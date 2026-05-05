// src/app/services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { CarritoItemLocal } from '../Models/carrito.model';
import { Producto } from '../Models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsSubject = new BehaviorSubject<CarritoItemLocal[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.cargarCarritoDesdeDB();
      } else {
        this.itemsSubject.next([]);
      }
    });
  }

  // READ - Cargar carrito desde DB
  async cargarCarritoDesdeDB() {
    const usuario = this.authService.usuarioActual;
    if (!usuario) return;

    const { data, error } = await this.supabaseService.client
      .from('carrito_items')
      .select(`
        id,
        cantidad,
        productos (*)
      `)
      .eq('usuario_id', usuario.id);

    if (error) throw error;

    const items: CarritoItemLocal[] = (data || []).map((item: any) => ({
      producto: item.productos,
      cantidad: item.cantidad
    }));

    this.itemsSubject.next(items);
  }

  // CREATE - Agregar producto con control de stock
  async agregarProducto(producto: Producto, cantidad: number = 1): Promise<void> {
    const usuario = this.authService.usuarioActual;
    if (!usuario) {
      throw new Error('Debes iniciar sesión para agregar al carrito');
    }

    const itemsActuales = this.itemsSubject.value;
    const itemExistente = itemsActuales.find(i => i.producto.id === producto.id);
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;

    // VALIDAR STOCK
  // REEMPLAZA SOLO ESTA PARTE dentro de agregarProducto()

// VALIDAR STOCK
if (producto.stock <= 0) {
  throw new Error('No hay productos en stock disponibles 😔');
}

if (cantidadActual + cantidad > producto.stock) {
  throw new Error(
    `No hay suficiente stock disponible 😔\nDisponible actualmente: ${producto.stock} unidad(es)`
  );
}

    if (itemExistente) {
      await this.actualizarCantidad(
        producto.id,
        cantidadActual + cantidad
      );
    } else {
      const { error } = await this.supabaseService.client
        .from('carrito_items')
        .insert({
          usuario_id: usuario.id,
          producto_id: producto.id,
          cantidad
        });

      if (error) throw error;

      this.itemsSubject.next([
        ...itemsActuales,
        { producto, cantidad }
      ]);
    }
  }

  // UPDATE - Cambiar cantidad con control de stock
  async actualizarCantidad(productoId: string, nuevaCantidad: number): Promise<void> {
    const usuario = this.authService.usuarioActual;
    if (!usuario) return;

    if (nuevaCantidad <= 0) {
      await this.eliminarProducto(productoId);
      return;
    }

    const item = this.itemsSubject.value.find(
      i => i.producto.id === productoId
    );

    // VALIDAR STOCK
    if (item && nuevaCantidad > item.producto.stock) {
      throw new Error(
        `Solo hay ${item.producto.stock} unidades disponibles`
      );
    }

    const { error } = await this.supabaseService.client
      .from('carrito_items')
      .update({ cantidad: nuevaCantidad })
      .eq('usuario_id', usuario.id)
      .eq('producto_id', productoId);

    if (error) throw error;

    const itemsActualizados = this.itemsSubject.value.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );

    this.itemsSubject.next(itemsActualizados);
  }

  // DELETE - Eliminar producto
  async eliminarProducto(productoId: string): Promise<void> {
    const usuario = this.authService.usuarioActual;
    if (!usuario) return;

    const { error } = await this.supabaseService.client
      .from('carrito_items')
      .delete()
      .eq('usuario_id', usuario.id)
      .eq('producto_id', productoId);

    if (error) throw error;

    const itemsFiltrados = this.itemsSubject.value.filter(
      item => item.producto.id !== productoId
    );

    this.itemsSubject.next(itemsFiltrados);
  }

  // DELETE - Vaciar carrito
  async limpiarCarrito(): Promise<void> {
    const usuario = this.authService.usuarioActual;
    if (!usuario) return;

    const { error } = await this.supabaseService.client
      .from('carrito_items')
      .delete()
      .eq('usuario_id', usuario.id);

    if (error) throw error;

    this.itemsSubject.next([]);
  }

  // TOTAL
  get total(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + (item.producto.precio * item.cantidad),
      0
    );
  }

  // CANTIDAD TOTAL
  get cantidadItems(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + item.cantidad,
      0
    );
  }
}