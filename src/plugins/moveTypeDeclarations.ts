import * as fs from "node:fs";
import * as path from "node:path";

import fse from "fs-extra";
import type { Plugin, ResolvedConfig } from "vite";

import { Options } from "../types";

export const moveTypeDeclarationsPlugin = (options: Options): Plugin | null => {
	if (!options.dts) {
		return null;
	}

	let config: ResolvedConfig;

	return {
		name: "sdk:move-type-declarations",
		apply: "build",
		configResolved: (resolvedConfig) => {
			config = resolvedConfig;
		},
		closeBundle: () => {
			const outDir = config.build.outDir;
			const srcOutDir = path.posix.join(outDir, options.srcDir);

			if (fs.existsSync(srcOutDir)) {
				// TODO: Replace with native Node 16 compatible version when 14 is EOL
				fse.copySync(srcOutDir, outDir, { recursive: true });
				fs.rmSync(srcOutDir, { recursive: true });
			}
		},
	};
};
