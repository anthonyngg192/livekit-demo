import { BaseRepository } from '../../base/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDoc, LogModel } from '../models/log.model';
import { Model } from 'mongoose';

@Injectable()
export class LogRepository extends BaseRepository<LogDoc, LogModel> {
  constructor(@InjectModel(LogModel.name) public override readonly model: Model<LogDoc>) {
    super(model);
  }
}
