/**
 * COLORS
 *
 * You can use this on tailwindcss.config.ts as follows:
 *
 *   import type { Config } from "tailwindcss";
 *   import { themeColors } from "./src/themes/theme-colors";
 *
 *   export default {
 *       content: ["./index.html", ".\src\**\*.{js,ts,jsx,tsx}"],
 *       darkMode: "class",
 *       theme: {
 *           extend: {
 *               colors: themeColors,
 *           },
 *       },
 *       plugins: [],
 *   } satisfies Config;
 *
 *
 */

import { dynamicTwClasses } from "cyhip-dynamic-themes";
import colors from "tailwindcss/colors";

export const themeColors = {
    // accent vars to allow dynamic color changes
    accent: dynamicTwClasses("accent", 250),
    // static colors as you wish...
    white: colors.white,
    danger: colors.red,
    success: colors.green,
    /**
     * You can customize this css vars based on accent values.
     * Take a look at root.css
     */
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",
    },
    secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--foreground)",
    },
    muted: {
        DEFAULT: "var(--muted)",
        foreground: "var(--muted-foreground)",
    },
    border: "var(--border)",
    ring: "var(--ring)",
    input: "var(--input)",
};
