import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { Session } from '../../shared/session';

// Inicio = Gestor documental (igual en forma a MINVU, skin LexDocs).
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Icon],
  template: `
    <div class="breadcrumb"><a href="javascript:void(0)">Inicio</a> / Gestor documental</div>
    <section class="hero">
      <h2>Gestor documental</h2>
      <p>Gestiona tus expedientes y documentos en línea.</p>
    </section>

    <div class="grid grid-3">
      <a class="card action-card" routerLink="/app/buscador">
        <span class="icon-chip chip-blue"><app-icon name="search" [size]="22" /></span>
        <div class="name" style="font-weight:700;font-size:16px">Consultar Solicitud o Expediente</div>
        <div class="muted">Revisa el estado, etapas y documentos asociados a cada uno de tus trámites.</div>
        <span class="link-arrow">Ver mis expedientes <app-icon name="arrow-right" [size]="15" /></span>
      </a>
      <a class="card action-card green" routerLink="/app/ingresos/documento">
        <span class="icon-chip chip-green"><app-icon name="upload" [size]="22" /></span>
        <div class="name" style="font-weight:700;font-size:16px">Subir documento</div>
        <div class="muted">Adjunta antecedentes o documentos requeridos a un expediente en curso.</div>
        <span class="link-arrow">Subir archivo <app-icon name="arrow-right" [size]="15" /></span>
      </a>
      @if (!esCiudadano()) {
        <a class="card action-card orange" routerLink="/app/ingresos/expediente">
          <span class="icon-chip chip-orange"><app-icon name="plus" [size]="22" /></span>
          <div class="name" style="font-weight:700;font-size:16px">Ingresar nuevo expediente</div>
          <div class="muted">Inicia un nuevo expediente completando el formulario de ingreso.</div>
          <span class="link-arrow">Inicia expediente <app-icon name="arrow-right" [size]="15" /></span>
        </a>
      }
    </div>
  `,
})
export class Dashboard {
  private session = inject(Session);
  esCiudadano = computed(() => this.session.role() === 'Ciudadano');
}
