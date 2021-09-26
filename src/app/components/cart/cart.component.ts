import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/services/product.interface';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent {
  @Select(RSSState.goodsInCart) public goodsInCart$!: Observable<IProduct[]>;
}
