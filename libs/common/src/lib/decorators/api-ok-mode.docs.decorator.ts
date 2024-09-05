import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export const ApiOkModelResponse = <TModel extends Type<any>>(options: {
  type: TModel;
  description?: string;
  isArray?: boolean;
}) => {
  const allOf: any[] = [];
  if (!options.isArray) allOf.push({ $ref: getSchemaPath(options.type) });
  else
    allOf.push({
      type: 'array',
      items: { $ref: getSchemaPath(options.type) },
    });
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      schema: {
        title: `${options.type.name}OkModelResponse`,
        allOf,
      },
    }),
  );
};
