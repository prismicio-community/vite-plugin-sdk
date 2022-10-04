import { defineConfig } from "vite";

import sdk from "./src";

export default defineConfig({
	plugins: [sdk()],
	test: {
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
});
