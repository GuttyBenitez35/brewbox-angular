import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../Models/producto.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  cargando = true;
  notificacion: string | null = null;

  categoriaSeleccionada = 'todos';
  busqueda = '';
  ordenamiento = 'nombre';

  categorias = [
    { key: 'todos', label: 'Todos', emoji: '🛍️' },
    { key: 'cafe_grano', label: 'Café en Grano', emoji: '🫘' },
    { key: 'cafe_molido', label: 'Café Molido', emoji: '☕' },
    { key: 'cafetera', label: 'Cafeteras', emoji: '⚙️' },
    { key: 'prensa_francesa', label: 'Prensas', emoji: '🫗' },
    { key: 'molino', label: 'Molinos', emoji: '⚙️' },
  ];

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.categoriaSeleccionada = params['categoria'];
      }
    });
    try {
      this.productos = await this.productosService.getProductos();
      this.aplicarFiltros();
    } finally {
      this.cargando = false;
    }
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();
  }

  onBusqueda(event: Event) {
    this.busqueda = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  onOrdenamiento(event: Event) {
    this.ordenamiento = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.productos];

    if (this.categoriaSeleccionada !== 'todos') {
      resultado = resultado.filter(p => p.categoria === this.categoriaSeleccionada);
    }

    if (this.busqueda) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(this.busqueda) ||
        p.descripcion.toLowerCase().includes(this.busqueda)
      );
    }

    switch (this.ordenamiento) {
      case 'precio_asc': resultado.sort((a, b) => a.precio - b.precio); break;
      case 'precio_desc': resultado.sort((a, b) => b.precio - a.precio); break;
      default: resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    this.productosFiltrados = resultado;
  }

 async agregarAlCarrito(producto: Producto) {
  try {
    await this.carritoService.agregarProducto(producto, 1);

    alert('✅ Producto agregado al carrito');

  } catch (error: any) {
    console.error('❌ Error al agregar producto:', error);

    if (error.message.includes('stock')) {
      alert(error.message);
    } else if (error.message.includes('iniciar sesión')) {
      alert('⚠️ Debes iniciar sesión para agregar productos');
    } else {
      alert('❌ Error al agregar producto al carrito');
    }
  }
}

  private mostrarNotificacion(mensaje: string) {
    this.notificacion = mensaje;
    setTimeout(() => { this.notificacion = null; }, 3000);
  }
}