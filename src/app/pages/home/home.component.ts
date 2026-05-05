import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../Models/producto.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  // 1. Inicializamos como arreglos vacíos para evitar errores en el HTML (.length)
  productosDestacados: Producto[] = [];
  productosMasVendidos: Producto[] = [];

  cargando = true;
  notificacion: string | null = null;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    public authService: AuthService, // Lo ponemos public para que el HTML acceda si es necesario
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargando = true; // Aseguramos que empiece en true
    try {
      // 2. Cargamos los productos reales desde el servicio
      const destacados = await this.productosService.getProductosDestacados();
      this.productosDestacados = destacados || [];

      // 🔥 SIMULADO: Tomamos los primeros 4 para "Más Vendidos"
      // Si el array está vacío, slice no fallará, devolverá []
      this.productosMasVendidos = this.productosDestacados.slice(0, 4);

    } catch (error) {
      console.error('Error cargando productos en Home:', error);
      this.productosDestacados = [];
      this.productosMasVendidos = [];
    } finally {
      // 3. Quitamos el estado de carga siempre
      this.cargando = false;
    }
  }

  async agregarAlCarrito(producto: Producto) {
    if (!this.authService.estaAutenticado) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.carritoService.agregarProducto(producto);
      this.mostrarNotificacion(`☕ ${producto.nombre} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  }

  private mostrarNotificacion(msg: string) {
    this.notificacion = msg;
    // Desvanece la notificación después de 2.5 segundos
    setTimeout(() => this.notificacion = null, 2500);
  }
}