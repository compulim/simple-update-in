export default function setIn(obj, path, updater) {
  if (!path.length) {
    return updater(obj);
  }

  path = path.slice();

  const accessor = path.shift();
  const value = obj[accessor];

  if (Array.isArray(obj)) {
    obj = obj.slice();

    if (updater || path.length) {
      obj[accessor] = setIn(value, path, updater);
    } else {
      obj.splice(accessor, 1);
    }

    return obj;
  } else {
    if (updater || path.length) {
      return {
        ...obj,
        [accessor]: setIn(value, path, updater)
      };
    } else {
      const { [accessor]: deleted, ...nextObj } = obj;

      return nextObj;
    }
  }
}
