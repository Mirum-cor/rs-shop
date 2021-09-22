import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IAllGoods } from 'src/app/services/all-goods.interface';
import { IProduct } from 'src/app/services/product.interface';
import { GetGoods, GetMainGoods } from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less'],
})
export class MainPageComponent implements OnInit {
  @Select(RSSState.goods) public goods$!: Observable<IAllGoods[]>;
  @Select(RSSState.mainGoods) public mainGoods$!: Observable<IProduct[]>;

  counter: number = 1;
  intervalId!: any; // NodeJS.Timeout;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetGoods({}));
    this.store.dispatch(new GetMainGoods([]));
    this.turnOnMainSliderTimer();
  }

  showMainSliderProduct(event: Event): void {
    clearInterval(this.intervalId);
    const target = event.target as HTMLElement;
    const targetNumber = +target.id.slice(0, target.id.indexOf('-'));
    this.counter = targetNumber;
    this.setMainSliderCurrentProduct(targetNumber);
    this.turnOnMainSliderTimer();
  }

  setMainSliderCurrentProduct(targetNumber: number): void {
    const mainSliderGoods = Array.from(
      (document.querySelector('.main-slider .slider-wrapper') as HTMLElement).children
    );
    const mainSliderBtns = Array.from(
      (document.querySelector('.main-slider .slider-btns') as HTMLElement).children
    );
    mainSliderGoods.forEach((product) => {
      const currentProduct = product as HTMLElement;
      currentProduct.classList.add('invisible');
      currentProduct.classList.remove('visible');
    });
    mainSliderBtns.forEach((btn) => {
      (btn as HTMLElement).classList.remove('active');
    });
    mainSliderGoods[targetNumber].classList.remove('invisible');
    mainSliderGoods[targetNumber].classList.add('visible');
    mainSliderBtns[targetNumber].classList.add('active');
  }

  turnOnMainSliderTimer(): void {
    this.intervalId = setInterval(() => {
      this.setMainSliderCurrentProduct(this.counter);
      this.counter =
        this.counter ===
        this.store.selectSnapshot(RSSState.mainGoods).length - 1
          ? 0
          : this.counter + 1;
    }, 2000);
  }
}
