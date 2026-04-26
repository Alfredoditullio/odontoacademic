import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Reglas de tipado estricto: cero `any`, cero supresiones silenciosas.
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      // Prohíbe `any` explícito en el código de la app.
      "@typescript-eslint/no-explicit-any": "error",

      // Prohíbe @ts-ignore / @ts-nocheck. Permite @ts-expect-error
      // sólo si va con descripción (mínimo 10 chars) — para casos
      // realmente inevitables en libs externas.
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          "ts-expect-error": "allow-with-description",
          "minimumDescriptionLength": 10,
        },
      ],

      // Variables sin usar = error, salvo que empiecen con _ (convención).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],

      // React 19 escapa el contenido de JSX automáticamente; usar `"texto"`
      // y `'texto'` en JSX es seguro y idiomático en español.
      "react/no-unescaped-entities": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
