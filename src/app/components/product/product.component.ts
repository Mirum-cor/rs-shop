import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICategory } from 'src/app/services/category.interface';
import { IProduct } from 'src/app/services/product.interface';
import { ISubcategory } from 'src/app/services/subcategory.interface';
import { GetCurrentProduct, SetFavoriteGoods, SetGoodsInCart, UpdateFavoriteGoods, UpdateGoodsInCart } from 'src/app/store/rss.action';
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

  @ViewChild('mainImage') mainImage: ElementRef = { nativeElement: '' };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetCurrentProduct(this.product));
    this.currentProduct$.subscribe((result) => {
      this.product = JSON.parse(JSON.stringify(result));
      const favoriteGoods: IProduct[] = this.store.selectSnapshot(RSSState.favoriteGoods);
      const goodsInCart: IProduct[] = this.store.selectSnapshot(RSSState.goodsInCart);
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
      if (favoriteGoods.find((product) => product.id === this.product.id)) {
        this.product = { ...this.product, isFavorite: true };
      }
      if (goodsInCart.find((product) => product.id === this.product.id)) {
        this.product = { ...this.product, isInCart: true };
      }
    });
  }

  showImageBigger(event: Event): void {
    const target = event.target as HTMLElement;
    const img = target.nodeName === 'IMG'
      ? target as HTMLImageElement
      : target.firstElementChild as HTMLImageElement;
      this.mainImage.nativeElement.src = img.src;
  }

  addToFavorite(): void {
    this.product = { ...this.product, isFavorite: true };
    this.store.dispatch(new SetFavoriteGoods([this.product]));
  }

  addToCart(): void {
    this.product = { ...this.product, isInCart: true };
    this.store.dispatch(new SetGoodsInCart([this.product]));
  }

  removeFromFavorite(): void {
    this.product = { ...this.product, isFavorite: false };
    this.store.dispatch(new UpdateFavoriteGoods([this.product]));
  }

  removeFromCart(): void {
    this.product = { ...this.product, isInCart: false };
    this.store.dispatch(new UpdateGoodsInCart([this.product]));
  }
}
