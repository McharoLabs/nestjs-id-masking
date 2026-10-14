import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { MaskerConfig } from '../types/masker.types';

export interface MaskerModuleAsyncOptions<
  TArgs extends unknown[] = unknown[],
> extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider<MaskerConfig>['inject'];

  useFactory: (...args: TArgs) => MaskerConfig | Promise<MaskerConfig>;
}
