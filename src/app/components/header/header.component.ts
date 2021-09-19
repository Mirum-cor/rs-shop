import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/services/category.interface';
import { GetCategories } from 'src/app/store/rss.action';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @ViewChild("restOfContacts") restOfContacts: ElementRef = { nativeElement: '' };
  @ViewChild("currentCity") currentCity: ElementRef = { nativeElement: '' };
  @ViewChild("biggestCities") biggestCities: ElementRef = { nativeElement: '' };

  @Select(RSSState.categories) public categories$!: Observable<ICategory[]>;

  categories: ICategory[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetCategories([]));
    this.categories = this.store.selectSnapshot(RSSState.categories);
    this.getCurrentLocation();
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
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=81aaf0c0775f440885be1a9e23fdc1ea`)
      .then((responce) => {
        if (!responce.ok) throw new Error(`Problem with geocoding ${responce.status}!`);
        return responce.json();
      })
      .then((data) => {
        this.currentCity.nativeElement.textContent = data.results[0].components.city;
      })
      .catch((err) => console.log(err));
  }

  closeDropdowns(): void {
    if (!this.restOfContacts.nativeElement.classList.contains('invisible')) {
      this.restOfContacts.nativeElement.classList.add('invisible');
    } else if (!this.biggestCities.nativeElement.classList.contains('invisible')) {
      this.biggestCities.nativeElement.classList.add('invisible');
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
    event.stopPropagation();
  }

  toggleRestOfContacts(event: Event): void {
    this.restOfContacts.nativeElement.classList.toggle('invisible');
    event.stopPropagation();
  }
}
