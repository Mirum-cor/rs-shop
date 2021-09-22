import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IAllGoods } from 'src/app/services/all-goods.interface';
import { IProduct } from 'src/app/services/product.interface';
import {
  GetGoods,
  GetMainGoods,
  GetPopularGoods,
} from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less'],
})
export class MainPageComponent implements OnInit {
  @Select(RSSState.goods) public goods$!: Observable<IAllGoods[]>;
  @Select(RSSState.mainGoods) public mainGoods$!: Observable<IProduct[]>;
  @Select(RSSState.popularGoods) public popularGoods$!: Observable<IProduct[]>;

  @ViewChild('mainSliderWrapper')
  mainSliderWrapper: ElementRef = { nativeElement: '' };
  @ViewChild('mainSliderBtnsDiv')
  mainSliderBtnsDiv: ElementRef = { nativeElement: '' };
  @ViewChild('innerPopularSliderWrapper')
  innerPopularSliderWrapper: ElementRef = { nativeElement: '' };
  @ViewChild('popularSliderBtnsDiv')
  popularSliderBtnsDiv: ElementRef = { nativeElement: '' };

  mainSliderCounter: number = 1;
  popularSliderCounter: number = 1;
  intervalIdMainSlider!: any; // NodeJS.Timeout;
  intervalIdPopularSlider!: any; // NodeJS.Timeout;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetGoods({}));
    this.store.dispatch(new GetMainGoods([]));
    this.turnOnMainSliderTimer();
    this.store.dispatch(new GetPopularGoods([]));
    this.turnOnPopularSliderTimer();
  }

  showMainSliderProduct(event: Event): void {
    clearInterval(this.intervalIdMainSlider);
    const target = event.target as HTMLElement;
    const targetNumber = +target.id.slice(0, target.id.indexOf('-'));
    this.mainSliderCounter = targetNumber;
    this.setMainSliderCurrentProduct(targetNumber);
    this.turnOnMainSliderTimer();
  }

  showPopularGoodsSliderProduct(event: Event): void {
    clearInterval(this.intervalIdPopularSlider);
    const target = event.target as HTMLElement;
    const targetNumber = +target.id.slice(0, target.id.indexOf('-'));
    this.popularSliderCounter = targetNumber;
    this.setPopularSliderCurrentProduct(targetNumber);
    this.turnOnPopularSliderTimer();
  }

  setMainSliderCurrentProduct(targetNumber: number): void {
    const mainSliderGoods: HTMLElement[] = Array.from(this.mainSliderWrapper.nativeElement.children);
    const mainSliderBtns: HTMLElement[] = Array.from(this.mainSliderBtnsDiv.nativeElement.children);
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

  setPopularSliderCurrentProduct(targetNumber: number): void {
    const popularSliderBtns: HTMLElement[] = Array.from(this.popularSliderBtnsDiv.nativeElement.children);
    popularSliderBtns.forEach((btn) => {
      (btn as HTMLElement).classList.remove('active');
    });
    this.innerPopularSliderWrapper.nativeElement.style.left = -100 * targetNumber + '%';
    popularSliderBtns[targetNumber].classList.add('active');
  }

  turnOnMainSliderTimer(): void {
    this.intervalIdMainSlider = setInterval(() => {
      this.setMainSliderCurrentProduct(this.mainSliderCounter);
      this.mainSliderCounter =
        this.mainSliderCounter ===
        this.store.selectSnapshot(RSSState.mainGoods).length - 1
          ? 0
          : this.mainSliderCounter + 1;
    }, 5000);
  }

  turnOnPopularSliderTimer(): void {
    this.intervalIdPopularSlider = setInterval(() => {
      this.setPopularSliderCurrentProduct(this.popularSliderCounter);
      this.popularSliderCounter =
        this.popularSliderCounter ===
        this.store.selectSnapshot(RSSState.mainGoods).length - 1
          ? 0
          : this.popularSliderCounter + 1;
    }, 5000);
  }
}
