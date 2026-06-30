import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../shared/icon';
import { SolicitudTabs } from './solicitud-tabs';
import { misPendientes, historialSolicitudes, SolicitudLista } from '../../shared/mock-data';

@Component({
  selector: 'app-bandeja-lista',
  imports: [Icon, SolicitudTabs],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">{{ esHistorial() ? 'Historial de Solicitudes' : 'Mis Solicitudes Pendientes' }}</h1>
        <p class="ph-sub">{{ esHistorial() ? 'Revisa el historial completo de solicitudes procesadas.' : 'Solicitudes asignadas a tu usuario pendientes de acción.' }}</p>
      </div>
    </div>

    @if (esHistorial()) {
      <div class="card filtros-card">
        <div class="filtros-hd">
          <span class="filtros-section">Filtros</span>
          <button class="btn-clear-all" (click)="fDesc.set('')">Limpiar</button>
        </div>
        <div class="filtros-bar">
          <div class="fgrp grow"><label>Descripción</label>
            <input placeholder="Ingrese descripción…" [value]="fDesc()" (input)="fDesc.set($any($event.target).value)" />
          </div>
          <div class="fgrp"><label>Fecha desde</label><input type="date" /></div>
          <div class="fgrp"><label>Fecha hasta</label><input type="date" /></div>
          <div class="f-btns"><button class="btn btn-sm">Buscar</button></div>
        </div>
      </div>
    }

    <div class="r-bar">
      <span class="r-count"><b>{{ filtradas().length }}</b> {{ esHistorial() ? 'solicitudes' : 'pendientes' }}</span>
    </div>

    @for (s of filtradas(); track $index) {
      <div class="lcard" (click)="abrir(s)">
        <div class="lcard-left">
          <div class="lcard-icon" [class]="s.estado === 'RESUELTA' ? 'icon-green' : 'icon-orange'">
            {{ s.estado === 'RESUELTA' ? '✓' : '⏳' }}
          </div>
        </div>
        <div class="lcard-main">
          <div class="lcard-title">{{ s.titulo }}</div>
          <div class="lcard-meta">
            <div class="meta-item">
              <span class="meta-label">Última actividad</span>
              <span class="meta-value">{{ s.ultimaActividad }}</span>
            </div>
            @if (!esHistorial()) {
              <div class="meta-item">
                <span class="meta-label">Procedimiento</span>
                <a class="exp-link" href="javascript:void(0)">{{ s.procedimiento }}</a>
              </div>
            }
            <div class="meta-item">
              <span class="meta-label">Fecha creación</span>
              <span class="meta-value">{{ s.fechaCreacion }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fecha est. resolución</span>
              <span class="meta-value">{{ s.fechaResolucion }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Estado</span>
              <span class="badge" [class]="estadoClass(s.estado)">{{ s.estado }}</span>
            </div>
          </div>
        </div>
        <button class="lcard-btn iconbtn" (click)="abrir(s); $event.stopPropagation()">
          <app-icon name="eye" [size]="18" />
        </button>
      </div>
    }
    @if (!filtradas().length) { <div class="placeholder">Sin solicitudes.</div> }

    @if (esHistorial()) {
      <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /></span><span>1</span><span class="active">2</span><span>3</span><span><app-icon name="chevrons-right" [size]="13" /></span></div>
    }

    @if (sel(); as s) {
      <div class="modal-ov" (click)="cerrar()">
        <div class="modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <b class="modal-titulo">{{ s.modalTitulo }}</b>
            <button class="iconbtn" (click)="cerrar()"><app-icon name="x-circle" [size]="22" /></button>
          </div>
          <app-solicitud-tabs [docPrincipal]="s.docPrincipal" [anexos]="s.anexos" [historial]="s.historial" [detalles]="s.detalles" />
          <div class="modal-foot">
            <button class="btn btn-ghost btn-sm" (click)="info.set(true)"><app-icon name="file-text" [size]="15" /> Ver información documento</button>
          </div>
        </div>
      </div>
    }

    @if (info()) {
      @if (sel(); as s) {
        <div class="modal-ov" (click)="info.set(false)">
          <div class="modal-lg info-modal" (click)="$event.stopPropagation()">
            <div class="modal-head">
              <b class="modal-titulo">Información del documento</b>
              <button class="iconbtn" (click)="info.set(false)"><app-icon name="x-circle" [size]="22" /></button>
            </div>
            <p class="muted small">Los campos marcados con (*) son obligatorios.</p>
            <div class="info-grid2">
              <div class="field"><label>Tipo de documento (*)</label><select disabled><option>{{ s.infoTipoDoc }}</option></select></div>
              <div class="field"><label>Materia (*)</label><textarea disabled rows="2">{{ s.infoMateria }}</textarea></div>
            </div>
            <div class="field" style="margin-bottom:14px"><label>Palabras claves</label><input disabled placeholder="Escriba un tag y presione Enter" /><small class="muted">Ingrese los tags asociados al documento</small></div>
            <div class="info-grid4">
              <div class="field"><label>Número</label><input disabled value="OFI-000123" /></div>
              <div class="field"><label>Origen (de)</label><input disabled value="Unidad de Proyectos" /></div>
              <div class="field"><label>Para</label><input disabled value="Departamento Jurídico" /></div>
              <div class="field"><label>Descripción</label><input disabled value="Solicitud de visación de documento" /></div>
              <div class="field"><label>Código CPAT</label><input disabled value="CPAT-2026-045" /></div>
              <div class="field"><label>Nombre firmante</label><input disabled value="Juan Pérez" /></div>
              <div class="field"><label>Fecha</label><input disabled value="27-03-2026" /></div>
              <div class="field"><label>Tipo de recurso</label><input disabled value="Ordinario" /></div>
              <div class="field"><label>Correo electrónico</label><input disabled value="contacto@minvu.cl" /></div>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .filtros-card { padding: 0; overflow: hidden; margin-bottom: 20px; }
    .filtros-hd { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .filtros-section { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
    .btn-clear-all { background: none; border: none; font-size: 11px; color: var(--brand-primary); font-weight: 600; cursor: pointer; }
    .filtros-bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; padding: 16px 18px; }
    .fgrp { display: flex; flex-direction: column; gap: 5px; min-width: 150px; } .fgrp.grow { flex: 1; }
    .fgrp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .fgrp input { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px; width: 100%; background: var(--surface); transition: border-color .15s, box-shadow .15s; }
    .fgrp input:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .f-btns { display: flex; align-items: flex-end; }

    .r-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .r-count { font-size: 13px; color: var(--text-muted); }
    .r-count b { color: var(--text); }

    /* List card */
    .lcard { display: flex; align-items: center; gap: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; margin-bottom: 10px; cursor: pointer; transition: box-shadow .2s, transform .2s, border-color .2s; }
    .lcard:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); border-color: color-mix(in srgb, var(--brand-primary) 40%, transparent); }

    .lcard-left { flex-shrink: 0; }
    .lcard-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-size: 16px; font-weight: 700; }
    .icon-green { background: #f0fdf4; color: #16a34a; }
    .icon-orange { background: #fff7ed; color: #ea580c; }

    .lcard-main { flex: 1; min-width: 0; }
    .lcard-title { font-weight: 700; font-size: 14px; color: var(--text); margin-bottom: 10px; }
    .lcard-meta { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px 16px; }
    @media (max-width: 1100px) { .lcard-meta { grid-template-columns: repeat(3, 1fr); } }

    .meta-item { display: flex; flex-direction: column; gap: 3px; }
    .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-weight: 700; }
    .meta-value { font-size: 13px; color: var(--text); }
    .exp-link { font-size: 13px; color: var(--brand-primary); font-weight: 600; }
    .lcard-btn { color: var(--brand-primary); flex-shrink: 0; padding: 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface-2); }
    .lcard-btn:hover { background: color-mix(in srgb, var(--brand-primary) 10%, transparent); border-color: var(--brand-primary); }

    /* Modal */
    .modal-ov { position: fixed; inset: 0; background: rgba(16,24,40,.5); display: grid; place-items: center; z-index: 50; padding: 20px; backdrop-filter: blur(4px); }
    .modal-lg { background: var(--surface); border-radius: 16px; width: 900px; max-width: 95vw; max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); padding: 22px 26px; }
    .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
    .modal-titulo { font-size: 17px; font-weight: 700; }
    .modal-foot { display: flex; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 16px; margin-top: 8px; }
    .info-modal { width: 1100px; }
    .small { font-size: 12px; margin: 0 0 14px; }
    .info-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
    .info-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 14px; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .field input, .field select, .field textarea { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px; background: var(--surface-2); color: var(--text); }
    .field small { font-size: 11px; }
  `],
})
export class BandejaLista {
  private rdata = toSignal(inject(ActivatedRoute).data);
  private tipo = computed(() => this.rdata()?.['tipo'] ?? 'mis-pendientes');
  esHistorial = computed(() => this.tipo() === 'historial');
  private datos = computed<SolicitudLista[]>(() => this.esHistorial() ? historialSolicitudes : misPendientes);

  fDesc = signal('');
  filtradas = computed(() => {
    const d = this.fDesc().toLowerCase().trim();
    if (!d) return this.datos();
    return this.datos().filter(r => (r.ultimaActividad + ' ' + r.titulo).toLowerCase().includes(d));
  });

  sel = signal<SolicitudLista | null>(null);
  info = signal(false);
  abrir(s: SolicitudLista) { this.info.set(false); this.sel.set(s); }
  cerrar() { this.info.set(false); this.sel.set(null); }

  estadoClass(e: string): string { return e === 'RESUELTA' ? 'badge-green' : 'badge-orange'; }
}
