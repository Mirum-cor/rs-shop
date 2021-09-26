import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/services/category.interface';
import { DataService } from 'src/app/services/data.service';
import { IProduct } from 'src/app/services/product.interface';
import {
  GetCategories,
  GetCurrentCategory,
  GetCurrentCategoryGoods,
  SetFavoriteGoods,
  SetGoodsInCart,
} from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('restOfContacts') restOfContacts: ElementRef = {
    nativeElement: '',
  };

  @ViewChild('currentCity') currentCity: ElementRef = { nativeElement: '' };

  @ViewChild('biggestCities') biggestCities: ElementRef = { nativeElement: '' };

  @ViewChild('loginForm') loginForm: ElementRef = { nativeElement: '' };

  @ViewChild('name') name: ElementRef = { nativeElement: '' };

  @ViewChild('password') password: ElementRef = { nativeElement: '' };

  @Select(RSSState.categories) public categories$!: Observable<ICategory[]>;
  @Select(RSSState.favoriteGoods) public favoriteGoods$!: Observable<
    IProduct[]
  >;
  @Select(RSSState.goodsInCart) public goodsInCart$!: Observable<IProduct[]>;

  currentUser: string;

  constructor(private store: Store, private dataService: DataService) {
    this.currentUser = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!).token
      : '';
  }

  ngOnInit(): void {
    this.store.dispatch(new GetCategories([]));
    this.getCurrentLocation();
    const favoriteGoods = localStorage.getItem('favoriteGoods')
      ? JSON.parse(localStorage.getItem('favoriteGoods')!)
      : [];
    const goodsInCart = localStorage.getItem('goodsInCart')
      ? JSON.parse(localStorage.getItem('goodsInCart')!)
      : [];
    this.store.dispatch(new SetFavoriteGoods(favoriteGoods));
    this.store.dispatch(new SetGoodsInCart(goodsInCart));
  }

  getCurrentLocation(): void {
    let currentPos: string[] = [];
    const geoSuccess = (position: any) => {
      const startPos = position;
      currentPos = [
        startPos.coords.latitude.toFixed(3),
        startPos.coords.longitude.toFixed(3),
      ];
      this.getCurrentCity(currentPos);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
  }

  getCurrentCity([lat, lng]: string[]): void {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=81aaf0c0775f440885be1a9e23fdc1ea`
    )
      .then((responce) => {
        if (!responce.ok)
          throw new Error(`Problem with geocoding ${responce.status}!`);
        return responce.json();
      })
      .then((data) => {
        this.currentCity.nativeElement.textContent =
          data.results[0].components.city;
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }

  closeDropdowns(): void {
    if (!this.restOfContacts.nativeElement.classList.contains('invisible')) {
      this.restOfContacts.nativeElement.classList.add('invisible');
      this.restOfContacts.nativeElement.classList.remove('visible');
    } else if (
      !this.biggestCities.nativeElement.classList.contains('invisible')
    ) {
      this.biggestCities.nativeElement.classList.add('invisible');
      this.biggestCities.nativeElement.classList.remove('visible');
    }
  }

  chooseCity(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'P') {
      this.currentCity.nativeElement.textContent = target.textContent;
    }
  }

  toggleBiggestCities(event: Event): void {
    this.biggestCities.nativeElement.classList.toggle('invisible');
    this.biggestCities.nativeElement.classList.toggle('visible');
    this.restOfContacts.nativeElement.classList.add('invisible');
    this.restOfContacts.nativeElement.classList.remove('visible');
    event.stopPropagation();
  }

  toggleRestOfContacts(event: Event): void {
    this.restOfContacts.nativeElement.classList.toggle('invisible');
    this.restOfContacts.nativeElement.classList.toggle('visible');
    this.biggestCities.nativeElement.classList.add('invisible');
    this.biggestCities.nativeElement.classList.remove('visible');
    event.stopPropagation();
  }

  login(): void {
    this.loginForm.nativeElement.classList.remove('invisible-login-form');
    this.loginForm.nativeElement.classList.add('visible-login-form');
    document.body.classList.add('not-scrollable');
  }

  closeLoginForm(event: Event): void {
    if ((event.target as HTMLElement).nodeName === 'DIV') {
      this.loginForm.nativeElement.classList.add('invisible-login-form');
      this.loginForm.nativeElement.classList.remove('visible-login-form');
      document.body.classList.remove('not-scrollable');
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = '';
  }

  validateName(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length >= 3 && target.value.length <= 50) {
      target.classList.remove('wrong-input');
      target.classList.add('right-input');
    } else {
      target.classList.remove('right-input');
      target.classList.add('wrong-input');
    }
  }

  validatePassword(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length >= 3 && target.value.length <= 10) {
      target.classList.remove('wrong-input');
      target.classList.add('right-input');
    } else {
      target.classList.remove('right-input');
      target.classList.add('wrong-input');
    }
  }

  confirmLogin(event: Event): void {
    event.preventDefault();
    if (
      this.name.nativeElement.classList.contains('right-input') &&
      this.password.nativeElement.classList.contains('right-input')
    ) {
      this.name.nativeElement.classList.remove('right-input');
      this.password.nativeElement.classList.remove('right-input');
      this.name.nativeElement.classList.remove('wrong-input');
      this.password.nativeElement.classList.remove('wrong-input');
      this.loginForm.nativeElement.classList.remove('visible-login-form');
      this.loginForm.nativeElement.classList.add('invisible-login-form');
      this.dataService
        .getToken(
          this.name.nativeElement.value,
          this.password.nativeElement.value
        )
        .subscribe((data) => {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUser = JSON.parse(JSON.stringify(data)).token;
        });
      document.forms[0].reset();
      document.body.classList.remove('not-scrollable');
    } else {
      this.name.nativeElement.classList.remove('right-input');
      this.password.nativeElement.classList.remove('right-input');
      this.name.nativeElement.classList.add('wrong-input');
      this.password.nativeElement.classList.add('wrong-input');
    }
  }

  getCategoryID(event: Event): void {
    const target = event.target as HTMLElement;
    this.store.dispatch(new GetCurrentCategory(target.id));
    this.store.dispatch(new GetCurrentCategoryGoods([]));
  }
}
