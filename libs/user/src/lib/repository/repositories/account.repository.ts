import { AccountDoc, AccountModel } from '../models/account.model';
import { BaseRepository } from '@livekit-demo/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountRepository extends BaseRepository<AccountDoc, AccountModel> {
  constructor(@InjectModel(AccountModel.name) public override readonly model: Model<AccountDoc>) {
    super(model);
  }
}
