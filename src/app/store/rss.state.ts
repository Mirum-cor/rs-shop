import { Injectable } from '@angular/core';
import {
  State, Action, StateContext, Selector,
} from '@ngxs/store';
import {
  tap,
} from 'rxjs/operators';
import { ICategory } from "../services/category.interface";
import { DataService } from '../services/data.service';
import { GetCategories } from './rss.action';
import { IState } from "./rss.interface";

const initialState: IState = {
  categories: [],
};

@State<IState>({
  name: 'RSSState',
  defaults: initialState,
})
@Injectable()
export class RSSState {
  constructor(private dataService: DataService) {}

  @Action(GetCategories)
  getCategories({ getState, patchState }: StateContext<IState>, action: GetCategories) {
    return this.dataService.getHttpResponse('categories').pipe(
      tap((result: any) => {
        const state = getState();
        patchState({
          ...state,
          categories: result,
        });
      }),
    );
  }

  @Selector()
  public static categories(state: IState): ICategory[] {
    return state.categories;
  }
}
