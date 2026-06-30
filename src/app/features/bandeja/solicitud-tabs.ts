import { Component, inject, input, signal } from '@angular/core';
import { Icon } from '../../shared/icon';
import { SolicitudHist } from '../../shared/mock-data';
import { DocHistorial } from '../../shared/doc-historial';

// Cuerpo del modal de solicitud: tabs Archivos / Historial / Más detalles (compartido).
@Component({
  selector: 'app-solicitud-tabs',
  imports: [Icon],
  template: `
    <div class="seg-tabs">
      <button [class.on]="t() === 'archivos'" (click)="t.set('archivos')">Archivos</button>
      <button [class.on]="t() === 'historial'" (click)="t.set('historial')">Historial</button>
      <button [class.on]="t() === 'detalles'" (click)="t.set('detalles')">Más detalles</button>
    </div>
    <div class="modal-body">
      @switch (t()) {
        @case ('archivos') {
          <h4 class="modal-h">Documento principal</h4>
          <div class="doc-row"><app-icon name="file" [size]="18" /> {{ docPrincipal() }} <button class="clock-btn" (click)="dochist.open(docPrincipal())"><app-icon name="clock" [size]="15" /></button></div>
          <h4 class="modal-h">Anexos</h4>
          @if (anexos().length) {
            @for (a of anexos(); track a) { <div class="doc-row"><app-icon name="paperclip" [size]="16" /> {{ a }}</div> }
          } @else {
            <div class="anexos-box">La solicitud no contiene Anexos</div>
          }
        }
        @case ('historial') {
          @for (h of historial(); track $index) {
            <div class="hist-item"><b>{{ h.autor }}</b><span class="h-date">{{ h.fecha }}</span><div>{{ h.texto }}</div></div>
          }
        }
        @case ('detalles') {
          <textarea class="detalle-area" readonly>{{ detalles() }}</textarea>
        }
      }
    </div>
  `,
  styles: [`
    .modal-body { min-height: 170px; padding: 6px 2px 10px; }
    .modal-h { margin: 14px 0 8px; font-size: 16px; }
    .doc-row { border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; font-size: 13px; }
    .clock-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); display: inline-flex; padding: 0; }
    .clock-btn:hover { color: var(--brand-primary); }
    .anexos-box { background: var(--surface-2); border-radius: 8px; padding: 14px 16px; color: var(--text-muted); font-size: 13px; }
    .hist-item { margin-bottom: 14px; font-size: 13px; } .hist-item .h-date { color: var(--text-muted); font-size: 12px; margin-left: 8px; }
    .detalle-area { width: 100%; min-height: 160px; border: 1px solid var(--border); border-radius: 10px; padding: 14px; font-family: inherit; font-size: 13px; resize: vertical; background: var(--surface); color: var(--text); }
  `],
})
export class SolicitudTabs {
  dochist = inject(DocHistorial);
  docPrincipal = input('');
  anexos = input<string[]>([]);
  historial = input<SolicitudHist[]>([]);
  detalles = input('');
  t = signal<'archivos' | 'historial' | 'detalles'>('archivos');
}
