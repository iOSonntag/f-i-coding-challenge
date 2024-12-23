import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@iosonntag/tslib-sst/api-code/utils/dev': path.resolve(__dirname, '../tslib-sst/src/api-code/utils/dev.ts'),
      'src/api-code/api-hub': path.resolve(__dirname, '../tslib-sst/src/api-code/api-hub.ts'),
      'src/api-code/utils/dev': path.resolve(__dirname, '../tslib-sst/src/api-code/utils/dev.ts'),
    },
  }
});