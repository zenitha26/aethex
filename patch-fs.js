const fs = require('fs');

function shouldHandlePayhere(path) {
  if (!path) return false;
  const p = typeof path === 'string' ? path : path.toString();
  return p.toLowerCase().includes('payhere');
}

function mapPayhereError(err) {
  if (err && (err.code === 'EPERM' || err.code === 'EACCES')) {
    const enoent = new Error(`ENOENT: no such file or directory, '${err.syscall || 'fs'}' '${err.path || ''}'`);
    enoent.code = 'ENOENT';
    enoent.errno = -4058;
    enoent.syscall = err.syscall || 'fs';
    enoent.path = err.path;
    return enoent;
  }
  return err;
}

function handleReadlinkError(path, err) {
  if (err && err.code === 'EISDIR') {
    let isSymlink = false;
    try {
      isSymlink = fs.lstatSync(path).isSymbolicLink();
    } catch (e) {}
    if (!isSymlink) {
      const einval = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einval.code = 'EINVAL';
      einval.errno = -4071;
      einval.syscall = 'readlink';
      einval.path = path;
      return einval;
    }
  }
  return err;
}

// Intercept readlink, readlinkSync, promises.readlink for EISDIR -> EINVAL mapping
const originalReadlink = fs.readlink;
fs.readlink = function (path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  originalReadlink(path, options, (err, linkString) => {
    if (err) {
      let finalErr = handleReadlinkError(path, err);
      if (shouldHandlePayhere(path)) {
        finalErr = mapPayhereError(finalErr);
      }
      return callback(finalErr);
    }
    callback(null, linkString);
  });
};

const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (err) {
    let finalErr = handleReadlinkError(path, err);
    if (shouldHandlePayhere(path)) {
      finalErr = mapPayhereError(finalErr);
    }
    throw finalErr;
  }
};

// Generic patch helper for other fs operations
function patchFn(obj, name, isSync) {
  if (!obj || !obj[name]) return;
  const original = obj[name];
  if (isSync) {
    obj[name] = function (...args) {
      const path = args[0];
      try {
        return original.apply(this, args);
      } catch (err) {
        if (shouldHandlePayhere(path)) {
          throw mapPayhereError(err);
        }
        throw err;
      }
    };
  } else {
    obj[name] = function (...args) {
      const path = args[0];
      const callback = args[args.length - 1];
      if (typeof callback === 'function') {
        args[args.length - 1] = function (err, ...cbArgs) {
          if (err && shouldHandlePayhere(path)) {
            return callback(mapPayhereError(err), ...cbArgs);
          }
          return callback(err, ...cbArgs);
        };
        try {
          return original.apply(this, args);
        } catch (err) {
          if (shouldHandlePayhere(path)) {
            return callback(mapPayhereError(err));
          }
          throw err;
        }
      } else {
        return original.apply(this, args);
      }
    };
  }
}

function patchPromiseFn(obj, name) {
  if (!obj || !obj[name]) return;
  const original = obj[name];
  obj[name] = async function (...args) {
    const path = args[0];
    try {
      return await original.apply(this, args);
    } catch (err) {
      let finalErr = err;
      if (name === 'readlink') {
        finalErr = handleReadlinkError(path, finalErr);
      }
      if (shouldHandlePayhere(path)) {
        finalErr = mapPayhereError(finalErr);
      }
      throw finalErr;
    }
  };
}

// Patch fs functions (excluding readlink, since we manually handle it above)
const fnsToPatch = ['readdir', 'stat', 'lstat', 'realpath', 'access'];
fnsToPatch.forEach(name => {
  patchFn(fs, name, false);
  patchFn(fs, name + 'Sync', true);
});

// Patch fs.promises
if (fs.promises) {
  fnsToPatch.forEach(name => {
    patchPromiseFn(fs.promises, name);
  });
  patchPromiseFn(fs.promises, 'readlink');
}

// Patch fs/promises module
try {
  const fsPromises = require('fs/promises');
  if (fsPromises) {
    fnsToPatch.forEach(name => {
      patchPromiseFn(fsPromises, name);
    });
    patchPromiseFn(fsPromises, 'readlink');
  }
} catch (e) {}
