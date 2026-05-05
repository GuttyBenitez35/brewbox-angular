import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private usuarioSubject = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabaseService.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', event);
      this.usuarioSubject.next(session?.user ?? null);
    });

    this.verificarSesionInicial();
  }

  private async verificarSesionInicial() {
    const session = await this.supabaseService.getSession();
    console.log('✅ Sesión inicial:', session?.user?.email ?? 'sin sesión');
    this.usuarioSubject.next(session?.user ?? null);
  }

  get usuarioActual(): User | null {
    return this.usuarioSubject.value;
  }

  get estaAutenticado(): boolean {
    return !!this.usuarioSubject.value;
  }

  get esAdmin(): boolean {
    return this.usuarioSubject.value?.user_metadata?.['rol'] === 'admin';
  }

  get nombreUsuario(): string {
    return this.usuarioSubject.value?.user_metadata?.['nombre_completo'] ??
           this.usuarioSubject.value?.email ?? '';
  }

  async registrar(email: string, password: string, nombre: string) {
  const resultado = await this.supabaseService.signUp(email, password, nombre);
  return resultado;
}

  async iniciarSesion(email: string, password: string) {
    const resultado = await this.supabaseService.signIn(email, password);

    console.log('🔑 Login:', resultado.user?.email);
    console.log('👑 Rol en metadata:', resultado.user?.user_metadata?.['rol']);

    this.usuarioSubject.next(resultado.user);

    return resultado;
  }

  async cerrarSesion() {
    await this.supabaseService.signOut();

    console.log('🚪 Sesión cerrada');

    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }
}