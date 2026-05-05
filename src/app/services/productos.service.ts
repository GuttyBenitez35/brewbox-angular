// src/app/services/productos.service.ts
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { CategoriaProducto, Producto } from '../Models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private supabaseService: SupabaseService) {}

  // READ - Obtener todos los productos
  async getProductos(): Promise<Producto[]> {
    const { data, error } = await this.supabaseService.client
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // READ - Obtener productos destacados (CON DEBUG)
  async getProductosDestacados(): Promise<Producto[]> {
    console.log('🔍 Consultando productos destacados...');

    const { data, error } = await this.supabaseService.client
      .from('productos')
      .select('*')
      .eq('destacado', true)
      .limit(4);

    console.log('📦 Data productos destacados:', data);
    console.log('❌ Error productos destacados:', error);

    if (error) throw error;
    return data || [];
  }

  // READ - Filtrar por categoría
  async getProductosPorCategoria(
    categoria: CategoriaProducto
  ): Promise<Producto[]> {
    const { data, error } = await this.supabaseService.client
      .from('productos')
      .select('*')
      .eq('categoria', categoria);

    if (error) throw error;
    return data || [];
  }

  // READ - Buscar productos
  async buscarProductos(termino: string): Promise<Producto[]> {
    const { data, error } = await this.supabaseService.client
      .from('productos')
      .select('*')
      .ilike('nombre', `%${termino}%`);

    if (error) throw error;
    return data || [];
  }

  // READ - Obtener producto por ID
  async getProductoById(id: string): Promise<Producto | null> {
    const { data, error } = await this.supabaseService.client
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}