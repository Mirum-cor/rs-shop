import {
  Component,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/services/order.interface';
import { IProduct } from 'src/app/services/product.interface';
import {
  ResetGoodsInCart,
  SetOrder,
  UpdateGoodsInCart,
} from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements AfterViewInit, AfterViewChecked {
  @Select(RSSState.goodsInCart) public goodsInCart$!: Observable<IProduct[]>;

  @ViewChild('total') total: ElementRef = { nativeElement: '' };

  @ViewChild('userName') userName: ElementRef = { nativeElement: '' };

  @ViewChild('address') address: ElementRef = { nativeElement: '' };

  @ViewChild('tel') tel: ElementRef = { nativeElement: '' };

  @ViewChild('date') date: ElementRef = { nativeElement: '' };

  @ViewChild('time') time: ElementRef = { nativeElement: '' };

  @ViewChild('comment') comment: ElementRef = { nativeElement: '' };

  @ViewChild('orderSent') orderSent: ElementRef = { nativeElement: '' };

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    this.setEachProductCurrentAmount();
  }

  ngAfterViewChecked(): void {
    if (this.store.selectSnapshot(RSSState.goodsInCart).length) {
      this.calculateTotalAmount();
    }
  }

  setEachProductCurrentAmount(): void {
    const currentAmounts: HTMLElement[] = Array.from(
      document.querySelectorAll('.current-amount'),
    );
    currentAmounts.forEach((currentAmount) => {
      this.setCurrentAmount(currentAmount);
    });
  }

  setCurrentAmount(currentAmount: HTMLElement): void {
    const priceTD = currentAmount.parentElement
      ?.previousElementSibling as HTMLElement;
    const priceTextContent = priceTD.textContent?.replace(',', '')!;
    const price = parseFloat(priceTextContent);
    const productTotal = currentAmount.parentElement
      ?.nextElementSibling as HTMLElement;
    let newProductTotal = (
      Math.round(price * parseInt(currentAmount.textContent!, 10) * 100) / 100
    ).toString();
    newProductTotal = this.setRightTotalPriceDecimalPart(newProductTotal);
    productTotal.textContent = `${newProductTotal} руб.`;
  }

  addMoreProduct(event: Event): void {
    const target = event.target as HTMLElement;
    const amount = target.previousElementSibling as HTMLElement;
    amount.textContent = `${parseInt(amount.textContent!, 10) + 1}`;
    this.setCurrentAmount(amount);
  }

  addLessProduct(event: Event): void {
    const target = event.target as HTMLElement;
    const amount = target.nextElementSibling as HTMLElement;
    if (parseInt(amount.textContent!, 10) !== 1) {
      amount.textContent = `${parseInt(amount.textContent!, 10) - 1}`;
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
      const decimalPart = total.slice(total.indexOf('.') + 1);
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
      .find((productInCart) => productId === productInCart.id)!;
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
        today.getFullYear() <= deliveryDay.getFullYear()
        && today.getMonth() <= deliveryDay.getMonth()
        && ((today.getDate() <= deliveryDay.getDate()
          && today.getMonth() === deliveryDay.getMonth())
          || today.getMonth() < deliveryDay.getMonth())
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
      this.userName.nativeElement.classList.contains('right-input')
      && this.address.nativeElement.classList.contains('right-input')
      && this.tel.nativeElement.classList.contains('right-input')
      && this.date.nativeElement.classList.contains('right-input')
      && this.time.nativeElement.classList.contains('right-input')
    ) {
      event.preventDefault();
      this.store.dispatch(new SetOrder([this.setOrderToSend()]));
      this.orderSent.nativeElement.classList.remove('invisible');
      this.orderSent.nativeElement.classList.add('visible');
      setTimeout(() => {
        this.resetForm();
        this.store.dispatch(new ResetGoodsInCart([]));
      }, 1500);
    } else {
      this.userName.nativeElement.classList.add('wrong-input');
      this.address.nativeElement.classList.add('wrong-input');
      this.tel.nativeElement.classList.add('wrong-input');
      this.date.nativeElement.classList.add('wrong-input');
      this.time.nativeElement.classList.add('wrong-input');
    }
  }

  resetForm(): void {
    document.forms[0].reset();
    this.userName.nativeElement.classList = [];
    this.address.nativeElement.classList = [];
    this.tel.nativeElement.classList = [];
    this.date.nativeElement.classList = [];
    this.time.nativeElement.classList = [];
  }

  setOrderToSend(): IOrder {
    const ids = Array.from(document.querySelectorAll('tr'))
      .slice(0, -1)
      .map((tr) => tr.id);
    const amounts = Array.from(
      document.querySelectorAll('.current-amount'),
    ).map((amount) => +amount.textContent!);
    const names = Array.from(document.querySelectorAll('.name'))
      .slice(1)
      .map((name) => name.textContent!);
    const prices = Array.from(document.querySelectorAll('.price'))
      .slice(1)
      .map((price) => parseFloat(price.textContent!.replace(',', '')!));
    const items = ids.map((id, i) => ({
      id,
      amount: amounts[i],
      price: prices[i],
      name: names[i],
    }));
    const order: IOrder = {
      items,
      details: {
        name: this.userName.nativeElement.value,
        address: this.address.nativeElement.value,
        phone: `+${this.tel.nativeElement.value}`,
        timeToDeliver: `${this.date.nativeElement.value}, ${this.time.nativeElement.value}`,
        comment: this.comment.nativeElement.value,
        totalPrice: +parseFloat(this.total.nativeElement.textContent),
      },
    };
    return order;
  }
}
