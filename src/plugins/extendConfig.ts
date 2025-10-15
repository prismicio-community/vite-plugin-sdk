import * as path from "node:path"

import typescript from "@rollup/plugin-typescript"
import { defuFn } from "defu"
import renameNodeModules from "rollup-plugin-rename-node-modules"
import ts from "typescript"
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
							transformers: {
								afterDeclarations: [addImportExtensionsTransformer],
							},
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

/**
 * Adds a `.js` extension to all import and export declarations that do not
 * contain an extension.
 */
function addImportExtensionsTransformer(context: ts.TransformationContext) {
	return (source: ts.Bundle | ts.SourceFile) => {
		function visitor(node: ts.Node) {
			function shouldAddExtension(moduleSpecifier: ts.StringLiteral) {
				const text = moduleSpecifier.text

				return text.startsWith(".") && !/\.[a-z0-9]+$/i.test(text)
			}

			function addExtension(moduleSpecifier: ts.StringLiteral) {
				return ts.factory.createStringLiteral(moduleSpecifier.text + ".js")
			}

			if (ts.isImportDeclaration(node)) {
				if (
					ts.isStringLiteral(node.moduleSpecifier) &&
					shouldAddExtension(node.moduleSpecifier)
				) {
					return ts.factory.updateImportDeclaration(
						node,
						node.modifiers,
						node.importClause,
						addExtension(node.moduleSpecifier),
						node.attributes,
					)
				}
			}

			if (ts.isExportDeclaration(node)) {
				if (
					node.moduleSpecifier &&
					ts.isStringLiteral(node.moduleSpecifier) &&
					shouldAddExtension(node.moduleSpecifier)
				) {
					return ts.factory.updateExportDeclaration(
						node,
						node.modifiers,
						node.isTypeOnly,
						node.exportClause,
						addExtension(node.moduleSpecifier),
						node.attributes,
					)
				}
			}

			return ts.visitEachChild(node, visitor, context)
		}

		return ts.visitEachChild(source, visitor, context)
	}
}
