import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { DataService } from '../services/data.service';
import { IProduct } from '../services/product.interface';
import {
  GetCategories,
  GetCurrentCategory,
  GetCurrentCategoryGoods,
  GetGoods,
  GetMainGoods,
  GetPopularGoods,
  SetCurrentProductID,
  SetGoodsInCart,
  SetLikedGoods,
} from './rss.action';
import { IState } from './rss.interface';

const initialState: IState = {
  categories: [],
  goods: {},
  mainGoods: [],
  popularGoods: [],
  currentCategory: 'appliances',
  currentCategoryGoods: [],
  likedGoods: [],
  goodsInCart: [],
  currentProductID: '',
};

@State<IState>({
  name: 'RSSState',
  defaults: initialState,
})
@Injectable()
export class RSSState {
  constructor(
    private dataService: DataService,
    private activateRoute: ActivatedRoute
  ) {}

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<IState>) {
    return this.dataService.getCategories().pipe(
      tap((result: any) => {
        patchState({
          categories: result,
        });
      })
    );
  }

  @Action(GetGoods)
  getGoods({ patchState }: StateContext<IState>) {
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        patchState({
          goods: result,
        });
      })
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
      })
    );
  }

  @Action(GetPopularGoods)
  getPopularGoods({ patchState }: StateContext<IState>) {
    let popularSliderGoods: IProduct[] = [];
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
      })
    );
  }

  @Action(GetCurrentCategory)
  getCurrentCategory(
    { patchState }: StateContext<IState>,
    action: GetCurrentCategory
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
      })
    );
  }

  @Action(SetLikedGoods)
  setLikedGoods(
    { getState, patchState }: StateContext<IState>,
    action: SetLikedGoods
  ) {
    const state = getState();
    const likedGoods = [...state.likedGoods];
    likedGoods.push(...action.likedGoods);
    const likedSet = new Set(likedGoods);
    patchState({
      likedGoods: [...likedSet],
    });
  }

  @Action(SetGoodsInCart)
  setGoodsInCart(
    { getState, patchState }: StateContext<IState>,
    action: SetGoodsInCart
  ) {
    const state = getState();
    const goodsInCart = [...state.goodsInCart];
    goodsInCart.push(...action.goodsInCart);
    const cartSet = new Set(goodsInCart);
    patchState({
      goodsInCart: [...cartSet],
    });
  }

  @Action(SetCurrentProductID)
  setCurrentProductID(
    { patchState }: StateContext<IState>,
    action: SetCurrentProductID
  ) {
    patchState({
      currentProductID: action.currentProductID,
    });
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
  public static likedGoods(state: IState): IProduct[] {
    return state.likedGoods;
  }

  @Selector()
  public static goodsInCart(state: IState): IProduct[] {
    return state.goodsInCart;
  }

  @Selector()
  public static currentProductID(state: IState): string {
    return state.currentProductID;
  }
}
