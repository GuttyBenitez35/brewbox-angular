import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor(private supabaseService: SupabaseService) {}

  async subirImagen(file: File): Promise<string> {
    const extension = file.name.split('.').pop();
    const nombreArchivo = `${Date.now()}.${extension}`;

    const { error } = await this.supabaseService.client.storage
      .from('productos')
      .upload(nombreArchivo, file, { upsert: true });

    if (error) throw error;

    const { data } = this.supabaseService.client.storage
      .from('productos')
      .getPublicUrl(nombreArchivo);

    return data.publicUrl;
  }

  async eliminarImagen(url: string): Promise<void> {
    const nombreArchivo = url.split('/').pop();
    if (!nombreArchivo) return;

    await this.supabaseService.client.storage
      .from('productos')
      .remove([nombreArchivo]);
  }
}