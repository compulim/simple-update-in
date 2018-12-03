export default function (obj, path, updater) {
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

export async function asyncUpdateIn(obj, path, updater) {
  const paths = getPaths(obj, path);

  for (let path of paths) {
    obj = setValue(
      obj,
      path,
      updater ? await updater(getValue(obj, path)) : undefined
    );
  }

  return obj;
}

function getPaths(obj, path) {
  if (!Array.isArray(path)) {
    throw new Error('path must be an array');
  }

  if (!path.length) {
    return;
  }

  const [accessor, ...nextPath] = path;

  if (typeof accessor === 'function') {
    if (Array.isArray(obj)) {
      return obj.reduce((results, value, index) => {
        accessor.call(obj, value, index) && results.push(...getPaths(obj, [index, ...nextPath]));

        return results;
      }, []);
    } else if (obj) {
      return Object.keys(obj).reduce((results, key) => {
        accessor.call(obj, obj[key], key) && results.push(...getPaths(obj, [key, ...nextPath]));

        return results;
      }, []);
    } else {
      return [];
    }
  }

  const result = getPaths(typeof obj !== 'undefined' && obj[accessor], nextPath);

  return result ? result.map(result => [accessor, ...result]) : [[accessor]];
}

function getValue(obj, path) {
  return path.reduce((obj, accessor) => obj && obj[accessor], obj);
}

function setValue(obj, path, target) {
  const [accessor, ...nextPath] = path;

  if (!path.length) {
    return target;
  }

  const value = typeof obj !== 'undefined' && obj[accessor];
  let nextObj = obj;

  if (typeof accessor === 'string' && (typeof nextObj !== 'object' || Array.isArray(nextObj))) {
    nextObj = {};
  } else if (typeof accessor === 'number' && !Array.isArray(nextObj)) {
    nextObj = [];
  }

  if (typeof accessor === 'number') {
    if (typeof target !== 'undefined') {
      const nextValue = setValue(value, nextPath, target);

      if (nextValue === value) {
        return obj;
      } else {
        nextObj = [...nextObj];
        nextObj[accessor] = nextValue;

        return nextObj;
      }
    }

    // If updater returned undefined or no updater at all, delete the item
    if (accessor in nextObj) {
      nextObj = [...nextObj];
      nextObj.splice(accessor, 1);
    }

    return nextObj;
  } else {
    if (typeof target !== 'undefined') {
      const nextValue = setValue(value, nextPath, target);

      if (nextValue === value) {
        return obj;
      } else {
        return {
          ...nextObj,
          [accessor]: nextValue
        };
      }
    }

    // If updater returned undefined or no updater at all, delete the key
    if (accessor in nextObj) {
      nextObj = { ...nextObj };
      delete nextObj[accessor];
    }

    return nextObj;
  }
}
