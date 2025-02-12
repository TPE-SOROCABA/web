import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export const resolve = {
   extensions: ['.js', '.jsx', '.ts', '.tsx'],
   plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
};