import { getBasiliskProcessorIndexerStatus } from '../../utils/api-utils';

const { test, expect } = require('@playwright/test');

test.describe('Basilisk-api processor/indexer should', () => {
  test('provide status', async () => {
    const procIndexerStatus = await getBasiliskProcessorIndexerStatus();
    await expect(procIndexerStatus).not.toBe(null);
  });
});
