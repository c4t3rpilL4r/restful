import { Filter } from './filter';

export class Pagination {
  page!: number;
  limit!: number;
  filters?: Filter;
}
