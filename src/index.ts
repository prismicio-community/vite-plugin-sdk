import type { Plugin } from "vite";

import { extendConfigPlugin, moveTypeDeclarationsPlugin } from "./plugins";
import { readPackageJSON } from "./readPackageJSON";
import type { Options } from "./types";

const DEFAULT_OPTIONS = {
	dts: true,
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
