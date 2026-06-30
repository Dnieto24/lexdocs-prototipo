import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { expedientes, expedienteColumns, organismos, procedimientos } from '../../shared/mock-data';

@Component({
  selector: 'app-expedientes',
  imports: [DataTable, RouterLink, Icon],
  template: `
    <div class="breadcrumb"><a routerLink="/app/reportes">Reportes</a> / Listado de expedientes</div>
    <h1 class="page-title">Expedientes</h1>
    <p class="page-sub">Revisa el estado, etapas y documentos asociados a cada trámite.</p>

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
        <div class="field"><label>Estado</label>
          <select [value]="estado()" (change)="estado.set($any($event.target).value)">
            <option>Todos</option><option>En trámite</option><option>Observado</option><option>Terminado</option><option>Rechazado</option>
          </select>
        </div>
        <button class="btn btn-ghost" (click)="limpiar()">Limpiar</button>
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

    <div class="card">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center">
        <b>Listado detallado</b>
        <button class="btn btn-green btn-sm">Nuevo expediente</button>
      </div>
      <div (click)="abrir($event)"><app-data-table [columns]="cols" [rows]="filtrados()" /></div>
    </div>
  `,
  styles: [`
    .kpi-rich { flex-direction: row; align-items: center; justify-content: space-between; }
    .kpi-rich .kpi-text { display: flex; flex-direction: column; gap: 6px; }
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

  private router = inject(Router);
  abrir(e: MouseEvent) {
    const tr = (e.target as HTMLElement).closest('tbody tr');
    if (!tr || (e.target as HTMLElement).closest('.actions')) return;
    const folio = tr.querySelector('td')?.textContent?.trim();
    if (folio) this.router.navigate(['/app', 'expedientes', folio]);
  }
}
