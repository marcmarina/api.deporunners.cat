import { merge } from 'lodash';
import {
  defineConfig as defineViteConfig,
  UserConfigExport,
} from 'vitest/config';

function defineConfig(config: UserConfigExport = {}): UserConfigExport {
  const standardConfig: UserConfigExport = {
    test: {
      globals: true,
      include: ['src/**/*.spec.ts'],
    },
  };

  return defineViteConfig(merge({}, standardConfig, config));
}

export default defineConfig;
