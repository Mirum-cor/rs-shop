import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { IOrder } from '../services/order.interface';
import { IProduct } from '../services/product.interface';

export interface IState {
  categories: ICategory[];
  goods: IAllGoods;
  mainGoods: IProduct[];
  popularGoods: IProduct[];
  currentCategory: string;
  currentCategoryGoods: IProduct[];
  favoriteGoods: IProduct[];
  goodsInCart: IProduct[];
  currentProductID: string;
  currentProduct: IProduct;
  orders: IOrder[];
}
