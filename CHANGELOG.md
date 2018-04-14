# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
