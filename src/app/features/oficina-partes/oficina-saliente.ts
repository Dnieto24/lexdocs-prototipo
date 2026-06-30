import { Component, computed, signal } from '@angular/core';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import {
  salienteColumns, salienteDespachadosColumns, salienteFirmados, salientePublicados,
  salienteDespachados, salienteMenus, salienteMenuIconos, organismos,
} from '../../shared/mock-data';

type Tab = 'firmados' | 'publicados' | 'despachados';

@Component({
  selector: 'app-oficina-saliente',
  imports: [DataTable, Icon],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Saliente</h1>
        <p class="ph-sub">Documentos despachados a otras unidades — firmados, publicados y distribuidos.</p>
      </div>
    </div>

    <div class="op-layout">
      <aside class="filtros-side">
        <div class="card filtros-card">
          <div class="filtros-hd">
            <span class="filtros-section">Filtros de búsqueda</span>
            <button class="btn-clear-all" (click)="limpiar()">Limpiar</button>
          </div>
          <div class="filtros-body">
            <div class="grp"><label>Expediente</label>
              <input placeholder="Buscar…" [value]="fExpediente()" (input)="fExpediente.set($any($event.target).value)" />
            </div>
            <div class="grp-row">
              <div class="grp"><label>Fecha desde</label><input type="date" /></div>
              <div class="grp"><label>Fecha hasta</label><input type="date" /></div>
            </div>
            <div class="grp"><label>Materia</label>
              <input placeholder="Materia…" [value]="fMateria()" (input)="fMateria.set($any($event.target).value)" />
            </div>
            <div class="grp"><label>Organismo</label>
              <select><option>Seleccione organismo</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select>
            </div>
            <div class="grp"><label>Tipo de documento</label>
              <select><option>Seleccione tipo</option><option>Oficio</option><option>Resolución</option><option>Memorándum</option><option>Carta</option></select>
            </div>
            <div class="grp"><label>Usuario emisor</label>
              <select><option>Seleccione usuario</option><option>Dayana Nieto</option><option>Juan Pérez</option><option>Marta Soto</option></select>
            </div>
            <div class="grp"><label>Fecha firma</label><input type="date" /></div>
            <button class="btn btn-sm" style="width:100%;justify-content:center">Buscar</button>
          </div>
        </div>
      </aside>

      <div class="op-main">
        <div class="card">
          <div class="tabs-bar">
            <button class="stab" [class.active]="tab() === 'firmados'" (click)="tab.set('firmados')">Firmados</button>
            <button class="stab" [class.active]="tab() === 'publicados'" (click)="tab.set('publicados')">Publicados</button>
            <button class="stab" [class.active]="tab() === 'despachados'" (click)="tab.set('despachados')">Despachados</button>
          </div>
          <div class="tbl-toolbar">
            <div class="tbl-info">
              <span class="tbl-title">{{ filtrados().length }} documentos</span>
            </div>
            <div class="tbl-acts">
              @if (tab() === 'firmados') { <button class="btn btn-ghost btn-sm"><app-icon name="upload" [size]="15" /> Publicar</button> }
              <button class="btn btn-ghost btn-sm"><app-icon name="forward" [size]="15" /> Distribución</button>
            </div>
          </div>
          <app-data-table [columns]="columns()" [rows]="filtrados()" [select]="true"
            [menu]="menu()" [menuIcons]="menuIconos" (cellAction)="onCell($event)" />
          <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span>@if (tab() === 'despachados') { <span>2</span> }<span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
        </div>
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
    .filtros-side { width: 260px; flex-shrink: 0; }
    .filtros-card { padding: 0; overflow: hidden; }
    .filtros-hd { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .filtros-section { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
    .btn-clear-all { background: none; border: none; font-size: 11px; color: var(--brand-primary); font-weight: 600; cursor: pointer; }
    .filtros-body { display: flex; flex-direction: column; gap: 12px; padding: 14px; }
    .grp { display: flex; flex-direction: column; gap: 5px; }
    .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .grp input, .grp select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 10px; font-family: inherit; font-size: 13px; width: 100%; background: var(--surface); color: var(--text); transition: border-color .15s, box-shadow .15s; }
    .grp input:focus, .grp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .grp-row { display: flex; gap: 8px; }
    .grp-row .grp { flex: 1; min-width: 0; }
    .op-main { flex: 1; min-width: 0; }
    .tabs-bar { display: flex; gap: 2px; padding: 0 4px; border-bottom: 1px solid var(--border); }
    .stab { border: none; background: none; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--text-muted); padding: 12px 16px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color .15s, border-color .15s; }
    .stab:hover { color: var(--text); }
    .stab.active { color: var(--brand-primary); font-weight: 700; border-bottom-color: var(--brand-primary); }
    .tbl-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-bottom: 1px solid var(--border); }
    .tbl-info { display: flex; align-items: center; gap: 10px; }
    .tbl-title { font-size: 13px; color: var(--text-muted); }
    .tbl-acts { display: flex; gap: 8px; }
    .modal-ov { position: fixed; inset: 0; background: rgba(16,24,40,.5); display: grid; place-items: center; z-index: 50; }
    .modal { background: var(--surface); border-radius: 12px; width: 540px; max-width: 92vw; box-shadow: var(--shadow-lg); }
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
