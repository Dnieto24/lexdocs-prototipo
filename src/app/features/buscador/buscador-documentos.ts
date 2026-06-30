import { Component, computed, inject, signal } from '@angular/core';
import { documentosBusqueda, organismos } from '../../shared/mock-data';
import { DocViewer } from '../../shared/doc-viewer';
import { DocHistorial } from '../../shared/doc-historial';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-buscador-documentos',
  imports: [Icon],
  template: `
    <div class="head"><h1 class="page-title">Buscador de documentos</h1>
      <select class="sort"><option>Más relevante</option><option>Más reciente</option><option>Más antiguo</option></select>
    </div>

    <div class="layout">
      <aside class="card panel filtros">
        <input class="buscar" [value]="texto()" (input)="texto.set($any($event.target).value)" placeholder="Buscar" />
        <div style="text-align:right"><button class="btn btn-sm">💾 Guardar</button></div>

        <div class="sel-head"><span class="muted">Has seleccionado</span><button class="btn btn-ghost btn-sm" (click)="limpiar()">↻ Borrar filtros</button></div>
        <div class="chips">
          @if (operacion() !== 'Todas') { <span class="chip" (click)="operacion.set('Todas')">{{ operacion() }} ✕</span> }
          @if (tipo() !== 'Todos') { <span class="chip" (click)="tipo.set('Todos')">{{ tipo() }} ✕</span> }
          @if (operacion() === 'Todas' && tipo() === 'Todos') { <span class="muted" style="font-size:12px">Sin filtros aplicados</span> }
        </div>

        <div class="grp"><label>Fecha ingreso desde</label><input type="date" /></div>
        <div class="grp"><label>Fecha ingreso hasta</label><input type="date" /></div>
        <div class="grp"><label>Tipo de documento</label>
          <select [value]="tipo()" (change)="tipo.set($any($event.target).value)"><option>Todos</option><option>Oficio</option><option>Circular</option><option>Adjunto</option><option>Antecedente</option></select>
        </div>
        <div class="grp"><label>Organización</label><select><option>Todas</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select></div>
        <div class="grp"><label>Tipo de operación</label>
          <select [value]="operacion()" (change)="operacion.set($any($event.target).value)"><option>Todas</option><option>Entrada</option><option>Salida</option></select>
        </div>
        <div class="grp"><label>Año</label><select><option>2026</option><option>2025</option></select></div>
        <div class="grp"><label>Tags</label><input placeholder="Seleccionar o buscar…" /></div>
      </aside>

      <div class="resultados">
        <div class="rcount muted">Se han encontrado <b>{{ resultados().length }}</b> resultados</div>
        @for (d of resultados(); track d.nombre) {
          <div class="rcard">
            <div class="rtop link" (click)="viewer.open(d.nombre)">{{ d.nombre }}</div>
            <div class="rgrid">
              <span><b>Materia:</b> {{ d.materia }}</span><span><b>Tipo:</b> {{ d.tipo }}</span><span><b>Autor:</b> {{ d.autor }}</span><span><b>Fecha ingreso:</b> {{ d.fechaIngreso }}</span>
              <span><b>N° Documento:</b> {{ d.nDoc }}</span><span><b>Año:</b> {{ d.anio }}</span><span><b>Origen:</b> {{ d.origen }}</span><span><b>Para:</b> {{ d.para }}</span>
              <span><b>Tipo de operación:</b> {{ d.operacion }}</span><span class="hist-cell"><b>Historial:</b> <button class="hist-btn" (click)="dochist.open(d.nombre)"><app-icon name="clock" [size]="16"/></button></span>
            </div>
          </div>
        }
        @if (!resultados().length) { <div class="placeholder">No hay documentos que coincidan.</div> }
      </div>
    </div>
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; }
    .sort { border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-family: inherit; }
    .layout { display: grid; grid-template-columns: 300px 1fr; gap: 18px; align-items: start; margin-top: 12px; }
    .filtros { display: flex; flex-direction: column; gap: 12px; }
    .buscar { border: 1px solid var(--border); border-radius: 999px; padding: 10px 16px; font-family: inherit; }
    .sel-head { display: flex; justify-content: space-between; align-items: center; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { background: var(--brand-primary); color: #fff; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .grp { display: flex; flex-direction: column; gap: 5px; }
    .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .grp input, .grp select { border: 1px solid var(--border); border-radius: 999px; padding: 9px 14px; font-family: inherit; font-size: 13px; }
    .resultados { display: flex; flex-direction: column; gap: 12px; }
    .rcount { text-align: right; }
    .rcard { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; box-shadow: var(--shadow); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
    .rcard:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--brand-primary); }
    .rtop { font-weight: 700; margin-bottom: 12px; }
    .rtop.link { color: var(--brand-primary); cursor: pointer; }
    .rtop.link:hover { text-decoration: underline; }
    .rgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px 24px; font-size: 13px; }
    .rgrid b { font-weight: 600; }
    @media (max-width: 1100px) { .rgrid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
    .hist-cell { display: inline-flex; align-items: center; gap: 6px; }
    .hist-btn { background: none; border: none; cursor: pointer; color: var(--brand-primary); display: inline-flex; padding: 0; }
  `],
})
export class BuscadorDocumentos {
  viewer = inject(DocViewer);
  dochist = inject(DocHistorial);
  organismos = organismos;
  texto = signal('');
  tipo = signal('Todos');
  operacion = signal('Todas');
  resultados = computed(() => {
    const t = this.texto().toLowerCase().trim();
    return documentosBusqueda.filter(d =>
      (this.tipo() === 'Todos' || d.tipo === this.tipo()) &&
      (this.operacion() === 'Todas' || d.operacion === this.operacion()) &&
      (!t || `${d.nombre} ${d.materia} ${d.autor}`.toLowerCase().includes(t)));
  });
  limpiar() { this.texto.set(''); this.tipo.set('Todos'); this.operacion.set('Todas'); }
}
