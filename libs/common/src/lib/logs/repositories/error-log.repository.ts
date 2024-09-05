import { BaseRepository } from '../../base/base.repository';
import { ErrorLogDoc, ErrorLogModel } from '../models/error-log.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ErrorLogRepository extends BaseRepository<ErrorLogDoc, ErrorLogModel> {
  constructor(@InjectModel(ErrorLogModel.name) public override readonly model: Model<ErrorLogDoc>) {
    super(model);
  }
}
