// src/app/Models/pedido.model.ts

export interface Pedido {
  id: string;
  usuario_id: string;

  total: number;

  estado: 'pendiente' | 'procesando' | 'entregado' | 'cancelado';

  nombre_cliente: string;
  email_cliente: string;
  telefono: string;

  direccion_envio: string;
  ciudad_envio: string;

  metodo_pago: 'tarjeta' | 'qr';

  notas?: string;

  created_at?: string;
}

export interface PedidoItem {
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
}