import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { reportDefs } from '../../shared/mock-data';
import { barChart, donutChart } from '../../shared/charts';

// Reporte genérico parametrizado por :tipo. Filtros visuales + KPIs + gráfico + tabla.
@Component({
  selector: 'app-reporte',
  imports: [NgApexchartsModule, DataTable, RouterLink, Icon],
  template: `
    <div class="breadcrumb"><a routerLink="/app/reportes">Reportes</a> / {{ def().titulo }}</div>
    <h1 class="page-title">{{ def().titulo }}</h1>
    <p class="page-sub">{{ def().subtitulo }}</p>

    <div class="card panel" style="margin-bottom:18px">
      <div class="filters">
        <div class="field"><label>Fecha inicio</label><input type="date" /></div>
        <div class="field"><label>Fecha término</label><input type="date" /></div>
        <button class="btn btn-ghost">Limpiar</button>
        <button class="btn">Aplicar</button>
        <div style="flex:1"></div>
        <button class="btn btn-green btn-sm"><app-icon name="download" [size]="14" /> Exportar Excel</button>
      </div>
    </div>

    <div class="grid grid-3" style="margin-bottom:18px">
      @for (k of def().kpis; track k.label) {
        <div class="card kpi"><span class="kpi-val">{{ k.val }}</span><span class="kpi-label">{{ k.label }}</span></div>
      }
    </div>

    <div class="grid" style="grid-template-columns:1fr 1fr;margin-bottom:18px;align-items:start">
      <div class="card panel">
        <b>Distribución</b>
        @if (def().chart.tipo === 'bar') {
          <apx-chart [series]="bar().series" [chart]="bar().chart" [colors]="bar().colors" [plotOptions]="bar().plotOptions" [dataLabels]="bar().dataLabels" [xaxis]="bar().xaxis" [yaxis]="bar().yaxis" [legend]="bar().legend" [grid]="bar().grid" [tooltip]="bar().tooltip" />
        } @else {
          <apx-chart [series]="dona().series" [chart]="dona().chart" [labels]="dona().labels" [colors]="dona().colors" [legend]="dona().legend" [dataLabels]="dona().dataLabels" [plotOptions]="dona().plotOptions" [stroke]="dona().stroke" [tooltip]="dona().tooltip" />
        }
      </div>
      <div class="card panel">
        <b>Resumen</b>
        <div class="resumen">
          @for (k of def().kpis; track k.label) {
            <div class="r"><span class="muted">{{ k.label }}</span><b>{{ k.val }}</b></div>
          }
        </div>
      </div>
    </div>

    <div class="card">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center">
        <b>Detalle</b><span class="muted">{{ def().rows.length }} registros</span>
      </div>
      <app-data-table [columns]="def().columns" [rows]="def().rows" />
    </div>
  `,
  styles: [`
    apx-chart { display: block; margin-top: 8px; }
    .resumen { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
    .resumen .r { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
  `],
})
export class Reporte {
  private params = toSignal(inject(ActivatedRoute).paramMap);
  private fallback = reportDefs['documentos-es'];
  def = computed(() => reportDefs[this.params()?.get('tipo') ?? ''] ?? this.fallback);
  bar = computed(() => barChart(this.def().chart.labels, this.def().chart.data));
  dona = computed(() => donutChart(this.def().chart.labels, this.def().chart.data));
}
