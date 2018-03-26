export default function setIn(obj, path, updater) {
  if (!path.length) {
    return updater(obj);
  }

  path = path.slice();

  const accessor = path.shift();
  let value = typeof obj !== 'undefined' && obj[accessor];

  if (typeof accessor === 'string' && (typeof obj !== 'object' || Array.isArray(obj))) {
    obj = {};
  } else if (typeof accessor === 'number' && !Array.isArray(obj)) {
    obj = [];
  }

  if (typeof accessor === 'number') {
    obj = obj ? obj.slice() : [];

    if (updater || path.length) {
      if (accessor === -1) {
        obj.push(updater());
      } else {
        obj[accessor] = setIn(value, path, updater);
      }
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
