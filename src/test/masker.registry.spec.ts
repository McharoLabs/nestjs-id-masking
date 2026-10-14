import { afterEach, describe, expect, it } from '@jest/globals';

import {
  getMaskerService,
  resetMaskerService,
  setMaskerService,
} from '../masker.registry';
import { MaskerService } from '../services/masker.service';

describe('MaskerRegistry', () => {
  afterEach(() => {
    resetMaskerService();
  });

  it('should throw when the service has not been initialized', () => {
    resetMaskerService();

    expect(() => getMaskerService()).toThrow(
      'MaskerService has not been initialized',
    );
  });

  it('should return the registered service', () => {
    const service = new MaskerService({
      salt: 'registry-test-salt',
    });

    setMaskerService(service);

    expect(getMaskerService()).toBe(service);
  });
});
