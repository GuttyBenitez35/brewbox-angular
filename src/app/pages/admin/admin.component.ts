import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { StorageService } from '../../services/storage.service';
import { Producto, CategoriaProducto } from '../../Models/producto.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  productos: Producto[] = [];
  formulario!: FormGroup;
  cargando = false;
  cargandoProductos = true;
  notificacion: string | null = null;
  modoEdicion = false;
  productoEditandoId: string | null = null;
  imagenPreview: string | null = null;
  archivoImagen: File | null = null;
  subiendoImagen = false;
  mostrarFormulario = false;

  categorias: CategoriaProducto[] = [
    'cafe_grano', 'cafe_molido', 'cafetera', 'prensa_francesa', 'molino'
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarProductos();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      categoria: ['cafe_grano', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      destacado: [false],
      imagen_url: ['']
    });
  }

  async cargarProductos() {
    this.cargandoProductos = true;
    const { data } = await this.supabaseService.client
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
    this.productos = data || [];
    this.cargandoProductos = false;
  }

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.archivoImagen = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagenPreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.archivoImagen);
  }

  async guardarProducto() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    try {
      let imagen_url = this.formulario.value.imagen_url;

      // Subir imagen si hay archivo seleccionado
      if (this.archivoImagen) {
        this.subiendoImagen = true;
        imagen_url = await this.storageService.subirImagen(this.archivoImagen);
        this.subiendoImagen = false;
      }

      const datos = { ...this.formulario.value, imagen_url };

      if (this.modoEdicion && this.productoEditandoId) {
        const { error } = await this.supabaseService.client
          .from('productos')
          .update(datos)
          .eq('id', this.productoEditandoId);
        if (error) throw error;
        this.notificar('✅ Producto actualizado');
      } else {
        const { error } = await this.supabaseService.client
          .from('productos')
          .insert(datos);
        if (error) throw error;
        this.notificar('✅ Producto creado');
      }

      this.resetFormulario();
      await this.cargarProductos();
    } catch (e: any) {
      this.notificar('❌ Error: ' + e.message);
    } finally {
      this.cargando = false;
    }
  }

  editarProducto(producto: Producto) {
    this.modoEdicion = true;
    this.productoEditandoId = producto.id;
    this.mostrarFormulario = true;
    this.imagenPreview = producto.imagen_url;
    this.formulario.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      stock: producto.stock,
      destacado: producto.destacado,
      imagen_url: producto.imagen_url
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async eliminarProducto(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    const { error } = await this.supabaseService.client
      .from('productos')
      .delete()
      .eq('id', id);
    if (error) { this.notificar('❌ Error al eliminar'); return; }
    this.notificar('🗑 Producto eliminado');
    await this.cargarProductos();
  }

  resetFormulario() {
    this.formulario.reset({ categoria: 'cafe_grano', destacado: false });
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.imagenPreview = null;
    this.archivoImagen = null;
    this.mostrarFormulario = false;
  }

  campoInvalido(campo: string): boolean {
    const c = this.formulario.get(campo);
    return !!(c?.invalid && c?.touched);
  }

  private notificar(msg: string) {
    this.notificacion = msg;
    setTimeout(() => this.notificacion = null, 3000);
  }
}