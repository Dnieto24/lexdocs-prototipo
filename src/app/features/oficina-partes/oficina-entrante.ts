import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { opEntrante, opEntranteColumns, opEntranteAcciones, opEntranteAccionesIconos, organismos } from '../../shared/mock-data';

// Bandeja "Entrante" de Oficina de Partes (forma MINVU, skin LexDocs).
@Component({
  selector: 'app-oficina-entrante',
  imports: [DataTable, Icon, RouterLink],
  template: `
    <div class="breadcrumb"><a routerLink="/app/inicio">Inicio</a> / Entrante</div>
    <h1 class="page-title">Entrante</h1>

    <div class="op-layout">
      <aside class="card panel filtros-side">
        <h3 class="f-title">Búsqueda</h3>
        <p class="muted f-sub">Filtros:</p>

        <div class="field"><label>Expediente</label>
          <input placeholder="Buscar…" [value]="fExpediente()" (input)="fExpediente.set($any($event.target).value)" />
        </div>
        <div class="field-row">
          <div class="field"><label>Fecha desde</label><input type="date" /></div>
          <div class="field"><label>Fecha hasta</label><input type="date" /></div>
        </div>
        <div class="field"><label>Materia</label>
          <input placeholder="Materia…" [value]="fMateria()" (input)="fMateria.set($any($event.target).value)" />
        </div>
        <div class="field"><label>Organismo</label>
          <select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select>
        </div>

        <div class="f-acciones">
          <button class="btn btn-sm">Buscar</button>
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar filtros</button>
        </div>
      </aside>

      <div class="card panel op-main">
        <div class="op-head">
          <div class="mostrando"><span class="muted">Mostrando:</span>
            <select><option>5 resultados por página</option><option>10 resultados por página</option><option>25 resultados por página</option></select>
          </div>
          <a class="btn" routerLink="/app/ingresos/documento" [queryParams]="{ origen: 'op-entrante' }">
            <app-icon name="file-plus" [size]="16" /> Ingreso de documento
          </a>
        </div>

        <div class="op-bulk">
          <button class="btn btn-sm">Rechazar</button>
        </div>

        <app-data-table [columns]="columns" [rows]="filtrados()" [select]="true" [menu]="acciones" [menuIcons]="accionesIconos" />

        <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
      </div>
    </div>
  `,
  styles: [`
    .op-layout { display: flex; gap: 20px; align-items: flex-start; }
    .filtros-side { width: 380px; flex-shrink: 0; }
    .filtros-side .f-title { margin: 0 0 4px; font-size: 17px; }
    .filtros-side .f-sub { margin: 0 0 16px; font-size: 13px; }
    .filtros-side .field { margin-bottom: 14px; }
    .filtros-side .field input, .filtros-side .field select { min-width: 0; width: 100%; }
    .field-row { display: flex; gap: 10px; }
    .field-row .field { flex: 1; min-width: 0; }
    .field-row input { padding-left: 10px; padding-right: 10px; }
    .f-acciones { display: flex; gap: 8px; margin-top: 6px; }
    .op-main { flex: 1; min-width: 0; }
    .op-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
    .mostrando { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .mostrando select { border: 1px solid var(--border); border-radius: 999px; padding: 7px 12px; font-family: inherit; font-size: 13px; }
    .op-bulk { margin-bottom: 10px; }
  `],
})
export class OficinaEntrante {
  organismos = organismos;
  columns = opEntranteColumns;
  acciones = opEntranteAcciones;
  accionesIconos = opEntranteAccionesIconos;

  fExpediente = signal('');
  fMateria = signal('');
  filtrados = computed(() => {
    const e = this.fExpediente().toLowerCase().trim();
    const m = this.fMateria().toLowerCase().trim();
    return opEntrante.filter(r =>
      (!e || r.expediente.toLowerCase().includes(e)) &&
      (!m || r.materia.toLowerCase().includes(m)));
  });
  limpiar() { this.fExpediente.set(''); this.fMateria.set(''); }
}
