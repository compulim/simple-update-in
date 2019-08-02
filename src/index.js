import objectIs from './objectIs';

export default function simpleUpdateIn(obj, path, updater) {
  validatePath(path);

  const paths = getPaths(obj, path);

  for (let path of paths) {
    obj = setValue(
      obj,
      path,
      updater ? updater(getValue(obj, path)) : undefined
    );
  }

  return obj;
}

async function updateInAsync(obj, path, updater) {
  validatePath(path);

  const paths = await getPathsAsync(obj, path);

  for (let path of paths) {
    obj = setValue(
      obj,
      path,
      updater ? await updater(getValue(obj, path)) : undefined
    );
  }

  return obj;
}

simpleUpdateIn.updateInAsync = updateInAsync;

function validatePath(path) {
  if (!Array.isArray(path)) {
    throw new Error('path must be an array');
  }
}

const RESERVED_KEYS = ['__proto__', 'constructor', 'prototype'];

function reserved(key) {
  return RESERVED_KEYS.includes(key);
}

function getPaths(obj, path) {
  if (!path.length) {
    return;
  }

  const [accessor, ...nextPath] = path;

  if (typeof accessor === 'function') {
    const results = [];

    if (Array.isArray(obj)) {
      for (let index = 0, { length } = obj; index < length; index++) {
        accessor.call(obj, obj[index], index) && results.push(...getPaths(obj, [index, ...nextPath]));
      }
    } else {
      for (let key in obj || {}) {
        accessor.call(obj, obj[key], key) && results.push(...getPaths(obj, [key, ...nextPath]));
      }
    }

    return results;
  }

  const result = getPaths(typeof obj !== 'undefined' && obj[accessor], nextPath);

  return result ? result.map(result => [accessor, ...result]) : [[accessor]];
}

async function getPathsAsync(obj, path) {
  if (!path.length) {
    return;
  }

  const [accessor, ...nextPath] = path;

  if (typeof accessor === 'function') {
    const results = [];

    if (Array.isArray(obj)) {
      for (let index = 0, { length } = obj; index < length; index++) {
        (await accessor.call(obj, obj[index], index)) && results.push(...await getPathsAsync(obj, [index, ...nextPath]));
      }
    } else {
      for (let key in obj || {}) {
        (await accessor.call(obj, obj[key], key)) && results.push(...await getPathsAsync(obj, [key, ...nextPath]));
      }
    }

    return results;
  }

  const result = await getPathsAsync(typeof obj !== 'undefined' && obj[accessor], nextPath);

  return result ? result.map(result => [accessor, ...result]) : [[accessor]];
}

function getValue(obj, path) {
  return path.reduce((obj, accessor) => obj && obj[accessor], obj);
}

function setValue(obj, path, target) {
  if (!path.length) {
    return target;
  }

  const [accessor, ...nextPath] = path;
  const value = typeof obj !== 'undefined' && obj[accessor];
  let nextObj = obj;

  if (reserved(accessor)) {
    return obj;
  }

  if (typeof accessor === 'string' && (typeof nextObj !== 'object' || Array.isArray(nextObj))) {
    nextObj = {};
  } else if (typeof accessor === 'number' && !Array.isArray(nextObj)) {
    nextObj = [];
  }

  if (typeof accessor === 'number') {
    const nextValue = setValue(value, nextPath, target);

    if (typeof nextValue === 'undefined') {
      if (typeof obj === 'undefined') {
        return obj;
      } else {
        // If updater returned undefined or no updater at all, delete the item
        if (accessor in nextObj) {
          nextObj = [...nextObj];
          nextObj.splice(accessor, 1);
        }

        return nextObj;
      }
    } else {
      if (objectIs(nextValue, value)) {
        return obj;
      } else {
        nextObj = [...nextObj];
        nextObj[accessor] = nextValue;

        return nextObj;
      }
    }
  } else {
    const nextValue = setValue(value, nextPath, target);

    if (typeof nextValue === 'undefined') {
      if (typeof obj === 'undefined') {
        return obj;
      } else {
        // If updater returned undefined or no updater at all, delete the key
        if (accessor in nextObj) {
          nextObj = { ...nextObj };
          delete nextObj[accessor];
        }

        return nextObj;
      }
    } else {
      if (objectIs(nextValue, value)) {
        return obj;
      } else {
        return {
          ...nextObj,
          [accessor]: nextValue
        };
      }
    }
  }
}
