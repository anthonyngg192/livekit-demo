import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { PagingDocs } from '../docs';
import { ResponseDocs } from '../docs/response.docs';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PagingDocs, ResponseDocs, model),
    ApiOkResponse({
      schema: {
        title: `${model.name}PaginationResponse`,
        allOf: [
          { $ref: getSchemaPath(ResponseDocs) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PagingDocs) },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiFilterResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PagingDocs, ResponseDocs, model),
    ApiOkResponse({
      schema: {
        title: `${model.name}FiltersResponse`,
        allOf: [
          { $ref: getSchemaPath(PagingDocs) },
          { $ref: getSchemaPath(ResponseDocs) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          },
        ],
      },
    }),
  );
};
