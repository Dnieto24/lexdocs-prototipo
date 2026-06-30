import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { DocViewer } from '../../shared/doc-viewer';
import { DocHistorial } from '../../shared/doc-historial';
import {
  organismos, tiposDocumento, preIngresoColumns, preIngresoRows,
  preIngresoAcciones, preIngresoAccionesIconos,
} from '../../shared/mock-data';

// Pre Ingreso de Oficina de Partes (forma MINVU, skin LexDocs). Datos ficticios.
@Component({
  selector: 'app-pre-ingreso',
  imports: [DataTable, Icon, RouterLink],
  template: `
    @if (vista() === 'nuevo') {
      <!-- ===== Generar pre ingreso ===== -->
      <div class="breadcrumb"><a (click)="vista.set('lista')">Pre Ingreso</a> / Nuevo</div>
      <h1 class="page-title">Pre Ingreso</h1>

      <div class="nuevo">
      <div class="card panel">
        <div class="assoc-head">
          <div>
            <b>¿Este documento está asociado a un expediente?</b>
            <p class="muted">Un expediente es un trámite que ya ingresaste anteriormente.</p>
          </div>
          <div class="seg">
            <button [class.on]="tieneExp()" (click)="tieneExp.set(true)"><app-icon name="file" [size]="15"/> Sí, tiene expediente</button>
            <button [class.on]="!tieneExp()" (click)="tieneExp.set(false)"><app-icon name="file" [size]="15"/> No, sin expediente</button>
          </div>
        </div>
      </div>

      @if (tieneExp()) {
        <div class="cards2">
          <button class="opt-card" [class.on]="modoBusqueda() === 'numero'" (click)="modoBusqueda.set('numero')">
            <app-icon name="file-text" [size]="22"/>
            <div><b>Por número de expediente</b><p class="muted">Búsqueda directa si conoces el folio del trámite.</p></div>
            <span class="rad" [class.on]="modoBusqueda() === 'numero'"></span>
          </button>
          <button class="opt-card" [class.on]="modoBusqueda() === 'rut'" (click)="modoBusqueda.set('rut')">
            <app-icon name="user" [size]="22"/>
            <div><b>Por participante (RUT)</b><p class="muted">Busca por RUT y selecciona entre los expedientes en que participa.</p></div>
            <span class="rad" [class.on]="modoBusqueda() === 'rut'"></span>
          </button>
        </div>

        <div class="card panel">
          <div class="info-strip">
            <b>Ingresa el número de tu expediente.</b>
            <p class="muted">Lo encontrarás en la confirmación que recibiste al ingresar tu trámite anteriormente.</p>
          </div>
          <p class="muted small">Los campos marcados con asteriscos (*) son obligatorios.</p>
          <label class="lbl">Número de expediente (*)</label>
          <div class="search-row">
            <input [value]="numExp()" (input)="numExp.set($any($event.target).value)" placeholder="2026-00875-A-000018" />
            <button class="btn" (click)="buscarExp()"><app-icon name="search" [size]="15"/> Buscar expediente</button>
          </div>
          @if (expEncontrado()) {
            <div class="found">
              <b class="ok"><app-icon name="check-circle" [size]="16"/> Expediente encontrado — verifica que sea el correcto</b>
              <div class="found-grid">
                <span><small>NÚMERO</small><br/>{{ numExp() || '2026-00875-A-000018' }}</span>
                <span><small>NOMBRE</small><br/>Trámite documental</span>
                <span><small>INGRESO</small><br/>11-02-2026</span>
              </div>
            </div>
          }
        </div>
      }

      <div class="card panel">
        <b>Información documento</b>
        <p class="muted small">Nuevo documento · Los campos marcados con (*) son obligatorios.</p>
        <div class="form-grid">
          <div class="field"><label>Tipo de documento (*)</label>
            <select [value]="tipoDoc()" (change)="tipoDoc.set($any($event.target).value)">
              <option value="">Selecciona tipo de documento</option>
              @for (t of tipos; track t) { <option>{{ t }}</option> }
            </select>
          </div>
          <div class="field"><label>Materia (*)</label><input [value]="materia()" (input)="materia.set($any($event.target).value)" placeholder="0/255" /></div>
          <div class="field full"><label>Palabras claves</label><input placeholder="Escriba un tag y presione Enter" /></div>
        </div>
      </div>
      </div>

      <div class="foot">
        <button class="btn btn-ghost" (click)="vista.set('lista')">‹ Volver</button>
        <button class="btn btn-green" (click)="generar()">Generar preingreso</button>
      </div>
    } @else {
      <!-- ===== Lista ===== -->
      <div class="breadcrumb"><a routerLink="/app/inicio">Inicio</a> / Pre Ingreso</div>
      <h1 class="page-title">Pre Ingreso</h1>

      <div class="op-layout">
        <aside class="card panel filtros-side">
          <h3 class="f-title">Búsqueda</h3>
          <p class="muted f-sub">Filtros:</p>
          <div class="field"><label>Expediente</label><input placeholder="Buscar…" [value]="fExp()" (input)="fExp.set($any($event.target).value)" /></div>
          <div class="field-row">
            <div class="field"><label>Fecha desde</label><input type="date" /></div>
            <div class="field"><label>Fecha hasta</label><input type="date" /></div>
          </div>
          <div class="field"><label>Materia</label><input placeholder="Materia…" [value]="fMat()" (input)="fMat.set($any($event.target).value)" /></div>
          <div class="field"><label>Organismo</label><select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select></div>
          <div class="f-acciones">
            <button class="btn btn-sm">Buscar</button>
            <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar filtros</button>
          </div>
        </aside>

        <div class="card panel op-main">
          <div class="op-head">
            <div class="mostrando"><span class="muted">Mostrando:</span>
              <select><option>5 resultados por página</option><option>10 resultados por página</option></select>
            </div>
            <div class="op-btns">
              <button class="btn" (click)="abrirNuevo()"><app-icon name="plus" [size]="16"/> Pre-ingreso</button>
              <button class="btn" (click)="masivo.set(true)"><app-icon name="file-text" [size]="16"/> Pre-ingreso masivo</button>
            </div>
          </div>

          <app-data-table [columns]="columns" [rows]="filtrados()" [menu]="acciones" [menuIcons]="accionesIconos" (menuAction)="accion($event)" />

          <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
        </div>
      </div>
    }

    @if (masivo()) {
      <!-- ===== Subir masivo (wizard) ===== -->
      <div class="md-overlay" (click)="cerrarMasivo()">
        <div class="md" (click)="$event.stopPropagation()">
          <div class="md-head"><h3>Subir masivo</h3><button class="md-x" (click)="cerrarMasivo()"><app-icon name="x" [size]="14" /></button></div>

          <div class="wsteps">
            <div class="ws on"><span class="dot"><app-icon name="file-text" [size]="20"/></span><span>Seleccionar tipo documento</span></div>
            <span class="wline" [class.on]="paso() === 2"></span>
            <div class="ws" [class.on]="paso() === 2"><span class="dot"><app-icon name="file-text" [size]="20"/></span><span>Descargar y cargar estructura</span></div>
          </div>

          @if (paso() === 1) {
            <div class="wbox">
              <label class="lbl">Tipo documento (*)</label>
              <select [value]="tipoMasivo()" (change)="tipoMasivo.set($any($event.target).value)">
                <option value="">Seleccione documento</option>
                @for (t of tipos; track t) { <option>{{ t }}</option> }
              </select>
              @if (tipoMasivo()) {
                <p class="muted small">Los campos marcados con asteriscos (*) son obligatorios.</p>
                <p>Tipo documento seleccionado: <b>{{ tipoMasivo() }}</b></p>
                <p>Procede al <b>siguiente</b> paso para descargar la plantilla del tipo documento seleccionado.</p>
              }
            </div>
            <div class="foot">
              <button class="btn btn-ghost" [disabled]="!tipoMasivo()" (click)="paso.set(2)">Siguiente ›</button>
            </div>
          } @else {
            <div class="wbox center">
              <b>Descargar excel de tipo documento para:</b>
              <div class="tipo-big">{{ tipoMasivo() }}</div>
              <button class="btn full-btn" (click)="descargarPlantilla()"><app-icon name="download" [size]="15"/> Descargar</button>
            </div>
            <div class="wbox center">
              <b>Cargar datos de documento</b>
              <label class="btn full-btn"><app-icon name="upload" [size]="15"/> Cargar
                <input type="file" accept=".csv,.xlsx,.xls" hidden (change)="cargarPlantilla($event)" />
              </label>
              @if (cargado()) { <p class="ok small"><app-icon name="check-circle" [size]="14"/> {{ cargado() }}</p> }
            </div>
            <div class="foot">
              <button class="btn btn-ghost" (click)="paso.set(1)">‹ Anterior</button>
              <button class="btn btn-green" (click)="finalizarMasivo()">Finalizar <app-icon name="check" [size]="15" /></button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .breadcrumb a { cursor: pointer; }
    .op-layout { display: flex; gap: 20px; align-items: flex-start; }
    .filtros-side { width: 380px; flex-shrink: 0; }
    .filtros-side .f-title { margin: 0 0 4px; font-size: 17px; }
    .filtros-side .f-sub { margin: 0 0 16px; font-size: 13px; }
    .filtros-side .field { margin-bottom: 14px; }
    .filtros-side .field input, .filtros-side .field select { width: 100%; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .field input, .field select { width: 100%; min-width: 0; box-sizing: border-box; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .field-row { display: flex; gap: 10px; } .field-row .field { flex: 1; min-width: 0; }
    .f-acciones { display: flex; gap: 8px; margin-top: 6px; }
    .op-main { flex: 1; min-width: 0; }
    .op-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
    .mostrando { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .mostrando select { border: 1px solid var(--border); border-radius: 999px; padding: 7px 12px; font-family: inherit; font-size: 13px; }
    .op-btns { display: flex; gap: 10px; }
    /* nuevo */
    .nuevo { display: flex; flex-direction: column; gap: 18px; margin-bottom: 18px; }
    .assoc-head { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    .seg { display: flex; gap: 8px; }
    .seg button { border: 1px solid var(--border); background: var(--surface-2); border-radius: 8px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; gap: 6px; align-items: center; }
    .seg button.on { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
    .cards2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .opt-card { display: flex; gap: 14px; align-items: center; text-align: left; border: 2px solid var(--border); border-radius: 12px; padding: 16px 18px; background: var(--surface); cursor: pointer; }
    .opt-card.on { border-color: var(--brand-primary); background: var(--nav-active-bg); }
    .opt-card p { margin: 2px 0 0; font-size: 12px; }
    .opt-card .rad { margin-left: auto; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; }
    .opt-card .rad.on { border-color: var(--brand-primary); background: var(--brand-primary); box-shadow: inset 0 0 0 3px #fff; }
    .info-strip { border-left: 4px solid var(--text); padding-left: 14px; margin-bottom: 14px; }
    .info-strip p { margin: 4px 0 0; }
    .small { font-size: 12px; }
    .lbl { display: block; text-transform: uppercase; font-size: 11px; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; margin: 10px 0 6px; }
    .search-row { display: flex; gap: 10px; }
    .search-row input { flex: 1; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .found { margin-top: 16px; border: 1px solid var(--brand-green, #10B981); background: color-mix(in srgb, var(--brand-green) 12%, var(--surface)); border-radius: 10px; padding: 14px 16px; }
    .found .ok { color: var(--brand-green, #10B981); display: inline-flex; align-items: center; gap: 6px; }
    .found-grid { display: flex; gap: 50px; margin-top: 10px; font-size: 14px; } .found-grid small { color: var(--text-muted); font-size: 11px; }
    .ok { color: var(--brand-green, #10B981); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px; }
    .form-grid .field.full { grid-column: 1 / -1; }
    .foot { display: flex; justify-content: center; gap: 12px; margin-top: 20px; }
    /* modal masivo */
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(680px, 94vw); box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .md-head h3 { margin: 0; }
    .md-x { background: var(--brand-blue, #2563EB); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; }
    .wsteps { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 22px; }
    .ws { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: .5; font-size: 13px; font-weight: 600; max-width: 150px; text-align: center; }
    .ws.on { opacity: 1; }
    .ws .dot { width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--brand-blue, #2563EB); color: var(--brand-blue, #2563EB); display: grid; place-items: center; }
    .ws.on .dot { background: var(--brand-blue, #2563EB); color: #fff; }
    .wline { flex: 1; max-width: 200px; height: 2px; background: var(--border); } .wline.on { background: var(--brand-blue, #2563EB); }
    .wbox { border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; margin-bottom: 14px; }
    .wbox.center { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .wbox select { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .tipo-big { font-family: 'Exo', sans-serif; font-size: 20px; font-weight: 700; }
    .full-btn { width: 100%; justify-content: center; }
  `],
})
export class PreIngreso {
  private viewer = inject(DocViewer);
  private dochist = inject(DocHistorial);
  organismos = organismos;
  tipos = tiposDocumento;
  columns = preIngresoColumns;
  acciones = preIngresoAcciones;
  accionesIconos = preIngresoAccionesIconos;

  rows = signal<Record<string, any>[]>([...preIngresoRows]);
  vista = signal<'lista' | 'nuevo'>('lista');

  // filtros
  fExp = signal('');
  fMat = signal('');
  filtrados = computed(() => {
    const e = this.fExp().toLowerCase().trim(), m = this.fMat().toLowerCase().trim();
    return this.rows().filter(r =>
      (!e || String(r['expediente']).toLowerCase().includes(e)) &&
      (!m || String(r['materia']).toLowerCase().includes(m)));
  });
  limpiar() { this.fExp.set(''); this.fMat.set(''); }

  accion(e: { action: string; index: number }) {
    const row = this.filtrados()[e.index];
    if (e.action === 'Visualizar') this.viewer.open((row['materia'] || 'documento') + '.pdf');
    else if (e.action === 'Historial') this.dochist.open((row['materia'] || 'documento') + '.pdf');
    else if (e.action === 'Eliminar') this.rows.update(rs => rs.filter(r => r !== row));
  }

  // ----- nuevo pre ingreso -----
  tieneExp = signal(true);
  modoBusqueda = signal<'numero' | 'rut'>('numero');
  numExp = signal('');
  expEncontrado = signal(false);
  tipoDoc = signal('');
  materia = signal('');
  abrirNuevo() { this.tieneExp.set(true); this.modoBusqueda.set('numero'); this.numExp.set(''); this.expEncontrado.set(false); this.tipoDoc.set(''); this.materia.set(''); this.vista.set('nuevo'); }
  buscarExp() { this.expEncontrado.set(true); }
  generar() {
    this.rows.update(rs => [{
      expediente: this.tieneExp() && this.numExp() ? this.numExp() : 'Sin expediente',
      numero: '-', materia: this.materia() || 'Sin materia', origen: '-',
      fecha: '30-06-2026', para: '-', ingresadoPor: 'Dayana Nieto',
    }, ...rs]);
    this.vista.set('lista');
  }

  // ----- masivo -----
  masivo = signal(false);
  paso = signal<1 | 2>(1);
  tipoMasivo = signal('');
  cargado = signal('');
  cerrarMasivo() { this.masivo.set(false); this.paso.set(1); this.tipoMasivo.set(''); this.cargado.set(''); }
  descargarPlantilla() {
    const csv = 'Numero Documento,Materia,Origen,Para\n,,,\n';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `plantilla-${this.tipoMasivo()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  cargarPlantilla(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    file.text().then(txt => {
      const filas = txt.split(/\r?\n/).slice(1).map(l => l.split(',')).filter(c => c.some(v => v.trim()));
      this.pendientes = filas.map(c => ({
        expediente: 'Sin expediente', numero: c[0]?.trim() || '-', materia: c[1]?.trim() || `${this.tipoMasivo()} masivo`,
        origen: c[2]?.trim() || '-', fecha: '30-06-2026', para: c[3]?.trim() || '-', ingresadoPor: 'Dayana Nieto',
      }));
      this.cargado.set(`${this.pendientes.length} documento(s) cargado(s) de ${file.name}`);
    });
  }
  private pendientes: Record<string, any>[] = [];
  finalizarMasivo() {
    if (this.pendientes.length) this.rows.update(rs => [...this.pendientes, ...rs]);
    this.cerrarMasivo();
  }
}
