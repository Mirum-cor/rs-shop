import { ICategory } from "../services/category.interface";

export class GetCategories {
  static readonly type = '[YC] Load Categories';
  constructor(public categories: ICategory[]) { }
}
