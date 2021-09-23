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

export class GetPopularGoods {
  static readonly type = '[RSS] Load Popular Goods for Slider';
  constructor(public popularGoods: IProduct[]) {}
}

export class GetCurrentCategory {
  static readonly type = '[RSS] Load Current Category';
  constructor(public currentCategory: string) {}
}

export class GetCurrentCategoryGoods {
  static readonly type = '[RSS] Load Current Category Goods';
  constructor(public currentCategoryGoods: IProduct[]) {}
}

export class SetLikedGoods {
  static readonly type = '[RSS] Load Liked Goods';
  constructor(public likedGoods: IProduct[]) {}
}

export class SetGoodsInCart {
  static readonly type = '[RSS] Load Goods In Cart';
  constructor(public goodsInCart: IProduct[]) {}
}

export class SetCurrentProductID {
  static readonly type = '[RSS] Load Current Product ID';
  constructor(public currentProductID: string) {}
}
