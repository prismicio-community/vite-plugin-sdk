const pkg = require("./package.json");
const { builtins } = require("./dist/lib/builtins.cjs");

module.exports = [pkg.module, pkg.main]
	.filter(Boolean)
	.map((path) => ({
		path,
		ignore: [
			...Object.keys(pkg.dependencies),
			"node:*",
			...builtins
		]
	}));
