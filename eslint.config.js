import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**"
    ],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {},
  },
];