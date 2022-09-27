import { defineConfig } from "vite";

import sdk from "./src";

export default defineConfig({
	build: {
		// target: ["node14"],
	},
	plugins: [sdk()],
	test: {
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
});
