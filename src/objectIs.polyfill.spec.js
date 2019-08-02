describe('Object.is without native implementation', () => {
  let objectIs;

  beforeEach(() => {
    const originalObjectIs = Object.is;

    Object.is = null;
    objectIs = require('./objectIs');
    Object.is = originalObjectIs;
  });

  test('should return true when comparing "abc" to "abc"', () => {
    expect(objectIs('abc', 'abc')).toBe(true);
  });

  test('should return true when comparing NaN to NaN', () => {
    expect(objectIs(NaN, NaN)).toBe(true);
  });

  test('should return false when comparing 0 to -0', () => {
    expect(objectIs(0, -0)).toBe(false);
  });
});
