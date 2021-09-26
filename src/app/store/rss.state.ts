import { Injectable } from '@angular/core';
import {
  State, Action, StateContext, Selector,
} from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { DataService } from '../services/data.service';
import { IProduct } from '../services/product.interface';
import {
  GetCategories,
  GetCurrentCategory,
  GetCurrentCategoryGoods,
  GetCurrentProduct,
  GetGoods,
  GetMainGoods,
  GetPopularGoods,
  SetCurrentProductID,
  SetFavoriteGoods,
  SetGoodsInCart,
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
  goodsInCart: [{
    "id": "CSMV5335MC0S",
    "name": "Холодильник с морозильником Beko CSMV5335MC0S",
    "imageUrls": [
      "https://cdn21vek.by/img/galleries/476/171/preview/csmv5335mc0s_beko_5a3a4c5cb078c.jpeg",
      "https://cdn21vek.by/img/galleries/476/171/preview_b/csmv5335mc0s_beko_5a3a4c65101e7.jpeg"
    ],
    "availableAmount": 5,
    "price": 999,
    "rating": 5,
    "description": "Deserunt esse anim nulla consequat mollit non do occaecat in aute labore fugiat. Amet deserunt ullamco ex et ullamco. Magna irure nostrud sint enim aliqua incididunt consectetur minim mollit ad. Qui minim magna Lorem nulla officia non consequat ad officia proident laborum. Ut non nisi culpa laboris commodo ipsum laboris do ad irure Lorem nulla eiusmod.",
    "isInCart": false,
    "isFavorite": false,
    "category": "appliances",
    "subCategory": "refrigerators"
  }],
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
}
