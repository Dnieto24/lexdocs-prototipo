import { Component, computed, signal } from '@angular/core';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { auditoria, auditoriaColumns } from '../../shared/mock-data';

@Component({
  selector: 'app-auditoria',
  imports: [DataTable, Icon],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Historia de Actividades</h1>
        <p class="ph-sub">Registro completo de eventos y acciones realizadas en el sistema.</p>
      </div>
      <div class="ph-actions">
        <button class="btn btn-ghost btn-sm"><app-icon name="download" [size]="14" /> Exportar</button>
      </div>
    </div>

    <div class="card filtros-card">
      <div class="filtros-hd">
        <span class="filtros-section">Filtros de búsqueda</span>
        <button class="btn-clear-all" (click)="limpiar()">Limpiar todo</button>
      </div>
      <div class="filtros-bar">
        <div class="fgrp"><label>Fecha desde</label><input type="date" /></div>
        <div class="fgrp"><label>Fecha hasta</label><input type="date" /></div>
        <div class="fgrp grow"><label>Usuario</label>
          <select [value]="usuario()" (change)="usuario.set($any($event.target).value)">
            <option>Seleccione un usuario</option>@for (u of usuarios; track u) { <option>{{ u }}</option> }
          </select>
        </div>
        <div class="fgrp"><label>Objeto afectado</label>
          <select [value]="objeto()" (change)="objeto.set($any($event.target).value)">
            <option>Seleccione un objeto</option><option>Expediente</option><option>Documento</option>
          </select>
        </div>
        <div class="f-btns">
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar</button>
          <button class="btn btn-sm">Ver informe</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="tbl-toolbar">
        <div class="tbl-info">
          <span class="tbl-title">Registro de actividad</span>
          <span class="tbl-count">{{ filtrados().length }} registros</span>
        </div>
      </div>
      <app-data-table [columns]="cols" [rows]="filtrados()" [actions]="false" />
      <div class="pagination">
        <span><app-icon name="chevrons-left" [size]="13" /> Anterior</span>
        <span class="active">1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>…</span><span>22</span>
        <span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span>
      </div>
    </div>
  `,
  styles: [`
    .filtros-card { padding: 0; overflow: hidden; margin-bottom: 20px; }
    .filtros-hd { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .filtros-section { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
    .btn-clear-all { background: none; border: none; font-size: 11px; color: var(--brand-primary); font-weight: 600; cursor: pointer; }
    .filtros-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; padding: 16px 18px; }
    .fgrp { display: flex; flex-direction: column; gap: 5px; min-width: 150px; } .fgrp.grow { flex: 1; }
    .fgrp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .fgrp input, .fgrp select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px; width: 100%; background: var(--surface); color: var(--text); transition: border-color .15s, box-shadow .15s; }
    .fgrp input:focus, .fgrp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .f-btns { display: flex; gap: 8px; align-items: flex-end; }

    .tbl-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--border); }
    .tbl-info { display: flex; align-items: center; gap: 10px; }
    .tbl-title { font-size: 14px; font-weight: 600; color: var(--text); }
    .tbl-count { font-size: 12px; font-weight: 600; background: var(--surface-2); color: var(--text-muted); padding: 3px 10px; border-radius: 999px; border: 1px solid var(--border); }
  `],
})
export class Auditoria {
  cols = auditoriaColumns;
  usuarios = [...new Set(auditoria.map(a => a.usuario))];
  usuario = signal('Seleccione un usuario');
  objeto = signal('Seleccione un objeto');
  filtrados = computed(() => auditoria.filter(a =>
    (this.usuario().startsWith('Seleccione') || a.usuario === this.usuario()) &&
    (this.objeto().startsWith('Seleccione') || a.objeto === this.objeto())));
  limpiar() { this.usuario.set('Seleccione un usuario'); this.objeto.set('Seleccione un objeto'); }
}
