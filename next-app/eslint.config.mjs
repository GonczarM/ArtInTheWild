import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // This rule flags every "fetch on mount" effect in the app (calling an
      // async function from useEffect that eventually calls a state setter),
      // which is this app's deliberate, pervasive data-fetching idiom - there's
      // no Suspense/React Query layer to move it to. Disabled project-wide
      // rather than suppressed line-by-line in 6+ places.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
