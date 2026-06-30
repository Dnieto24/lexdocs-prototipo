import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { SolicitudTabs } from '../bandeja/solicitud-tabs';
import { tareasRechazadas, Solicitud } from '../../shared/mock-data';

// Oficina de Partes · Tareas rechazadas: tareas devueltas (vencidas) + modal Resolver (forma MINVU).
@Component({
  selector: 'app-tareas-rechazadas',
  imports: [Icon, SolicitudTabs, RouterLink],
  template: `
    <div class="breadcrumb"><a routerLink="/app/inicio">Inicio</a> / Tareas rechazadas</div>
    <h1 class="page-title">Tareas rechazadas</h1>

    <div class="card panel filtros-card">
      <div class="filtros-bar">
        <div class="field"><label>Materia</label><input placeholder="Buscar materia" [value]="fMateria()" (input)="fMateria.set($any($event.target).value)" /></div>
        <div class="field"><label>Tipo de documento</label>
          <select><option>Buscar tipo de documento</option><option>OFICIO</option><option>CIRCULAR</option><option>RESOLUCIÓN</option><option>ANTECEDENTE</option></select>
        </div>
        <div class="field"><label>Solicitante</label><input placeholder="Buscar solicitante" [value]="fSolicitante()" (input)="fSolicitante.set($any($event.target).value)" /></div>
        <div class="field"><label>Fecha desde</label><input type="date" /></div>
        <div class="field"><label>Fecha hasta</label><input type="date" /></div>
        <div class="f-btns">
          <button class="btn btn-sm">Buscar</button>
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar</button>
        </div>
      </div>
    </div>

    <div class="card panel">
      <div class="mostrar"><span class="muted">Mostrar</span>
        <select><option>5</option><option>10</option><option>25</option></select>
        <span class="muted">elementos</span>
      </div>

      @for (s of filtradas(); track $index) {
        <div class="sol rojo">
          <div class="sol-head">
            <span class="sol-title">{{ s.titulo }}</span>
            <div class="sol-limite">
              <span>Fecha límite: <b>{{ s.fechaLimite }}</b></span>
              <span><span class="badge badge-red">{{ s.estado }}</span> <small class="muted">{{ s.estadoTexto }}</small></span>
            </div>
          </div>
          <div class="sol-grid">
            <div><label>Solicitado por:</label><span>{{ s.solicitadoPor }}</span></div>
            <div><label>Fecha solicitud:</label><span>{{ s.fechaSolicitud }}</span></div>
            <div><label>Asignado por:</label><span>{{ s.asignadoPor }}</span></div>
            <div><label>Fecha asignación</label><span>{{ s.fechaAsignacion }}</span></div>
          </div>
          <div class="sol-grid">
            <div><label>Materia:</label><span>{{ s.materia }}</span></div>
            <div><label>Tipo documento:</label><span>{{ s.tipoDoc }}</span></div>
            <div></div>
            <div class="sol-act"><button class="btn btn-outline btn-sm" (click)="abrir(s)"><app-icon name="play" [size]="13" /> Resolver</button></div>
          </div>
        </div>
      }
      @if (!filtradas().length) { <div class="placeholder">Sin tareas rechazadas.</div> }
      <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
    </div>

    @if (sel(); as s) {
      <div class="modal-ov" (click)="cerrar()">
        <div class="modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div><b>{{ s.titulo }}</b></div>
            <button class="iconbtn" (click)="cerrar()"><app-icon name="x-circle" [size]="22" /></button>
          </div>
          <div class="modal-strip">{{ s.materia }}</div>

          <app-solicitud-tabs [docPrincipal]="s.docPrincipal" [anexos]="s.anexos" [historial]="s.historial" [detalles]="s.detalles" />

          <div class="modal-foot">
            <button class="btn btn-outline btn-sm"><app-icon name="file-text" [size]="15" /> Editar información documento</button>
            <button class="btn btn-outline btn-sm"><app-icon name="edit" [size]="15" /> Asignar a Expediente</button>
            <button class="btn btn-outline btn-sm"><app-icon name="log-in" [size]="15" /> Nuevo Expediente</button>
            <button class="btn btn-outline btn-sm btn-rojo"><app-icon name="trash" [size]="15" /> Archivar</button>
            <button class="btn btn-outline btn-sm"><app-icon name="check-circle" [size]="15" /> Terminar revisión</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .filtros-card { margin-bottom: 20px; }
    .filtros-bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
    .filtros-bar .field { flex: 1; min-width: 170px; display: flex; flex-direction: column; gap: 6px; }
    .filtros-bar .field label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .filtros-bar .field input, .filtros-bar .field select { width: 100%; min-width: 0; box-sizing: border-box; border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; }
    .f-btns { display: flex; gap: 8px; }
    .mostrar { display: flex; align-items: center; gap: 8px; justify-content: flex-end; font-size: 13px; margin-bottom: 14px; }
    .mostrar select { border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; font-family: inherit; }
    .sol { border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; margin-bottom: 14px; }
    .sol.rojo { border: 2px solid #ef4444; background: color-mix(in srgb, #ef4444 12%, var(--surface)); }
    .sol-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 14px; }
    .sol-title { font-weight: 700; font-size: 15px; }
    .sol-limite { text-align: right; font-size: 13px; display: flex; flex-direction: column; gap: 4px; align-items: flex-end; white-space: nowrap; }
    .sol-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px 16px; }
    .sol-grid + .sol-grid { margin-top: 12px; }
    .sol-grid label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 2px; }
    .sol-grid span { font-size: 13px; }
    .sol-act { display: flex; align-items: flex-end; justify-content: flex-end; }
    .modal-ov { position: fixed; inset: 0; background: rgba(16,24,40,.5); display: grid; place-items: center; z-index: 50; padding: 20px; }
    .modal-lg { background: var(--surface); border-radius: var(--radius); width: 1120px; max-width: 96vw; max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); padding: 22px 26px; }
    .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 16px; }
    .modal-strip { background: color-mix(in srgb, #ef4444 12%, var(--surface)); border: 1px solid color-mix(in srgb, #ef4444 30%, var(--surface)); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; }
    .modal-foot { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 16px; }
    .modal-foot .btn { white-space: nowrap; }
    .btn-rojo { color: #dc2626; border-color: #dc2626; }
  `],
})
export class TareasRechazadas {
  fMateria = signal('');
  fSolicitante = signal('');
  filtradas = computed(() => {
    const m = this.fMateria().toLowerCase().trim(), s = this.fSolicitante().toLowerCase().trim();
    return tareasRechazadas.filter(r =>
      (!m || r.materia.toLowerCase().includes(m)) &&
      (!s || r.solicitadoPor.toLowerCase().includes(s)));
  });
  limpiar() { this.fMateria.set(''); this.fSolicitante.set(''); }

  sel = signal<Solicitud | null>(null);
  abrir(s: Solicitud) { this.sel.set(s); }
  cerrar() { this.sel.set(null); }
}
