import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "plugin:tailwindcss/recommended",
      "prettier"
    ],
    rules: {
      "no-undef": "off",
    },
  },
];
