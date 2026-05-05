import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItemLocal } from '../../Models/carrito.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {

  formulario!: FormGroup;
  items: CarritoItemLocal[] = [];
  cargando = false;
  pedidoExitoso = false;
  pedidoId = '';
  error = '';

  metodosPago = [
    { value: 'tarjeta', label: 'Tarjeta', emoji: '💳' },
    { value: 'transferencia', label: 'Transferencia', emoji: '🏦' },
    { value: 'efectivo', label: 'Efectivo', emoji: '💵' },
  ];

  constructor(
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    public carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.items$.subscribe(items => {
      this.items = items;
      if (items.length === 0 && !this.pedidoExitoso) {
        this.router.navigate(['/carrito']);
      }
    });

    this.formulario = this.fb.group({
      nombre_cliente: ['', [Validators.required, Validators.minLength(3)]],
      email_cliente: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      direccion_envio: ['', [Validators.required, Validators.minLength(10)]],
      ciudad_envio: ['', [Validators.required]],
      metodo_pago: ['tarjeta', [Validators.required]],
      notas: ['']
    });
  }

  async confirmarPedido() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.error = '';
    try {
      this.pedidoId = await this.pedidosService.crearPedido(this.formulario.value);
      this.pedidoExitoso = true;
    } catch (e: any) {
      this.error = e.message || 'Error al procesar el pedido';
    } finally {
      this.cargando = false;
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  get subtotal() { return this.carritoService.total; }
  get envio() { return this.subtotal > 50 ? 0 : 5; }
  get totalFinal() { return this.subtotal + this.envio; }
}