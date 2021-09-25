import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICategory } from 'src/app/services/category.interface';
import { IProduct } from 'src/app/services/product.interface';
import { ISubcategory } from 'src/app/services/subcategory.interface';
import { GetCurrentProduct } from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less'],
})
export class ProductComponent implements OnInit {
  @Select(RSSState.currentProduct) public currentProduct$!: Observable<string>;

  @Input() product: IProduct = {
    id: '',
    name: '',
    imageUrls: [],
    availableAmount: 0,
    rating: 0,
    price: 0,
    description: '',
  };

  @ViewChild('category') category: ElementRef = { nativeElement: '' };

  @ViewChild('subCategory') subCategory: ElementRef = { nativeElement: '' };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetCurrentProduct(this.product));
    this.currentProduct$.subscribe((result) => {
      this.product = JSON.parse(JSON.stringify(result));
      const categories = this.store.selectSnapshot(RSSState.categories);
      const currentCategory: ICategory = categories.find(
        (category) => category.id === this.product.category
      ) ?? {
        id: '',
        name: '',
        subCategories: [],
      };
      const currentSubCategory: ISubcategory = currentCategory.subCategories.find(
        (subCategory) => subCategory.id === this.product.subCategory
      ) ?? {
        id: '',
        name: '',
      };
      if (this.category.nativeElement && this.subCategory.nativeElement) {
        this.category.nativeElement.textContent = currentCategory.name;
        this.subCategory.nativeElement.textContent = currentSubCategory.name;
      }
    });
  }
}
