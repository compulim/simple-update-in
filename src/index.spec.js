import updateIn from './index';

test('set in flat map', () => {
  const from = { abc: 123, def: 456 };
  const actual = updateIn(from, ['xyz'], () => 789);

  expect(from).not.toBe(actual);
  expect(actual).toEqual({
    abc: 123,
    def: 456,
    xyz: 789
  });
});

test('update in flat map', () => {
  const from = { one: 1, two: 2 };
  const actual = updateIn(from, ['one'], v => v * 10);

  expect(from).not.toBe(actual);
  expect(actual).toEqual({
    one: 10,
    two: 2
  });
});

test('update in map', () => {
  const from = { odd: { one: 1, three: 3 }, even: { two: 2 } };
  const actual = updateIn(from, ['odd', 'one'], v => v * 10);

  expect(from).not.toBe(actual);
  expect(from.odd).not.toBe(actual.odd);
  expect(from.even).toBe(actual.even);
  expect(actual).toEqual({
    odd: { one: 10, three: 3 },
    even: { two: 2 }
  });
});

test('remove in map', () => {
  const from = { one: 1, two: 2, three: 3 };
  const actual = updateIn(from, ['three']);

  expect(from).not.toBe(actual);
  expect(actual).toEqual({ one: 1, two: 2 });
  expect(actual).not.toHaveProperty('three');
});

test('set in flat array', () => {
  const from = [0, 1, 2];
  const actual = updateIn(from, [1], () => 3);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([0, 3, 2]);
});

test('set in 2D array', () => {
  const from = [0, [1.1, 1.2], [2.1, 2.2]];
  const actual = updateIn(from, [1, 1], () => 3);

  expect(from).not.toBe(actual);
  expect(from[1]).not.toBe(actual[1]);
  expect(from[2]).toBe(actual[2]);
  expect(actual).toEqual([0, [1.1, 3], [2.1, 2.2]]);
});

test('insert in array', () => {
  const from = [0, 1, 2];
  const actual = updateIn(from, [3], () => 3);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([0, 1, 2, 3]);
});

test('remove in array', () => {
  const from = [0, 1, 2];
  const actual = updateIn(from, [1]);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([0, 2]);
});

test('mix map/array', () => {
  const from = { one: [1.1, 1.2, 1.3], two: [2.1, 2.2, 2.3] };
  const actual = updateIn(from, ['one', 1], v => v * 10);

  expect(from).not.toBe(actual);
  expect(from.one).not.toBe(actual.one);
  expect(from.two).toBe(actual.two);
  expect(actual).toEqual({ one: [1.1, 12, 1.3], two: [2.1, 2.2, 2.3] });
});

test('mix array/map', () => {
  const from = [{ one: 1, three: 3 }, { two: 2 }];
  const actual = updateIn(from, [0, 'three'], v => v * 10);

  expect(from).not.toBe(actual);
  expect(from[0]).not.toBe(actual[0]);
  expect(from[1]).toBe(actual[1]);
  expect(actual).toEqual([{ one: 1, three: 30 }, { two: 2 }]);
});
