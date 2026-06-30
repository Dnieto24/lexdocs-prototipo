import { Component } from '@angular/core';
import { DataTable } from '../../shared/data-table';
import { tareas, tareaColumns } from '../../shared/mock-data';

@Component({
  selector: 'app-tareas',
  imports: [DataTable],
  template: `
    <h1 class="page-title">Tareas / Solicitudes</h1>
    <p class="page-sub">Tareas asignadas y solicitudes en curso del flujo documental.</p>

    <div class="grid grid-4" style="margin-bottom:18px">
      <div class="card kpi"><span class="kpi-val">2</span><span class="kpi-label">Pendientes</span></div>
      <div class="card kpi"><span class="kpi-val">1</span><span class="kpi-label">En curso</span></div>
      <div class="card kpi"><span class="kpi-val">1</span><span class="kpi-label">Terminadas</span></div>
      <div class="card kpi"><span class="kpi-val">4</span><span class="kpi-label">Total</span></div>
    </div>

    <div class="card">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center">
        <b>Listado de tareas</b>
        <button class="btn btn-green btn-sm">Nueva tarea</button>
      </div>
      <app-data-table [columns]="cols" [rows]="rows" />
    </div>
  `,
})
export class Tareas {
  cols = tareaColumns;
  rows = tareas;
}
