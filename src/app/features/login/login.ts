import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../shared/session';
import { Icon } from '../../shared/icon';
import { ROLES, roleRoutes } from '../../shared/mock-data';

// ponytail: login simulado. Usuario/contraseña + ClaveÚnica (demo); luego selección de rol.
@Component({
  selector: 'app-login',
  imports: [Icon],
  template: `
    <div class="wrap">
      <div class="card login">
        <div class="brand">
          <span class="mark"></span>
          <span class="wm"><b>Lex</b><span>Docs</span></span>
        </div>
        <p class="by">by amisoft</p>

        @if (step() === 'auth') {
          <div class="mtabs">
            <button class="mtab on">Usuario y contraseña</button>
            <button class="mtab" (click)="aRol()">ClaveÚnica</button>
          </div>
          <form (submit)="aRol($event)" style="width:100%">
            <div class="field"><label>Usuario</label><input name="user" value="admin" autocomplete="username" /></div>
            <div class="field"><label>Contraseña</label><input name="pass" type="password" value="1234" autocomplete="current-password" /></div>
            <button class="btn full" type="submit">Iniciar sesión</button>
          </form>
          <div class="sep"><span>o continúa con</span></div>
          <button class="btn full cu" (click)="aRol()"><app-icon name="log-in" [size]="16" /> Ingresar con ClaveÚnica</button>
          <a class="recuperar" href="javascript:void(0)">¿Problemas para ingresar? Mesa de Ayuda</a>
          <div class="trust"><app-icon name="shield" [size]="12" /> Conexión segura SSL · MINVU 2026</div>
        } @else {
          <p class="hint">Selecciona el rol con el que quieres acceder al sistema</p>
          <div class="field" style="width:100%">
            <label>Rol</label>
            <select [value]="rol()" (change)="rol.set($any($event.target).value)">
              @for (r of roles; track r) { <option [value]="r">{{ r }}</option> }
            </select>
          </div>
          <button class="btn full" (click)="ingresar()"><app-icon name="log-in" [size]="16" /> Ingresar al sistema</button>
          <a class="recuperar back" href="javascript:void(0)" (click)="step.set('auth')"><app-icon name="arrow-left" [size]="14" /> Cambiar método</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .wrap {
      min-height: 100vh; display: grid; place-items: center; padding: 24px;
      background:
        radial-gradient(ellipse 80% 60% at 50% -10%, rgba(8,0,152,.22), transparent 55%),
        radial-gradient(ellipse 60% 50% at 100% 100%, rgba(146,39,177,.14), transparent 55%),
        radial-gradient(ellipse 40% 40% at 0% 80%, rgba(16,185,129,.08), transparent 50%),
        #f0f2f9;
    }
    .login {
      width: 420px; max-width: 100%; padding: 48px 44px 40px;
      display: flex; flex-direction: column; align-items: center;
      background: rgba(255,255,255,.97);
      box-shadow: 0 24px 80px rgba(8,0,152,.15), 0 2px 8px rgba(8,0,152,.06);
      border: 1px solid rgba(255,255,255,.8);
      border-radius: 20px;
      position: relative; overflow: hidden;
    }
    .login::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--brand-purple), var(--brand-blue) 50%, var(--brand-green));
    }
    .login::after {
      content: ''; position: absolute; top: -80px; right: -60px;
      width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(circle, rgba(8,0,152,.06), transparent 70%);
      pointer-events: none;
    }
    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; position: relative; }
    .mark { width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-blue) 55%, var(--brand-green) 100%); box-shadow: 0 6px 20px rgba(8,0,152,.28); }
    .wm { font-family: 'Exo'; font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -.02em; }
    .wm span { color: var(--brand-green); }
    .by { color: var(--text-muted); margin: 2px 0 28px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; position: relative; }

    /* Tabs método login */
    .mtabs { display: flex; background: var(--surface-2); border-radius: 10px; padding: 4px; width: 100%; margin-bottom: 24px; position: relative; }
    .mtab { flex: 1; border: none; background: none; padding: 9px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all .18s var(--ease); }
    .mtab.on { background: var(--surface); color: var(--brand-primary); box-shadow: 0 1px 4px rgba(0,0,0,.1); }

    form { width: 100%; display: flex; flex-direction: column; gap: 16px; }
    .field { width: 100%; display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); }
    .field input, .field select {
      border: 1.5px solid var(--border); border-radius: 10px; padding: 12px 14px;
      font-family: inherit; font-size: 14px; width: 100%;
      background: var(--surface); color: var(--text);
      transition: border-color .15s var(--ease), box-shadow .15s var(--ease);
    }
    .field input:focus, .field select:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(8,0,152,.1); }

    .btn.full { justify-content: center; width: 100%; border-radius: 10px; padding: 13px; margin-top: 6px; font-size: 14px; font-weight: 700; letter-spacing: .02em; }
    .btn.cu { background: linear-gradient(135deg, #0a4ea3, #1a6fd4); box-shadow: 0 2px 8px rgba(10,78,163,.3); }

    .sep { width: 100%; display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 11px; font-weight: 600; letter-spacing: .04em; margin: 16px 0 4px; }
    .sep::before, .sep::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .hint { color: var(--text-muted); font-size: 13px; text-align: center; margin: 0 0 20px; }
    .recuperar { text-align: center; color: var(--brand-primary); font-size: 12px; font-weight: 600; margin-top: 20px; opacity: .7; transition: opacity .15s; }
    .recuperar:hover { opacity: 1; }
    .back { display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
    .trust { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 20px; font-size: 11px; color: var(--text-muted); }
  `],
})
export class Login {
  private router = inject(Router);
  private session = inject(Session);
  roles = ROLES;
  step = signal<'auth' | 'role'>('auth');
  metodo = signal('Usuario y contraseña');
  rol = signal(ROLES[0]);

  aRol(e?: Event) { e?.preventDefault(); this.step.set('role'); }
  ingresar() {
    this.session.set(this.rol(), this.metodo());
    const first = roleRoutes[this.rol()]?.[0] ?? 'inicio';
    this.router.navigate(['/app', first]);
  }
}
