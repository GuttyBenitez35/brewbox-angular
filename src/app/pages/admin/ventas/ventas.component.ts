import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidosService } from '../../../services/pedidos.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {

  pedidos: any[] = [];
  cargando = true;

  // Variables para estadísticas
  totalVentas = 0;
  pedidosMes = 0;
  pedidosPendientes = 0;
  ticketPromedio = 0;
  ventasPorMes: any[] = [];

  // Variables para el modal
  mostrarDetalle = false;
  pedidoSeleccionado: any = null;

  constructor(private pedidosService: PedidosService) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    try {
      this.pedidos = await this.pedidosService.getTodosLosPedidos();
      this.calcularEstadisticas();
      this.generarVentasPorMes();
    } catch (error) {
      console.error('❌ Error cargando ventas:', error);
    } finally {
      this.cargando = false;
    }
  }

  calcularEstadisticas() {
    this.totalVentas = this.pedidos.reduce((sum, p) => sum + Number(p.total), 0);
    const ahora = new Date();
    this.pedidosMes = this.pedidos.filter(p => {
      const fecha = new Date(p.created_at);
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    }).length;
    this.pedidosPendientes = this.pedidos.filter(p => p.estado === 'pendiente').length;
    this.ticketPromedio = this.pedidos.length ? this.totalVentas / this.pedidos.length : 0;
  }

  // --- MÉTODOS DE ACCIÓN ---

  async verDetalle(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.mostrarDetalle = true;
    try {
      // Cargamos el detalle profundo (con productos) desde el servicio
      const detalle = await this.pedidosService.getDetallePedido(pedido.id);
      this.pedidoSeleccionado = detalle;
    } catch (error) {
      console.error('Error al obtener detalle:', error);
    }
  }

  async cambiarEstado(id: string, nuevoEstado: string) {
    try {
      // Ajustado al nombre exacto de tu servicio: actualizarEstadoPedido
      await this.pedidosService.actualizarEstadoPedido(id, nuevoEstado);
      
      const pedido = this.pedidos.find(p => p.id === id);
      if (pedido) pedido.estado = nuevoEstado;
      
      this.calcularEstadisticas();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al actualizar en la base de datos');
    }
  }

  async eliminar(id: string) {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
      try {
        await this.pedidosService.eliminarPedido(id);
        this.pedidos = this.pedidos.filter(p => p.id !== id);
        this.calcularEstadisticas();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  generarVentasPorMes() {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.ventasPorMes = meses.map((mes, index) => {
      const total = this.pedidos
        .filter(p => new Date(p.created_at).getMonth() === index)
        .reduce((sum, p) => sum + Number(p.total), 0);
      return { mes, total };
    });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}