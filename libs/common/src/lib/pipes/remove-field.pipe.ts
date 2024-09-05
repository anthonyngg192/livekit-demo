import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isArray, isString, omitBy } from 'lodash';

@Injectable()
export class SanitizePayloadPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    return this.removeEmptyFields(value);
  }

  private removeEmptyFields(obj: Record<string, any>): Record<string, any> {
    return omitBy(obj, (value) => {
      return (
        value === null ||
        value === undefined ||
        (isString(value) && value.trim().length === 0) ||
        (isArray(value) && value.length === 0)
      );
    });
  }
}
