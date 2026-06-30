import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { DocViewer } from '../../shared/doc-viewer';
import { DocHistorial } from '../../shared/doc-historial';
import {
  organismos, distRechColumns, distRechRows, distRechAcciones, distRechAccionesIconos, despachosHistorial,
} from '../../shared/mock-data';

// Distribuciones rechazadas de Oficina de Partes (forma MINVU, skin LexDocs). Datos ficticios.
@Component({
  selector: 'app-distribuciones-rechazadas',
  imports: [DataTable, Icon, RouterLink],
  template: `
    <div class="breadcrumb"><a routerLink="/app/inicio">Inicio</a> / Distribuciones rechazadas</div>
    <h1 class="page-title">Distribuciones rechazadas</h1>

    <div class="op-layout">
      <aside class="card panel filtros-side">
        <h3 class="f-title">Búsqueda</h3>
        <p class="muted f-sub">Filtros:</p>
        <div class="field"><label>Expediente</label><input placeholder="Buscar…" [value]="fExp()" (input)="fExp.set($any($event.target).value)" /></div>
        <div class="field-row">
          <div class="field"><label>Fecha desde</label><input type="date" /></div>
          <div class="field"><label>Fecha hasta</label><input type="date" /></div>
        </div>
        <div class="field"><label>Materia</label><input placeholder="Materia…" [value]="fMat()" (input)="fMat.set($any($event.target).value)" /></div>
        <div class="field"><label>Organismo</label><select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select></div>
        <div class="f-acciones">
          <button class="btn btn-sm">Buscar</button>
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar filtros</button>
        </div>
      </aside>

      <div class="card panel op-main">
        <div class="op-head">
          <div class="mostrando"><span class="muted">Mostrando:</span>
            <select><option>5 resultados por página</option><option>10 resultados por página</option></select>
          </div>
        </div>
        <div class="op-bulk"><button class="btn"><app-icon name="swap" [size]="16"/> Distribución</button></div>

        <app-data-table [columns]="columns" [rows]="filtrados()" [select]="true"
          [menu]="acciones" [menuIcons]="accionesIconos"
          (cellAction)="despachos.set(true)" (menuAction)="accion($event)" />

        <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
      </div>
    </div>

    @if (despachos()) {
      <div class="md-overlay" (click)="despachos.set(false)">
        <div class="md" (click)="$event.stopPropagation()">
          <div class="md-head"><h3>Historial de despachos</h3><button class="md-x" (click)="despachos.set(false)"><app-icon name="x" [size]="14" /></button></div>
          @for (e of eventos; track $index) {
            <div class="evt" [class.dist]="e.tipo === 'Distribución'" [class.rech]="e.tipo === 'Rechazo'">
              <div class="evt-top">
                <div><b>{{ e.tipo }}</b><div class="muted">{{ e.fecha }}</div></div>
                <b>{{ e.autor }}</b>
              </div>
              <div class="evt-body">
                @if (e.destinatarios) { <span><b>Destinatarios:</b> {{ e.destinatarios }}</span> }
                @if (e.rol) { <span><b>Rol:</b> {{ e.rol }}</span> }
                @if (e.motivo) { <span><b>Motivo:</b> {{ e.motivo }}</span> }
              </div>
            </div>
          }
          <div style="text-align:right;margin-top:8px"><button class="btn" (click)="despachos.set(false)">Cancel</button></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .op-layout { display: flex; gap: 20px; align-items: flex-start; }
    .filtros-side { width: 380px; flex-shrink: 0; }
    .filtros-side .f-title { margin: 0 0 4px; font-size: 17px; }
    .filtros-side .f-sub { margin: 0 0 16px; font-size: 13px; }
    .filtros-side .field { margin-bottom: 14px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .field input, .field select { width: 100%; min-width: 0; box-sizing: border-box; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .field-row { display: flex; gap: 10px; } .field-row .field { flex: 1; min-width: 0; }
    .f-acciones { display: flex; gap: 8px; margin-top: 6px; }
    .op-main { flex: 1; min-width: 0; }
    .op-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
    .mostrando { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .mostrando select { border: 1px solid var(--border); border-radius: 999px; padding: 7px 12px; font-family: inherit; font-size: 13px; }
    .op-bulk { margin-bottom: 12px; }
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(560px, 94vw); max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .md-head h3 { margin: 0; }
    .md-x { background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 6px; width: 28px; height: 28px; cursor: pointer; }
    .evt { border: 2px solid var(--border); border-radius: 10px; padding: 16px 18px; margin-bottom: 18px; }
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
