import type { Plugin } from "vite";

import { readPackageJSON } from "./lib/readPackageJSON";

import type { Options } from "./types";

import { extendConfigPlugin, moveTypeDeclarationsPlugin } from "./plugins";

const DEFAULT_OPTIONS = {
	dts: true,
	internalDependencies: [],
	srcDir: "src",
};

const sdkPlugin = (rawOptions?: Partial<Options>): (Plugin | null)[] => {
	const options: Options = {
		...DEFAULT_OPTIONS,
		packageJSON: rawOptions?.packageJSON || readPackageJSON(),
		...rawOptions,
	};

	return [extendConfigPlugin(options), moveTypeDeclarationsPlugin(options)];
};

export default sdkPlugin;
export { Options };
