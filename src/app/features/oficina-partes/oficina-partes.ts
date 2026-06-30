import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataTable } from '../../shared/data-table';
import { oficinaBandejas } from '../../shared/mock-data';

// Una sola pantalla parametrizada por submenú (entrante, saliente, pre-ingreso, …).
@Component({
  selector: 'app-oficina-partes',
  imports: [DataTable],
  template: `
    <div class="breadcrumb"><a href="javascript:void(0)">Oficina de Partes</a> / {{ data().titulo }}</div>
    <h1 class="page-title">{{ data().titulo }}</h1>
    <p class="page-sub">{{ data().desc }}</p>

    <div class="grid grid-4" style="margin-bottom:18px">
      <div class="card kpi"><span class="kpi-val">{{ data().rows.length }}</span><span class="kpi-label">En esta bandeja</span></div>
      <div class="card kpi"><span class="kpi-val">{{ pendientes() }}</span><span class="kpi-label">Pendientes</span></div>
      <div class="card kpi"><span class="kpi-val">2</span><span class="kpi-label">Hoy</span></div>
      <div class="card kpi"><span class="kpi-val">8 h</span><span class="kpi-label">Tiempo prom.</span></div>
    </div>

    <div class="card">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center;gap:16px">
        <input class="search" [value]="q()" (input)="q.set($any($event.target).value)" placeholder="Buscar…" />
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm">Derivar</button>
          <button class="btn btn-green btn-sm">+ Nuevo ingreso</button>
        </div>
      </div>
      <app-data-table [columns]="data().columns" [rows]="filtrados()" />
    </div>
  `,
  styles: [`.search { border: 1px solid var(--border); border-radius: 999px; padding: 9px 16px; font-family: inherit; font-size: 13px; min-width: 280px; }`],
})
export class OficinaPartes {
  private params = toSignal(inject(ActivatedRoute).paramMap);
  private fallback = { titulo: 'Oficina de Partes', desc: '', columns: [], rows: [] };
  data = computed(() => oficinaBandejas[this.params()?.get('tipo') ?? 'entrante'] ?? this.fallback);
  q = signal('');
  filtrados = computed(() => {
    const t = this.q().toLowerCase().trim();
    if (!t) return this.data().rows;
    return this.data().rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(t)));
  });
  pendientes = computed(() => this.data().rows.filter(r => /pendiente|sin asignar|rechaz|revisi/i.test(String(r['estado']))).length);
}
