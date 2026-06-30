import { Component, signal } from '@angular/core';
import { Icon } from '../../shared/icon';

// Ingresar Expediente: selección de tipo (solo Expediente Documental activo) + wizard 3 pasos.
@Component({
  selector: 'app-ingreso-expediente',
  imports: [Icon],
  template: `
    @if (modo() === 'select') {
      <div class="card panel">
        <h1 class="page-title" style="margin-bottom:20px">Ingresar Expediente</h1>
        <div class="tipos">
          @for (t of tipos; track t.nombre) {
            <button class="tipo" [class.disabled]="!t.activo" [disabled]="!t.activo" (click)="elegir(t)">
              <span class="ic"><app-icon [name]="t.icon" [size]="26" /></span>
              <span class="t">{{ t.nombre }}</span>
            </button>
          }
        </div>
      </div>
    } @else {
      <div class="breadcrumb">Ingreso / Expediente Documental</div>

      <div class="card panel">
        <div class="stepper">
          @for (p of pasos; track p.label; let i = $index) {
            <div class="st" [class.on]="i + 1 <= step()" [class.cur]="i + 1 === step()">
              <span class="dot"><app-icon [name]="p.icon" [size]="20" /></span><span class="lab">{{ p.label }}</span>
            </div>
            @if (i < pasos.length - 1) { <span class="line" [class.on]="i + 1 < step()"></span> }
          }
        </div>

        @if (step() === 1) {
          <div class="hint-row"><span class="muted">Los campos marcados con asteriscos (*) son obligatorios.</span><button class="btn btn-sm"><app-icon name="refresh" [size]="14" /> Limpiar</button></div>
          <div class="centro">
            <div class="field nombre">
              <label>NOMBRE DEL EXPEDIENTE(*)</label>
              <div class="nombre-row"><input maxlength="255" placeholder="" /><label class="pub"><span class="tgl on"></span> Público</label></div>
              <small class="cnt">0/255</small>
            </div>
            <div class="field">
              <label style="text-align:center;display:block">DESCRIPCIÓN</label>
              <div class="editor">
                <div class="toolbar">
                  <b>B</b><i>I</i><u>U</u><s>S</s><span>&rdquo;</span><span>&lt;/&gt;</span><span>H1</span><span>H2</span>
                  <span>≔</span><span>•≔</span><span>x₂</span><span>x²</span><span>⇥</span><span>⇤</span><span>¶</span>
                  <span class="sel">Normal ▾</span><span class="sel">Normal ▾</span><span>A</span>
                </div>
                <textarea rows="7" placeholder="Descripción del expediente"></textarea>
                <small class="cnt">0/5000</small>
              </div>
            </div>
          </div>
        }

        @if (step() === 2) {
          <div class="hint-row"><span class="muted">Los campos marcados con asteriscos (*) son obligatorios.</span><button class="btn btn-sm"><app-icon name="refresh" [size]="14" /> Limpiar</button></div>
          <div class="form-grid g4">
            <div class="field"><label>RUT PARTICIPANTE(*)</label><input [value]="rut()" (input)="rut.set($any($event.target).value)" /><label class="chk"><input type="checkbox" /> Sin RUT</label></div>
            <div class="field"><label>TIPO PARTICIPANTE(*)</label><select [value]="tipoPart()" (change)="tipoPart.set($any($event.target).value)"><option>Seleccione una opción</option><option>Solicitante</option><option>Representante</option></select></div>
            <div class="field"><label>TIPO DE ACTOR RELACIONADO(*)</label><select [value]="actor()" (change)="actor.set($any($event.target).value)"><option>Seleccione una opción</option><option>Ciudadano</option><option>Funcionario</option></select></div>
            <div class="field"><label>TIPO DE PERSONA(*)</label>
              <div class="seg"><button class="s" [class.on]="persona() === 'Natural'" (click)="persona.set('Natural')">Natural</button><button class="s" [class.on]="persona() === 'Jurídica'" (click)="persona.set('Jurídica')">Jurídica</button></div>
            </div>
            <div class="field"><label>NOMBRES(*)</label><input [value]="nombres()" (input)="nombres.set($any($event.target).value)" /></div>
            <div class="field"><label>PRIMER APELLIDO(*)</label><input [value]="apellido()" (input)="apellido.set($any($event.target).value)" /></div>
            <div class="field"><label>SEGUNDO APELLIDO</label><input /></div>
            <div class="field"><label>CORREO ELECTRÓNICO</label><input [value]="correo()" (input)="correo.set($any($event.target).value)" /></div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn" (click)="agregar()"><app-icon name="plus" [size]="15" /> Agregar Participante</button></div>

          <div class="lista">
            <div class="lista-title">LISTA DE PARTICIPANTES AGREGADOS</div>
            <table class="data-table">
              <thead><tr><th>Tipo Participante</th><th>Tipo Actor Relacionado</th><th>RUT/Núm. documento</th><th>Nombre</th><th>Tipo Persona</th><th>Correo electrónico</th><th>Acciones</th></tr></thead>
              <tbody>
                @for (pt of participantes(); track $index) {
                  <tr><td>{{ pt.tipo }}</td><td>{{ pt.actor }}</td><td>{{ pt.rut }}</td><td>{{ pt.nombre }}</td><td>{{ pt.persona }}</td><td>{{ pt.correo }}</td>
                    <td class="acts"><app-icon name="edit" [size]="15" class="g" /><app-icon name="trash" [size]="15" class="r" (click)="quitar($index)" /></td></tr>
                }
                @if (!participantes().length) {
                  <tr><td colspan="7" class="vacio">No hay participantes agregados.</td></tr>
                }
              </tbody>
            </table>
            <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
          </div>
        }

        @if (step() === 3) {
          <div style="display:flex;justify-content:flex-end;margin-bottom:14px"><label class="chk"><span class="muted" style="letter-spacing:.04em">BAJO SILENCIO ADMINISTRATIVO</span> <input type="checkbox" /></label></div>
          <div class="adj">
            <div class="adj-head"><b>Documento principal</b><button class="btn btn-sm btn-ghost"><app-icon name="paperclip" [size]="14" /> ▾</button></div>
            <div class="adj-sub muted">Tamaño máximo: <app-icon name="file" [size]="14" /></div>
            <div class="adj-empty">La solicitud no contiene Documento principal</div>
          </div>
          <div class="adj">
            <div class="adj-head"><b>Anexos</b><button class="btn btn-sm btn-ghost"><app-icon name="paperclip" [size]="14" /> ▾</button></div>
            <div class="adj-sub muted">Tamaño máximo: <app-icon name="file" [size]="14" /></div>
            <div class="adj-empty">La solicitud no contiene Anexos</div>
          </div>
        }
      </div>

      <div class="foot">
        <button class="btn btn-ghost" (click)="prev()">‹ Anterior</button>
        @if (step() < 3) { <button class="btn" (click)="next()">Siguiente ›</button> }
        @else { <button class="btn btn-green" (click)="modo.set('select')">Finalizar <app-icon name="check" [size]="15" /></button> }
      </div>
    }
  `,
  styles: [`
    .tipos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
    @media (max-width: 1200px) { .tipos { grid-template-columns: repeat(2, 1fr); } }
    .tipo { border: 1px solid var(--border); border-radius: 12px; padding: 26px 16px; display: flex; flex-direction: column; align-items: center; gap: 14px; background: var(--surface); box-shadow: var(--shadow); }
    .tipo:not(.disabled):hover { border-color: var(--brand-primary); }
    .tipo.disabled { opacity: .5; cursor: not-allowed; }
    .tipo .ic { width: 56px; height: 56px; border-radius: 50%; background: #e8efee; color: #0f766e; display: grid; place-items: center; }
    .tipo .t { font-size: 14px; color: var(--text); }

    .stepper { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; }
    .st { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: .5; }
    .st.on { opacity: 1; }
    .st .dot { width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--brand-blue); color: var(--brand-blue); display: grid; place-items: center; background: var(--surface); }
    .st.cur .dot { background: var(--brand-blue); color: #fff; }
    .st .lab { font-size: 13px; font-weight: 700; }
    .line { flex: 1; max-width: 360px; height: 2px; background: var(--border); }
    .line.on { background: var(--brand-blue); }

    .hint-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 14px; margin-bottom: 18px; }
    .centro { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 22px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field > label { font-size: 12px; color: var(--text-muted); font-weight: 600; letter-spacing: .04em; }
    .field input, .field select { border: 1px solid var(--border); border-radius: 999px; padding: 10px 16px; font-family: inherit; font-size: 14px; }
    .nombre-row { display: flex; align-items: center; gap: 16px; }
    .nombre-row input { flex: 1; }
    .pub { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-muted); letter-spacing: .04em; }
    .cnt { align-self: flex-end; font-size: 11px; color: var(--text-muted); }
    .editor { border: 1px solid var(--border); border-radius: 8px; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 10px; padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 13px; align-items: center; }
    .toolbar .sel { border: 1px solid var(--border); border-radius: 5px; padding: 1px 6px; }
    .editor textarea { width: 100%; border: none; padding: 12px; font-family: inherit; resize: vertical; }
    .editor .cnt { display: block; padding: 0 12px 8px; text-align: right; }

    .form-grid.g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1100px) { .form-grid.g4 { grid-template-columns: repeat(2, 1fr); } }
    .chk { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
    .seg { display: flex; gap: 8px; }
    .seg .s { flex: 1; border: 1px solid var(--border); background: var(--surface); border-radius: 999px; padding: 9px; font-weight: 600; font-size: 13px; color: var(--text-muted); }
    .seg .s.on { background: var(--brand-blue); color: #fff; border-color: var(--brand-blue); }
    .lista { margin-top: 22px; border-top: 1px solid var(--border); padding-top: 16px; }
    .lista-title { text-align: center; font-size: 12px; font-weight: 700; color: var(--text-muted); letter-spacing: .05em; margin-bottom: 12px; }
    .acts { display: flex; gap: 12px; align-items: center; }
    .acts .g { color: #16a34a; cursor: pointer; } .acts .r { color: #dc2626; cursor: pointer; }
    .vacio { text-align: center; color: var(--text-muted); padding: 20px; }

    .adj { margin-bottom: 18px; }
    .adj-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--brand-blue); padding-bottom: 8px; }
    .adj-head b { font-size: 17px; }
    .adj-sub { font-size: 12px; display: flex; align-items: center; gap: 6px; margin: 10px 0; }
    .adj-empty { background: var(--surface-2); color: var(--text-muted); border-radius: 6px; padding: 14px 16px; font-size: 13px; }

    .foot { display: flex; justify-content: center; gap: 12px; margin-top: 22px; }
  `],
})
export class IngresoExpediente {
  modo = signal<'select' | 'wizard'>('select');
  step = signal(1);
  persona = signal<'Natural' | 'Jurídica'>('Natural');

  // Participantes (lista en espera, se agrega con el botón). Sin validación: Siguiente avanza igual.
  rut = signal('11.111.111-1');
  tipoPart = signal('Seleccione una opción');
  actor = signal('Seleccione una opción');
  nombres = signal('');
  apellido = signal('');
  correo = signal('');
  participantes = signal<{ tipo: string; actor: string; rut: string; nombre: string; persona: string; correo: string }[]>([]);
  agregar() {
    const nombre = `${this.nombres()} ${this.apellido()}`.trim() || '—';
    this.participantes.update(l => [...l, {
      tipo: this.tipoPart().startsWith('Seleccione') ? 'Solicitante' : this.tipoPart(),
      actor: this.actor().startsWith('Seleccione') ? 'Ciudadano' : this.actor(),
      rut: this.rut() || '—', nombre, persona: this.persona(), correo: this.correo() || '-',
    }]);
    this.nombres.set(''); this.apellido.set(''); this.correo.set('');
  }
  quitar(i: number) { this.participantes.update(l => l.filter((_, j) => j !== i)); }
  pasos = [
    { label: 'Datos del Expediente', icon: 'file' },
    { label: 'Participantes', icon: 'users' },
    { label: 'Adjuntar Documentos', icon: 'folder' },
  ];
  tipos = [
    { nombre: 'Expediente Documental', icon: 'file', activo: true },
  ];
  elegir(t: { activo: boolean }) { if (t.activo) { this.step.set(1); this.modo.set('wizard'); } }
  next() { if (this.step() < 3) this.step.set(this.step() + 1); }
  prev() { if (this.step() > 1) this.step.set(this.step() - 1); else this.modo.set('select'); }
}
