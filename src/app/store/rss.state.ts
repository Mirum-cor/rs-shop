import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { DataService } from '../services/data.service';
import { IProduct } from '../services/product.interface';
import { GetCategories, GetGoods, GetMainGoods } from './rss.action';
import { IState } from './rss.interface';

const initialState: IState = {
  categories: [],
  goods: {},
  mainGoods: [],
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
        Object.values(result).map((category: any) => {
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
}
