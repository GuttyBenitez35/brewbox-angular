import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- IMPORTANTE
import { PedidosService } from '../../services/pedidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true, // <--- Esto activa el modo moderno
  imports: [CommonModule], // <--- Esto permite usar *ngFor y *ngIf
  templateUrl: './mis-pedidos.component.html'
})
export class MisPedidosComponent implements OnInit {

  pedidos: any[] = [];
  cargando = true;

  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    console.log('🔥 USER ACTUAL:', this.authService.usuarioActual);
    
    try {
      const data = await this.pedidosService.getMisPedidos();
      console.log('📦 PEDIDOS TRAÍDOS:', data);
      this.pedidos = data;
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      this.cargando = false;
    }
  }
}