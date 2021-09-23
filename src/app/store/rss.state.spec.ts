import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { IAllGoods } from '../services/all-goods.interface';
import { ICategory } from '../services/category.interface';
import { IProduct } from '../services/product.interface';
import { RSSState } from './rss.state';

describe('State & Selectors', async () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([RSSState])],
      providers: [HttpClient, HttpHandler],
    });
    store = TestBed.inject(Store);
  });

  it('should be created with default values', () => {
    const categories: ICategory[] = store.selectSnapshot(
      (state: any) => state.RSSState.categories
    );
    expect(categories).toEqual([]);
  });

  it('getCategories selector works', () => {
    const categories: ICategory[] = store.selectSnapshot(RSSState.categories);
    expect(categories).toEqual([]);
  });

  it('getGoods selector works', () => {
    const goods: IAllGoods = store.selectSnapshot(RSSState.goods);
    expect(goods).toEqual({});
  });

  it('getMainGoods selector works', () => {
    const mainGoods: IProduct[] = store.selectSnapshot(RSSState.mainGoods);
    expect(mainGoods).toEqual([]);
  });

  it('getPopularGoods selector works', () => {
    const popularGoods: IProduct[] = store.selectSnapshot(RSSState.popularGoods);
    expect(popularGoods).toEqual([]);
  });
});
