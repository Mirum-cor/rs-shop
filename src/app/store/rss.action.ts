import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { IProduct } from '../services/product.interface';

export class GetCategories {
  static readonly type = '[RSS] Load Categories';
  constructor(public categories: ICategory[]) {}
}

export class GetGoods {
  static readonly type = '[RSS] Load Goods';
  constructor(public goods: IAllGoods) {}
}

export class GetMainGoods {
  static readonly type = '[RSS] Load Goods for Main Slider';
  constructor(public mainGoods: IProduct[]) {}
}
