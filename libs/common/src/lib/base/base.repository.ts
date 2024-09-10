import moment from 'moment';
import { assignIn, cloneDeep, forEach, isArray, isString, isUndefined, max, omitBy, split } from 'lodash';
import { BaseModel } from './base.model';
import { PagingDocs } from '../docs';
import { PagingDTO } from '../dto/paging.dto';
import { QueryDTO } from '../dto/query.dto';
import { randomBytes } from 'crypto';
import { SortBy, SortType } from '../constants';

import {
  Document,
  FilterQuery,
  isObjectIdOrHexString,
  Model,
  MongooseBaseQueryOptionKeys,
  PipelineStage,
  QueryOptions,
} from 'mongoose';

export abstract class BaseRepository<DocType extends Document, ModelType extends BaseModel> {
  sortBy: SortBy | string;
  sortType: SortType;

  protected textSearchFields: string[] = [];

  constructor(protected readonly model: Model<DocType>) {
    this.sortBy = SortBy.ID;
    this.sortType = SortType.DESC;
  }

  public getModel() {
    return this.model;
  }

  private generateRandomString(length: number): string {
    const bytes = randomBytes(length);
    const alphaChars = bytes.toString('base64').replace(/[^a-zA-Z]/g, '');
    return alphaChars.slice(0, length).toUpperCase();
  }

  public remakeQuery(query: QueryDTO) {
    if (query['fullTextSearch']) {
      query['$or'] = query['$or'] || [];
      query['$or'].push(
        ...[
          {
            $text: { $search: `\"${(query['fullTextSearch'] as string).split(' ').join(`\" \"`)}\"` },
          },
          ...this.textSearchFields.map((field) => ({ [field]: new RegExp(query['fullTextSearch'], 'i') })),
        ],
      );
    }

    query.sortBy = query.sortBy || this.sortBy;
    query.sortType = query.sortType || this.sortType;

    if (query.createdAtFrom) {
      query['createdAt'] = { $gte: query.createdAtFrom };
    }

    if (query.createdAtTo) {
      query['createdAt'] = assignIn(query['createdAt'] || {}, { $lte: query.createdAtTo });
    }

    if (query['updatedAtFrom']) {
      query['updatedAt'] = { $gte: query['updatedAtFrom'] };
    }

    if (query['updatedAtTo']) {
      query['updatedAt'] = assignIn(query['updatedAt'] || {}, { $lte: query['updatedAtTo'] });
    }

    return omitBy(
      query,
      (value, key) =>
        isUndefined(value) ||
        value === '' ||
        value === null ||
        [
          'fields',
          'externalFields',
          'fullTextSearch',
          'createdAtFrom',
          'createdAtTo',
          'updatedAtFrom',
          'updatedAtTo',
          'startTimeAt',
          'endTimeAt',
          'page',
          'limit',
          'sortBy',
          'sortType',
          'ids',
          'cursor',
          'includeCursor',
          'running',
          'sort',
        ].includes(key),
    ) as FilterQuery<DocType>;
  }

  protected convertArrayToObjectFields(items: string[]) {
    const data: { [key: string]: boolean } = {};
    items.forEach((item) => (data[item] = true));
    return data;
  }

  protected convertStringToArray(data: string | string[], separator = ',') {
    let returnValues: string[] = [];
    if (data) {
      if (isString(data)) {
        returnValues = split(data, separator);
      } else if (isArray(data)) {
        returnValues = data as string[];
      }
    }

    return returnValues;
  }

  protected determineSort(query: QueryDTO): any {
    const sortBy = query.sortBy || this.sortBy;
    const sortType = query.sortType || this.sortType;

    if (query.sort) {
      const sortObject = {} as any;
      query.sort.split(',').forEach((field) => {
        sortObject[field.startsWith('-') ? field.slice(1) : field] = field.startsWith('-') ? -1 : 1;
      });

      if (sortBy) {
        return { ...sortObject, [sortBy]: sortType === SortType.ASC ? 1 : -1 };
      }

      return sortObject;
    }

    return {
      [sortBy]: sortType === SortType.ASC ? 1 : -1,
    };
  }

  async generateCode(preCode: string): Promise<string> {
    const codeSuffix = this.generateRandomString(5);
    const now = moment();
    const code = `${preCode}${now.format('YYMMDD')}${codeSuffix}`.toUpperCase();
    const instance = await this.findOne({ code });
    return instance ? await this.generateCode(preCode) : code;
  }

  async insert<T extends ModelType>(data: ModelType) {
    data.createdAt = data.updatedAt = data.createdAt || Date.now();
    return (await this.model.create(data)).toJSON<T>() as T;
  }

  async insertMany<T extends ModelType>(items: ModelType[]) {
    if (!items.length) {
      return [];
    }
    const now = Date.now();
    items.forEach((data) => {
      data.createdAt = data.updatedAt = data.createdAt || now;
    });
    const createdItems = await this.model.create(items);
    return createdItems.map((item) => item.toJSON<T>());
  }

  async findById<T extends ModelType>(_id: string, fields: string[] = []) {
    if (!_id) return null;

    return this.model.findById(_id).select(fields).lean<T>().exec();
  }

  async findByOrSlug<T extends ModelType>(_id: string, fields: string[] = []) {
    if (isObjectIdOrHexString(_id)) return this.findById(_id, fields);

    const code = _id.split(',').reverse()[0];

    return this.model
      .findOne({ code } as any)
      .select(fields)
      .lean<T>()
      .exec();
  }

  async findOne<T extends ModelType>(query: QueryDTO): Promise<T | null> {
    const queryRemake = this.remakeQuery(query);
    return this.model
      .findOne({ ...queryRemake })
      .select(query.fields || [])
      .lean<T>()
      .exec();
  }

  async find<T extends ModelType>(query = new QueryDTO()) {
    const newQuery = this.remakeQuery(query);
    const fields = this.convertStringToArray(query.fields || '');

    return this.model.findOne(newQuery).sort(this.determineSort(query)).select(fields).lean<T>().exec();
  }

  async findOneAndUpdate<T extends ModelType>(query: QueryDTO, data: any, options: QueryOptions = {}) {
    const newQuery = this.remakeQuery(query);
    if (options.upsert) {
      data.$setOnInsert = data.$setOnInsert || {};
      if (!data.createdAt) {
        data.$setOnInsert = { ...data.$setOnInsert, createdAt: Date.now() };
      }
    }
    return this.model
      .findOneAndUpdate(newQuery, { ...data, updatedAt: Date.now() }, { new: true, ...options })
      .lean<T>();
  }

  async findAll<T extends ModelType>(query: QueryDTO) {
    const newQuery = this.remakeQuery(query);
    const fields = this.convertStringToArray(query.fields || '');
    return this.model.find(newQuery, fields, null).sort(this.determineSort(query)).lean<T[]>().exec();
  }

  async filter<T extends ModelType>(query: PagingDTO) {
    try {
      const fields = this.convertStringToArray(query.fields || '');
      const newQuery = this.remakeQuery(query);
      const skip = max([0, (query.page - 1) * query.limit]) || 0;
      const data = await this.model
        .find(newQuery, fields)
        .sort(this.determineSort(query))
        .skip(skip)
        .limit(query.limit)
        .lean<T[]>()
        .exec();
      const total = await this.model.countDocuments(newQuery).exec();
      return new PagingDocs<T>(data, total, query.page, query.limit);
    } catch (e) {
      return new PagingDocs<T>([], 0, query.page, query.limit);
    }
  }

  async paginateAggregate<T>(query: PagingDTO, pipelines: PipelineStage[] = [], options?: any, flatField: string = '') {
    const fields = this.convertStringToArray(query.fields || '');
    const newQuery = this.remakeQuery(query);
    let formattedAggregations = [{ $match: newQuery }, ...pipelines];
    const formattedOptions = options;
    const formattedAggregationsCount = [...formattedAggregations, { $count: 'total' }];

    formattedAggregations.push({ $sort: this.determineSort(query) });
    if (fields && fields.length) {
      formattedAggregations = [...formattedAggregations, { $project: fields }];
    }
    const skip = max([0, (query.page - 1) * query.limit]) || 0;

    const [data, count] = await Promise.all([
      this.model.aggregate(formattedAggregations, formattedOptions).skip(skip).limit(query.limit).exec(),
      this.model.aggregate(formattedAggregationsCount).exec(),
    ]);

    if (flatField) {
      forEach(data, (item) => {
        assignIn(item, item[flatField]);
        delete item[flatField];
      });
    }

    return new PagingDocs<T>(data, count.length ? count[0].total : 0, query.page, query.limit);
  }

  async paginateAggregation<T>(pipelines: any[] = [], query: PagingDTO) {
    const pipelinesCount = cloneDeep(pipelines);
    pipelinesCount.push({ $count: 'total' });
    const fields = this.convertStringToArray(query.fields || '');
    pipelines.push({ $sort: this.determineSort(query) });
    const skip = max([0, (query.page - 1) * query.limit]) || 0;

    if (fields && fields.length) {
      pipelines.push({ $project: this.convertArrayToObjectFields(fields) });
    }
    const [data, count] = await Promise.all([
      this.model.aggregate(pipelines).skip(skip).limit(query.limit).exec(),
      this.model.aggregate(pipelinesCount).exec(),
    ]);

    return new PagingDocs<T>(data, count.length ? count[0].total : 0, query.page, query.limit);
  }

  async updateOne(conditions: any, data: any, queryOptions?: QueryOptions<DocType>) {
    if (data.updatedAt === null) delete data.updatedAt;
    else data.updatedAt = Date.now();

    if (queryOptions?.upsert) {
      data.$setOnInsert = data.$setOnInsert || {};
      if (!data.createdAt) data.$setOnInsert.createdAt = data.$setOnInsert.createdAt || Date.now();
    }

    const options: Pick<QueryOptions<DocType>, 'timestamps' | MongooseBaseQueryOptionKeys> = {
      ...queryOptions, // assuming queryOptions is of type QueryOptions<DocType>
    };

    const result = await this.model.updateOne(conditions, data, options || null).exec();

    return result.matchedCount > 0;
  }

  async updateMany(conditions: any, data: any, queryOptions?: QueryOptions<DocType>) {
    if (data.updatedAt === null) delete data.updatedAt;
    else data.updatedAt = Date.now();

    const options: Pick<QueryOptions<DocType>, 'timestamps' | MongooseBaseQueryOptionKeys> = {
      ...queryOptions,
    };

    const result = await this.model.updateMany(conditions, data, options).exec();

    return result.matchedCount > 0;
  }

  async count(condition: any): Promise<number> {
    return (await this.model.countDocuments(this.remakeQuery(condition)).exec()) || 0;
  }
}
