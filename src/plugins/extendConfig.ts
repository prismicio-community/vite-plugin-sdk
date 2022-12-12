import * as path from "node:path";

import typescript from "@rollup/plugin-typescript";
import { defineConfig, Plugin, UserConfig } from "vite";
import { defuFn } from "defu";

import { builtins } from "../lib/builtins";
import { castArray } from "../lib/castArray";
import type { Options } from "../types";

export const extendConfigPlugin = (options: Options): Plugin => {
	const getDefaultConfig = (userConfig: UserConfig) =>
		defineConfig({
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
						...builtins.map(
							(name) => new RegExp(`^(?:node:)?${name}(?:\/.*)?$`),
						),
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
						preserveModulesRoot: castArray(options.entryDir).shift(),
						inlineDynamicImports: false,
					},
					plugins: [
						typescript({
							rootDir: ".",
							declaration: options.dts,
							declarationDir: userConfig.build?.outDir || "dist",
							include: castArray(options.entryDir).map((dir) =>
								path.posix.join(dir, "**/*"),
							),
						}) as Plugin,
						// Preserve dynamic imports for CommonJS
						// TODO: Remove when Vite updates to Rollup v3. This behavior is enabled by default in v3.
						{
							name: "preserve-dynamic-imports",
							renderDynamicImport() {
								return { left: "import(", right: ")" };
							},
						},
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

			return defuFn(userConfig, getDefaultConfig(userConfig));
		},
	};
};
