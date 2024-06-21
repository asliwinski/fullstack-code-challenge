import path from "path";

const config = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/@"),
      "@/components": path.resolve(__dirname, "src/@/components"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@queries": path.resolve(__dirname, "src/queries"),
      "@api": path.resolve(__dirname, "src/api"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/@/$1",
        "^@/components/(.*)$": "<rootDir>/src/@/components/$1",
        "^@/types$": "<rootDir>/src/types.ts",
        "^@queries/(.*)$": "<rootDir>/src/queries/$1",
        "^@api/(.*)$": "<rootDir>/src/api/$1",
      },
    },
  },
};

export default config;
