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
				],
				output: {
					preserveModules: true,
					preserveModulesRoot: "src",
					inlineDynamicImports: false,
				},
				plugins: [
					typescript({
						rootDir: ".",
						declaration: true,
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
		config: (userConfig) => {
			return defuFn(userConfig, DEFAULT_CONFIG);
		},
	};
};
