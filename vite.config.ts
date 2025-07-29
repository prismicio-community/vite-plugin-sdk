/// <reference types="vitest/config" />
import { defineConfig } from "vite"

import sdk from "./src"

export default defineConfig({
	plugins: [sdk()],
	test: {
		coverage: {
			provider: "v8",
			reporter: ["lcovonly", "text"],
		},
	},
})
