import { Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';

import { MASKER_CONFIG } from './constants/masker.constants';
import type { MaskerModuleAsyncOptions } from './config/masker.config';
import { MaskerService } from './services/masker.service';

@Module({})
export class MaskerModule {
  public static forRootAsync<TArgs extends unknown[] = unknown[]>(
    options: MaskerModuleAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: MaskerModule,
      imports: [...(options.imports ?? [])],
      providers: [
        {
          provide: MASKER_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        MaskerService,
      ],
      exports: [MaskerService],
    };
  }
}
