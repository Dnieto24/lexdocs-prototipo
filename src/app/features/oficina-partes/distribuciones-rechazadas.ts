import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { DocViewer } from '../../shared/doc-viewer';
import { DocHistorial } from '../../shared/doc-historial';
import {
  organismos, distRechColumns, distRechRows, distRechAcciones, distRechAccionesIconos, despachosHistorial,
} from '../../shared/mock-data';

@Component({
  selector: 'app-distribuciones-rechazadas',
  imports: [DataTable, Icon, RouterLink],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Distribuciones rechazadas</h1>
        <p class="ph-sub">Documentos cuya distribución fue rechazada y requieren acción.</p>
      </div>
    </div>

    <div class="op-layout">
      <aside class="filtros-side">
        <div class="card filtros-card">
          <div class="filtros-hd">
            <span class="filtros-section">Filtros</span>
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

      <div class="op-main">
        <div class="card">
          <div class="tbl-toolbar">
            <div class="tbl-info">
              <span class="tbl-title">Distribuciones rechazadas</span>
              <span class="tbl-badge">{{ filtrados().length }}</span>
            </div>
            <div class="tbl-acts">
              <button class="btn btn-ghost btn-sm"><app-icon name="swap" [size]="16"/> Nueva distribución</button>
            </div>
          </div>
          <app-data-table [columns]="columns" [rows]="filtrados()" [select]="true"
            [menu]="acciones" [menuIcons]="accionesIconos"
            (cellAction)="despachos.set(true)" (menuAction)="accion($event)" />
          <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
        </div>
      </div>
    </div>

    @if (despachos()) {
      <div class="md-overlay" (click)="despachos.set(false)">
        <div class="md" (click)="$event.stopPropagation()">
          <div class="md-head"><h3>Historial de despachos</h3><button class="iconbtn" (click)="despachos.set(false)"><app-icon name="x-circle" [size]="20" /></button></div>
          @for (e of eventos; track $index) {
            <div class="evt" [class.dist]="e.tipo === 'Distribución'" [class.rech]="e.tipo === 'Rechazo'">
              <div class="evt-top">
                <div><b>{{ e.tipo }}</b><div class="muted small">{{ e.fecha }}</div></div>
                <b>{{ e.autor }}</b>
              </div>
              <div class="evt-body">
                @if (e.destinatarios) { <span><b>Destinatarios:</b> {{ e.destinatarios }}</span> }
                @if (e.rol) { <span><b>Rol:</b> {{ e.rol }}</span> }
                @if (e.motivo) { <span><b>Motivo:</b> {{ e.motivo }}</span> }
              </div>
            </div>
          }
          <div style="text-align:right;margin-top:8px"><button class="btn" (click)="despachos.set(false)">Cerrar</button></div>
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
    .tbl-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid var(--border); }
    .tbl-info { display: flex; align-items: center; gap: 10px; }
    .tbl-title { font-size: 14px; font-weight: 600; }
    .tbl-badge { background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border); border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 600; }
    .tbl-acts { display: flex; gap: 8px; }
    .small { font-size: 12px; }
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(560px, 94vw); max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .md-head h3 { margin: 0; }
    .evt { border: 2px solid var(--border); border-radius: 10px; padding: 16px 18px; margin-bottom: 14px; }
    .evt.dist { border-color: var(--brand-amber, #F59E0B); }
    .evt.rech { border-color: #dc2626; }
    .evt-top { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
    .evt-top b { font-size: 15px; }
    .evt-body { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
  `],
})
export class DistribucionesRechazadas {
  private viewer = inject(DocViewer);
  private dochist = inject(DocHistorial);
  organismos = organismos;
  columns = distRechColumns;
  acciones = distRechAcciones;
  accionesIconos = distRechAccionesIconos;
  eventos = despachosHistorial;

  rows = signal<Record<string, any>[]>([...distRechRows]);
  fExp = signal('');
  fMat = signal('');
  filtrados = computed(() => {
    const e = this.fExp().toLowerCase().trim(), m = this.fMat().toLowerCase().trim();
    return this.rows().filter(r =>
      (!e || String(r['expediente']).toLowerCase().includes(e)) &&
      (!m || String(r['materia']).toLowerCase().includes(m)));
  });
  limpiar() { this.fExp.set(''); this.fMat.set(''); }

  despachos = signal(false);
  accion(e: { action: string; index: number }) {
    const row = this.filtrados()[e.index];
    if (e.action === 'Visualizar' || e.action === 'Abrir documento') this.viewer.open((row['materia'] || 'documento') + '.pdf');
    else if (e.action === 'Historial') this.dochist.open((row['materia'] || 'documento') + '.pdf');
  }
}
