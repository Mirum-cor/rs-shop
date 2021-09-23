import { Component, ElementRef, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/services/category.interface';
import { IProduct } from 'src/app/services/product.interface';
import { GetCurrentCategoryGoods } from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.less']
})
export class ProductCategoryComponent implements OnInit, AfterViewChecked {
  @Select(RSSState.categories) public categories$!: Observable<ICategory[]>;
  @Select(RSSState.currentCategory) public currentCategory$!: Observable<string>;
  @Select(RSSState.currentCategoryGoods) public currentCategoryGoods$!: Observable<IProduct[]>;

  @ViewChild('category') category: ElementRef = { nativeElement: '' };

  currentCategory!: string;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetCurrentCategoryGoods([]));
  }

  ngAfterViewChecked(): void {
    this.categories$.subscribe((data) => {
      const currentCategory = this.store.selectSnapshot(RSSState.currentCategory);
      this.currentCategory = data.find((category) => category.id === currentCategory)?.name ?? '';
      this.category.nativeElement.textContent = this.currentCategory;
    });
  }
}
