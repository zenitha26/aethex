import fs from 'fs';

// Patch fs.readlink / fs.readlinkSync / fs.promises.readlink to fix exFAT build issues on Windows.
// When Node attempts to resolve paths on exFAT, fs.readlink on regular files/directories returns
// EISDIR instead of EINVAL. We catch these and override the code to EINVAL, telling Node's realpath
// resolver that the target is a normal file/directory, not a symlink.
if (process.platform === 'win32') {
  const origReadlinkSync = fs.readlinkSync;
  fs.readlinkSync = function (path, options) {
    try {
      return origReadlinkSync.call(fs, path, options);
    } catch (err) {
      if (err && (err.code === 'EISDIR' || err.code === 'EPERM')) {
        err.code = 'EINVAL';
      }
      throw err;
    }
  };

  const origReadlink = fs.readlink;
  fs.readlink = function (path, options, callback) {
    let actualOptions = options;
    let actualCallback = callback;
    if (typeof options === 'function') {
      actualCallback = options;
      actualOptions = undefined;
    }
    return origReadlink.call(fs, path, actualOptions, (err, linkString) => {
      if (err && (err.code === 'EISDIR' || err.code === 'EPERM')) {
        err.code = 'EINVAL';
      }
      if (actualCallback) {
        actualCallback(err, linkString);
      }
    });
  };

  if (fs.promises && fs.promises.readlink) {
    const origPromisesReadlink = fs.promises.readlink;
    fs.promises.readlink = async function (path, options) {
      try {
        return await origPromisesReadlink.call(fs.promises, path, options);
      } catch (err) {
        if (err && (err.code === 'EISDIR' || err.code === 'EPERM')) {
          err.code = 'EINVAL';
        }
        throw err;
      }
    };
  }

  const origMkdirSync = fs.mkdirSync;
  fs.mkdirSync = function (path, options) {
    try {
      return origMkdirSync.call(fs, path, options);
    } catch (err) {
      if (err && (err.code === 'EPERM' || err.code === 'EEXIST')) {
        if (fs.existsSync(path)) {
          return;
        }
      }
      throw err;
    }
  };

  const origMkdir = fs.mkdir;
  fs.mkdir = function (path, options, callback) {
    let actualOptions = options;
    let actualCallback = callback;
    if (typeof options === 'function') {
      actualCallback = options;
      actualOptions = undefined;
    }
    return origMkdir.call(fs, path, actualOptions, (err) => {
      if (err && (err.code === 'EPERM' || err.code === 'EEXIST')) {
        if (fs.existsSync(path)) {
          if (actualCallback) actualCallback(null);
          return;
        }
      }
      if (actualCallback) actualCallback(err);
    });
  };

  if (fs.promises && fs.promises.mkdir) {
    const origPromisesMkdir = fs.promises.mkdir;
    fs.promises.mkdir = async function (path, options) {
      try {
        return await origPromisesMkdir.call(fs.promises, path, options);
      } catch (err) {
        if (err && (err.code === 'EPERM' || err.code === 'EEXIST')) {
          if (fs.existsSync(path)) {
            return;
          }
        }
        throw err;
      }
    };
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    if (config.resolveLoader) {
      config.resolveLoader.symlinks = false;
    }
    config.cache = false;
    return config;
  },
  experimental: {
    webpackBuildWorker: false,
    workerThreads: false
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;