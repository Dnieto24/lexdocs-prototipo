import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { DocViewer } from '../../shared/doc-viewer';
import { DocHistorial } from '../../shared/doc-historial';
import {
  organismos, manualColumns, manualRows, manualAcciones, manualAccionesIconos,
  manualNumeracionColumns, manualNumeracionRows,
} from '../../shared/mock-data';

// Ingreso Manual de Oficina de Partes (forma MINVU, skin LexDocs). Datos ficticios.
@Component({
  selector: 'app-manual',
  imports: [DataTable, Icon, RouterLink],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Ingreso Manual</h1>
        <p class="ph-sub">Gestión de documentos ingresados manualmente a la Oficina de Partes.</p>
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
            <div class="grp"><label>Expediente</label><input placeholder="Buscar…" [value]="fExp()" (input)="fExp.set($any($event.target).value)" /></div>
            <div class="grp-row">
              <div class="grp"><label>Fecha desde</label><input type="date" /></div>
              <div class="grp"><label>Fecha hasta</label><input type="date" /></div>
            </div>
            <div class="grp"><label>Materia</label><input placeholder="Materia…" [value]="fMat()" (input)="fMat.set($any($event.target).value)" /></div>
            <div class="grp"><label>Organismo</label><select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select></div>
            <button class="btn btn-sm" style="width:100%;justify-content:center">Buscar</button>
          </div>
        </div>
      </aside>

      <div class="card op-main">
        <div class="op-head">
          <div class="mostrando"><span class="muted">Mostrando:</span>
            <select><option>5 resultados por página</option><option>10 resultados por página</option></select>
          </div>
          <button class="btn" (click)="registrar.set(true)"><app-icon name="plus" [size]="16"/> Registrar</button>
        </div>

        <app-data-table [columns]="columns" [rows]="filtrados()" [menu]="acciones" [menuIcons]="accionesIconos" (menuAction)="accion($event)" />

        <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
      </div>
    </div>

    @if (registrar()) {
      <div class="md-overlay" (click)="registrar.set(false)">
        <div class="md" (click)="$event.stopPropagation()">
          <div class="md-head"><h3>Ingreso numeración manual</h3><button class="md-x" (click)="registrar.set(false)"><app-icon name="x" [size]="14" /></button></div>
          <app-data-table [columns]="numCols" [rows]="numRows" [menu]="numAcciones" [menuIcons]="numAccionesIconos" (menuAction)="accionNum($event)" />
          <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
          <div style="text-align:right;margin-top:16px"><button class="btn btn-ghost" (click)="registrar.set(false)">Cerrar</button></div>
        </div>
      </div>
    }
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
    .grp input, .grp select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 10px; font-family: inherit; font-size: 13px; width: 100%; background: var(--surface); color: var(--text); }
    .grp input:focus, .grp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .grp-row { display: flex; gap: 8px; }
    .grp-row .grp { flex: 1; min-width: 0; }
    .op-main { flex: 1; min-width: 0; }
    .op-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
    .mostrando { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .mostrando select { border: 1px solid var(--border); border-radius: 999px; padding: 7px 12px; font-family: inherit; font-size: 13px; }
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(1100px, 94vw); max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .md-head h3 { margin: 0; }
    .md-x { background: var(--brand-blue, #2563EB); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; }
  `],
})
export class Manual {
  private viewer = inject(DocViewer);
  private dochist = inject(DocHistorial);
  organismos = organismos;
  columns = manualColumns;
  acciones = manualAcciones;
  accionesIconos = manualAccionesIconos;
  numCols = manualNumeracionColumns;
  numRows = manualNumeracionRows;
  numAcciones = ['Numerar', 'Visualizar', 'Historial'];
  numAccionesIconos: Record<string, string> = { 'Numerar': 'edit', 'Visualizar': 'eye', 'Historial': 'clock' };

  rows = signal<Record<string, any>[]>([...manualRows]);
  fExp = signal('');
  fMat = signal('');
  filtrados = computed(() => {
    const e = this.fExp().toLowerCase().trim(), m = this.fMat().toLowerCase().trim();
    return this.rows().filter(r =>
      (!e || String(r['expediente']).toLowerCase().includes(e)) &&
      (!m || String(r['materia']).toLowerCase().includes(m)));
  });
  limpiar() { this.fExp.set(''); this.fMat.set(''); }

  registrar = signal(false);

  accion(e: { action: string; index: number }) {
    const row = this.filtrados()[e.index];
    if (e.action === 'Visualizar' || e.action === 'Abrir documento') this.viewer.open((row['materia'] || 'documento') + '.pdf');
    else if (e.action === 'Historial') this.dochist.open((row['materia'] || 'documento') + '.pdf');
  }
  accionNum(e: { action: string; index: number }) {
    const row = this.numRows[e.index];
    if (e.action === 'Visualizar') this.viewer.open((row['materia'] || 'documento') + '.pdf');
    else if (e.action === 'Historial') this.dochist.open((row['materia'] || 'documento') + '.pdf');
  }
}
