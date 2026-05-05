// src/app/services/pedidos.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';
import { PedidoItem, Pedido } from '../Models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  // CREATE - Crear pedido completo desde el carrito
  async crearPedido(datosPedido: Omit<Pedido, 'id' | 'usuario_id' | 'total'>): Promise<string> {
    const usuario = this.authService.usuarioActual;
    if (!usuario) throw new Error('Usuario no autenticado');

    const items = this.carritoService['itemsSubject'].value;
    if (items.length === 0) throw new Error('El carrito está vacío');

    const total = this.carritoService.total;

    // Insertar pedido principal
    const { data: pedido, error: errorPedido } = await this.supabaseService.client
      .from('pedidos')
      .insert({
        usuario_id: usuario.id,
        total: total,

        // DATOS CLIENTE
        nombre_cliente: datosPedido.nombre_cliente,
        email_cliente: datosPedido.email_cliente,

        // DIRECCIÓN
        direccion_envio: datosPedido.direccion_envio,
        ciudad_envio: datosPedido.ciudad_envio,

        // PAGO
        metodo_pago: datosPedido.metodo_pago,

        // EXTRA
        notas: datosPedido.notas || null,

        // ESTADO
        estado: 'pendiente'
      })
      .select()
      .single();

    if (errorPedido) {
      console.error('❌ Error creando pedido:', errorPedido);
      throw errorPedido;
    }

    // Crear detalle de productos
    const pedidoItems: PedidoItem[] = items.map(item => ({
      pedido_id: pedido.id,
      producto_id: item.producto.id,
      cantidad: item.cantidad,
      precio_unitario: item.producto.precio
    }));

    const { error: errorItems } = await this.supabaseService.client
      .from('pedido_items')
      .insert(pedidoItems);

    if (errorItems) {
      console.error('❌ Error creando pedido_items:', errorItems);
      throw errorItems;
    }

    // Limpiar carrito
    await this.carritoService.limpiarCarrito();

    console.log('✅ Pedido creado correctamente:', pedido.id);

    return pedido.id;
  }

  // READ - Pedidos del usuario actual
async getMisPedidos(): Promise<Pedido[]> {

  const { data: { user } } = await this.supabaseService.client.auth.getUser();

  if (!user) return [];

  const { data, error } = await this.supabaseService.client
    .from('pedidos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

  // ADMIN - Todos los pedidos
  async getTodosLosPedidos(): Promise<Pedido[]> {
    const { data, error } = await this.supabaseService.client
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }
// ADMIN - eliminar pedido
async eliminarPedido(id: string) {
  const { error } = await this.supabaseService.client
    .from('pedidos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ADMIN - cambiar estado
async actualizarEstadoPedido(id: string, estado: string) {
  const { error } = await this.supabaseService.client
    .from('pedidos')
    .update({ estado })
    .eq('id', id);

  if (error) throw error;
}

// ADMIN - ver detalle de pedido (con productos)
async getDetallePedido(id: string) {
  const { data, error } = await this.supabaseService.client
    .from('pedidos')
    .select(`
      *,
      pedido_items (
        cantidad,
        precio_unitario,
        productos (nombre, imagen_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}



}