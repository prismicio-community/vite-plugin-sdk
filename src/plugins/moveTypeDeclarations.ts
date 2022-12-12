import * as fs from "node:fs";
import * as path from "node:path";

import fse from "fs-extra";
import type { Plugin, UserConfig } from "vite";

import { Options } from "../types";
import { castArray } from "../lib/castArray";

export const moveTypeDeclarationsPlugin = (options: Options): Plugin | null => {
	if (!options.dts) {
		return null;
	}

	let savedUserConfig: UserConfig;

	return {
		name: "sdk:move-type-declarations",
		apply: "build",
		config: (userConfig) => {
			savedUserConfig = userConfig;
		},
		closeBundle: () => {
			const outDir = savedUserConfig.build?.outDir || "dist";

			for (const entryDir of castArray(options.entryDir)) {
				const entryOutDir = path.posix.join(outDir, entryDir);

				if (fs.existsSync(entryOutDir)) {
					// TODO: Replace with native Node 16 compatible version when 14 is EOL
					fse.copySync(entryOutDir, outDir, { recursive: true });
					fs.rmSync(entryOutDir, { recursive: true });
				}
			}
		},
	};
};
