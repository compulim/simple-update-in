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

test('expand undefined as map', () => {
  const from = undefined;
  const actual = updateIn(from, ['one'], () => 1);

  expect(actual).toHaveProperty('one', 1);
});

test('expand undefined as array', () => {
  const from = undefined;
  const actual = updateIn(from, [1], () => 1);

  expect(actual).toEqual([, 1]);
});

test('expand map', () => {
  const from = { two: { three: 2.3 } };
  const actual = updateIn(from, ['one', 'two'], () => 1.2);

  expect(from).not.toBe(actual);
  expect(actual).toHaveProperty('one', { two: 1.2 });
  expect(actual.two).toBe(from.two);
});

test('expand array', () => {
  const from = [0, 1];
  const actual = updateIn(from, [3], () => 3);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([0, 1, , 3]);
});

test('incompatible type convert map to array', () => {
  const from = { one: 1 };
  const actual = updateIn(from, [1], () => 1);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([, 1]);
});

test('incompatible type convert string to array', () => {
  const from = '123';
  const actual = updateIn(from, [1], () => 1);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([, 1]);
});

test('incompatible type convert array to map', () => {
  const from = [0];
  const actual = updateIn(from, ['one'], () => 1);

  expect(from).not.toBe(actual);
  expect(actual).toEqual({ one: 1 });
});

test('incompatible type convert string to map', () => {
  const from = '123';
  const actual = updateIn(from, ['one'], () => 1);

  expect(from).not.toBe(actual);
  expect(actual).toEqual({ one: 1 });
});

test('append to array', () => {
  const from = [0, 1, 2];
  const actual = updateIn(from, [-1], () => 3);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([0, 1, 2, 3]);
});

test('append to array 2', () => {
  const from = [0, 1, 2];
  const actual = updateIn(from, [-1, 0, 0], () => 3);

  expect(from).not.toBe(actual);
  expect(actual).toEqual([0, 1, 2, [[3]]]);
});

test('modifying undefined in map', () => {
  const from = { one: 1 };
  const actual = updateIn(from, ['two', 'three'], value => value && value * 10);

  expect(from).toBe(actual);
});

test('modifying undefined in array', () => {
  const from = [0, 1, 2, 3];
  const actual = updateIn(from, [4], value => value && value * 10);

  expect(from).toBe(actual);
});

test('untouched in map', () => {
  const from = { one: 1 };
  const actual = updateIn(from, ['one'], value => value);

  expect(from).toBe(actual);
});

test('untouched in array', () => {
  const from = [0, 1, 2];
  const actual = updateIn(from, [1], value => value);

  expect(from).toBe(actual);
});

test('removing non-existing key in map', () => {
  const from = { one: 1 };
  const actual = updateIn(from, ['two']);

  expect(from).toBe(actual);
});

test('removing non-existing key in array', () => {
  const from = [0];
  const actual = updateIn(from, [1]);

  expect(from).toBe(actual);
});

test('removing using undefined in map', () => {
  const from = { one: 1 };
  const actual = updateIn(from, ['one'], value => undefined);

  expect(actual).toEqual({});
});

test('removing using undefined in array', () => {
  const from = [0];
  const actual = updateIn(from, [0], value => undefined);

  expect(actual).toEqual([]);
});

test('incompatible type and untouched map', () => {
  const from = { one: 1 };
  const actual = updateIn(from, [0], value => undefined);

  expect(actual).toEqual([]);
})

test('incompatible type and untouched array', () => {
  const from = [0];
  const actual = updateIn(from, ['one'], value => undefined);

  expect(actual).toEqual({});
})

test('path not array', () => {
  expect(() => {
    updateIn({}, 'not valid path');
  }).toThrow();
});
