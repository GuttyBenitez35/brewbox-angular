import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../../services/pedidos.service';
import { CommonModule, DatePipe } from '@angular/common'; // <--- Importante para el HTML

@Component({
  selector: 'app-dashboard',
  standalone: true,           
  imports: [CommonModule],    
  templateUrl: './dashboard.component.html',
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {

  pedidos: any[] = [];
  ingresos = 0;
  totalPedidos = 0;
  pendientes = 0;
  entregados = 0;
  cargando = true;

  constructor(private pedidosService: PedidosService) {}

  async ngOnInit() {
    try {
      // CORRECCIÓN: Ahora sí guardamos los datos que vienen del servicio
      this.pedidos = await this.pedidosService.getTodosLosPedidos();
      
      console.log('📊 Datos cargados en Dashboard:', this.pedidos);
      
      this.calcularEstadisticas();
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      this.cargando = false;
    }
  }

  calcularEstadisticas() {
    this.totalPedidos = this.pedidos.length;
    this.pendientes = this.pedidos.filter(p => p.estado === 'pendiente').length;
    this.entregados = this.pedidos.filter(p => p.estado === 'entregado').length;
    
    // Sumamos los totales asegurándonos de que sean números
    this.ingresos = this.pedidos.reduce((sum, p) => sum + Number(p.total || 0), 0);
  }

  // Esto es para los gráficos si decides usarlos
  get chartData() {
    return [
      { name: 'Pendiente', value: this.pendientes },
      { name: 'Entregado', value: this.entregados }
    ];
  }
}