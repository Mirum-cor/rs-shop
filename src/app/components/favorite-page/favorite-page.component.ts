import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/services/product.interface';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-favorite-page',
  templateUrl: './favorite-page.component.html',
  styleUrls: ['./favorite-page.component.less'],
})
export class FavoritePageComponent {
  @Select(RSSState.favoriteGoods) public favoriteGoods$!: Observable<IProduct[]>;
}
