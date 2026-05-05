import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  formulario: FormGroup;
  cargando = false;
  error = '';
  registroExitoso = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar_password: ['', [Validators.required]]
    }, { validators: this.passwordsCoinciden });
  }

  passwordsCoinciden(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmar_password')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

  async registrar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    try {
      const { nombre_completo, email, password } = this.formulario.value;

      // Registro completo: Auth + tabla perfiles
      const resultado = await this.authService.registrar(
        email,
        password,
        nombre_completo
      );

      console.log('📝 Registro exitoso:', resultado);

      this.registroExitoso = true;

      // Redirige al login después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (e: any) {
      console.error('❌ Error en registro:', e);
      this.error = this.manejarError(e);
    } finally {
      this.cargando = false;
    }
  }

  private manejarError(e: any): string {
    const msg = e?.message || '';

    if (msg.includes('already registered')) {
      return 'Este email ya está registrado';
    }

    if (msg.includes('429') || msg.includes('rate limit')) {
      return 'Demasiados intentos. Espera unos minutos antes de volver a intentar.';
    }

    if (msg.includes('Database error')) {
      return 'Error al guardar el perfil en la base de datos.';
    }

    if (msg.includes('invalid')) {
      return 'Email inválido. Verifica el correo ingresado.';
    }

    if (msg.includes('network')) {
      return 'Error de conexión. Verifica tu internet.';
    }

    return 'Error al crear la cuenta. Intenta nuevamente.';
  }

  campoInvalido(campo: string): boolean {
    const c = this.formulario.get(campo);
    return !!(c?.invalid && c?.touched);
  }
}