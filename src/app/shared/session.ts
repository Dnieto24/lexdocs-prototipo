import { Injectable, signal } from '@angular/core';

// ponytail: sesión simulada en memoria (sin backend). Guarda el rol elegido en el login.
@Injectable({ providedIn: 'root' })
export class Session {
  role = signal<string>('Administrador General');
  method = signal<string>('Usuario y contraseña');

  set(role: string, method: string) {
    this.role.set(role);
    this.method.set(method);
  }
}
