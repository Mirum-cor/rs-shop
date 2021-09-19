import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'category/:id', component: ProductCategoryComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
