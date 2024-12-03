/**
 * Options used by `vite-plugin-sdk`.
 */
export interface Options {
	/**
	 * `package.json` to create config from.
	 *
	 * @defaultValue First `package.json` found from the current working directory and up.
	 */
	packageJSON: PackageJSON

	/**
	 * Whether or not to generate type declarations in the build.
	 *
	 * @defaultValue `true`
	 */
	dts: boolean

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

/**
 * Shaved-down `package.json` type for internal use.
 */
export interface PackageJSON {
	name: string
	version: string
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	optionalDependencies?: Record<string, string>
	peerDependencies?: Record<string, string>
	[Key: string]: unknown
}
