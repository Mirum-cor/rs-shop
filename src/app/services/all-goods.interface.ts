import { IProduct } from './product.interface';

export interface IAllGoods {
  [key: string]: {
    [key: string]: IProduct[];
  };
}
