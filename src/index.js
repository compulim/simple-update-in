export default function setIn(obj, path, updater) {
  if (!Array.isArray(path)) {
    throw new Error('path must be an array');
  }

  if (!path.length) {
    return updater(obj);
  }

  path = path.slice();

  const accessor = path.shift();
  const value = typeof obj !== 'undefined' && obj[accessor];
  let nextObj = obj;

  if (typeof accessor === 'string' && (typeof nextObj !== 'object' || Array.isArray(nextObj))) {
    nextObj = {};
  } else if (typeof accessor === 'number' && !Array.isArray(nextObj)) {
    nextObj = [];
  }

  if (typeof accessor === 'number') {
    if (updater || path.length) {
      if (accessor === -1) {
        return [...nextObj, setIn([], path, updater)];
      }

      const nextValue = setIn(value, path, updater);

      if (typeof nextValue !== 'undefined') {
        if (nextValue === value) {
          return obj;
        } else {
          nextObj = [...nextObj];
          nextObj[accessor] = nextValue;

          return nextObj;
        }
      }
    }

    // If updater returned undefined or no updater at all, delete the item
    if (accessor in nextObj) {
      nextObj = [...nextObj];
      nextObj.splice(accessor, 1);
    }

    return nextObj;
  } else {
    if (updater || path.length) {
      const nextValue = setIn(value, path, updater);

      if (typeof nextValue !== 'undefined') {
        if (nextValue === value) {
          return obj;
        } else {
          return {
            ...nextObj,
            [accessor]: nextValue
          };
        }
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
