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
