import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
export class ProductComponent implements OnInit, AfterViewChecked {
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

  @ViewChild('rating') rating: ElementRef = { nativeElement: '' };

  @ViewChild('inStock') inStock: ElementRef = { nativeElement: '' };

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

  ngAfterViewChecked(): void {
    this.setCorrespondingRating();
    this.setCorrespondingInStockStyle();
  }

  setCorrespondingRating(): void {
    if (this.rating.nativeElement.children.length !== this.product.rating) {
      this.rating.nativeElement.innerHTML = '';
      for (let i = 1; i <= this.product.rating; i++) {
        const img = document.createElement('img');
        img.src = '../../../assets/rate-star.svg';
        img.alt = 'rate-star';
        this.rating.nativeElement.append(img);
      }
    }
  }

  setCorrespondingInStockStyle(): void {
    if (this.product.availableAmount >= 20) {
      this.inStock.nativeElement.style.color = '#008f30';
      this.inStock.nativeElement.style.background =
        'url(../../../assets/much-products.svg) no-repeat left -1px';
    } else if (this.product.availableAmount < 5) {
      this.inStock.nativeElement.style.color = '#b10000';
      this.inStock.nativeElement.style.background =
        'url(../../../assets/few-products.svg) no-repeat left -1px';
    } else if (
      this.product.availableAmount >= 5 &&
      this.product.availableAmount < 20
    ) {
      this.inStock.nativeElement.style.color = '#d3c500';
      this.inStock.nativeElement.style.background =
        'url(../../../assets/enough-products.svg) no-repeat left -1px';
    } else {
      this.inStock.nativeElement.style.color = '#b10000';
      this.inStock.nativeElement.textContent = 'Нет в наличии';
    }
    this.inStock.nativeElement.style.paddingLeft = '25px';
    this.inStock.nativeElement.style.backgroundSize = '20px';
    this.inStock.nativeElement.style.textShadow = '0 0 1px #000000';
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
