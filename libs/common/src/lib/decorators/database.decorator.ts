import { InjectModel } from '@nestjs/mongoose';

export const DatabaseModel = (entity: string): ParameterDecorator => {
  return InjectModel(entity);
};
