import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  cantidadCarrito = 0;
  estaAutenticado = false;
  menuMovilAbierto = false;

  constructor(
    public authService: AuthService,
    public carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.estaAutenticado = !!usuario;
      console.log('👤 Autenticado:', !!usuario, '| Admin:', this.authService.esAdmin);
    });

    this.carritoService.items$.subscribe(items => {
      this.cantidadCarrito = items.reduce((sum, item) => sum + item.cantidad, 0);
    });
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
  }

  toggleMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }
}