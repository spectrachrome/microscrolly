# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
    Add new changelog entries here.
    Each entry may be annotated with "Added", "Changed", "Removed", and "Fixed" titles.

    Example:

    ## [1.0.0] - May 16, 2022

    ### Added
    - New visual identity.

    ### Changed
    - Start using "changelog" over "change log" since it's the common usage.

    ### Removed
    - Section about "changelog" vs "CHANGELOG".

    ### Fixed
    - Fix typos in recent README changes.
    - Update outdated unreleased diff link.
-->

## Unreleased
### Added
- Start using [human-readable changelogs](https://keepachangelog.com/en/1.0.0/) and [semantic versioning](https://semver.org/).

### Changed
- Simplify layer control by using a singular list of enabled layers instead of separate `enable` and `disable` arrays.
- Reset default NPM package version `1.0.0` to starting version `0.1.0`.

### Fixed
- Prevent flickering with a permanent base layer and usage of `requestAnimationFrame()`.
- An error which prevented rendering of the base layer in Chrome.