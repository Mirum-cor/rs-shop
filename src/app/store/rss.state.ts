import { Injectable } from '@angular/core';
import {
  State, Action, StateContext, Selector,
} from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { DataService } from '../services/data.service';
import { IOrder } from '../services/order.interface';
import { IProduct } from '../services/product.interface';
import {
  GetCategories,
  GetCurrentCategory,
  GetCurrentCategoryGoods,
  GetCurrentProduct,
  GetGoods,
  GetMainGoods,
  GetPopularGoods,
  ResetGoodsInCart,
  SetCurrentProductID,
  SetFavoriteGoods,
  SetGoodsInCart,
  SetOrder,
  UpdateFavoriteGoods,
  UpdateGoodsInCart,
} from './rss.action';
import { IState } from './rss.interface';

const initialState: IState = {
  categories: [],
  goods: {},
  mainGoods: [],
  popularGoods: [],
  currentCategory: 'appliances',
  currentCategoryGoods: [],
  favoriteGoods: [],
  goodsInCart: [],
  currentProductID: 'CSMV5335MC0S',
  currentProduct: {
    id: '',
    name: '',
    imageUrls: [],
    rating: 0,
    availableAmount: 0,
    price: 0,
    description: '',
  },
  orders: [],
};

@State<IState>({
  name: 'RSSState',
  defaults: initialState,
})
@Injectable()
export class RSSState {
  constructor(
    private dataService: DataService,
  ) {}

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<IState>) {
    return this.dataService.getCategories().pipe(
      tap((result: any) => {
        patchState({
          categories: result,
        });
      }),
    );
  }

  @Action(GetGoods)
  getGoods({ patchState }: StateContext<IState>) {
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        patchState({
          goods: result,
        });
      }),
    );
  }

  @Action(GetMainGoods)
  getMainGoods({ patchState }: StateContext<IState>) {
    const mainSliderGoods: IProduct[] = [];
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        Object.values(result).forEach((category: any) => {
          const subcategory: any[] = Object.values(category);
          const product = Object.values(subcategory)[0][0];
          mainSliderGoods.push(product);
        });
        patchState({
          mainGoods: mainSliderGoods,
        });
      }),
    );
  }

  @Action(GetPopularGoods)
  getPopularGoods({ patchState }: StateContext<IState>) {
    const popularSliderGoods: IProduct[] = [];
    const MAX_GOODS_AMOUNT = 30;
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        Object.values(result).forEach((category: any) => {
          const subcategories: any[] = Object.values(category);
          subcategories.forEach((subcategory) => {
            for (let i = 0; i < subcategory.length; i++) {
              if (popularSliderGoods.length < MAX_GOODS_AMOUNT) {
                if (subcategory[i].rating >= 4) {
                  popularSliderGoods.push(subcategory[i]);
                }
              } else {
                break;
              }
            }
          });
        });
        patchState({
          popularGoods: popularSliderGoods,
        });
      }),
    );
  }

  @Action(GetCurrentCategory)
  getCurrentCategory(
    { patchState }: StateContext<IState>,
    action: GetCurrentCategory,
  ) {
    patchState({
      currentCategory: action.currentCategory,
    });
  }

  @Action(GetCurrentCategoryGoods)
  getCurrentCategoryGoods({ getState, patchState }: StateContext<IState>) {
    const state = getState();
    return this.dataService.getCategoryGoods(state.currentCategory).pipe(
      tap((result: any) => {
        patchState({
          currentCategoryGoods: result,
        });
      }),
    );
  }

  @Action(SetFavoriteGoods)
  setFavoriteGoods(
    { getState, patchState }: StateContext<IState>,
    action: SetFavoriteGoods,
  ) {
    const state = getState();
    const favoriteGoods = [...state.favoriteGoods];
    favoriteGoods.push(...action.favoriteGoods);
    const favoriteSet = new Set(favoriteGoods);
    patchState({
      favoriteGoods: [...favoriteSet],
    });
    if (action.favoriteGoods[0]) {
      this.dataService.setFavorite(action.favoriteGoods[0].id);
      localStorage.setItem('favoriteGoods', JSON.stringify([...favoriteSet]));
    }
  }

  @Action(UpdateFavoriteGoods)
  updateFavoriteGoods(
    { getState, patchState }: StateContext<IState>,
    action: UpdateFavoriteGoods,
  ) {
    const state = getState();
    const favoriteGoods = [...state.favoriteGoods]
      .filter((product) => product.id !== action.favoriteGoods[0].id) ?? [];
    const favoriteSet = new Set(favoriteGoods);
    patchState({
      favoriteGoods: [...favoriteSet],
    });
    if (action.favoriteGoods[0]) {
      this.dataService.removeFromFavorite(action.favoriteGoods[0].id);
      localStorage.setItem('favoriteGoods', JSON.stringify([...favoriteSet]));
    }
  }

  @Action(SetGoodsInCart)
  setGoodsInCart(
    { getState, patchState }: StateContext<IState>,
    action: SetGoodsInCart,
  ) {
    const state = getState();
    const goodsInCart = [...state.goodsInCart];
    goodsInCart.push(...action.goodsInCart);
    const cartSet = new Set(goodsInCart);
    patchState({
      goodsInCart: [...cartSet],
    });
    if (action.goodsInCart[0]) {
      this.dataService.setCart(action.goodsInCart[0].id);
      localStorage.setItem('goodsInCart', JSON.stringify([...cartSet]));
    }
  }

  @Action(UpdateGoodsInCart)
  updateGoodsInCart(
    { getState, patchState }: StateContext<IState>,
    action: UpdateGoodsInCart,
  ) {
    const state = getState();
    const goodsInCart = [...state.goodsInCart]
      .filter((product) => product.id !== action.goodsInCart[0].id) ?? [];
    const cartSet = new Set(goodsInCart);
    patchState({
      goodsInCart: [...cartSet],
    });
    if (action.goodsInCart[0]) {
      this.dataService.removeFromCart(action.goodsInCart[0].id);
      localStorage.setItem('goodsInCart', JSON.stringify([...cartSet]));
    }
  }

  @Action(ResetGoodsInCart)
  resetGoodsInCart(
    { patchState }: StateContext<IState>,
  ) {
    patchState({
      goodsInCart: [],
    });
    localStorage.setItem('goodsInCart', JSON.stringify([]));
  }

  @Action(SetCurrentProductID)
  setCurrentProductID(
    { patchState }: StateContext<IState>,
    action: SetCurrentProductID,
  ) {
    patchState({
      currentProductID: action.currentProductID,
    });
  }

  @Action(GetCurrentProduct)
  getCurrentProduct(
    { getState, patchState }: StateContext<IState>,
  ) {
    const state = getState();
    return this.dataService.getProduct(state.currentProductID).pipe(
      tap((result: any) => {
        patchState({
          currentProduct: result,
        });
      }),
    );
  }

  @Action(SetOrder)
  setOrder(
    { getState, patchState }: StateContext<IState>,
    action: SetOrder,
  ) {
    const state = getState();
    const orders = [...state.orders];
    orders.push(...action.orders);
    const ordersSet = new Set(orders);
    patchState({
      orders: [...ordersSet],
    });
    if (action.orders[0]) {
      this.dataService.setOrder(action.orders[0]);
      localStorage.setItem('orders', JSON.stringify([...ordersSet]));
    }
  }

  @Selector()
  public static categories(state: IState): ICategory[] {
    return state.categories;
  }

  @Selector()
  public static goods(state: IState): IAllGoods {
    return state.goods;
  }

  @Selector()
  public static mainGoods(state: IState): IProduct[] {
    return state.mainGoods;
  }

  @Selector()
  public static popularGoods(state: IState): IProduct[] {
    return state.popularGoods;
  }

  @Selector()
  public static currentCategory(state: IState): string {
    return state.currentCategory;
  }

  @Selector()
  public static currentCategoryGoods(state: IState): IProduct[] {
    return state.currentCategoryGoods;
  }

  @Selector()
  public static favoriteGoods(state: IState): IProduct[] {
    return state.favoriteGoods;
  }

  @Selector()
  public static goodsInCart(state: IState): IProduct[] {
    return state.goodsInCart;
  }

  @Selector()
  public static currentProductID(state: IState): string {
    return state.currentProductID;
  }

  @Selector()
  public static currentProduct(state: IState): IProduct {
    return state.currentProduct;
  }

  @Selector()
  public static orders(state: IState): IOrder[] {
    return state.orders;
  }
}
