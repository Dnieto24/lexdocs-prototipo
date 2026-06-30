import { Component, inject, Injectable, signal, computed } from '@angular/core';
import { Icon } from './icon';

// Historial del documento (forma MINVU, skin LexDocs). Overlay global controlado por DocHistorial.
// Usado desde el buscador de documentos y los paneles de revisión. Datos ficticios.

@Injectable({ providedIn: 'root' })
export class DocHistorial {
  nombre = signal<string | null>(null);
  open(nombre: string) { this.nombre.set(nombre.replace(/^[^\w]+/, '').trim()); }
  close() { this.nombre.set(null); }
}

@Component({
  selector: 'app-doc-historial',
  imports: [Icon],
  template: `
    @if (hist.nombre(); as nom) {
      <div class="md-overlay" (click)="hist.close()">
        <div class="md" (click)="$event.stopPropagation()">
          <div class="md-head"><h3>Historial del documento</h3><button class="md-x" (click)="hist.close()"><app-icon name="x" [size]="14" /></button></div>
          <div class="hfilters">
            <div class="grp"><label>Tipo de acción</label><select><option>Todas</option><option>Abrir documento</option><option>Abrir historial</option><option>Ingreso documento</option></select></div>
            <div class="grp"><label>Fecha desde</label><input type="date" /></div>
            <div class="grp"><label>Fecha hasta</label><input type="date" /></div>
            <button class="btn btn-sm">Limpiar</button>
            <button class="btn btn-sm">Buscar</button>
            <button class="btn btn-sm exp"><app-icon name="download" [size]="14" /> Exportar</button>
          </div>
          <table class="data-table">
            <thead><tr><th>Usuario</th><th>Acción</th><th>Detalle</th><th>Expediente</th><th>Fecha ingreso</th></tr></thead>
            <tbody>
              @for (h of filas(); track $index) {
                <tr><td>{{ h.usuario }}</td><td>{{ h.accion }}</td><td>{{ h.detalle }}</td><td>{{ h.expediente }}</td><td>{{ h.fecha }}</td></tr>
              }
            </tbody>
          </table>
          <div style="text-align:right;margin-top:16px"><button class="btn btn-green" (click)="hist.close()">Cerrar</button></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .md-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1100; display: grid; place-items: center; }
    .md { background: var(--surface); border-radius: 12px; padding: 22px 26px; width: min(1100px, 94vw); max-height: 90vh; overflow: auto; box-shadow: var(--shadow-lg); }
    .md-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .md-head h3 { margin: 0; }
    .md-x { background: var(--brand-blue, #2563EB); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; }
    .hfilters { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 16px; }
    .hfilters .exp { margin-left: auto; }
    .hfilters .grp { display: flex; flex-direction: column; gap: 5px; }
    .hfilters .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .hfilters .grp input, .hfilters .grp select { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 13px; }
  `],
})
export class DocHistorialComponent {
  hist = inject(DocHistorial);
  filas = computed(() => {
    const n = this.hist.nombre() ?? '';
    const exp = '2026-00094-S-000001';
    return [
      { usuario: 'Juan Pérez', accion: 'Abrir documento', detalle: 'Se ha abierto el archivo para su visualización', expediente: exp, fecha: '30-06-2026 12:20:30' },
      { usuario: 'Juan Pérez', accion: 'Abrir documento', detalle: 'Se ha abierto el archivo para su visualización', expediente: exp, fecha: '30-06-2026 12:06:56' },
      { usuario: 'Juan Pérez', accion: 'Abrir historial', detalle: `Abrió el historial del documento ${n}`, expediente: exp, fecha: '30-06-2026 12:06:28' },
      { usuario: 'Juan Pérez', accion: 'Abrir documento', detalle: 'Se ha abierto el archivo para su visualización', expediente: exp, fecha: '30-06-2026 12:05:42' },
      { usuario: 'Juan Pérez', accion: 'Documento actualizado.', detalle: '-', expediente: exp, fecha: '19-06-2026 10:06:59' },
      { usuario: 'Juan Pérez', accion: 'Documento derivado', detalle: 'Se ha derivado el documento a admin', expediente: exp, fecha: '19-06-2026 10:06:21' },
      { usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: 'Se ha subido el documento.', expediente: exp, fecha: '19-06-2026 10:05:29' },
      { usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: 'Se ha subido el documento.', expediente: exp, fecha: '19-06-2026 10:04:50' },
    ];
  });
}
