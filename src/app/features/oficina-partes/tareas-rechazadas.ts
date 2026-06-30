import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { SolicitudTabs } from '../bandeja/solicitud-tabs';
import { tareasRechazadas, Solicitud } from '../../shared/mock-data';

@Component({
  selector: 'app-tareas-rechazadas',
  imports: [Icon, SolicitudTabs, RouterLink],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Tareas rechazadas</h1>
        <p class="ph-sub">Tareas devueltas o vencidas que requieren revisión y acción.</p>
      </div>
    </div>

    <div class="card filtros-card">
      <div class="filtros-hd">
        <span class="filtros-section">Filtros de búsqueda</span>
        <button class="btn-clear-all" (click)="limpiar()">Limpiar todo</button>
      </div>
      <div class="filtros-bar">
        <div class="fgrp"><label>Materia</label><input placeholder="Buscar materia…" [value]="fMateria()" (input)="fMateria.set($any($event.target).value)" /></div>
        <div class="fgrp"><label>Tipo de documento</label>
          <select><option>Todos los tipos</option><option>OFICIO</option><option>CIRCULAR</option><option>RESOLUCIÓN</option><option>ANTECEDENTE</option></select>
        </div>
        <div class="fgrp"><label>Solicitante</label><input placeholder="Buscar solicitante…" [value]="fSolicitante()" (input)="fSolicitante.set($any($event.target).value)" /></div>
        <div class="fgrp"><label>Fecha desde</label><input type="date" /></div>
        <div class="fgrp"><label>Fecha hasta</label><input type="date" /></div>
        <div class="f-btns"><button class="btn btn-sm">Buscar</button></div>
      </div>
    </div>

    <div class="results-bar">
      <span class="r-count"><b>{{ filtradas().length }}</b> tareas encontradas</span>
      <div class="mostrar"><span>Mostrar</span>
        <select><option>5</option><option>10</option><option>25</option></select>
        <span>por página</span>
      </div>
    </div>

    @for (s of filtradas(); track $index) {
      <div class="sol sol-rech">
        <div class="sol-head">
          <div class="sol-title-wrap">
            <span class="sol-icon">⚠️</span>
            <div>
              <div class="sol-title">{{ s.titulo }}</div>
              @if (s.expedienteLabel) { <span class="exp-ref">{{ s.expedienteLabel }}</span> }
            </div>
          </div>
          <div class="sol-right">
            <span class="badge badge-red">{{ s.estado }}</span>
            <span class="fecha-limite">⏱ Límite: <b>{{ s.fechaLimite }}</b></span>
            <button class="btn btn-sm" (click)="abrir(s)"><app-icon name="play" [size]="13" /> Resolver</button>
          </div>
        </div>

        <div class="sol-meta">
          <div class="meta-item">
            <span class="meta-label">Solicitado por</span>
            <span class="meta-value">{{ s.solicitadoPor }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Fecha solicitud</span>
            <span class="meta-value">{{ s.fechaSolicitud }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Asignado por</span>
            <span class="meta-value">{{ s.asignadoPor }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Fecha asignación</span>
            <span class="meta-value">{{ s.fechaAsignacion }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Materia</span>
            <span class="meta-value">{{ s.materia }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Tipo documento</span>
            <span class="meta-value badge badge-blue">{{ s.tipoDoc }}</span>
          </div>
        </div>
      </div>
    }
    @if (!filtradas().length) { <div class="placeholder">Sin tareas rechazadas.</div> }
    <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>

    @if (sel(); as s) {
      <div class="modal-ov" (click)="cerrar()">
        <div class="modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <div class="modal-titulo">{{ s.titulo }}</div>
            <button class="iconbtn" (click)="cerrar()"><app-icon name="x-circle" [size]="22" /></button>
          </div>
          <app-solicitud-tabs [docPrincipal]="s.docPrincipal" [anexos]="s.anexos" [historial]="s.historial" [detalles]="s.detalles" />
          <div class="modal-foot">
            <div class="foot-left"><button class="btn btn-ghost btn-sm"><app-icon name="file-text" [size]="15" /> Editar documento</button></div>
            <div class="foot-right">
              <button class="btn btn-ghost btn-sm"><app-icon name="edit" [size]="15" /> Asignar expediente</button>
              <button class="btn btn-ghost btn-sm"><app-icon name="log-in" [size]="15" /> Nuevo expediente</button>
              <button class="btn btn-danger btn-sm"><app-icon name="trash" [size]="15" /> Archivar</button>
              <button class="btn btn-sm"><app-icon name="check-circle" [size]="15" /> Terminar revisión</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .filtros-card { padding: 0; overflow: hidden; margin-bottom: 20px; }
    .filtros-hd { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .filtros-section { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
    .btn-clear-all { background: none; border: none; font-size: 11px; color: var(--brand-primary); font-weight: 600; cursor: pointer; }
    .filtros-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; padding: 16px 18px; }
    .fgrp { display: flex; flex-direction: column; gap: 5px; min-width: 150px; flex: 1; }
    .fgrp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .fgrp input, .fgrp select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px; background: var(--surface); color: var(--text); transition: border-color .15s, box-shadow .15s; }
    .fgrp input:focus, .fgrp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .f-btns { display: flex; align-items: flex-end; }

    .results-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .r-count { font-size: 13px; color: var(--text-muted); }
    .r-count b { color: var(--text); }
    .mostrar { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
    .mostrar select { border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; font-family: inherit; font-size: 12px; }

    .sol { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; transition: box-shadow .2s, transform .2s; }
    .sol:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
    .sol.sol-rech { border-left: 4px solid #ef4444; background: color-mix(in srgb, #ef4444 4%, var(--surface)); }

    .sol-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; }
    .sol-title-wrap { display: flex; align-items: center; gap: 12px; }
    .sol-icon { font-size: 22px; }
    .sol-title { font-weight: 700; font-size: 15px; color: var(--text); line-height: 1.3; }
    .exp-ref { font-size: 12px; color: var(--brand-primary); font-weight: 600; }
    .sol-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .fecha-limite { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
    .fecha-limite b { color: var(--text); }

    .sol-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 20px; padding-top: 14px; border-top: 1px solid var(--border); }
    .meta-item { display: flex; flex-direction: column; gap: 3px; }
    .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-weight: 700; }
    .meta-value { font-size: 13px; color: var(--text); }

    .modal-ov { position: fixed; inset: 0; background: rgba(16,24,40,.5); display: grid; place-items: center; z-index: 50; padding: 20px; backdrop-filter: blur(4px); }
    .modal-lg { background: var(--surface); border-radius: 16px; width: 1120px; max-width: 96vw; max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); padding: 22px 26px; }
    .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
    .modal-titulo { font-size: 17px; font-weight: 700; }
    .modal-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px; gap: 8px; flex-wrap: wrap; }
    .foot-left, .foot-right { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-danger { color: #dc2626; border-color: #fca5a5; background: #fef2f2; }
    .btn-danger:hover { background: #fee2e2; }
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
