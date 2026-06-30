import { Component, computed, signal } from '@angular/core';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { auditoria, auditoriaColumns } from '../../shared/mock-data';

@Component({
  selector: 'app-auditoria',
  imports: [DataTable, Icon],
  template: `
    <h1 class="page-title">Historia de Actividades</h1>

    <div class="card panel" style="margin-bottom:18px">
      <div class="filters">
        <div class="field"><label>Fecha desde</label><input type="date" /></div>
        <div class="field"><label>Fecha hasta</label><input type="date" /></div>
        <div class="field"><label>Usuario</label>
          <select [value]="usuario()" (change)="usuario.set($any($event.target).value)">
            <option>Seleccione un usuario</option>@for (u of usuarios; track u) { <option>{{ u }}</option> }
          </select>
        </div>
        <div class="field"><label>Objeto afectado</label>
          <select [value]="objeto()" (change)="objeto.set($any($event.target).value)">
            <option>Seleccione un objeto</option><option>Expediente</option><option>Documento</option>
          </select>
        </div>
        <button class="btn btn-outline" (click)="limpiar()">Limpiar filtros</button>
        <button class="btn">Ver informe</button>
      </div>
    </div>

    <div class="card">
      <div class="panel" style="display:flex;justify-content:flex-end">
        <button class="btn btn-sm"><app-icon name="download" [size]="14" /> Exportar</button>
      </div>
      <app-data-table [columns]="cols" [rows]="filtrados()" [actions]="false" />
      <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>…</span><span>22</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
    </div>
  `,
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
