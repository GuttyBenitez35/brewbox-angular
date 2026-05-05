// src/app/models/carrito.model.ts
import { Producto } from './producto.model';

export interface CarritoItem {
  id: string;
  usuario_id: string;
  producto_id: string;
  cantidad: number;
  producto?: Producto; // join con tabla productos
}

export interface CarritoItemLocal {
  producto: Producto;
  cantidad: number;
}