import * as fs from "node:fs";
import * as path from "node:path";

import { PackageJSON } from "../types";

export const readPackageJSON = (rootDir = process.cwd()): PackageJSON => {
	try {
		const blob = fs.readFileSync(path.resolve(rootDir, "package.json"), "utf8");

		return JSON.parse(blob);
	} catch {
		if (rootDir === "/") {
			throw new Error(
				`Could not locate \`package.json\` in \`${process.cwd()}\` or its parent directories.`,
			);
		}

		return readPackageJSON(path.resolve(rootDir, ".."));
	}
};
