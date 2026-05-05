// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { VentasComponent } from './pages/admin/ventas/ventas.component';
import { MisPedidosComponent } from './pages/mis-pedidos/mis-pedidos.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

const routes: Routes = [
  // RUTAS PÚBLICAS
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // RUTAS DE CLIENTE (Requieren Login)
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'mis-pedidos', 
    component: MisPedidosComponent, 
    canActivate: [AuthGuard] 
  },

  // RUTAS DE ADMINISTRACIÓN (Requieren Login + Ser Admin)
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, adminGuard]
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, adminGuard]
  },
  {
    path: 'admin/ventas',
    component: VentasComponent,
    canActivate: [AuthGuard, adminGuard]
  },

  // COMODÍN: Si la ruta no existe, vuelve al inicio
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }