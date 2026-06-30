import { Component, computed, inject, signal } from '@angular/core';
import { documentosBusqueda, organismos } from '../../shared/mock-data';
import { DocViewer } from '../../shared/doc-viewer';
import { DocHistorial } from '../../shared/doc-historial';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-buscador-documentos',
  imports: [Icon],
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Buscador de Documentos</h1>
        <p class="ph-sub">Filtra y encuentra documentos por tipo, organización o período.</p>
      </div>
      <div class="ph-actions">
        <select class="sort-sel"><option>Más relevante</option><option>Más reciente</option><option>Más antiguo</option></select>
      </div>
    </div>

    <div class="layout">
      <aside class="card filtros">
        <div class="filtros-hd">
          <span class="filtros-title">Filtros</span>
          <button class="btn-clear-all" (click)="limpiar()"><app-icon name="refresh" [size]="12"/> Limpiar</button>
        </div>

        <div class="search-wrap">
          <app-icon name="search" [size]="15" class="search-ic"/>
          <input class="buscar" [value]="texto()" (input)="texto.set($any($event.target).value)" placeholder="Buscar por nombre, materia…" />
        </div>

        @if (operacion() !== 'Todas' || tipo() !== 'Todos') {
          <div class="chips-wrap">
            @if (tipo() !== 'Todos') { <span class="chip" (click)="tipo.set('Todos')">{{ tipo() }} ✕</span> }
            @if (operacion() !== 'Todas') { <span class="chip" (click)="operacion.set('Todas')">{{ operacion() }} ✕</span> }
          </div>
        }

        <div class="filtros-body">
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
          <button class="btn btn-sm" style="width:100%;justify-content:center">💾 Guardar búsqueda</button>
        </div>
      </aside>

      <div class="resultados">
        <div class="r-header">
          <span class="r-count"><b>{{ resultados().length }}</b> documentos encontrados</span>
        </div>

        @for (d of resultados(); track d.nombre) {
          <div class="rcard">
            <div class="rcard-top">
              <div class="rcard-file">
                <span class="file-icon">📄</span>
                <button class="rcard-name" (click)="viewer.open(d.nombre)">{{ d.nombre }}</button>
              </div>
              <div class="rcard-badges">
                <span class="badge badge-blue">{{ d.tipo }}</span>
                <span class="badge" [class]="d.operacion === 'Entrada' ? 'badge-green' : 'badge-orange'">{{ d.operacion }}</span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Materia</span>
                <span class="meta-value">{{ d.materia }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Autor</span>
                <span class="meta-value">{{ d.autor }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Fecha ingreso</span>
                <span class="meta-value">{{ d.fechaIngreso }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">N° Documento</span>
                <span class="meta-value">{{ d.nDoc }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Año</span>
                <span class="meta-value">{{ d.anio }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Origen</span>
                <span class="meta-value">{{ d.origen }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Para</span>
                <span class="meta-value">{{ d.para }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Historial</span>
                <button class="hist-btn" (click)="dochist.open(d.nombre)"><app-icon name="clock" [size]="14"/> Ver historial</button>
              </div>
            </div>
          </div>
        }
        @if (!resultados().length) { <div class="placeholder">No hay documentos que coincidan con los filtros aplicados.</div> }
      </div>
    </div>
  `,
  styles: [`
    .layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }

    .sort-sel { border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; font-family: inherit; font-size: 13px; color: var(--text); background: var(--surface); }

    /* Sidebar */
    .filtros { display: flex; flex-direction: column; gap: 0; padding: 0; overflow: hidden; }
    .filtros-hd { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
    .filtros-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); }
    .btn-clear-all { background: none; border: none; font-size: 11px; color: var(--brand-primary); font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }

    .search-wrap { position: relative; padding: 12px 12px 8px; }
    .search-ic { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; margin-top: 2px; }
    .buscar { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px 9px 36px; font-family: inherit; font-size: 13px; background: var(--surface); transition: border-color .15s, box-shadow .15s; }
    .buscar:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }

    .chips-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 12px 8px; }
    .chip { background: color-mix(in srgb, var(--brand-primary) 12%, transparent); color: var(--brand-primary); border: 1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent); border-radius: 999px; padding: 3px 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background .15s; }
    .chip:hover { background: color-mix(in srgb, var(--brand-primary) 20%, transparent); }

    .filtros-body { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
    .grp { display: flex; flex-direction: column; gap: 5px; }
    .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .grp input, .grp select { border: 1px solid var(--border); border-radius: 7px; padding: 8px 10px; font-family: inherit; font-size: 13px; width: 100%; background: var(--surface); color: var(--text); transition: border-color .15s, box-shadow .15s; }
    .grp input:focus, .grp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }

    /* Resultados */
    .resultados { display: flex; flex-direction: column; gap: 12px; }
    .r-header { display: flex; align-items: center; justify-content: space-between; padding: 2px 0 6px; }
    .r-count { font-size: 13px; color: var(--text-muted); }
    .r-count b { color: var(--text); }

    /* Result card */
    .rcard { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; transition: box-shadow .2s, transform .2s, border-color .2s; }
    .rcard:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); border-color: color-mix(in srgb, var(--brand-primary) 40%, transparent); }

    .rcard-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
    .rcard-file { display: flex; align-items: center; gap: 10px; }
    .file-icon { font-size: 20px; flex-shrink: 0; }
    .rcard-name { background: none; border: none; font-size: 15px; font-weight: 700; color: var(--brand-primary); cursor: pointer; font-family: inherit; padding: 0; text-align: left; }
    .rcard-name:hover { text-decoration: underline; }
    .rcard-badges { display: flex; gap: 6px; flex-shrink: 0; }

    /* Metadata grid */
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px 20px; padding-top: 12px; border-top: 1px solid var(--border); }
    @media (max-width: 1200px) { .meta-grid { grid-template-columns: repeat(3, 1fr); } }
    .meta-item { display: flex; flex-direction: column; gap: 3px; }
    .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-weight: 700; }
    .meta-value { font-size: 13px; color: var(--text); }
    .hist-btn { background: none; border: none; cursor: pointer; color: var(--brand-primary); font-size: 12px; font-weight: 600; padding: 0; font-family: inherit; display: flex; align-items: center; gap: 4px; }
    .hist-btn:hover { text-decoration: underline; }
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
