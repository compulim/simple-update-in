import objectIs from './objectIs';

test('Object.is should use native implementation if available', () => {
  expect(objectIs).toBe(Object.is);
});
