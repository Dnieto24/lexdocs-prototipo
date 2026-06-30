import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { expedientes, expedienteColumns, organismos, procedimientos } from '../../shared/mock-data';

@Component({
  selector: 'app-expedientes',
  imports: [DataTable, RouterLink, Icon],
  template: `
    <div class="ph">
      <div class="ph-left">
<h1 class="ph-title">Expedientes</h1>
        <p class="ph-sub">Revisa el estado, etapas y documentos asociados a cada trámite.</p>
      </div>
      <div class="ph-actions">
        <button class="btn btn-green btn-sm" routerLink="/app/ingresos/expediente">+ Nuevo expediente</button>
      </div>
    </div>

    <div class="grid grid-3" style="margin-bottom:18px">
      <div class="card kpi kpi-rich">
        <div class="kpi-text"><span class="kpi-val">{{ enTramite() }}</span><span class="kpi-label">En trámite</span></div>
        <span class="icon-chip chip-orange"><app-icon name="clock" [size]="20" /></span>
      </div>
      <div class="card kpi kpi-rich">
        <div class="kpi-text"><span class="kpi-val">{{ terminados() }}</span><span class="kpi-label">Terminados</span></div>
        <span class="icon-chip chip-green"><app-icon name="check-circle" [size]="20" /></span>
      </div>
      <div class="card kpi kpi-rich">
        <div class="kpi-text"><span class="kpi-val">{{ filtrados().length }}</span><span class="kpi-label">Total filtrado</span></div>
        <span class="icon-chip chip-indigo"><app-icon name="clipboard-list" [size]="20" /></span>
      </div>
    </div>

    <div class="card panel" style="margin-bottom:18px">
      <div class="filter-hd">
        <span class="filter-label">Filtros</span>
        <div class="filter-actions">
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar</button>
          <button class="btn btn-primary btn-sm" (click)="aplicar()">Aplicar</button>
        </div>
      </div>
      <div class="filters">
        <div class="field"><label>Organismo</label>
          <select [value]="org()" (change)="org.set($any($event.target).value)">
            <option>Todos</option>@for (o of organismos; track o) { <option>{{ o }}</option> }
          </select>
        </div>
        <div class="field"><label>Proceso administrativo</label>
          <select [value]="proc()" (change)="proc.set($any($event.target).value)">
            <option>Todos</option>@for (p of procedimientos; track p) { <option>{{ p }}</option> }
          </select>
        </div>
        <div class="field"><label>Estado</label>
          <select [value]="estado()" (change)="estado.set($any($event.target).value)">
            <option>Todos</option><option>En trámite</option><option>Observado</option><option>Terminado</option><option>Rechazado</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="tbl-hd">
        <span class="tbl-hd-title">Listado detallado</span>
        <span class="badge badge-count">{{ filtrados().length }}</span>
      </div>
      <div (click)="abrir($event)"><app-data-table [columns]="cols" [rows]="filtrados()" /></div>
    </div>
  `,
  styles: [`
    .ph { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .ph-left { display: flex; flex-direction: column; gap: 4px; }
    .ph-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .ph-sub { margin: 0; color: var(--text-secondary, #6b7280); font-size: 0.875rem; }
    .ph-actions { display: flex; align-items: center; gap: 8px; padding-top: 4px; }

    .kpi-rich { flex-direction: row; align-items: center; justify-content: space-between; }
    .kpi-rich .kpi-text { display: flex; flex-direction: column; gap: 6px; }

    .filter-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .filter-label { font-weight: 600; font-size: 0.875rem; color: var(--text-secondary, #6b7280); text-transform: uppercase; letter-spacing: 0.04em; }
    .filter-actions { display: flex; gap: 8px; }

    .tbl-hd { display: flex; align-items: center; gap: 10px; padding: 14px 18px 12px; border-bottom: 1px solid var(--border, #e5e7eb); }
    .tbl-hd-title { font-weight: 600; font-size: 0.9375rem; }
    .badge-count { background: var(--bg-subtle, #f3f4f6); color: var(--text-secondary, #6b7280); font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
  `],
})
export class Expedientes {
  cols = expedienteColumns;
  organismos = organismos;
  procedimientos = procedimientos;
  org = signal('Todos');
  proc = signal('Todos');
  estado = signal('Todos');

  filtrados = computed(() => expedientes.filter(e =>
    (this.org() === 'Todos' || e.organismo === this.org()) &&
    (this.proc() === 'Todos' || e.procedimiento === this.proc()) &&
    (this.estado() === 'Todos' || e.estado === this.estado())));

  enTramite = computed(() => this.filtrados().filter(e => e.estado === 'En trámite').length);
  terminados = computed(() => this.filtrados().filter(e => e.estado === 'Terminado').length);

  limpiar() { this.org.set('Todos'); this.proc.set('Todos'); this.estado.set('Todos'); }
  aplicar() { /* filters are reactive — selection already applied */ }

  private router = inject(Router);
  abrir(e: MouseEvent) {
    const tr = (e.target as HTMLElement).closest('tbody tr');
    if (!tr || (e.target as HTMLElement).closest('.actions')) return;
    const folio = tr.querySelector('td')?.textContent?.trim();
    if (folio) this.router.navigate(['/app', 'expedientes', folio]);
  }
}
