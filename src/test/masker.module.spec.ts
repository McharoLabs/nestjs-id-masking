import { Module } from '@nestjs/common';
import { describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { MaskerModule } from '../masker.module';
import { MaskerService } from '../services/masker.service';
import { MaskerConfig } from '../types/masker.types';

const TEST_SALT = Symbol('TEST_SALT');

@Module({
  providers: [
    {
      provide: TEST_SALT,
      useValue: 'injected-test-salt',
    },
  ],
  exports: [TEST_SALT],
})
class TestConfigModule {}

describe('MaskerModule', () => {
  describe('forRootAsync', () => {
    it('should configure the module asynchronously', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          MaskerModule.forRootAsync({
            useFactory: (): MaskerConfig => ({
              salt: 'async-test-salt',
            }),
          }),
        ],
      }).compile();

      const service = moduleRef.get(MaskerService);

      expect(service).toBeInstanceOf(MaskerService);

      const maskedId = service.mask(123);

      expect(service.unmask(maskedId)).toBe(123);

      await moduleRef.close();
    });

    it('should inject dependencies into the configuration factory', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          MaskerModule.forRootAsync({
            imports: [TestConfigModule],
            inject: [TEST_SALT],
            useFactory: (salt: string): MaskerConfig => ({
              salt,
            }),
          }),
        ],
      }).compile();

      const service = moduleRef.get(MaskerService);

      expect(service).toBeInstanceOf(MaskerService);

      const maskedId = service.mask(456);

      expect(service.unmask(maskedId)).toBe(456);

      await moduleRef.close();
    });

    it('should export MaskerService for use by importing modules', async () => {
      @Module({
        imports: [
          MaskerModule.forRootAsync({
            useFactory: (): MaskerConfig => ({
              salt: 'export-test-salt',
            }),
          }),
        ],
      })
      class ParentModule {
        public constructor(public readonly maskerService: MaskerService) {}
      }

      const moduleRef = await Test.createTestingModule({
        imports: [ParentModule],
      }).compile();

      const parent = moduleRef.select(ParentModule).get(ParentModule);

      expect(parent.maskerService).toBeInstanceOf(MaskerService);
      expect(parent.maskerService.unmask(parent.maskerService.mask(789))).toBe(
        789,
      );

      await moduleRef.close();
    });
  });
});
