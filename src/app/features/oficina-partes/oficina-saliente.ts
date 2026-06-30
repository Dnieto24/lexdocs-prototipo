import { Component, computed, signal } from '@angular/core';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import {
  salienteColumns, salienteDespachadosColumns, salienteFirmados, salientePublicados,
  salienteDespachados, salienteMenus, salienteMenuIconos, organismos,
} from '../../shared/mock-data';

type Tab = 'firmados' | 'publicados' | 'despachados';

// Bandeja "Saliente" de Oficina de Partes (tabs Firmados / Publicados / Despachados).
@Component({
  selector: 'app-oficina-saliente',
  imports: [DataTable, Icon],
  template: `
    <div class="breadcrumb"><a href="javascript:void(0)">Inicio</a> / Saliente</div>
    <h1 class="page-title">Saliente</h1>

    <div class="op-layout">
      <aside class="card panel filtros-side">
        <h3 class="f-title">Búsqueda</h3>
        <p class="muted f-sub">Filtros:</p>

        <div class="field"><label>Expediente</label>
          <input placeholder="Buscar…" [value]="fExpediente()" (input)="fExpediente.set($any($event.target).value)" />
        </div>
        <div class="field-row">
          <div class="field"><label>Fecha desde</label><input type="date" /></div>
          <div class="field"><label>Fecha hasta</label><input type="date" /></div>
        </div>
        <div class="field"><label>Materia</label>
          <input placeholder="Materia…" [value]="fMateria()" (input)="fMateria.set($any($event.target).value)" />
        </div>
        <div class="field"><label>Organismo</label>
          <select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select>
        </div>
        <div class="field"><label>Tipo de documento</label>
          <select><option>Seleccione tipo de documento</option><option>Oficio</option><option>Resolución</option><option>Memorándum</option><option>Carta</option></select>
        </div>
        <div class="field"><label>Usuario emisor</label>
          <select><option>Seleccione usuario emisor</option><option>Dayana Nieto</option><option>Juan Pérez</option><option>Marta Soto</option></select>
        </div>
        <div class="field"><label>Fecha firma</label><input type="date" /></div>

        <div class="f-acciones">
          <button class="btn btn-sm">Buscar</button>
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">Limpiar filtros</button>
        </div>
      </aside>

      <div class="card panel op-main">
        <div class="seg-tabs">
          <button [class.on]="tab() === 'firmados'" (click)="tab.set('firmados')">Firmados</button>
          <button [class.on]="tab() === 'publicados'" (click)="tab.set('publicados')">Publicados</button>
          <button [class.on]="tab() === 'despachados'" (click)="tab.set('despachados')">Despachados</button>
        </div>

        <div class="op-bulk">
          @if (tab() === 'firmados') { <button class="btn btn-sm"><app-icon name="upload" [size]="15" /> Publicar</button> }
          <button class="btn btn-sm"><app-icon name="forward" [size]="15" /> Distribución</button>
        </div>

        <app-data-table [columns]="columns()" [rows]="filtrados()" [select]="true"
          [menu]="menu()" [menuIcons]="menuIconos" (cellAction)="onCell($event)" />

        <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span>@if (tab() === 'despachados') { <span>2</span> }<span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
      </div>
    </div>

    @if (modal()) {
      <div class="modal-ov" (click)="modal.set(false)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-head"><b>Historial de despachos</b>
            <button class="iconbtn" (click)="modal.set(false)"><app-icon name="x-circle" [size]="20" /></button>
          </div>
          <div class="modal-body">
            <div class="hist hist-dist">
              <div class="hist-top"><b>Distribución</b><span>Dayana Nieto</span></div>
              <p class="muted">05-05-2026 12:12:23</p>
              <div class="hist-foot">Destinatarios: Dayana Nieto</div>
            </div>
            <div class="hist hist-rech">
              <div class="hist-top"><b>Rechazo</b><span>Dayana Nieto</span></div>
              <p class="muted">05-05-2026 12:12:49</p>
              <div class="hist-foot"><b>Rol:</b> Oficial de Partes<br /><b>Motivo:</b> test devol</div>
            </div>
          </div>
          <div class="modal-actions"><button class="btn btn-sm" (click)="modal.set(false)">Cancelar</button></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .op-layout { display: flex; gap: 20px; align-items: flex-start; }
    .filtros-side { width: 380px; flex-shrink: 0; }
    .filtros-side .f-title { margin: 0 0 4px; font-size: 17px; }
    .filtros-side .f-sub { margin: 0 0 16px; font-size: 13px; }
    .filtros-side .field { margin-bottom: 14px; }
    .filtros-side .field input, .filtros-side .field select { min-width: 0; width: 100%; }
    .field-row { display: flex; gap: 10px; }
    .field-row .field { flex: 1; min-width: 0; }
    .field-row input { padding-left: 10px; padding-right: 10px; }
    .f-acciones { display: flex; gap: 8px; margin-top: 6px; }
    .op-main { flex: 1; min-width: 0; }
    .seg-tabs button { text-transform: uppercase; letter-spacing: .03em; }
    .op-bulk { display: flex; gap: 10px; margin-bottom: 12px; }
    .modal-ov { position: fixed; inset: 0; background: rgba(16,24,40,.5); display: grid; place-items: center; z-index: 50; }
    .modal { background: var(--surface); border-radius: var(--radius); width: 540px; max-width: 92vw; box-shadow: var(--shadow-lg); }
    .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--border); font-size: 16px; }
    .modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
    .hist { border: 2px solid; border-radius: 10px; padding: 14px 16px; }
    .hist-dist { border-color: var(--brand-orange); }
    .hist-rech { border-color: #dc2626; }
    .hist-top { display: flex; justify-content: space-between; align-items: center; }
    .hist p { margin: 4px 0 10px; font-size: 12px; }
    .hist-foot { border-top: 1px solid var(--border); padding-top: 10px; font-size: 13px; }
    .modal-actions { display: flex; justify-content: flex-end; padding: 16px 22px; border-top: 1px solid var(--border); }
  `],
})
export class OficinaSaliente {
  organismos = organismos;
  menuIconos = salienteMenuIconos;
  tab = signal<Tab>('firmados');
  modal = signal(false);

  private datos: Record<Tab, any[]> = { firmados: salienteFirmados, publicados: salientePublicados, despachados: salienteDespachados };
  columns = computed(() => this.tab() === 'despachados' ? salienteDespachadosColumns : salienteColumns);
  menu = computed(() => salienteMenus[this.tab()]);

  fExpediente = signal('');
  fMateria = signal('');
  filtrados = computed(() => {
    const e = this.fExpediente().toLowerCase().trim();
    const m = this.fMateria().toLowerCase().trim();
    return this.datos[this.tab()].filter(r =>
      (!e || r.expediente.toLowerCase().includes(e)) &&
      (!m || r.materia.toLowerCase().includes(m)));
  });
  limpiar() { this.fExpediente.set(''); this.fMateria.set(''); }
  onCell(e: { key: string; index: number }) { if (e.key === 'despachos') this.modal.set(true); }
}
