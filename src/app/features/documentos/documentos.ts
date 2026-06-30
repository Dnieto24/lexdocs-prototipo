import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { documentos, documentoColumns } from '../../shared/mock-data';

@Component({
  selector: 'app-documentos',
  imports: [DataTable, Icon],
  template: `
    <h1 class="page-title">Documentos</h1>
    <p class="page-sub">Repositorio documental. Organiza carpetas y archivos por expediente.</p>

    <div class="layout">
      <aside class="card panel tree">
        <div class="root"><app-icon name="folder-open" [size]="16" /> LexDocs</div>
        <ul>
          <li><app-icon name="folder" [size]="15" /> Plantillas</li>
          <li><app-icon name="folder" [size]="15" /> Proyectos</li>
          <li><app-icon name="folder" [size]="15" /> Solicitudes</li>
          <li><app-icon name="folder" [size]="15" /> Resoluciones</li>
          <li><app-icon name="folder" [size]="15" /> Oficios</li>
        </ul>
      </aside>

      <div class="card">
        <div class="panel head">
          <b class="crumb"><app-icon name="home" [size]="15" /> LexDocs</b>
          <div class="acts">
            <button class="btn btn-green btn-sm"><app-icon name="share" [size]="14" /> Compartir</button>
            <button class="btn btn-sm"><app-icon name="plus" [size]="14" /> Nuevo</button>
          </div>
        </div>
        <div (click)="abrir($event)"><app-data-table [columns]="cols" [rows]="rows" /></div>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: grid; grid-template-columns: 260px 1fr; gap: 18px; align-items: start; }
    .tree .root { font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; color: var(--brand-primary); }
    .tree ul { list-style: none; padding-left: 6px; margin: 0; }
    .tree li { padding: 8px 8px; color: var(--text); cursor: pointer; border-radius: 7px; display: flex; align-items: center; gap: 8px; }
    .tree li app-icon { color: var(--brand-orange); }
    .crumb { display: inline-flex; align-items: center; gap: 8px; }
    .tree li:hover { background: var(--surface-2); }
    .head { display: flex; justify-content: space-between; align-items: center; }
    .acts { display: flex; gap: 10px; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  `],
})
export class Documentos {
  cols = documentoColumns;
  rows = documentos;
  private router = inject(Router);
  // Solo los PDF abren detalle (versiones/permisos); las carpetas no.
  abrir(e: MouseEvent) {
    const cell = (e.target as HTMLElement).closest('tbody tr')?.querySelector('td');
    const txt = cell?.textContent?.trim() ?? '';
    if (!txt.includes('.pdf')) return;
    const nombre = txt.substring(txt.indexOf(' ') + 1);
    this.router.navigate(['/app', 'documentos', nombre]);
  }
}
