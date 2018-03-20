# simple-update-in

A lightweight `updateIn` for immutable objects.

We love [ImmutableJS](https://facebook.github.io/immutable-js). But sometimes, we want to start something from small. Thus, we created this package with zero dependencies.

Under the cover, we use Rest Operator to do most of the heavylifting.

# Install

For latest stable, run `npm install simple-update-in`.

For active development (`master` branch), run `npm install simple-update-in@master`.

# How to use

We share similar signature as [ImmutableJS.updateIn](https://facebook.github.io/immutable-js/docs/#/Map/updateIn):

```js
updateIn(target: Array|Map, path: (Number|String)[], updater?: (value: any) => any)
```

To make `updateIn` efficient, especially, when paired with React. It will return a mixed deep/shallow clone of the `target`. It only deep clone on objects that it modified along the `path`, and shallow clone objects that it did not modify.

## Example

Just like ImmutableJS, we want to make both `Array` and `Map` a first-class citizen. To work on a map, use a `string` as key. For arrays, use a `number` as key.

### Map

```js
import updateIn from 'simple-update-in';

const from = { one: 1, two: { number: 2 }, thirty: 3 };
const actual = updateIn(from, ['thirty'], three => three * 10);

expect(actual).toEqual({ one: 1, two: { number: 2 }, thirty: 30 });

expect(actual).not.toBe(from);   // Something under this tree has changed
expect(actual.two).toBe(to.two); // Nothing under this tree has changed
expect(actual.thirty).toBe(30);  // We multiplied it by 10
```

> This is in fact an "upsert" operation.

### Array in map

```js
const from = { one: [1.1, 1.2, 1.3], two: [2] };
const actual = updateIn(from, ['one', 1], value => 'one point two');

expect(actual).toEqual({ one: [1.1, 'one point two', 1.3], two: [2] });
```

## Remove a key

You can also use `updateIn` to remove a key by passing a falsy value to the `updater` argument.

```js
const from = { one: 1, two: 2 };
const actual = updateIn(from, ['two']);

expect(actual).toEqual({ one: 1 });

expect(actual).not.toBe(from);
expect(actual).not.toHaveProperty('two');
```

## Remove an item in array

```js
const from = ['zero', 'one', 'two'];
const actual = updateIn(from, [1]);

expect(actual).toEqual(['zero', 'two']);
```

## How about adding an item in an array?

Adding an item in an array is different than "upsert"-ing in a map. As we want to keep the learning curve very low, thus, we don't want to introduce syntax to do the insertion.

You can use the following code to insert an item with Rest Operator:

```js
const from = { numbers: ['zero', 'one'] };
const actual = updateIn(from, ['numbers'], array => [...array, 'two']);

expect(actual).toEqual({ numbers: ['zero', 'one', 'two'] });
```

# Contributions

Like us? [Star](https://github.com/compulim/simple-update-in/stargazers) us.

Want to make it better? [File](https://github.com/compulim/simple-update-in/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/simple-update-in/pulls) a pull request.
