import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FavoritePageComponent } from './components/favorite-page/favorite-page.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'favorite', component: FavoritePageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'category/:id', component: ProductCategoryComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
