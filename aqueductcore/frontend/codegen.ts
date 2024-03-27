import type { CodegenConfig } from "@graphql-codegen/cli";
import 'dotenv/config'

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.REACT_APP_API_DEV_ORIGIN}/api/graphql`,
  documents: "src/API/graphql/**/*.{ts,tsx}",
  generates: {
    "src/types/graphql/__GENERATED__/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
