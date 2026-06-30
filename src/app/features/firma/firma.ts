import { Component, computed, inject, signal } from '@angular/core';
import { Icon } from '../../shared/icon';
import { DocViewer } from '../../shared/doc-viewer';
import { documentosPorFirmar, DocFirma } from '../../shared/mock-data';

// Bandeja de firmas (forma MINVU, skin LexDocs). 3 tabs con columnas propias + popover tipo de firma
// y modal "Listado firmas y visaciones". Datos ficticios.
@Component({
  selector: 'app-firma',
  imports: [Icon],
  template: `
    <h1 class="page-title">Bandeja de firmas</h1>

    <div class="segs">
      @for (s of segmentos(); track s.key) {
        <button class="seg" [class.active]="s.key === seg()" (click)="seg.set(s.key)">
          {{ s.label }} <span class="cnt">{{ s.count }}</span>
        </button>
      }
    </div>

    <div class="card panel">
      <p class="muted refresh">La vista se actualiza automáticamente cada 15 segundos…</p>
      <div class="filters">
        <div class="field"><label>Materia</label><input [value]="materia()" (input)="materia.set($any($event.target).value)" placeholder="Buscar por materia…" /></div>
        <div class="field"><label>Tipo de documento</label>
          <select [value]="tipo()" (change)="tipo.set($any($event.target).value)">
            <option>Todos</option><option>ANTECEDENTE</option><option>CIRCULAR</option><option>OFICIO</option><option>RESOLUCIÓN</option>
          </select>
        </div>
        @if (seg() === 'firmados') {
          <div class="field"><label>Fecha de firma desde</label><input type="date" /></div>
          <div class="field"><label>Fecha de firma hasta</label><input type="date" /></div>
        }
        <button class="btn btn-ghost" (click)="limpiar()">Limpiar</button>
        <button class="btn"><app-icon name="search" [size]="14"/> Buscar</button>
        @if (seg() === 'porfirmar') {
          <div class="spacer"></div>
          <div class="firmar-wrap">
            <button class="btn btn-outline" (click)="toggleFirma()"><app-icon name="pen-tool" [size]="14"/> Firmar selección</button>
            <button class="btn btn-outline" (click)="toggleFirma()"><app-icon name="pen-tool" [size]="14"/> Firmar todo</button>
            @if (firmaMenu()) {
              <div class="firma-pop">
                <div class="fp-head"><b>Seleccione el tipo de firma</b><button class="fp-x" (click)="firmaMenu.set(false)"><app-icon name="x" [size]="13" /></button></div>
                <div class="fp-opts">
                  @for (t of tiposFirma; track t) {
                    <label><input type="radio" name="tf" [value]="t" [checked]="tipoFirmaSel() === t" (change)="tipoFirmaSel.set(t)" /> {{ t }}</label>
                  }
                </div>
                <p class="fp-warn"><app-icon name="alert-triangle" [size]="14" /> Solo serán enviados a firma aquellos documentos que no posean tipo de firma asignado o que compartan el mismo tipo de firma.</p>
                <div style="text-align:right"><button class="btn btn-sm" (click)="firmaMenu.set(false)">Firmar</button></div>
              </div>
            }
          </div>
        }
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <table class="data-table">
        <thead>
          <tr>
            @if (seg() === 'porfirmar') { <th class="sel-col"><input type="checkbox" (change)="toggleAll($any($event.target).checked)" [checked]="allSel()" /></th> }
            <th>Nombre</th><th>Tipo documento</th><th>Materia</th><th>Expediente</th>
            @if (seg() !== 'porfirmar') { <th>Folio</th> }
            <th>Documento</th>
            @if (seg() === 'porfirmar') { <th>Fecha creación</th> }
            @if (seg() === 'firmados') { <th>Fecha firma</th> }
            <th>Estado</th>
            @if (seg() === 'porfirmar') { <th>Tipo firma</th> }
            <th>Firmas y visaciones</th>
            @if (seg() === 'porfirmar') { <th>Acciones</th> }
          </tr>
        </thead>
        <tbody>
          @for (d of filtrados(); track $index; let i = $index) {
            <tr>
              @if (seg() === 'porfirmar') { <td class="sel-col"><input type="checkbox" [checked]="sel().has(i)" (change)="toggleRow(i)" /></td> }
              <td><button class="namebtn" (click)="viewer.open(d.nombre)"><app-icon name="file" [size]="15"/> {{ d.nombre }}</button></td>
              <td>{{ d.tipoDoc }}</td><td>{{ d.materia }}</td>
              <td><a class="exp-link">{{ d.expediente }}</a></td>
              @if (seg() !== 'porfirmar') { <td>{{ d.folio }}</td> }
              <td>{{ d.documento }}</td>
              @if (seg() === 'porfirmar') { <td>{{ d.fechaCreacion }}</td> }
              @if (seg() === 'firmados') { <td>{{ d.fechaFirma }}</td> }
              <td><span class="badge" [class]="estadoClass(d.estado)">{{ d.estado }}</span></td>
              @if (seg() === 'porfirmar') { <td>{{ d.tipoFirma }}</td> }
              <td><button class="vis-btn" (click)="visDoc.set(d)"><app-icon name="users" [size]="16"/> 1</button></td>
              @if (seg() === 'porfirmar') {
                <td>
                  @if (d.estado === 'Fallido') {
                    <button class="btn btn-outline btn-sm"><app-icon name="swap" [size]="13"/> Enviar a numeración manual</button>
                  } @else {
                    <button class="btn btn-outline btn-sm btn-rojo"><app-icon name="trash" [size]="13"/> Rechazar</button>
                  }
                </td>
              }
            </tr>
          }
          @if (!filtrados().length) { <tr><td colspan="11" class="placeholder">Sin documentos en esta bandeja.</td></tr> }
        </tbody>
      </table>
      <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>3</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
    </div>

    @if (visDoc(); as d) {
      <div class="md-overlay" (click)="visDoc.set(null)">
        <div class="md" (click)="$event.stopPropagation()">
          <div class="md-head"><h3>Listado firmas y visaciones</h3><button class="md-x" (click)="visDoc.set(null)"><app-icon name="x" [size]="14" /></button></div>
          <table class="data-table">
            <thead><tr><th>Nombre</th><th>Estado</th><th>Tipo firma</th><th>Fecha firma</th></tr></thead>
            <tbody>
              <tr><td>Juan Pérez</td><td>{{ d.estado === 'Firmado' ? 'FIRMADO' : 'PENDIENTE' }}</td>
                <td>{{ d.tipoFirma === '—' ? '-' : d.tipoFirma }}</td><td>{{ d.fechaFirma === '—' ? '-' : d.fechaFirma }}</td></tr>
            </tbody>
          </table>
          <p class="muted novis">No se encontraron visadores para este documento.</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .segs { display: flex; gap: 14px; margin-bottom: 18px; }
    .seg { flex: 1; border: 1px solid var(--border); background: var(--surface); border-radius: 999px; padding: 14px 20px; font-weight: 700; font-size: 13px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; cursor: pointer; transition: border-color .15s var(--ease), color .15s var(--ease); }
    .seg:hover:not(.active) { border-color: var(--brand-primary); color: var(--brand-primary); }
    .seg.active { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
    .seg .cnt { background: rgba(0,0,0,.12); border-radius: 999px; padding: 1px 9px; font-size: 12px; }
    .seg.active .cnt { background: var(--brand-blue, #2563EB); color: #fff; }
    .refresh { font-size: 12px; margin: 0 0 14px; }
    .filters { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
    .filters .field { display: flex; flex-direction: column; gap: 5px; }
    .filters .field label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .filters .field input, .filters .field select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px; min-width: 200px; }
    .spacer { flex: 1; }
    .firmar-wrap { position: relative; display: flex; gap: 10px; }
    .firma-pop { position: absolute; top: 110%; right: 0; z-index: 10; width: 340px; background: var(--surface); border: 2px solid #ef4444; border-radius: 12px; padding: 16px; box-shadow: var(--shadow-lg); }
    .fp-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .fp-x { background: var(--brand-blue, #2563EB); color: #fff; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; }
    .fp-opts { display: flex; gap: 14px; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
    .fp-opts label { display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }
    .fp-warn { background: color-mix(in srgb, var(--brand-orange) 16%, var(--surface)); border-radius: 8px; padding: 10px 12px; font-size: 12px; margin: 0 0 12px; display: flex; gap: 8px; align-items: flex-start; }
    .namebtn { background: none; border: none; cursor: pointer; color: var(--brand-primary); display: inline-flex; align-items: center; gap: 6px; padding: 0; font-family: inherit; font-size: 13px; }
    .namebtn app-icon { color: #dc2626; }
    .exp-link { color: var(--brand-primary); font-weight: 600; }
    .vis-btn { background: none; border: none; cursor: pointer; color: var(--brand-primary); display: inline-flex; align-items: center; gap: 5px; }
    .btn-rojo { color: #dc2626; border-color: #dc2626; }
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(620px, 94vw); box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .md-head h3 { margin: 0; }
    .md-x { background: var(--brand-blue, #2563EB); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; }
    .novis { text-align: center; margin: 16px 0 0; }
  `],
})
export class Firma {
  viewer = inject(DocViewer);
  tiposFirma = ['Firma simple', 'Token', 'FirmaGob'];

  seg = signal('porfirmar');
  materia = signal('');
  tipo = signal('Todos');

  private grupo(estado: string): string {
    const e = estado.toLowerCase();
    if (/pendiente|fallido/.test(e)) return 'porfirmar';
    if (e.includes('proces')) return 'procesados';
    return 'firmados';
  }
  segmentos = computed(() => [
    { key: 'porfirmar', label: 'Documentos por firmar', count: documentosPorFirmar.filter(d => this.grupo(d.estado) === 'porfirmar').length },
    { key: 'procesados', label: 'Procesados', count: documentosPorFirmar.filter(d => this.grupo(d.estado) === 'procesados').length },
    { key: 'firmados', label: 'Firmados', count: documentosPorFirmar.filter(d => this.grupo(d.estado) === 'firmados').length },
  ]);
  filtrados = computed(() => {
    const m = this.materia().toLowerCase().trim();
    return documentosPorFirmar.filter(d =>
      this.grupo(d.estado) === this.seg()
      && (this.tipo() === 'Todos' || d.tipoDoc === this.tipo())
      && (!m || d.materia.toLowerCase().includes(m)));
  });
  limpiar() { this.materia.set(''); this.tipo.set('Todos'); }

  // selección (tab por firmar)
  sel = signal<Set<number>>(new Set());
  allSel = computed(() => this.filtrados().length > 0 && this.sel().size === this.filtrados().length);
  toggleAll(on: boolean) { this.sel.set(on ? new Set(this.filtrados().map((_, i) => i)) : new Set()); }
  toggleRow(i: number) { const s = new Set(this.sel()); s.has(i) ? s.delete(i) : s.add(i); this.sel.set(s); }

  // popover tipo de firma
  firmaMenu = signal(false);
  tipoFirmaSel = signal('');
  toggleFirma() { this.firmaMenu.set(!this.firmaMenu()); }

  // modal firmas y visaciones
  visDoc = signal<DocFirma | null>(null);

  estadoClass(e: string): string {
    const s = e.toLowerCase();
    if (s.includes('firmad')) return 'badge-green';
    if (s.includes('fallid')) return 'badge-red';
    if (s.includes('proces')) return 'badge-blue';
    return 'badge-orange';
  }
}
