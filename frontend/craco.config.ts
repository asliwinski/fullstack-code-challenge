import path from "path";

const config = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/@"),
      "@queries": path.resolve(__dirname, "src/queries"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "@/(.+)": "<rootDir>/src/@/$1",
        "@queries/(.+)": "<rootDir>/src/queries/$1",
      },
    },
  },
};

export default config;
