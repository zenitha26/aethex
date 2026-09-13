const fs = require('fs');

// Prevent crashes from Windows stdout/stderr pipe write drops
if (process.stdout && process.stdout.on) {
  process.stdout.on('error', (err) => {
    if (err && (err.code === 'EPIPE' || err.code === 'UNKNOWN' || err.code === 'EOF')) return;
  });
}
if (process.stderr && process.stderr.on) {
  process.stderr.on('error', (err) => {
    if (err && (err.code === 'EPIPE' || err.code === 'UNKNOWN' || err.code === 'EOF')) return;
  });
}
process.on('uncaughtException', (err) => {
  if (err && (err.code === 'UNKNOWN' || err.code === 'EPIPE') && err.syscall === 'write') {
    return;
  }
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

if (process.platform === 'win32') {
  // Sync readlink monkey-patch
  const origReadlinkSync = fs.readlinkSync;
  fs.readlinkSync = function (path, options) {
    try {
      return origReadlinkSync.call(fs, path, options);
    } catch (err) {
      if (err && (err.code === 'EISDIR' || err.code === 'EPERM')) {
        const error = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        error.code = 'EINVAL';
        error.errno = -4068;
        throw error;
      }
      throw err;
    }
  };

  // Async readlink monkey-patch
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
        const error = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        error.code = 'EINVAL';
        error.errno = -4068;
        if (actualCallback) actualCallback(error, undefined);
      } else {
        if (actualCallback) actualCallback(err, linkString);
      }
    });
  };

  // Readdir monkey-patches for locked/ghosted directories
  const origReaddirSync = fs.readdirSync;
  fs.readdirSync = function (path, options) {
    try {
      return origReaddirSync.call(fs, path, options);
    } catch (err) {
      if (err && (err.code === 'EPERM' || err.code === 'EACCES') && String(path).includes('aspor-a711')) {
        return [];
      }
      throw err;
    }
  };

  const origReaddir = fs.readdir;
  fs.readdir = function (path, options, callback) {
    let actualOptions = options;
    let actualCallback = callback;
    if (typeof options === 'function') {
      actualCallback = options;
      actualOptions = undefined;
    }
    return origReaddir.call(fs, path, actualOptions, (err, files) => {
      if (err && (err.code === 'EPERM' || err.code === 'EACCES') && String(path).includes('aspor-a711')) {
        if (actualCallback) actualCallback(null, []);
        return;
      }
      if (actualCallback) actualCallback(err, files);
    });
  };

  if (fs.promises && fs.promises.readdir) {
    const origPromisesReaddir = fs.promises.readdir;
    fs.promises.readdir = async function (path, options) {
      try {
        return await origPromisesReaddir.call(fs.promises, path, options);
      } catch (err) {
        if (err && (err.code === 'EPERM' || err.code === 'EACCES') && String(path).includes('aspor-a711')) {
          return [];
        }
        throw err;
      }
    };
  }

  // opendir monkey-patch (Next.js 15 uses fs.promises.opendir / fs.opendirSync)
  if (fs.promises && fs.promises.opendir) {
    const origPromisesOpendir = fs.promises.opendir;
    fs.promises.opendir = async function (path, options) {
      try {
        return await origPromisesOpendir.call(fs.promises, path, options);
      } catch (err) {
        if (err && (err.code === 'EPERM' || err.code === 'EACCES') && String(path).includes('aspor-a711')) {
          return {
            async *[Symbol.asyncIterator]() {},
            close: async () => {}
          };
        }
        throw err;
      }
    };
  }

  if (fs.opendirSync) {
    const origOpendirSync = fs.opendirSync;
    fs.opendirSync = function (path, options) {
      try {
        return origOpendirSync.call(fs, path, options);
      } catch (err) {
        if (err && (err.code === 'EPERM' || err.code === 'EACCES') && String(path).includes('aspor-a711')) {
          return {
            *[Symbol.iterator]() {},
            closeSync: () => {}
          };
        }
        throw err;
      }
    };
  }

  // Promises readlink monkey-patch
  if (fs.promises && fs.promises.readlink) {
    const origPromisesReadlink = fs.promises.readlink;
    fs.promises.readlink = async function (path, options) {
      try {
        return await origPromisesReadlink.call(fs.promises, path, options);
      } catch (err) {
        if (err && (err.code === 'EISDIR' || err.code === 'EPERM')) {
          const error = new Error(`EINVAL: invalid argument, readlink '${path}'`);
          error.code = 'EINVAL';
          error.errno = -4068;
          throw error;
        }
        throw err;
      }
    };
  }
}

// Launch Next.js compilation
process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), 'build'];
require('next/dist/bin/next');
