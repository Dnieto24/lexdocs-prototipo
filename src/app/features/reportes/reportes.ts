import { Component, computed, signal } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { expedientes, expedienteColumns, organismos, procedimientos } from '../../shared/mock-data';
import { barChart, donutChart } from '../../shared/charts';

@Component({
  selector: 'app-reportes',
  imports: [NgApexchartsModule, DataTable, Icon],
  template: `
    <div class="ph">
      <div class="ph-left">
        <div class="breadcrumb"><a href="javascript:void(0)">Inicio</a> <span>›</span> Dashboard</div>
        <h1 class="ph-title">Dashboard</h1>
        <p class="ph-sub">Resumen de expedientes por organismo y proceso administrativo.</p>
      </div>
      <div class="ph-actions">
        <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar filtros</button>
      </div>
    </div>

    <div class="card panel filter-card" style="margin-bottom:20px">
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
        <div class="field"><label>Fecha inicio</label><input type="date" /></div>
        <div class="field"><label>Fecha término</label><input type="date" /></div>
      </div>
    </div>

    <div class="grid grid-3" style="margin-bottom:20px">
      <div class="card kpi kpi-rich">
        <div class="kpi-icon-wrap chip-orange">
          <app-icon name="clock" [size]="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-val">{{ enTramite() }}</span>
          <span class="kpi-label">Expedientes en tramitación</span>
        </div>
      </div>
      <div class="card kpi kpi-rich">
        <div class="kpi-icon-wrap chip-green">
          <app-icon name="check-circle" [size]="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-val">{{ terminados() }}</span>
          <span class="kpi-label">Expedientes terminados</span>
        </div>
      </div>
      <div class="card kpi kpi-rich">
        <div class="kpi-icon-wrap chip-blue">
          <app-icon name="clock" [size]="20" />
        </div>
        <div class="kpi-body">
          <span class="kpi-val">{{ promedio() }} días</span>
          <span class="kpi-label">Tiempo promedio total</span>
        </div>
      </div>
    </div>

    <div class="section-label">Visualización</div>
    <div class="grid" style="grid-template-columns:1fr 1fr;margin-bottom:20px">
      <div class="card panel">
        <div class="ch-head">
          <span class="ch-title">Expedientes por tipo de procedimiento</span>
          <button class="btn btn-ghost btn-sm"><app-icon name="download" [size]="14" /> Exportar</button>
        </div>
        <apx-chart [series]="bar().series" [chart]="bar().chart" [colors]="bar().colors"
          [plotOptions]="bar().plotOptions" [dataLabels]="bar().dataLabels"
          [xaxis]="bar().xaxis" [yaxis]="bar().yaxis" [legend]="bar().legend"
          [grid]="bar().grid" [tooltip]="bar().tooltip" />
      </div>
      <div class="card panel">
        <div class="ch-head">
          <span class="ch-title">Estado de expedientes</span>
          <button class="btn btn-ghost btn-sm"><app-icon name="download" [size]="14" /> Exportar</button>
        </div>
        <apx-chart [series]="dona().series" [chart]="dona().chart" [labels]="dona().labels"
          [colors]="dona().colors" [legend]="dona().legend" [dataLabels]="dona().dataLabels"
          [plotOptions]="dona().plotOptions" [stroke]="dona().stroke" [tooltip]="dona().tooltip" />
      </div>
    </div>

    <div class="card">
      <div class="tbl-hd">
        <div class="tbl-hd-left">
          <span class="tbl-hd-title">Listado detallado</span>
          <span class="tbl-hd-count">{{ filtrados().length }} resultados</span>
        </div>
      </div>
      <app-data-table [columns]="cols" [rows]="filtrados()" />
    </div>
  `,
  styles: [`
    .ph {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
      gap: 16px;
    }
    .ph-left { display: flex; flex-direction: column; gap: 2px; }
    .ph-title { font-size: 1.5rem; font-weight: 700; margin: 2px 0 0; }
    .ph-sub { font-size: 0.875rem; color: var(--muted, #6b7280); margin: 0; }
    .ph-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

    .filter-card .filters { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }

    .kpi-rich {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }
    .kpi-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      flex-shrink: 0;
    }
    .chip-orange { background: #fff7ed; color: #ea580c; }
    .chip-green  { background: #f0fdf4; color: #16a34a; }
    .chip-blue   { background: #eff6ff; color: #2563eb; }
    .kpi-body { display: flex; flex-direction: column; gap: 2px; }
    .kpi-rich .kpi-val   { font-size: 1.75rem; font-weight: 700; line-height: 1; }
    .kpi-rich .kpi-label { font-size: 0.8125rem; color: var(--muted, #6b7280); margin-top: 4px; }

    .section-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted, #9ca3af);
      margin-bottom: 10px;
      padding-left: 2px;
    }

    .ch-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border, #e5e7eb);
    }
    .ch-title { font-size: 0.9375rem; font-weight: 600; }

    .tbl-hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border, #e5e7eb);
    }
    .tbl-hd-left { display: flex; align-items: center; gap: 10px; }
    .tbl-hd-title { font-size: 0.9375rem; font-weight: 600; }
    .tbl-hd-count {
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--chip-bg, #f3f4f6);
      color: var(--muted, #6b7280);
      padding: 2px 8px;
      border-radius: 999px;
    }
  `],
})
export class Reportes {
  organismos = organismos;
  procedimientos = procedimientos;
  cols = expedienteColumns;
  estados = ['En trámite', 'Terminado', 'Observado', 'Rechazado'];

  org = signal('Todos');
  proc = signal('Todos');

  filtrados = computed(() => expedientes.filter(e =>
    (this.org() === 'Todos' || e.organismo === this.org()) &&
    (this.proc() === 'Todos' || e.procedimiento === this.proc())));

  enTramite = computed(() => this.filtrados().filter(e => e.estado === 'En trámite').length);
  terminados = computed(() => this.filtrados().filter(e => e.estado === 'Terminado').length);
  promedio = computed(() => this.filtrados().length ? 6 + (this.filtrados().length % 5) : 0);

  bar = computed(() => barChart(this.procedimientos, this.procedimientos.map(p => this.filtrados().filter(e => e.procedimiento === p).length)));
  dona = computed(() => donutChart(this.estados, this.estados.map(s => this.filtrados().filter(e => e.estado === s).length)));

  limpiar() { this.org.set('Todos'); this.proc.set('Todos'); }
}
