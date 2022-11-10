import * as fs from "node:fs";

import fse from "fs-extra";
import type { Plugin } from "vite";

import { Options } from "../types";

export const moveTypeDeclarationsPlugin = (options: Options): Plugin | null => {
	if (!options.dts) {
		return null;
	}

	return {
		name: "sdk:move-type-declarations",
		apply: "build",
		closeBundle: () => {
			if (fs.existsSync("./dist/src")) {
				// TODO: Replace with native Node 16 compatible version when 14 is EOL
				fse.copySync("./dist/src", "./dist", { recursive: true });
				fs.rmSync("./dist/src", { recursive: true });
			}
		},
	};
};
