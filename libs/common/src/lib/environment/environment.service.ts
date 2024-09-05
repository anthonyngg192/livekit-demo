import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AppEnvironmentParam } from './environment.param';
import { Injectable, Logger, Optional, ValueProvider } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

type ClassConstructor<T> = {
  new (...args: any[]): T;
};

@Injectable()
export class AppEnvironmentService {
  private logger = new Logger(this.constructor.name);

  public readonly ENVIRONMENT: AppEnvironmentParam;

  constructor(
    @Optional()
    classValidate: ClassConstructor<AppEnvironmentParam> = AppEnvironmentParam as ClassConstructor<AppEnvironmentParam>,
  ) {
    let config: any;

    try {
      config = dotenv.parse(fs.readFileSync('.env'));
    } catch (err) {
      this.logger.warn(`System will get env from process`);
      config = process.env;
    }

    this.ENVIRONMENT = plainToClass(classValidate, {
      ...new classValidate(),
      ...config,
    });

    const res = validateSync(this.ENVIRONMENT);
    if (res.length) {
      this.logger.log(JSON.stringify(res));
      throw res;
    }
  }
}

export const EnvironmentServiceProvider: ValueProvider<AppEnvironmentService> = {
  provide: AppEnvironmentService,
  useValue: new AppEnvironmentService(),
};
