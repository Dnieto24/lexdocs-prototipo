import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { Session } from '../../shared/session';

// Inicio = Gestor documental (igual en forma a MINVU, skin LexDocs).
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Icon],
  template: `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge"><app-icon name="shield" [size]="13" /> Sistema Oficial</div>
        <h2>Gestor Documental</h2>
        <p>Administra expedientes, documentos y solicitudes desde un solo lugar.</p>
      </div>
      <div class="hero-stats">
        <div class="hstat"><span class="hval">248</span><span class="hlbl">Expedientes activos</span></div>
        <div class="hdiv"></div>
        <div class="hstat"><span class="hval">1.2K</span><span class="hlbl">Documentos gestionados</span></div>
        <div class="hdiv"></div>
        <div class="hstat"><span class="hval">99.9%</span><span class="hlbl">Disponibilidad</span></div>
      </div>
    </section>

    <div class="section-label">Acciones rápidas</div>
    <div class="grid grid-3 actions-grid">
      <a class="card action-card" routerLink="/app/buscador">
        <div class="card-top">
          <span class="icon-chip chip-blue"><app-icon name="search" [size]="22" /></span>
          <span class="badge badge-blue">Disponible</span>
        </div>
        <div class="card-name">Consultar Solicitud o Expediente</div>
        <div class="card-desc">Revisa el estado, etapas y documentos asociados a cada uno de tus trámites.</div>
        <span class="link-arrow">Ver expedientes <app-icon name="arrow-right" [size]="14" /></span>
      </a>
      <a class="card action-card green" routerLink="/app/ingresos/documento">
        <div class="card-top">
          <span class="icon-chip chip-green"><app-icon name="upload" [size]="22" /></span>
          <span class="badge badge-green">Disponible</span>
        </div>
        <div class="card-name">Subir Documento</div>
        <div class="card-desc">Adjunta antecedentes o documentos requeridos a un expediente en curso.</div>
        <span class="link-arrow">Subir archivo <app-icon name="arrow-right" [size]="14" /></span>
      </a>
      @if (!esCiudadano()) {
        <a class="card action-card orange" routerLink="/app/ingresos/expediente">
          <div class="card-top">
            <span class="icon-chip chip-orange"><app-icon name="plus" [size]="22" /></span>
            <span class="badge badge-orange">Nuevo</span>
          </div>
          <div class="card-name">Ingresar Nuevo Expediente</div>
          <div class="card-desc">Inicia un nuevo expediente completando el formulario de ingreso guiado.</div>
          <span class="link-arrow">Iniciar expediente <app-icon name="arrow-right" [size]="14" /></span>
        </a>
      }
    </div>
  `,
  styles: [`
    .hero { position: relative; }
    .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.25); border-radius: 999px; padding: 4px 12px; font-size: 11px; font-weight: 700; letter-spacing: .04em; color: rgba(255,255,255,.9); margin-bottom: 14px; }
    .hero-content { position: relative; z-index: 1; }
    .hero-stats { display: flex; align-items: center; gap: 0; margin-top: 24px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); border-radius: 12px; padding: 16px 24px; width: fit-content; position: relative; z-index: 1; }
    .hstat { display: flex; flex-direction: column; gap: 3px; padding: 0 20px; }
    .hstat:first-child { padding-left: 0; }
    .hval { font-family: 'Exo'; font-size: 22px; font-weight: 800; color: #fff; line-height: 1; }
    .hlbl { font-size: 11px; color: rgba(255,255,255,.7); font-weight: 500; }
    .hdiv { width: 1px; height: 36px; background: rgba(255,255,255,.2); }
    .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); margin: 24px 0 12px; }
    .actions-grid { }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .card-name { font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.3; }
    .card-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; flex: 1; }
  `],
})
export class Dashboard {
  private session = inject(Session);
  esCiudadano = computed(() => this.session.role() === 'Ciudadano');
}
