import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { CarritoItemLocal } from '../../Models/carrito.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {

  items: CarritoItemLocal[] = [];
  actualizando: string | null = null;

  constructor(
    public carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.items$.subscribe(items => {
      this.items = items;
    });
  }

  async cambiarCantidad(productoId: string, delta: number) {
    this.actualizando = productoId;
    const item = this.items.find(i => i.producto.id === productoId);
    if (!item) { this.actualizando = null; return; }
    try {
      await this.carritoService.actualizarCantidad(productoId, item.cantidad + delta);
    } finally {
      this.actualizando = null;
    }
  }

  async eliminar(productoId: string) {
    this.actualizando = productoId;
    try {
      await this.carritoService.eliminarProducto(productoId);
    } finally {
      this.actualizando = null;
    }
  }

  irCheckout() {
    if (!this.authService.estaAutenticado) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/checkout']);
  }

  get subtotal(): number { return this.carritoService.total; }
  get envio(): number { return this.subtotal > 50 ? 0 : 5; }
  get totalFinal(): number { return this.subtotal + this.envio; }
}