import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { expedientes, organismos, procedimientos } from '../../shared/mock-data';

@Component({
  selector: 'app-buscador',
  template: `
    <h1 class="page-title">Buscador de expedientes</h1>

    <div class="layout">
      <aside class="card panel filtros">
        <input class="buscar" [value]="texto()" (input)="texto.set($any($event.target).value)" placeholder="Buscar" />

        <div class="sel-head"><span class="muted">Has seleccionado</span><button class="btn btn-ghost btn-sm" (click)="limpiar()">↻ Borrar filtros</button></div>
        <div class="chips">
          @if (org() !== 'Todos') { <span class="chip" (click)="org.set('Todos')">{{ org() }} ✕</span> }
          @if (proc() !== 'Todos') { <span class="chip" (click)="proc.set('Todos')">{{ proc() }} ✕</span> }
          @if (estado() !== 'Todos') { <span class="chip" (click)="estado.set('Todos')">{{ estado() }} ✕</span> }
          @if (org() === 'Todos' && proc() === 'Todos' && estado() === 'Todos') { <span class="muted" style="font-size:12px">Sin filtros aplicados</span> }
        </div>

        <div class="grp"><label>Fecha ingreso desde</label><input type="date" /></div>
        <div class="grp"><label>Fecha ingreso hasta</label><input type="date" /></div>
        <div class="grp"><label>Organización</label>
          <select [value]="org()" (change)="org.set($any($event.target).value)"><option>Todos</option>@for (o of organismos; track o) { <option>{{ o }}</option> }</select>
        </div>
        <div class="grp"><label>Procedimiento</label>
          <select [value]="proc()" (change)="proc.set($any($event.target).value)"><option>Todos</option>@for (p of procedimientos; track p) { <option>{{ p }}</option> }</select>
        </div>
        <div class="grp"><label>Estado</label>
          <select [value]="estado()" (change)="estado.set($any($event.target).value)"><option>Todos</option><option>En trámite</option><option>Terminado</option><option>Observado</option><option>Rechazado</option></select>
        </div>
      </aside>

      <div class="resultados">
        <div class="rcount muted">Se han encontrado <b>{{ resultados().length }}</b> resultados</div>
        @for (e of resultados(); track e.folio) {
          <div class="rcard" (click)="abrir(e.folio)">
            <div class="rtop"><b>{{ e.folio }}</b></div>
            <div class="rrow">
              <span><span class="muted">Procedimiento:</span> {{ e.procedimiento }}</span>
              <span><span class="muted">Fecha ingreso:</span> {{ e.fechaIngreso }}</span>
              <span><span class="muted">Estado:</span> <span class="badge" [class]="badge(e.estado)">{{ e.estado }}</span></span>
            </div>
          </div>
        }
        @if (!resultados().length) { <div class="placeholder">No hay expedientes que coincidan con los filtros.</div> }
      </div>
    </div>
  `,
  styles: [`
    .layout { display: grid; grid-template-columns: 300px 1fr; gap: 18px; align-items: start; }
    .filtros { display: flex; flex-direction: column; gap: 14px; }
    .buscar { border: 1px solid var(--border); border-radius: var(--radius-input); padding: 10px 16px; font-family: inherit; transition: border-color .15s var(--ease), box-shadow .15s var(--ease); }
    .buscar:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .sel-head { display: flex; justify-content: space-between; align-items: center; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; min-height: 8px; }
    .chip { background: var(--brand-primary); color: #fff; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .grp { display: flex; flex-direction: column; gap: 5px; }
    .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .grp input, .grp select { border: 1px solid var(--border); border-radius: var(--radius-input); padding: 9px 14px; font-family: inherit; font-size: 13px; transition: border-color .15s var(--ease), box-shadow .15s var(--ease); }
    .grp input:focus, .grp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .resultados { display: flex; flex-direction: column; gap: 12px; }
    .rcount { text-align: right; }
    .rcard { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; cursor: pointer; box-shadow: var(--shadow); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
    .rcard:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--brand-primary); }
    .rtop { font-size: 15px; margin-bottom: 10px; }
    .rrow { display: flex; gap: 40px; flex-wrap: wrap; font-size: 13px; align-items: center; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
  `],
})
export class Buscador {
  organismos = organismos;
  procedimientos = procedimientos;
  texto = signal('');
  org = signal('Todos');
  proc = signal('Todos');
  estado = signal('Todos');
  private router = inject(Router);

  resultados = computed(() => {
    const t = this.texto().toLowerCase().trim();
    return expedientes.filter(e =>
      (this.org() === 'Todos' || e.organismo === this.org()) &&
      (this.proc() === 'Todos' || e.procedimiento === this.proc()) &&
      (this.estado() === 'Todos' || e.estado === this.estado()) &&
      (!t || `${e.folio} ${e.organismo} ${e.responsable} ${e.etapa}`.toLowerCase().includes(t)));
  });

  badge(s: string) {
    const x = s.toLowerCase();
    if (x.includes('termin')) return 'badge-green';
    if (x.includes('observ')) return 'badge-orange';
    if (x.includes('rechaz')) return 'badge-red';
    return '';
  }
  limpiar() { this.texto.set(''); this.org.set('Todos'); this.proc.set('Todos'); this.estado.set('Todos'); }
  abrir(folio: string) { this.router.navigate(['/app', 'expedientes', folio]); }
}
