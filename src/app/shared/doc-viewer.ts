import { Component, inject, Injectable, signal, computed, effect, viewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Icon } from './icon';

// Visor de documentos (forma MINVU, skin LexDocs). Overlay global controlado por DocViewer.
// Todo PDF apunta a TestPDF.pdf y todo DOCX a TestWord.docx (prototipo, sin backend).

@Injectable({ providedIn: 'root' })
export class DocViewer {
  nombre = signal<string | null>(null);
  open(nombre: string) { this.nombre.set(nombre.replace(/^[^\w]+/, '').trim()); }
  close() { this.nombre.set(null); }
}

@Component({
  selector: 'app-doc-viewer',
  imports: [Icon],
  template: `
    @if (viewer.nombre(); as nom) {
      <div class="vw-overlay">
        <div class="vw-bar">
          <div class="col left"><b>Última Edición:</b><span>19-06-2026</span></div>
          <div class="col center">
            <div class="title">{{ nom }} <span class="pub">Publicado</span></div>
            <small>Creado por: Juan Pérez</small>
            <button class="print" (click)="print()"><app-icon name="file" [size]="13"/> Imprimir</button>
          </div>
          <div class="col right">
            <div class="menu-wrap">
              <button class="burger" (click)="menu.set(!menu())"><app-icon name="menu" [size]="18" /></button>
              @if (menu()) {
                <div class="menu" (click)="menu.set(false)">
                  <button><app-icon name="upload" [size]="15"/> Subir versión</button>
                  <a [href]="fileUrl()" download><app-icon name="download" [size]="15"/> Descargar</a>
                  <button (click)="modal.set('historial')"><app-icon name="clock" [size]="15"/> Ver Historial</button>
                  <button (click)="modal.set('permisos')"><app-icon name="users" [size]="15"/> Permisos</button>
                </div>
              }
            </div>
            <a [href]="fileUrl()" target="_blank" rel="noopener"><app-icon name="upload" [size]="15"/> Abrir en una nueva pestaña</a>
            <button class="x" (click)="modal.set('none'); viewer.close()"><app-icon name="x" [size]="18" /></button>
          </div>
        </div>

        <div class="vw-body">
          @if (esPdf()) {
            <iframe [src]="safeUrl()" title="documento"></iframe>
          } @else {
            <div class="docx"><div #docxBox class="docx-render"></div></div>
          }
        </div>
      </div>

      <!-- Historial de versiones -->
      @if (modal() === 'historial') {
        <div class="md-overlay" (click)="modal.set('none')">
          <div class="md" (click)="$event.stopPropagation()">
            <div class="md-head"><h3>Historial de versiones</h3><button class="md-x" (click)="modal.set('none')"><app-icon name="x" [size]="14" /></button></div>
            <table class="data-table">
              <thead><tr><th>Nombre documento</th><th>Versión</th><th>Modificado por</th><th>Fecha</th><th>Acciones</th><th>Pasar a última versión</th></tr></thead>
              <tbody>
                <tr>
                  <td class="link">{{ nom }}</td><td>1.0</td><td>admin</td><td>19-06-2026 10:05</td>
                  <td class="acts"><app-icon name="download" [size]="16"/><app-icon name="eye" [size]="16"/></td>
                  <td class="muted">Versión actual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Permisos / Compartir -->
      @if (modal() === 'permisos') {
        <div class="md-overlay" (click)="modal.set('none')">
          <div class="md" (click)="$event.stopPropagation()">
            <div class="md-head"><h3>Compartir "{{ nom }}"</h3><button class="md-x" (click)="modal.set('none')"><app-icon name="x" [size]="14" /></button></div>
            <p class="muted">Los campos marcados con asteriscos (*) son obligatorios.</p>
            <div style="text-align:right"><button class="btn btn-sm">+ Mis organizaciones</button></div>
            <label class="lbl">Buscar:</label>
            <select class="sel">
              <option>Añadir personas o grupos</option>
              <option>Camila Fuentes — Unidad Jurídica</option>
              <option>Rodrigo Salas — Oficina de Partes</option>
              <option>Valentina Reyes — Dirección Regional</option>
            </select>
            <p class="ag">Acceso General</p>
            <div class="perm-row">
              <span class="av">A</span><b>JUAN PÉREZ</b>
              <select class="rol"><option>propietario</option><option>contribuidor</option><option>lector</option><option>administrador</option></select>
            </div>
            <div style="text-align:right;margin-top:18px"><button class="btn btn-green" (click)="modal.set('none')">Hecho</button></div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .vw-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 1000; display: flex; flex-direction: column; }
    .vw-bar { background: var(--brand-primary-dark, #050062); color: #fff; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 8px 18px; gap: 12px; }
    .vw-bar .col.left { display: flex; flex-direction: column; font-size: 12px; }
    .vw-bar .col.center { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .vw-bar .title { font-weight: 700; display: inline-flex; align-items: center; gap: 8px; }
    .vw-bar .pub { background: var(--brand-green, #10B981); color: #fff; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 2px 10px; }
    .vw-bar small { opacity: .85; font-size: 12px; }
    .vw-bar .print { margin-top: 2px; background: var(--surface); color: var(--text); border: none; border-radius: 6px; padding: 4px 12px; font-size: 12px; cursor: pointer; display: inline-flex; gap: 5px; align-items: center; }
    .vw-bar .col.right { display: flex; justify-content: flex-end; align-items: center; gap: 16px; }
    .vw-bar .col.right button, .vw-bar .col.right a { background: none; border: none; color: #fff; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 5px; text-decoration: none; }
    .vw-bar .col.right .x { font-size: 18px; }
    .menu-wrap { position: relative; }
    .burger { font-size: 18px; }
    .menu { position: absolute; top: 130%; right: 0; background: var(--surface); border-radius: 8px; box-shadow: var(--shadow-lg); min-width: 190px; padding: 6px; z-index: 1; display: flex; flex-direction: column; }
    .vw-bar .col.right .menu button, .vw-bar .col.right .menu a { color: var(--text); justify-content: flex-start; padding: 9px 12px; border-radius: 6px; font-size: 14px; white-space: nowrap; }
    .vw-bar .col.right .menu button:hover, .vw-bar .col.right .menu a:hover { background: var(--surface-2); }
    .vw-body { flex: 1; padding: 20px; overflow: auto; display: flex; justify-content: center; }
    .vw-body iframe { width: min(900px, 100%); height: 100%; border: none; background: #fff; box-shadow: 0 0 30px rgba(0,0,0,.4); }
    .docx { width: min(900px, 100%); background: #fff; box-shadow: 0 0 30px rgba(0,0,0,.4); overflow: auto; }
    /* modales */
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(820px, 92vw); box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .md-head h3 { margin: 0; }
    .md-x { background: var(--brand-blue, #2563EB); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; }
    .md .acts { display: flex; gap: 12px; color: var(--brand-primary); }
    .md .link { color: var(--brand-primary); font-weight: 600; }
    .lbl { display: block; text-transform: uppercase; font-size: 11px; letter-spacing: .04em; color: var(--text-muted); margin: 14px 0 6px; }
    .sel, .rol { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; }
    .sel { width: 100%; }
    .ag { font-weight: 600; margin: 18px 0 10px; }
    .perm-row { display: flex; align-items: center; gap: 12px; }
    .perm-row .av { width: 36px; height: 36px; border-radius: 50%; background: var(--brand-green, #10B981); color: #fff; display: grid; place-items: center; font-weight: 700; }
    .perm-row .rol { margin-left: auto; }
  `],
})
export class DocViewerComponent {
  viewer = inject(DocViewer);
  private san = inject(DomSanitizer);
  modal = signal<'none' | 'historial' | 'permisos'>('none');
  menu = signal(false);
  docxBox = viewChild<ElementRef<HTMLElement>>('docxBox');

  esPdf = computed(() => !/\.docx?$/i.test(this.viewer.nombre() ?? ''));
  fileUrl = computed(() => (this.esPdf() ? 'TestPDF.pdf' : 'TestWord.docx'));
  safeUrl = computed<SafeResourceUrl>(() => this.san.bypassSecurityTrustResourceUrl(this.fileUrl()));

  constructor() {
    // Render del .docx en el navegador (docx-preview); se dispara al abrir un docx.
    effect(() => {
      const box = this.docxBox();
      if (this.viewer.nombre() && !this.esPdf() && box) {
        Promise.all([fetch(this.fileUrl()).then(r => r.blob()), import('docx-preview')])
          .then(([blob, dp]) => dp.renderAsync(blob, box.nativeElement));
      }
    });
  }

  print() { window.open(this.fileUrl(), '_blank'); }
}
