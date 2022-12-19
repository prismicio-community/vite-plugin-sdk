<!--

TODO: Go through all "TODO" comments in the project

TODO: Replace all on all files (README.md, CONTRIBUTING.md, bug_report.md, package.json):
- vite-plugin-sdk
- Vite plugin to bundle SDKs
- prismicio-community/vite-plugin-sdk
- vite-plugin-sdk

-->

# vite-plugin-sdk

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![Conventional Commits][conventional-commits-src]][conventional-commits-href]
[![License][license-src]][license-href]

<!-- TODO: Replacing link to Prismic with [Prismic][prismic] is useful here -->

[Vite][vite] plugin to bundle SDKs.

- 🏭 &nbsp;Bundle for everyone with ESM and CJS;
- 🛠 &nbsp;Extensible thanks to [defu][defu];
- ⚡ &nbsp;Quick install and maintainability.

<!--

TODO: Create a small list of package features:

- 🤔 &nbsp;A useful feature;
- 🥴 &nbsp;Another useful feature;
- 🙃 &nbsp;A final useful feature.

Non-breaking space: &nbsp; are here on purpose to fix emoji rendering on certain systems.

-->

## Install

```bash
npm install --save-dev vite-plugin-sdk
```

## Documentation

`vite-plugin-sdk` adapts [Vite][vite] to bundle SDKs for distribution.

### Usage

```typescript
// vite.config.js
import sdk from "vite-plugin-sdk";

export default {
	plugins: [sdk(/* options */)],
};
```

### Options

```typescript
{
	/**
	 * `package.json` to create config from.
	 *
	 * @defaultValue First `package.json` found from the current working directory and up.
	 */
	packageJSON: PackageJSON;

	/**
	 * Whether or not to generate type declarations in the build.
	 *
	 * @defaultValue `true`
	 */
	dts: boolean;

	/**
	 * A list of dependencies to ignore from Rollup's `external` option.
	 *
	 * @defaultValue `[]`
	 */
	internalDependencies: string[]

	/**
	 * Directory to consider as the root `src` directory
	 *
	 * @defaultValue `src`
	 */
	srcDir: string
}
```

---

To discover what's new on this package check out [the changelog][changelog].

## Packages using `vite-plugin-sdk`

Find examples of `vite-plugin-sdk` in the real world.

- [`@prismicio/client`](https://github.com/prismicio/prismic-client) - The official JavaScript + TypeScript client library for Prismic.
- [`@prismicio/richtext`](https://github.com/prismicio/prismic-richtext) - A parser and serializer for Prismic's Rich Text format.
- [`@prismicio/react`](https://github.com/prismicio/prismic-react) - React components and hooks to fetch and present Prismic content.
- [`@prismicio/next`](https://github.com/prismicio/prismic-next) - Helpers to integrate Prismic into Next.js apps.
- [`r19`](https://github.com/prismicio-community/r19) - Simple remote procedure calls (RPC) in TypeScript.
- [`nuxt-hue`](https://github.com/lihbr/nuxt-hue) - Enlighten your Nuxt applications.

## Contributing

Whether you're helping us fix bugs, improve the docs, or spread the word, we'd love to have you as part of the Prismic developer community!

**Asking a question**: [Open an issue][repo-bug-report] explaining what you want to achieve / your question. Our support team will get back to you shortly.

**Reporting a bug**: [Open an issue][repo-bug-report] explaining your application's setup and the bug you're encountering.

**Suggesting an improvement**: [Open an issue][repo-feature-request] explaining your improvement or feature so we can discuss and learn more.

**Submitting code changes**: For small fixes, feel free to [open a pull request][repo-pull-requests] with a description of your changes. For large changes, please first [open an issue][repo-feature-request] so we can discuss if and how the changes should be implemented.

For more clarity on this project and its structure you can also check out the detailed [CONTRIBUTING.md][contributing] document.

## License

```
Copyright 2013-2022 Prismic <contact@prismic.io> (https://prismic.io)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

<!-- Links -->

[vite]: https://vitejs.dev
[prismic]: https://prismic.io
[defu]: https://github.com/unjs/defu#function-merger

<!-- TODO: Replace link with a more useful one if available -->

[changelog]: ./CHANGELOG.md
[contributing]: ./CONTRIBUTING.md

<!-- TODO: Replace link with a more useful one if available -->

[repo-bug-report]: https://github.com/prismicio-community/vite-plugin-sdk/issues/new?assignees=&labels=bug&template=bug_report.md&title=
[repo-feature-request]: https://github.com/prismicio-community/vite-plugin-sdk/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=
[repo-pull-requests]: https://github.com/prismicio-community/vite-plugin-sdk/pulls

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-sdk/latest.svg
[npm-version-href]: https://npmjs.com/package/vite-plugin-sdk
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-sdk.svg
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-sdk
[github-actions-ci-src]: https://github.com/prismicio-community/vite-plugin-sdk/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/prismicio-community/vite-plugin-sdk/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/github/prismicio-community/vite-plugin-sdk.svg
[codecov-href]: https://codecov.io/gh/prismicio-community/vite-plugin-sdk
[conventional-commits-src]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-href]: https://conventionalcommits.org
[license-src]: https://img.shields.io/npm/l/vite-plugin-sdk.svg
[license-href]: https://npmjs.com/package/vite-plugin-sdk
