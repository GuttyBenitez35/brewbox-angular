import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  formulario: FormGroup;
  cargando = false;
  error = '';
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async iniciarSesion() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.error = '';
    try {
      const { email, password } = this.formulario.value;
      await this.authService.iniciarSesion(email, password);
      this.router.navigate(['/']);
    } catch (e: any) {
  console.error('Login error:', e);
  this.error = e?.message || 'Error de login';
}{
      this.cargando = false;
    }
  }

  campoInvalido(campo: string): boolean {
    const c = this.formulario.get(campo);
    return !!(c?.invalid && c?.touched);
  }
}