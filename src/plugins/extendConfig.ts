import * as path from "node:path"

import typescript from "@rollup/plugin-typescript"
import { defuFn } from "defu"
import renameNodeModules from "rollup-plugin-rename-node-modules"
import type { Plugin, UserConfig } from "vite"
import { defineConfig } from "vite"

import { builtins } from "../lib/builtins"

import type { Options } from "../types"

export const extendConfigPlugin = (options: Options): Plugin => {
	const getDefaultConfig = (userConfig: UserConfig) =>
		defineConfig({
			build: {
				lib: {
					entry: path.posix.join(options.srcDir, "index.ts"),
					formats: ["es", "cjs"],
					fileName: (format) => {
						switch (format) {
							case "es": {
								return "[name].js"
							}

							case "cjs": {
								return "[name].cjs"
							}
						}

						throw new Error(`Unsupported format: ${format}`)
					},
				},
				rollupOptions: {
					external: [
						// Node builtins with support for `node:` prefix.
						...builtins.map(
							(name) => new RegExp(`^(?:node:)?${name}(?:/.*)?$`),
						),
						// `package.json` external dependencies, `devDependencies` should be inlined.
						...[
							...Object.keys(options.packageJSON.dependencies ?? {}),
							...Object.keys(options.packageJSON.optionalDependencies ?? {}),
							...Object.keys(options.packageJSON.peerDependencies ?? {}),
						].map((name) => new RegExp(`^${name}(?:/.*)?$`)),
					].filter(
						(regexp) =>
							!options.internalDependencies.some((internalDependency) =>
								regexp.test(internalDependency),
							),
					),
					output: {
						preserveModules: true,
						preserveModulesRoot: options.srcDir,
						inlineDynamicImports: false,
					},
					plugins: [
						typescript({
							rootDir: ".",
							declaration: options.dts,
							outDir: userConfig.build?.outDir || "dist",
							include: [path.posix.join(options.srcDir, "**/*")],
						}) as Plugin,
						// Ensure bundled dependencies are published to npm.
						// `npm pack` ignores directories named `node_modules`.
						renameNodeModules("_node_modules") as Plugin,
					],
				},
				minify: false,
				sourcemap: true,
			},
		})

	return {
		name: "sdk:extend-config",
		config: (userConfig, env) => {
			// Disable config extension in test otherwise coverage runs twice because of Vitest's watcher, see:
			// https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/core.ts#L382-L426
			if (env.mode === "test") {
				return
			}

			return defuFn(userConfig, getDefaultConfig(userConfig))
		},
	}
}
