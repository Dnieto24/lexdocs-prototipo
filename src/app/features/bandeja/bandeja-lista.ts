import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../shared/icon';
import { SolicitudTabs } from './solicitud-tabs';
import { misPendientes, historialSolicitudes, SolicitudLista } from '../../shared/mock-data';

// Bandeja de Entrada · Mis Pendientes / Historial: tarjetas con "ojo" -> modal solo lectura.
@Component({
  selector: 'app-bandeja-lista',
  imports: [Icon, SolicitudTabs],
  template: `
    <div class="card panel filtros-card">
      <h2 class="bandeja-title">{{ esHistorial() ? 'Historial de Solicitudes' : 'Mis Solicitudes Pendientes' }}</h2>
      @if (esHistorial()) {
        <div class="filtros-bar">
          <div class="field grow"><label>Descripción</label>
            <input placeholder="Ingrese descripción" [value]="fDesc()" (input)="fDesc.set($any($event.target).value)" />
          </div>
          <div class="field"><label>Fecha desde</label><input type="date" /></div>
          <div class="field"><label>Fecha hasta</label><input type="date" /></div>
          <div class="f-btns">
            <button class="btn btn-ghost btn-sm" (click)="fDesc.set('')">Limpiar</button>
            <button class="btn btn-sm">Buscar</button>
          </div>
        </div>
      }
    </div>

    <div class="card panel">
      @for (s of filtradas(); track $index) {
        <div class="lcard">
          <div class="lcard-main">
            <div class="lcard-title">{{ s.titulo }}</div>
            <div class="lcard-grid">
              <div class="col2"><label>Última Actividad</label><span>{{ s.ultimaActividad }}</span></div>
              @if (!esHistorial()) { <div><label>Procedimiento</label><a class="exp-link" href="javascript:void(0)">{{ s.procedimiento }}</a></div> }
              <div><label>Fecha Creación</label><span>{{ s.fechaCreacion }}</span></div>
              <div><label>Fecha Est. Resolución</label><span>{{ s.fechaResolucion }}</span></div>
              <div><label>Estado</label><span class="badge" [class]="estadoClass(s.estado)">{{ s.estado }}</span></div>
            </div>
          </div>
          <button class="iconbtn ojo" (click)="abrir(s)"><app-icon name="eye" [size]="20" /></button>
        </div>
      }
      @if (!filtradas().length) { <div class="placeholder">Sin solicitudes.</div> }

      @if (esHistorial()) {
        <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /></span><span>1</span><span class="active">2</span><span>3</span><span><app-icon name="chevrons-right" [size]="13" /></span></div>
      }
    </div>

    @if (sel(); as s) {
      <div class="modal-ov" (click)="cerrar()">
        <div class="modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-head">
            <b>{{ s.modalTitulo }}</b>
            <button class="iconbtn" (click)="cerrar()"><app-icon name="x-circle" [size]="22" /></button>
          </div>
          <app-solicitud-tabs [docPrincipal]="s.docPrincipal" [anexos]="s.anexos" [historial]="s.historial" [detalles]="s.detalles" />
          <div class="modal-foot">
            <button class="btn btn-outline btn-sm" (click)="info.set(true)"><app-icon name="file-text" [size]="15" /> Ver información documento</button>
          </div>
        </div>
      </div>
    }

    @if (info(); as on) {
      @if (sel(); as s) {
        <div class="modal-ov" (click)="info.set(false)">
          <div class="modal-lg info-modal" (click)="$event.stopPropagation()">
            <div class="modal-head"><b>Información documento</b>
              <button class="iconbtn" (click)="info.set(false)"><app-icon name="x-circle" [size]="22" /></button>
            </div>
            <p class="muted small">Los campos marcados con asteriscos (*) son obligatorios.</p>
            <div class="info-grid2">
              <div class="field"><label>Tipo de documento (*)</label><select disabled><option>{{ s.infoTipoDoc }}</option></select></div>
              <div class="field"><label>Materia (*)</label><textarea disabled rows="2">{{ s.infoMateria }}</textarea></div>
            </div>
            <div class="field"><label>Palabras claves</label><input disabled placeholder="Escriba un tag y presione Enter" /><small class="muted">Ingrese los tags asociados al documento</small></div>
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
    .bandeja-title { margin: 0 0 16px; font-size: 18px; }
    .filtros-card { margin-bottom: 20px; }
    .filtros-bar { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
    .filtros-bar .field { min-width: 180px; } .filtros-bar .field.grow { flex: 1; }
    .filtros-bar .field input { width: 100%; min-width: 0; }
    .f-btns { display: flex; gap: 8px; }
    .lcard { display: flex; align-items: center; gap: 16px; border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; margin-bottom: 14px; }
    .lcard-main { flex: 1; min-width: 0; }
    .lcard-title { font-weight: 700; text-decoration: underline; margin-bottom: 12px; }
    .lcard-grid { display: flex; gap: 24px; }
    .lcard-grid > div { flex: 1; } .lcard-grid > .col2 { flex: 2; }
    .lcard-grid label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 3px; }
    .lcard-grid span { font-size: 13px; }
    .exp-link { color: var(--brand-primary); font-size: 13px; }
    .ojo { color: var(--brand-primary); flex-shrink: 0; }
    .modal-ov { position: fixed; inset: 0; background: rgba(16,24,40,.5); display: grid; place-items: center; z-index: 50; padding: 20px; }
    .modal-lg { background: var(--surface); border-radius: var(--radius); width: 900px; max-width: 95vw; max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); padding: 22px 26px; }
    .modal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; gap: 16px; }
    .modal-foot { display: flex; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 16px; }
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
