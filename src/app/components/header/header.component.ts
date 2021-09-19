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

  @Select(RSSState.categories) public categories$!: Observable<ICategory[]>;

  categories: ICategory[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetCategories([]));
    this.categories = this.store.selectSnapshot(RSSState.categories);
  }

  toggleRestOfContacts(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.textContent === 'Ещё') {
      this.restOfContacts.nativeElement.classList.toggle('invisible');
    } else if (!this.restOfContacts.nativeElement.classList.contains('invisible')) {
      this.restOfContacts.nativeElement.classList.add('invisible');
    }
    event.stopPropagation();
  }
}
