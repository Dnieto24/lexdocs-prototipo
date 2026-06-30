import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { expedientes, organismos, procedimientos } from '../../shared/mock-data';

@Component({
  selector: 'app-buscador',
  template: `
    <div class="ph">
      <div class="ph-left">
        <h1 class="ph-title">Buscador de Expedientes</h1>
        <p class="ph-sub">Filtra y encuentra expedientes por organismo, procedimiento o estado.</p>
      </div>
    </div>

    <div class="layout">
      <aside class="card panel filtros">
        <div class="filtros-header">
          <span class="filtros-title">Filtros</span>
          <button class="btn btn-ghost btn-sm" (click)="limpiar()">↻ Borrar filtros</button>
        </div>
        <div class="filtros-divider"></div>

        <div class="buscar-wrap">
          <span class="buscar-icon">🔍</span>
          <input class="buscar" [value]="texto()" (input)="texto.set($any($event.target).value)" placeholder="Buscar expediente..." />
        </div>

        <div class="sel-head"><span class="muted">Has seleccionado</span></div>
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
        <div class="results-header-row">
          <span class="results-label">Resultados</span>
          <span class="results-count-badge">{{ resultados().length }}</span>
          <span class="results-found-text">expedientes encontrados</span>
        </div>

        @for (e of resultados(); track e.folio) {
          <div class="rcard" (click)="abrir(e.folio)">
            <div class="rcard-top">
              <span class="folio-pill">{{ e.folio }}</span>
              <span class="badge" [class]="badge(e.estado)">{{ e.estado }}</span>
            </div>
            <div class="rcard-body">
              <div class="rcard-field">
                <span class="rcard-label">Procedimiento</span>
                <span class="rcard-value rcard-proc">{{ e.procedimiento }}</span>
              </div>
              <div class="rcard-field">
                <span class="rcard-label">Fecha ingreso</span>
                <span class="rcard-value">{{ e.fechaIngreso }}</span>
              </div>
            </div>
            <div class="rcard-footer">
              <a class="rcard-open" (click)="$event.stopPropagation(); abrir(e.folio)">Abrir expediente →</a>
            </div>
          </div>
        }
        @if (!resultados().length) { <div class="placeholder">No hay expedientes que coincidan con los filtros.</div> }
      </div>
    </div>
  `,
  styles: [`
    /* ── Page header ── */
    .ph { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .ph-left { display: flex; flex-direction: column; gap: 4px; }
    .ph-title { font-size: 22px; font-weight: 700; color: var(--text); margin: 0; }
    .ph-sub { font-size: 13px; color: var(--text-muted); margin: 0; }

    /* ── Layout ── */
    .layout { display: grid; grid-template-columns: 280px 1fr; gap: 18px; align-items: start; }

    /* ── Aside / Filtros ── */
    .filtros { display: flex; flex-direction: column; gap: 14px; }
    .filtros-header { display: flex; justify-content: space-between; align-items: center; }
    .filtros-title { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: .01em; }
    .filtros-divider { height: 1px; background: var(--border); margin: 0 -4px; }

    /* ── Search input with icon ── */
    .buscar-wrap { position: relative; display: flex; align-items: center; }
    .buscar-icon { position: absolute; left: 10px; font-size: 14px; pointer-events: none; line-height: 1; }
    .buscar { width: 100%; box-sizing: border-box; border: 1px solid var(--border); border-radius: 8px; padding: 10px 16px 10px 36px; font-family: inherit; font-size: 13px; transition: border-color .15s var(--ease), box-shadow .15s var(--ease); }
    .buscar:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }

    .sel-head { display: flex; justify-content: space-between; align-items: center; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; min-height: 8px; }
    .chip { background: var(--brand-primary); color: #fff; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }

    .grp { display: flex; flex-direction: column; gap: 5px; }
    .grp label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .grp input, .grp select { border: 1px solid var(--border); border-radius: var(--radius-input); padding: 9px 14px; font-family: inherit; font-size: 13px; transition: border-color .15s var(--ease), box-shadow .15s var(--ease); }
    .grp input:focus, .grp select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }

    /* ── Results area ── */
    .resultados { display: flex; flex-direction: column; gap: 12px; }

    .results-header-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .results-label { font-size: 14px; font-weight: 700; color: var(--text); }
    .results-count-badge { background: var(--brand-primary); color: #fff; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
    .results-found-text { font-size: 13px; color: var(--text-muted); }

    /* ── Result cards ── */
    .rcard {
      background: var(--surface);
      border: 1px solid var(--border);
      border-left: 3px solid var(--brand-primary);
      border-radius: 12px;
      padding: 16px 20px;
      cursor: pointer;
      box-shadow: var(--shadow);
      transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .rcard:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--brand-primary); }

    .rcard-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .folio-pill { background: var(--brand-primary); color: #fff; border-radius: 999px; padding: 3px 14px; font-size: 12px; font-weight: 700; letter-spacing: .03em; }

    .rcard-body { display: flex; gap: 32px; flex-wrap: wrap; }
    .rcard-field { display: flex; flex-direction: column; gap: 2px; }
    .rcard-label { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); font-weight: 600; }
    .rcard-value { font-size: 13px; color: var(--text); }
    .rcard-proc { font-weight: 600; font-size: 14px; }

    .rcard-footer { display: flex; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 10px; margin-top: 2px; }
    .rcard-open { font-size: 13px; font-weight: 600; color: var(--brand-primary); cursor: pointer; text-decoration: none; }
    .rcard-open:hover { text-decoration: underline; }

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
