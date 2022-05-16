import { PlaywrightTestConfig } from '@playwright/test';

const env = require('dotenv');
env.config({
  path:
    process.env.NODE_ENV !== 'CI' ? `.env.test.e2e.local` : '.env.test.e2e.ci',
});

console.log('>>> process.env - ', process.env);
console.log('>>> process.env.NODE_ENV - ', process.env.NODE_ENV);
console.log('>>> process.env.EXTENSSION_SRC - ', process.env.EXTENSSION_SRC);

const config: PlaywrightTestConfig = {
  globalTeardown: require.resolve('../global-teardown.ts'),
  timeout: 60000,
  expect: {
    timeout: 60 * 1000,
  },
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 60 * 1000,
    // screenshot: 'only-on-failure',
    channel: 'chromium',
    screenshot: 'on',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  reporter: [
    [process.env.NODE_ENV !== 'CI' ? 'list' : 'github'],
    ['junit', { outputFile: 'ui-app-e2e-results.xml' }],
  ],
};

export default config;
