import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { ProductComponent } from './component/product/product.component';
import { UsersComponent } from './component/users/users.component';
import { VehiculosComponent } from './component/vehiculos/vehiculos.component';
import { VentaComponent } from './component/venta/venta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'users', component: UsersComponent },
  { path: 'vehiculos', component: VehiculosComponent },

  // pantalla Registro de Venta
  { path: 'venta', component: VentaComponent },

  { path: '**', redirectTo: 'login' }
];
