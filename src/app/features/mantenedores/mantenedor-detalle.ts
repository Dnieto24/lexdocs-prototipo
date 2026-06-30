import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataTable } from '../../shared/data-table';
import { Icon } from '../../shared/icon';
import { mantenedorData, MantDef } from '../../shared/mock-data';

// Una pantalla por mantenedor (forma MINVU, skin LexDocs), parametrizada por :tipo.
@Component({
  selector: 'app-mantenedor-detalle',
  imports: [DataTable, RouterLink, Icon],
  template: `
    <div class="breadcrumb"><a routerLink="/app/mantenedores">Mantenedores</a> / {{ data().titulo }}</div>
    <h1 class="page-title">{{ data().titulo }}</h1>
    @if (data().meta) { <p class="page-sub">{{ data().meta }}</p> }

    @if (data().general; as g) {
      <div class="card panel general">
        <span class="g-label">{{ g.label }}</span>
        <span class="g-text">{{ g.texto }}</span>
        <button class="iconbtn"><app-icon name="edit" [size]="16" /></button>
      </div>
    }

    <div class="card panel filtros-card">
      <div class="filtros">
        @for (f of data().filtros; track f.label) {
          @if (f.type === 'checkbox') {
            <label class="chk"><input type="checkbox" /> {{ f.label }}</label>
          } @else {
            <div class="field">
              <label>{{ f.label }}</label>
              @if (f.type === 'select') {
                <select>@for (o of f.options; track o) { <option>{{ o }}</option> }</select>
              } @else {
                <input [placeholder]="f.placeholder || ''" (input)="onSearch($index, $any($event.target).value)" />
              }
            </div>
          }
        }
      </div>
      <div class="acciones">
        @for (a of data().acciones; track a) {
          <button class="btn btn-sm" [class.btn-ghost]="a === 'Limpiar'" (click)="a === 'Limpiar' ? q.set('') : null">{{ a }}</button>
        }
      </div>
    </div>

    <div class="card">
      @if (data().itemsPorPagina) {
        <div class="ipp"><span class="muted">Items por página:</span>
          <select><option>10</option><option>25</option><option>50</option></select>
        </div>
      }
      <app-data-table [columns]="data().columns" [rows]="filtrados()"
        [actions]="data().actions ?? true" [iconActions]="data().iconActions || []" />
      <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>2</span><span>3</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
    </div>
  `,
  styles: [`
    .general { display: flex; align-items: center; gap: 24px; margin-bottom: 16px; }
    .general .g-label { color: var(--brand-primary); font-weight: 700; font-size: 13px; }
    .general .g-text { flex: 1; color: var(--text-muted); }
    .filtros-card { display: flex; justify-content: space-between; align-items: flex-end; gap: 18px; flex-wrap: wrap; margin-bottom: 20px; }
    .filtros { display: flex; gap: 16px; flex-wrap: wrap; flex: 1; align-items: flex-end; }
    .field { display: flex; flex-direction: column; gap: 5px; min-width: 180px; }
    .field label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .field input, .field select { border: 1px solid var(--border); border-radius: 999px; padding: 9px 14px; font-family: inherit; font-size: 13px; }
    .chk { display: flex; align-items: center; gap: 8px; font-size: 13px; padding-bottom: 10px; }
    .acciones { display: flex; gap: 8px; flex-wrap: wrap; }
    .ipp { display: flex; justify-content: flex-end; align-items: center; gap: 8px; padding: 12px 16px 0; font-size: 13px; }
    .ipp select { border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; font-family: inherit; }
  `],
})
export class MantenedorDetalle {
  private params = toSignal(inject(ActivatedRoute).paramMap);
  private fallback: MantDef = { titulo: 'Mantenedor', filtros: [], acciones: [], columns: [], rows: [] };
  data = computed(() => mantenedorData[this.params()?.get('tipo') ?? ''] ?? this.fallback);

  q = signal('');
  private firstInput = computed(() => this.data().filtros.findIndex(f => f.type === 'input'));
  onSearch(i: number, v: string) { if (i === this.firstInput()) this.q.set(v); }

  filtrados = computed(() => {
    const t = this.q().toLowerCase().trim();
    if (!t) return this.data().rows;
    return this.data().rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(t)));
  });
}
