const objectIs = Object.is || ((x, y) => x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y);

export default objectIs
