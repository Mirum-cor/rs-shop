import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { IProduct } from 'src/app/services/product.interface';
import {
  SetCurrentProductID,
  SetFavoriteGoods,
  SetGoodsInCart,
  UpdateFavoriteGoods,
  UpdateGoodsInCart,
} from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.less'],
})
export class ProductCardComponent implements OnInit, AfterViewInit {
  @Input() product: IProduct = {
    id: '',
    name: '',
    imageUrls: [],
    availableAmount: 0,
    rating: 0,
    price: 0,
    description: '',
  };

  @ViewChild('rating') rating: ElementRef = { nativeElement: '' };

  @ViewChild('inStock') inStock: ElementRef = { nativeElement: '' };

  constructor(private store: Store) {}

  ngOnInit(): void {
    const favoriteGoods: IProduct[] = this.store.selectSnapshot(RSSState.favoriteGoods);
    const goodsInCart: IProduct[] = this.store.selectSnapshot(RSSState.goodsInCart);
    if (favoriteGoods.find((product) => product.id === this.product.id)) {
      this.product = { ...this.product, isFavorite: true };
    }
    if (goodsInCart.find((product) => product.id === this.product.id)) {
      this.product = { ...this.product, isInCart: true };
    }
  }

  ngAfterViewInit(): void {
    this.setCorrespondingRating();
    this.setCorrespondingInStockStyle();
  }

  setCorrespondingRating(): void {
    for (let i = 1; i <= this.product.rating; i++) {
      const img = document.createElement('img');
      img.src = '../../../assets/rate-star.svg';
      img.alt = 'rate-star';
      this.rating.nativeElement.append(img);
    }
  }

  setCorrespondingInStockStyle(): void {
    if (this.product.availableAmount >= 20) {
      this.inStock.nativeElement.style.color = '#008f30';
      this.inStock.nativeElement.style.background = 'url(../../../assets/much-products.svg) no-repeat left -1px';
    } else if (this.product.availableAmount < 5) {
      this.inStock.nativeElement.style.color = '#b10000';
      this.inStock.nativeElement.style.background = 'url(../../../assets/few-products.svg) no-repeat left -1px';
    } else if (
      this.product.availableAmount >= 5
      && this.product.availableAmount < 20
    ) {
      this.inStock.nativeElement.style.color = '#d3c500';
      this.inStock.nativeElement.style.background = 'url(../../../assets/enough-products.svg) no-repeat left -1px';
    } else {
      this.inStock.nativeElement.style.color = '#b10000';
      this.inStock.nativeElement.textContent = 'Нет в наличии';
    }
    this.inStock.nativeElement.style.paddingLeft = '25px';
    this.inStock.nativeElement.style.backgroundSize = '20px';
    this.inStock.nativeElement.style.textShadow = '0 0 1px #000000';
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

  setCurrentProductID(): void {
    this.store.dispatch(new SetCurrentProductID(this.product.id));
  }
}
