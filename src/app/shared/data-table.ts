import { Component, computed, input, output, signal, HostListener } from '@angular/core';
import { Column } from './mock-data';
import { Icon } from './icon';

// ponytail: una sola tabla genérica reutilizada por todos los listados.
@Component({
  selector: 'app-data-table',
  imports: [Icon],
  template: `
    <table class="data-table">
      <thead>
        <tr>
          @if (select()) { <th class="sel-col"><input type="checkbox" [checked]="allChecked()" (change)="toggleAll($any($event.target).checked)" /></th> }
          @for (c of columns(); track c.key) { <th>{{ c.label }}</th> }
          @if (actions() || iconActions().length) { <th></th> }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track $index; let ri = $index) {
          <tr>
            @if (select()) { <td class="sel-col"><input type="checkbox" [checked]="selected().has(ri)" (change)="toggleRow(ri)" /></td> }
            @for (c of columns(); track c.key) {
              <td>
                @switch (c.type) {
                  @case ('badge') { <span class="badge" [class]="badgeClass(row[c.key])">{{ row[c.key] }}</span> }
                  @case ('toggle') { <span class="tgl" [class.on]="isOn(row[c.key])"></span> }
                  @case ('chips') {
                    @for (g of asArray(row[c.key]); track g) { <span class="chip-tag">{{ g }}</span> }
                    @if (!asArray(row[c.key]).length) { <span class="muted">—</span> }
                  }
                  @case ('file') {
                    <span class="cell-file">
                      <app-icon [name]="row[c.iconKey || 'icon'] || 'file'" [size]="16" [class.folder]="(row[c.iconKey || 'icon'] || 'file') === 'folder'" />
                      {{ row[c.key] }}
                    </span>
                  }
                  @case ('edit') { <button class="iconbtn" type="button"><app-icon name="edit" [size]="16" /></button> }
                  @case ('icon') { <button class="iconbtn" type="button" (click)="cellAction.emit({ key: c.key, index: ri }); $event.stopPropagation()"><app-icon [name]="c.icon || 'file'" [size]="18" /></button> }
                  @default { {{ row[c.key] }} }
                }
              </td>
            }
            @if (actions() || iconActions().length) {
              <td class="actions">
                @if (iconActions().length) {
                  @for (ic of iconActions(); track $index) { <button class="iconbtn" type="button" [class.danger]="ic === 'trash'"><app-icon [name]="ic" [size]="16" /></button> }
                } @else {
                  <button class="dots" type="button" (click)="toggle(ri, $event)"><app-icon name="more-horizontal" [size]="18" /></button>
                  @if (open() === ri) {
                    <div class="row-menu">
                      @for (a of menu(); track a) {
                        <button [class.danger]="a === 'Eliminar'" (click)="pick(a, ri, $event)">
                          @if (menuIcons()[a]; as ic) { <app-icon [name]="ic" [size]="15" /> }
                          {{ a }}
                        </button>
                      }
                    </div>
                  }
                }
              </td>
            }
          </tr>
        }
        @if (!rows().length) {
          <tr class="empty-row">
            <td [attr.colspan]="colspan()">
              <div class="empty-state"><app-icon name="inbox" [size]="28" /><span>Sin resultados</span></div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .empty-row td { padding: 40px 16px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--text-muted); }
    .cell-file { display: inline-flex; align-items: center; gap: 9px; }
    .cell-file app-icon { color: var(--brand-blue); }
    .cell-file app-icon.folder { color: var(--brand-orange); }
  `],
})
export class DataTable {
  columns = input<Column[]>([]);
  rows = input<Record<string, any>[]>([]);
  select = input(false);
  actions = input(true);
  iconActions = input<string[]>([]);
  menu = input<string[]>(['Ver detalle', 'Editar', 'Eliminar']);
  menuIcons = input<Record<string, string>>({});
  cellAction = output<{ key: string; index: number }>();
  menuAction = output<{ action: string; index: number }>();

  open = signal<number | null>(null);
  selected = signal<Set<number>>(new Set());
  colspan = computed(() => this.columns().length + (this.select() ? 1 : 0) + (this.actions() || this.iconActions().length ? 1 : 0));
  allChecked = computed(() => this.rows().length > 0 && this.selected().size === this.rows().length);
  toggleAll(on: boolean) { this.selected.set(on ? new Set(this.rows().map((_, i) => i)) : new Set()); }
  toggleRow(i: number) {
    const s = new Set(this.selected());
    s.has(i) ? s.delete(i) : s.add(i);
    this.selected.set(s);
  }

  toggle(i: number, e: Event) {
    e.stopPropagation();
    this.open.set(this.open() === i ? null : i);
  }
  pick(action: string, index: number, e: Event) {
    e.stopPropagation();
    this.open.set(null);
    this.menuAction.emit({ action, index });
  }
  @HostListener('document:click') close() { this.open.set(null); }

  isOn(v: any): boolean { return v === true || /^(s[ií]|activo|habilitado|on)$/i.test(String(v)); }
  asArray(v: any): string[] { return Array.isArray(v) ? v : []; }

  badgeClass(v: string): string {
    const s = (v || '').toLowerCase();
    if (s.includes('termin') || s.includes('aprob') || s.includes('firmad') || s.includes('valid') || s.includes('despach') || s === 'activo' || s === 'sí') return 'badge-green';
    if (s.includes('observ') || s.includes('pendiente') || s.includes('sin asign') || s === 'borrador' || s === 'cargado') return 'badge-orange';
    if (s.includes('rechaz') || s.includes('fallid') || s === 'inactivo') return 'badge-red';
    if (s.includes('revis') || s.includes('en curso') || s.includes('proces') || s.includes('deriv') || s === 'documento') return 'badge-blue';
    if (s === 'expediente') return 'badge-purple';
    return '';
  }
}
