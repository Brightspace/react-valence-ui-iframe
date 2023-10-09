# react-valence-ui-iframe

A wrapper for the iframe which provides callbacks for various purposes

## Props

- `src`: the src that you want to provide to the iframe
- `resizeCallback`: A function which gets called whenever the iframe's height is calculated
- `progressCallback`: A function which gets called whenever the iframe starts or finishes loading.

## Callbacks

```
resizeCallback ( size, sizeKnown )
```
- A callback reporting on the size of the iframe's contents. Provided in the same format as the `react-valence-ui-fileviewer`'s `resizeCallback`.

`size`
- A value for the size of the iframe if we can figure it out.
- Null if the size is not known.

`sizeKnown`
- True if the size is known.
- False if the size is not known.

```
progressCallback ( progress, accuracy )
```
- A callback providing information on whether the iframe has loaded or not. Provided in the same format as the `react-valence-ui-fileviewer`'s `progressCallback`.

`progress`
- 0 if the iframe has not loaded yet.
- 100 if the iframe is loaded

`accuracy`
- `'none'`, because it doesn't provide values than 0 and 100

## Usage Example:

- https://github.com/Brightspace/activity-viewer

**Note:** Iframe Brightspace pages that contain a navbar and/or minbar (such as quizzes and surveys) will have these removed in the ResizingIframe.

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...
The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)

[npm-url]: https://www.npmjs.org/package/frau-appconfig-builder
[npm-image]: https://img.shields.io/npm/v/frau-appconfig-builder.svg