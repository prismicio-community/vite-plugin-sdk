import typescript from "@rollup/plugin-typescript";
import { defineConfig, Plugin } from "vite";
import { defuFn } from "defu";

import { builtins } from "../lib/builtins";
import type { Options } from "../types";

export const extendConfigPlugin = (options: Options): Plugin => {
	const DEFAULT_CONFIG = defineConfig({
		build: {
			lib: {
				entry: "./src/index.ts",
				formats: ["es", "cjs"],
				fileName: (format) => {
					switch (format) {
						case "es": {
							return "[name].js";
						}

						case "cjs": {
							return "[name].cjs";
						}
					}

					throw new Error(`Unsupported format: ${format}`);
				},
			},
			rollupOptions: {
				external: [
					// Node builtins with support for `node:` prefix.
					...builtins.map((name) => new RegExp(`^(?:node:)?${name}(?:\/.*)?$`)),
					// `package.json` external dependencies, `devDependencies` should be inlined.
					...[
						...Object.keys(options.packageJSON.dependencies ?? {}),
						...Object.keys(options.packageJSON.optionalDependencies ?? {}),
						...Object.keys(options.packageJSON.peerDependencies ?? {}),
					].map((name) => new RegExp(`^${name}(?:\/.*)?$`)),
				].filter(
					(regexp) =>
						!options.internalDependencies.some((internalDependency) =>
							regexp.test(internalDependency),
						),
				),
				output: {
					preserveModules: true,
					preserveModulesRoot: "src",
					inlineDynamicImports: false,
				},
				plugins: [
					typescript({
						rootDir: ".",
						declaration: options.dts,
						declarationDir: "dist",
						include: ["./src/**/*"],
					}) as Plugin,
				],
			},
			minify: false,
			sourcemap: true,
		},
	});

	return {
		name: "sdk:extend-config",
		config: (userConfig, env) => {
			// Disable config extension in test otherwise coverage runs twice because of Vitest's watcher, see:
			// https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/core.ts#L382-L426
			if (env.mode === "test") {
				return;
			}

			return defuFn(userConfig, DEFAULT_CONFIG);
		},
	};
};
