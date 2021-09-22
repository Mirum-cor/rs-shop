import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { DataService } from '../services/data.service';
import { IProduct } from '../services/product.interface';
import { GetCategories, GetGoods, GetMainGoods, GetPopularGoods } from './rss.action';
import { IState } from './rss.interface';

const initialState: IState = {
  categories: [],
  goods: {},
  mainGoods: [],
  popularGoods: [],
};

@State<IState>({
  name: 'RSSState',
  defaults: initialState,
})
@Injectable()
export class RSSState {
  constructor(private dataService: DataService) {}

  @Action(GetCategories)
  getCategories({ getState, patchState }: StateContext<IState>) {
    return this.dataService.getCategories().pipe(
      tap((result: any) => {
        const state = getState();
        patchState({
          ...state,
          categories: result,
        });
      })
    );
  }

  @Action(GetGoods)
  getGoods({ getState, patchState }: StateContext<IState>) {
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        const state = getState();
        patchState({
          ...state,
          goods: result,
        });
      })
    );
  }

  @Action(GetMainGoods)
  getMainGoods({ getState, patchState }: StateContext<IState>) {
    const mainSliderGoods: IProduct[] = [];
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        Object.values(result).forEach((category: any) => {
          const subcategory: any[] = Object.values(category);
          const product = Object.values(subcategory)[0][0];
          mainSliderGoods.push(product);
        });
        const state = getState();
        patchState({
          ...state,
          mainGoods: mainSliderGoods,
        });
      })
    );
  }

  @Action(GetPopularGoods)
  getPopularGoods({ getState, patchState }: StateContext<IState>) {
    let popularSliderGoods: IProduct[] = [];
    const MAX_GOODS_AMOUNT = 30;
    return this.dataService.getAllGoods().pipe(
      tap((result: any) => {
        Object.values(result).forEach((category: any) => {
          const subcategories: any[] = Object.values(category);
          subcategories.forEach((subcategory) => {
            for (let i = 0; i < subcategory.length; i++) {
              if (popularSliderGoods.length < MAX_GOODS_AMOUNT) {
                if(subcategory[i].rating >= 4) {
                  popularSliderGoods.push(subcategory[i]);
                }
              } else {
                break;
              }
            }
          });
        });
        const state = getState();
        patchState({
          ...state,
          popularGoods: popularSliderGoods,
        });
      })
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
}
