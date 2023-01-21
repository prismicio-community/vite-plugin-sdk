const pkg = require("./package.json");

module.exports = [
	...new Set([
		pkg.main,
		pkg.module,
		...Object.values(pkg.exports).flatMap((exportValue) => {
			if (typeof exportValue === "string") {
				return exportValue;
			} else {
				return Object.values(exportValue);
			}
		}),
	]),
]
	.filter((path) => {
		return path && path !== "./package.json";
	})
	.map((path) => {
		return {
			path,
			modifyEsbuildConfig(config) {
				config.platform = "node";

				return config;
			},
		};
	});
