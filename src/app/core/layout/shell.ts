import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { navItems, roleRoutes, roleChildren, NavItem } from '../../shared/mock-data';
import { Session } from '../../shared/session';
import { Theme } from '../../shared/theme';
import { Icon } from '../../shared/icon';
import { DocViewerComponent } from '../../shared/doc-viewer';
import { DocHistorialComponent } from '../../shared/doc-historial';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, DocViewerComponent, DocHistorialComponent],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <a class="brand" routerLink="/app/inicio" title="Inicio">
          <span class="mark"></span>
          <span class="wm"><b>Lex</b>Docs</span>
        </a>
        <nav>
          @for (it of nav(); track it.key) {
            @if (it.children) {
              <button class="nav-item parent" [class.active]="parentActive(it)" (click)="toggle(it.key)">
                <span class="ic"><app-icon [name]="it.icon" [size]="18" /></span><span class="lbl">{{ it.label }}</span>
                <span class="chev" [class.open]="isOpen(it)">›</span>
              </button>
              @if (isOpen(it)) {
                <div class="subnav">
                  @for (c of it.children; track c.ruta) {
                    <a class="nav-sub" [routerLink]="'/app/' + c.ruta" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">{{ c.label }}</a>
                  }
                </div>
              }
            } @else {
              <a class="nav-item" [routerLink]="['/app', it.ruta]" routerLinkActive="active">
                <span class="ic"><app-icon [name]="it.icon" [size]="18" /></span><span class="lbl">{{ it.label }}</span>
              </a>
            }
          }
        </nav>
        <div class="ver">F 1.0.0 · B 2026.06 · © 2026 LexDocs</div>
      </aside>

      <div class="main">
        <header class="topbar">
          <div class="title font-title">{{ title() }}</div>
          <div class="tb-right">
            <button class="theme-tgl" (click)="theme.toggle()" [title]="theme.isDark() ? 'Modo claro' : 'Modo oscuro'" aria-label="Cambiar tema">
              <app-icon [name]="theme.isDark() ? 'sun' : 'moon'" [size]="18" />
            </button>
            <span class="user">
              <span class="avatar">{{ inicial() }}</span>
              <span><b>{{ usuario() }}</b><small>{{ session.role() }}</small></span>
            </span>
            <a class="logout" routerLink="/">Salir</a>
          </div>
        </header>
        <main class="content"><router-outlet /></main>
      </div>
      <app-doc-viewer />
      <app-doc-historial />
    </div>
  `,
  styles: [`
    .shell { display: flex; min-height: 100vh; }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
    .brand { display: flex; align-items: center; gap: 10px; padding: 18px 20px; }
    .mark { width: 30px; height: 30px; border-radius: 9px; background: linear-gradient(135deg, var(--brand-purple), var(--brand-blue) 50%, var(--brand-green)); }
    .wm { font-family: 'Exo'; font-size: 22px; font-weight: 800; color: var(--brand-green); }
    .wm b { color: var(--text); }
    nav { flex: 1; overflow-y: auto; padding: 6px 12px; }
    .nav-group { font-size: 11px; font-weight: 700; letter-spacing: .06em; color: var(--text-muted); text-transform: uppercase; padding: 16px 12px 6px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px; color: var(--text); font-weight: 500; margin-bottom: 2px; width: 100%; border: none; background: none; font-size: 14px; text-align: left; transition: background .15s var(--ease), color .15s var(--ease), box-shadow .15s var(--ease); }
    .nav-item .lbl { flex: 1; }
    .nav-item:hover { background: var(--surface-2); }
    .nav-item.active { background: var(--nav-active-bg); color: var(--brand-primary); font-weight: 700; box-shadow: inset 3px 0 0 var(--brand-primary); }
    .ic { width: 20px; text-align: center; }
    .chev { transition: transform .15s; color: var(--text-muted); }
    .chev.open { transform: rotate(90deg); }
    .subnav { display: flex; flex-direction: column; margin: 2px 0 6px 14px; padding-left: 12px; border-left: 1px solid var(--border); }
    .nav-sub { padding: 8px 10px; border-radius: 8px; color: var(--text-muted); font-size: 13px; transition: background .15s var(--ease), color .15s var(--ease); }
    .nav-sub:hover { background: var(--surface-2); color: var(--text); }
    .nav-sub.active { color: var(--brand-primary); font-weight: 700; background: var(--nav-active-bg); }
    .ver { padding: 14px 20px; font-size: 11px; color: var(--text-muted); border-top: 1px solid var(--border); }
    .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; position: sticky; top: 0; z-index: 5; }
    .title { font-size: 18px; font-weight: 700; }
    .tb-right { display: flex; align-items: center; gap: 18px; }
    .user { display: flex; align-items: center; gap: 10px; }
    .user b { font-size: 13px; display: block; }
    .user small { font-size: 11px; color: var(--text-muted); }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--brand-green); color: #fff; display: grid; place-items: center; font-weight: 700; box-shadow: 0 2px 6px rgba(16, 185, 129, .35); }
    .logout { font-size: 12px; color: var(--text-muted); padding: 6px 10px; border-radius: 999px; transition: background .15s var(--ease), color .15s var(--ease); }
    .logout:hover { background: var(--surface-2); color: var(--brand-primary); text-decoration: none; }
    .theme-tgl { display: inline-grid; place-items: center; width: 36px; height: 36px; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); border-radius: 999px; transition: background .15s var(--ease), color .15s var(--ease), border-color .15s var(--ease); }
    .theme-tgl:hover { background: var(--surface-2); color: var(--brand-primary); border-color: var(--brand-primary); }
    .content { padding: 26px 30px; }
    .main { flex: 1; min-width: 0; }
  `],
})
export class Shell {
  private router = inject(Router);
  session = inject(Session);
  theme = inject(Theme);
  private expanded = signal<Set<string>>(new Set());
  private url = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url)), { initialValue: this.router.url });

  constructor() {
    // Abre el submenú del ítem activo al navegar (sin re-abrir si el usuario lo colapsó a mano).
    effect(() => {
      const u = this.url();
      const parent = navItems.find(it => it.children?.some(c => u.includes('/app/' + c.ruta)));
      if (!parent) return;
      untracked(() => {
        if (!this.expanded().has(parent.key)) this.expanded.update(s => new Set(s).add(parent.key));
      });
    });
  }

  nav = computed(() => {
    const permit = roleRoutes[this.session.role()] ?? [];
    const childWhitelist = roleChildren[this.session.role()];
    return navItems
      .filter(it => permit.includes(it.key) && !it.hidden)
      .map(it => (it.children && childWhitelist)
        ? { ...it, children: it.children.filter(c => childWhitelist.includes(c.ruta)) }
        : it)
      .filter(it => !it.children || it.children.length > 0);
  });

  usuario = computed(() => 'Dayana Nieto');
  inicial = computed(() => this.usuario().charAt(0));

  toggle(key: string) {
    const s = new Set(this.expanded());
    s.has(key) ? s.delete(key) : s.add(key);
    this.expanded.set(s);
  }
  parentActive(it: NavItem) { return !!it.children?.some(c => this.url().includes('/app/' + c.ruta)); }
  isOpen(it: NavItem) { return this.expanded().has(it.key); }

  private labels: Record<string, string> = {
    inicio: 'Inicio', reportes: 'Reportes', dashboard: 'Dashboard', expedientes: 'Expedientes', documentos: 'Documentos',
    ingresos: 'Ingresos', firma: 'Bandeja de Firmas', buscador: 'Buscador', bandeja: 'Bandeja de Entrada',
    mantenedores: 'Mantenedores', auditoria: 'Auditoría', 'oficina-partes': 'Oficina de Partes',
    tareas: 'Tareas / Solicitudes', 'portal-ciudadano': 'Portal Ciudadano',
  };
  title() {
    const seg = this.router.url.split('?')[0].split('/').filter(Boolean)[1] || 'inicio';
    return this.labels[seg] ?? 'LexDocs';
  }
}
