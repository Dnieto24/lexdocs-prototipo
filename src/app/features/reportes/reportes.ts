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
    <div class="breadcrumb"><a href="javascript:void(0)">Inicio</a> / Dashboard</div>
    <h1 class="page-title">Dashboard</h1>
    <p class="page-sub">Resumen de expedientes por organismo y proceso administrativo.</p>

    <div class="card panel" style="margin-bottom:18px">
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
        <button class="btn btn-ghost" (click)="limpiar()">Limpiar</button>
      </div>
    </div>

    <div class="grid grid-3" style="margin-bottom:18px">
      <div class="card kpi"><span class="kpi-val">{{ enTramite() }}</span><span class="kpi-label">Expedientes en tramitación</span></div>
      <div class="card kpi"><span class="kpi-val">{{ terminados() }}</span><span class="kpi-label">Expedientes terminados</span></div>
      <div class="card kpi"><span class="kpi-val">{{ promedio() }} días</span><span class="kpi-label">Tiempo promedio total</span></div>
    </div>

    <div class="grid" style="grid-template-columns:1fr 1fr;margin-bottom:18px">
      <div class="card panel">
        <div class="ch-head"><b>Expedientes por tipo de procedimiento</b><button class="btn btn-sm"><app-icon name="download" [size]="14" /> Exportar</button></div>
        <apx-chart [series]="bar().series" [chart]="bar().chart" [colors]="bar().colors"
          [plotOptions]="bar().plotOptions" [dataLabels]="bar().dataLabels"
          [xaxis]="bar().xaxis" [yaxis]="bar().yaxis" [legend]="bar().legend"
          [grid]="bar().grid" [tooltip]="bar().tooltip" />
      </div>
      <div class="card panel">
        <div class="ch-head"><b>Estado de expedientes</b><button class="btn btn-sm"><app-icon name="download" [size]="14" /> Exportar</button></div>
        <apx-chart [series]="dona().series" [chart]="dona().chart" [labels]="dona().labels"
          [colors]="dona().colors" [legend]="dona().legend" [dataLabels]="dona().dataLabels"
          [plotOptions]="dona().plotOptions" [stroke]="dona().stroke" [tooltip]="dona().tooltip" />
      </div>
    </div>

    <div class="card">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center">
        <b>Listado detallado</b>
        <span class="muted">Se han encontrado {{ filtrados().length }} resultados</span>
      </div>
      <app-data-table [columns]="cols" [rows]="filtrados()" />
    </div>
  `,
  styles: [`.ch-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }`],
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
