import {
  Component,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/services/product.interface';
import { UpdateGoodsInCart } from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements AfterViewInit, AfterViewChecked {
  @Select(RSSState.goodsInCart) public goodsInCart$!: Observable<IProduct[]>;

  @ViewChild('total') total: ElementRef = { nativeElement: '' };
  @ViewChild('name') name: ElementRef = { nativeElement: '' };
  @ViewChild('address') address: ElementRef = { nativeElement: '' };
  @ViewChild('tel') tel: ElementRef = { nativeElement: '' };
  @ViewChild('date') date: ElementRef = { nativeElement: '' };
  @ViewChild('time') time: ElementRef = { nativeElement: '' };
  @ViewChild('comment') comment: ElementRef = { nativeElement: '' };

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    this.setEachProductCurrentAmount();
  }

  ngAfterViewChecked(): void {
    this.calculateTotalAmount();
  }

  setEachProductCurrentAmount(): void {
    const currentAmounts: HTMLElement[] = Array.from(
      document.querySelectorAll('.current-amount')
    );
    currentAmounts.forEach((currentAmount) => {
      this.setCurrentAmount(currentAmount);
    });
  }

  setCurrentAmount(currentAmount: HTMLElement): void {
    const priceTextContent =
      currentAmount.parentElement?.previousElementSibling?.textContent?.replace(
        ',',
        ''
      )!;
    const price = parseFloat(priceTextContent);
    const productTotal = currentAmount.parentElement
      ?.nextElementSibling as HTMLElement;
    let newProductTotal = (
      Math.round(price * parseInt(currentAmount.textContent!) * 100) / 100
    ).toString();
    newProductTotal = this.setRightTotalPriceDecimalPart(newProductTotal);
    productTotal.textContent = `${newProductTotal} руб.`;
  }

  addMoreProduct(event: Event): void {
    const target = event.target as HTMLElement;
    const amount = target.previousElementSibling as HTMLElement;
    amount.textContent = `${parseInt(amount.textContent!) + 1}`;
    this.setCurrentAmount(amount);
  }

  addLessProduct(event: Event): void {
    const target = event.target as HTMLElement;
    const amount = target.nextElementSibling as HTMLElement;
    if (parseInt(amount.textContent!) !== 1) {
      amount.textContent = `${parseInt(amount.textContent!) - 1}`;
      this.setCurrentAmount(amount);
    }
  }

  calculateTotalAmount(): void {
    let total = Array.from(document.querySelectorAll('.product-total'))
      .slice(1)
      .map((productTotal) => parseFloat(productTotal.textContent!))
      .reduce((acc, productTotal) => productTotal + acc, 0)
      .toString();
    total = (Math.round(+total * 100) / 100).toString();
    total = this.setRightTotalPriceDecimalPart(total);
    this.total.nativeElement.textContent = `${total} руб.`;
  }

  setRightTotalPriceDecimalPart(total: string): string {
    let newTotal = total;
    if (total.includes('.')) {
      let decimalPart = total.slice(total.indexOf('.') + 1);
      if (decimalPart.length < 2) newTotal += '0';
    } else {
      newTotal += '.00';
    }
    return newTotal;
  }

  removeFromCart(event: Event): void {
    const target = event.target as HTMLElement;
    const productId = target.parentElement?.parentElement!.id ?? '';
    const product = this.store
      .selectSnapshot(RSSState.goodsInCart)
      .find((product) => productId === product.id)!;
    this.store.dispatch(new UpdateGoodsInCart([product]));
  }

  isNameValid(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length >= 3 && target.value.length <= 50) {
      target.classList.remove('wrong-input');
      target.classList.add('right-input');
    } else {
      target.classList.remove('right-input');
      target.classList.add('wrong-input');
    }
  }

  isAddressValid(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length >= 3 && target.value.length <= 250) {
      target.classList.remove('wrong-input');
      target.classList.add('right-input');
    } else {
      target.classList.remove('right-input');
      target.classList.add('wrong-input');
    }
  }

  isTelValid(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');
    if (value.length === 12) {
      target.classList.remove('wrong-input');
      target.classList.add('right-input');
    } else {
      target.classList.remove('right-input');
      target.classList.add('wrong-input');
    }
  }

  isDateValid(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.type === 'date') {
      const today = new Date();
      const deliveryDay = new Date(target.value);
      if (
        today.getFullYear() <= deliveryDay.getFullYear() &&
        today.getMonth() <= deliveryDay.getMonth() &&
        ((today.getDate() <= deliveryDay.getDate() &&
          today.getMonth() === deliveryDay.getMonth()) ||
          today.getMonth() < deliveryDay.getMonth())
      ) {
        target.classList.remove('wrong-input');
        target.classList.add('right-input');
      } else {
        target.classList.remove('right-input');
        target.classList.add('wrong-input');
      }
    }
  }

  isTimeValid(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length === 5) {
      target.classList.remove('wrong-input');
      target.classList.add('right-input');
    } else {
      target.classList.remove('right-input');
      target.classList.add('wrong-input');
    }
  }

  sendOrder(event: Event): void {
    if (
      this.name.nativeElement.classList.contains('right-input') &&
      this.address.nativeElement.classList.contains('right-input') &&
      this.tel.nativeElement.classList.contains('right-input') &&
      this.date.nativeElement.classList.contains('right-input') &&
      this.time.nativeElement.classList.contains('right-input')
    ) {
      event.preventDefault();
      document.forms[0].reset();
      this.name.nativeElement.classList = [];
      this.address.nativeElement.classList = [];
      this.tel.nativeElement.classList = [];
      this.date.nativeElement.classList = [];
      this.time.nativeElement.classList = [];
    } else {
      this.name.nativeElement.classList.add('wrong-input');
      this.address.nativeElement.classList.add('wrong-input');
      this.tel.nativeElement.classList.add('wrong-input');
      this.date.nativeElement.classList.add('wrong-input');
      this.time.nativeElement.classList.add('wrong-input');
    }
  }
}
