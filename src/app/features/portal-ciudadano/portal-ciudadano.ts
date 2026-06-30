import { Component } from '@angular/core';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { ciudadanoSolicitudes, expedienteColumns } from '../../shared/mock-data';

// Vista del rol ciudadano: menús reducidos y solo sus propias solicitudes.
@Component({
  selector: 'app-portal-ciudadano',
  imports: [DataTable, Icon],
  template: `
    <section class="hero" style="background:linear-gradient(110deg,#410367,var(--brand-purple))">
      <h2>Portal Ciudadano</h2>
      <p>Consulta el estado de tus solicitudes en línea.</p>
    </section>

    <div class="grid grid-3" style="margin-bottom:18px">
      <div class="card action-card">
        <span class="icon-chip chip-purple"><app-icon name="file-plus" [size]="22" /></span><div class="name" style="font-weight:700">Nueva solicitud</div>
        <div class="muted">Inicia un trámite completando el formulario.</div>
        <a class="link-arrow" href="javascript:void(0)">Iniciar <app-icon name="arrow-right" [size]="15" /></a>
      </div>
      <div class="card action-card green">
        <span class="icon-chip chip-green"><app-icon name="search" [size]="22" /></span><div class="name" style="font-weight:700">Consultar estado</div>
        <div class="muted">Revisa etapas y documentos de tus solicitudes.</div>
        <a class="link-arrow" href="javascript:void(0)">Ver mis solicitudes <app-icon name="arrow-right" [size]="15" /></a>
      </div>
      <div class="card action-card orange">
        <span class="icon-chip chip-orange"><app-icon name="upload" [size]="22" /></span><div class="name" style="font-weight:700">Subir documento</div>
        <div class="muted">Adjunta antecedentes a una solicitud en curso.</div>
        <a class="link-arrow" href="javascript:void(0)">Subir archivo <app-icon name="arrow-right" [size]="15" /></a>
      </div>
    </div>

    <div class="card">
      <div class="panel"><b>Mis solicitudes</b></div>
      <app-data-table [columns]="cols" [rows]="rows" />
    </div>
  `,
})
export class PortalCiudadano {
  cols = expedienteColumns;
  rows = ciudadanoSolicitudes;
}
