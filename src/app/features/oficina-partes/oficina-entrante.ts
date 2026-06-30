import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { opEntrante, opEntranteColumns, opEntranteAcciones, opEntranteAccionesIconos, organismos } from '../../shared/mock-data';

@Component({
  selector: 'app-oficina-entrante',
  imports: [DataTable, Icon, RouterLink],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Entrante</h1>
        <p class="ph-sub">Documentos recibidos pendientes de derivar o gestionar.</p>
      </div>
      <div class="ph-actions">
        <a class="btn" routerLink="/app/ingresos/documento" [queryParams]="{ origen: 'op-entrante' }">
          <app-icon name="file-plus" [size]="16" /> Ingreso de documento
        </a>
      </div>
    </div>

    <div class="op-layout">
      <aside class="filtros-side">
        <div class="card filtros-card">
          <div class="filtros-hd">
            <span class="filtros-section">Filtros de búsqueda</span>
            <button class="btn-clear-all" (click)="limpiar()">Limpiar</button>
          </div>
          <div class="filtros-body">
            <div class="grp"><label>Expediente</label>
              <input placeholder="Buscar…" [value]="fExpediente()" (input)="fExpediente.set($any($event.target).value)" />
            </div>
            <div class="grp-row">
              <div class="grp"><label>Fecha desde</label><input type="date" /></div>
              <div class="grp"><label>Fecha hasta</label><input type="date" /></div>
            </div>
            <div class="grp"><label>Materia</label>
              <input placeholder="Materia…" [value]="fMateria()" (input)="fMateria.set($any($event.target).value)" />
            </div>
            <div class="grp"><label>Organismo</label>
              <select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select>
            </div>
            <button class="btn btn-sm" style="width:100%;justify-content:center">Buscar</button>
          </div>
        </div>
      </aside>

      <div class="op-main">
        <div class="card">
          <div class="tbl-toolbar">
            <div class="tbl-info">
              <span class="tbl-title">Documentos entrantes</span>
              <span class="tbl-badge">{{ filtrados().length }}</span>
            </div>
            <div class="tbl-acts">
              <button class="btn btn-ghost btn-sm">Rechazar selección</button>
            </div>
          </div>
          <app-data-table [columns]="columns" [rows]="filtrados()" [select]="true" [menu]="acciones" [menuIcons]="accionesIconos" />
          <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .op-layout { display: flex; gap: 20px; align-items: flex-start; }
    .filtros-side { width: 260px; flex-shrink: 0; }
    .filtros-card { padding: 0; overflow: hidden; }
    .filtros-hd { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .filtros-section { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
    .btn-clear-all { background: none; border: none; font-size: 11px; color: var(--brand-primary); font-weight: 600; cursor: pointer; }
    .filtros-body { display: flex; flex-direction: column; gap: 12px; padding: 14px; }
    .grp { display: flex; flex-direction: column; gap: 5px; }
    .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .grp input, .grp select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 10px; font-family: inherit; font-size: 13px; width: 100%; background: var(--surface); color: var(--text); transition: border-color .15s, box-shadow .15s; }
    .grp input:focus, .grp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .grp-row { display: flex; gap: 8px; }
    .grp-row .grp { flex: 1; min-width: 0; }
    .op-main { flex: 1; min-width: 0; }
    .tbl-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--border); }
    .tbl-info { display: flex; align-items: center; gap: 10px; }
    .tbl-title { font-size: 14px; font-weight: 600; }
    .tbl-badge { background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border); border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 600; }
    .tbl-acts { display: flex; gap: 8px; }
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
