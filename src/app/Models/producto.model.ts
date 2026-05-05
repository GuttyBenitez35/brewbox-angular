// src/app/models/producto.model.ts
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categoria: CategoriaProducto;
  stock: number;
  destacado: boolean;
  created_at?: string;
}

export type CategoriaProducto = 
  | 'cafe_grano' 
  | 'cafe_molido' 
  | 'cafetera' 
  | 'prensa_francesa' 
  | 'molino';

export const CATEGORIA_LABELS: Record<CategoriaProducto, string> = {
  cafe_grano: 'Café en Grano',
  cafe_molido: 'Café Molido',
  cafetera: 'Cafeteras',
  prensa_francesa: 'Prensas Francesas',
  molino: 'Molinos'
};