import { ApiResponseProperty } from '@nestjs/swagger';
import { ceil } from 'lodash';

export class PagingDocs<T> {
  @ApiResponseProperty({ type: Number })
  pages = 0;

  @ApiResponseProperty({ type: Number })
  total = 0;

  @ApiResponseProperty({ type: Number })
  page = 1;

  @ApiResponseProperty({ type: Number })
  limit = 20;

  @ApiResponseProperty()
  data: T[] = [];

  constructor(data: T[] = [], total = 0, page = 1, limit = 20) {
    this.data = data;
    this.total = total || this.total;
    this.page = page || this.page;
    this.limit = limit || this.limit;
    this.pages = ceil(total / limit);
  }
}
