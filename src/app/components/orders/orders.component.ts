import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/services/order.interface';
import { IProduct } from 'src/app/services/product.interface';
import { RSSState } from 'src/app/store/rss.state';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.less'],
})
export class OrdersComponent {
  @Select(RSSState.orders) public orders$!: Observable<IOrder[]>;

  currentProduct!: IProduct;

  toggleDetails(event: Event): void {
    const target = event.target as HTMLElement;
    const orderDetails = target.nextElementSibling as HTMLElement;
    if (orderDetails.style.display === 'block') {
      orderDetails.style.display = 'none';
    } else {
      orderDetails.style.display = 'block';
    }
  }
}
