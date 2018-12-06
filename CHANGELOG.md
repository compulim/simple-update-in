# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2018-12-03
### Added
- Emitting UMD bundle for browser
   - `<script src="https://unpkg.com/simple-update-in/dist/simple-update-in.production.min.js"></script>`
   - `<script>window.simpleUpdateIn({ abc: 123, def: 456 }, ['xyz'], () => 789);</script>`

## [2.0.0] - 2018-12-03
### Added
- Support async predicate
   - `await updateIn([1, 2, 3, 4, 5], [v => Promise.resolve(v % 2)], v => v * 10)` will return `[10, 2, 30, 4, 50]`
- Support async update
   - `await updateIn([1, 2, 3], [0], v => Promise.resolve(v * 10))` will return `[10, 2, 3]`

### Changed
- Use Node.js 10 and 11 for Travis CI

### Removed
- Removed array insertion using index number of `-1`
   - This introduces API inconfirmity: `-1` could means append, prepend, or the last item

## [1.4.0] - 2018-10-08
### Changed
- Add default exports for CommonJS
- Bump
   - `@babel/core@7.1.2`
   - `merge@1.2.1` (via `npm audit fix`)
   - `jest@23.6.0`

## [1.3.1] - 2018-10-05
### Fixed
- Using a predicate on a non-existing key/index should not throw error and return the original value as-is
   - `updateIn({}, ['Hello', () => true], () => 'World!'])` will return `{}`
   - `updateIn([], [0, () => true], () => 'Aloha'])` will return `[]`

## [1.3.0] - 2018-08-17
### Added
- Support predicate function
   - `updateIn([1, 2, 3, 4, 5], [v => v % 2], v => v * 10)` will return `[10, 2, 30, 4, 50]`
   - Predicate function can be used as branching function to update multiple subtrees in a single call

## [1.2.0] - 2018-04-14
### Added
- If after `updater` result in nothing change (triple-equal `===`), will return untouched
- `updater` returned `undefined` will be treated as removing the item

### Fixed
- Append not creating sub-structure correctly
   - `updateIn([1, 2], [-1, 0], 'Hello')` should return `[1, 2, ['Hello']]` instead of `[1, 2, 'Hello']`

## [1.1.1] - 2018-04-06
### Fixed
- Move `babel` and `gulp` into `devDependencies`

## [1.1.0] - 2018-03-31
### Added
- Automatic expansion
- Replace incompatible types
- Array insertion using index number of `-1`

## [1.0.0] - 2018-03-21
### Added
- Initial commit
