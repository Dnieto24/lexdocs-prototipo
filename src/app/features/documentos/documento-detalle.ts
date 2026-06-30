import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTable } from '../../shared/data-table';
import { documentoVersiones, versionColumns, documentoPermisos, permisoColumns } from '../../shared/mock-data';

@Component({
  selector: 'app-documento-detalle',
  imports: [DataTable, RouterLink],
  template: `
    <div class="breadcrumb"><a routerLink="/app/documentos">Documentos</a> / {{ nombre }}</div>
    <h1 class="page-title">{{ nombre }}</h1>
    <p class="page-sub">PDF · Propietario: admin · Última edición: 20-02-2026</p>

    <div class="tabs">
      @for (t of tabs; track t) {
        <button class="tab" [class.active]="t === tab()" (click)="tab.set(t)">{{ t }}</button>
      }
    </div>

    <div class="card">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center">
        <b>{{ tab() }}</b>
        @if (tab() === 'Permisos') { <button class="btn btn-green btn-sm">Otorgar permiso</button> }
      </div>
      @switch (tab()) {
        @case ('Versiones') { <app-data-table [columns]="verCols" [rows]="versiones" /> }
        @case ('Permisos') { <app-data-table [columns]="permCols" [rows]="permisos" /> }
      }
    </div>
  `,
})
export class DocumentoDetalle {
  nombre = inject(ActivatedRoute).snapshot.paramMap.get('nombre') ?? 'documento.pdf';
  tabs = ['Versiones', 'Permisos'];
  tab = signal('Versiones');
  verCols = versionColumns;
  versiones = documentoVersiones;
  permCols = permisoColumns;
  permisos = documentoPermisos;
}
