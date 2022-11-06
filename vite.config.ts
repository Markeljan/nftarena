import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: /^jss-plugin-(.*)$/,
                replacement: "$1",
                customResolver: (id) => {
                    if (id === "{}") {
                        id = "global";
                    }
                    return resolve(__dirname, `./node_modules/jss-plugin-${id}/src/index.js`);
                },
            },
        ],
    },
});