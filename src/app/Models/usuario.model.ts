export interface Perfil {
  id: string;
  nombre_completo: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rol: 'cliente' | 'admin';
}