/*
 ** Core logic from https://github.com/sindresorhus/builtin-modules
 ** Many thanks to @sindresorhus
 */
import Module from "node:module";

const ignoreList = ["sys"];

export const builtins = Module.builtinModules
	.filter(
		(x) =>
			!/^_|^(internal|v8|node-inspect)\/|\//.test(x) && !ignoreList.includes(x),
	)
	.sort();
