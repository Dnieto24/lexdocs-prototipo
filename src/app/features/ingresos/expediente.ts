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
      <div class="wiz-header">
        <div class="wiz-breadcrumb"><span class="bc-link">Ingresos</span><span class="bc-sep">›</span><span class="bc-cur">Expediente Documental</span></div>
        <div class="wiz-title-row">
          <div>
            <h1 class="wiz-title">Nuevo Expediente Documental</h1>
            <p class="wiz-sub">Complete los campos requeridos para registrar el expediente en el sistema.</p>
          </div>
          <div class="step-badge">Paso {{ step() }} de {{ pasos.length }}</div>
        </div>
      </div>

      <div class="card wiz-card">
        <div class="stepper">
          @for (p of pasos; track p.label; let i = $index) {
            <div class="st" [class.done]="i + 1 < step()" [class.on]="i + 1 <= step()" [class.cur]="i + 1 === step()">
              <span class="dot">
                @if (i + 1 < step()) { <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> }
                @else { {{ i + 1 }} }
              </span>
              <span class="lab">{{ p.label }}</span>
            </div>
            @if (i < pasos.length - 1) { <span class="line" [class.on]="i + 1 < step()"></span> }
          }
        </div>

        @if (step() === 1) {
          <div class="section-header">
            <div class="section-icon"><app-icon name="file" [size]="18" /></div>
            <div>
              <div class="section-title">Datos del Expediente</div>
              <div class="section-desc">Los campos marcados con <span class="req-mark">*</span> son obligatorios.</div>
            </div>
            <button class="btn-clear"><app-icon name="refresh" [size]="13" /> Limpiar campos</button>
          </div>

          <div class="centro">
            <div class="field-group">
              <div class="field-label-row">
                <label class="flabel">Nombre del Expediente <span class="req-mark">*</span></label>
                <div class="pub-toggle">
                  <span class="tgl-track on"><span class="tgl-thumb"></span></span>
                  <span class="pub-label">Público</span>
                </div>
              </div>
              <input class="finput" maxlength="255" placeholder="Ingrese el nombre del expediente…" />
              <span class="fcnt">0 / 255 caracteres</span>
            </div>

            <div class="field-group">
              <label class="flabel">Descripción</label>
              <div class="editor">
                <div class="toolbar">
                  <div class="tb-group"><button class="tb-btn"><b>B</b></button><button class="tb-btn"><i>I</i></button><button class="tb-btn"><u>U</u></button><button class="tb-btn"><s>S</s></button></div>
                  <div class="tb-sep"></div>
                  <div class="tb-group"><button class="tb-btn">H1</button><button class="tb-btn">H2</button></div>
                  <div class="tb-sep"></div>
                  <div class="tb-group"><button class="tb-btn">≔</button><button class="tb-btn">•≔</button></div>
                  <div class="tb-sep"></div>
                  <div class="tb-group"><button class="tb-btn">x₂</button><button class="tb-btn">x²</button></div>
                  <div class="tb-sep"></div>
                  <select class="tb-sel"><option>Normal</option><option>Título</option><option>Subtítulo</option></select>
                  <select class="tb-sel"><option>Normal</option><option>Grande</option><option>Pequeño</option></select>
                </div>
                <textarea rows="8" placeholder="Ingrese una descripción detallada del expediente…"></textarea>
                <div class="editor-footer"><span class="fcnt">0 / 5000 caracteres</span></div>
              </div>
            </div>
          </div>
        }

        @if (step() === 2) {
          <div class="section-header">
            <div class="section-icon"><app-icon name="users" [size]="18" /></div>
            <div>
              <div class="section-title">Participantes</div>
              <div class="section-desc">Los campos marcados con <span class="req-mark">*</span> son obligatorios.</div>
            </div>
            <button class="btn-clear"><app-icon name="refresh" [size]="13" /> Limpiar campos</button>
          </div>

          <div class="part-form">
            <div class="form-grid g4">
              <div class="field-group"><label class="flabel">RUT Participante <span class="req-mark">*</span></label><input class="finput" [value]="rut()" (input)="rut.set($any($event.target).value)" /><label class="chk"><input type="checkbox" /> Sin RUT</label></div>
              <div class="field-group"><label class="flabel">Tipo Participante <span class="req-mark">*</span></label><select class="finput" [value]="tipoPart()" (change)="tipoPart.set($any($event.target).value)"><option>Seleccione una opción</option><option>Solicitante</option><option>Representante</option></select></div>
              <div class="field-group"><label class="flabel">Tipo de Actor Relacionado <span class="req-mark">*</span></label><select class="finput" [value]="actor()" (change)="actor.set($any($event.target).value)"><option>Seleccione una opción</option><option>Ciudadano</option><option>Funcionario</option></select></div>
              <div class="field-group"><label class="flabel">Tipo de Persona <span class="req-mark">*</span></label>
                <div class="seg"><button class="s" [class.on]="persona() === 'Natural'" (click)="persona.set('Natural')">Natural</button><button class="s" [class.on]="persona() === 'Jurídica'" (click)="persona.set('Jurídica')">Jurídica</button></div>
              </div>
              <div class="field-group"><label class="flabel">Nombres <span class="req-mark">*</span></label><input class="finput" [value]="nombres()" (input)="nombres.set($any($event.target).value)" /></div>
              <div class="field-group"><label class="flabel">Primer Apellido <span class="req-mark">*</span></label><input class="finput" [value]="apellido()" (input)="apellido.set($any($event.target).value)" /></div>
              <div class="field-group"><label class="flabel">Segundo Apellido</label><input class="finput" /></div>
              <div class="field-group"><label class="flabel">Correo Electrónico</label><input class="finput" [value]="correo()" (input)="correo.set($any($event.target).value)" /></div>
            </div>
            <div class="add-row"><button class="btn" (click)="agregar()"><app-icon name="plus" [size]="15" /> Agregar Participante</button></div>
          </div>

          <div class="lista">
            <div class="lista-header">
              <span class="lista-title">Lista de Participantes Agregados</span>
              <span class="lista-count badge">{{ participantes().length }} registros</span>
            </div>
            <table class="data-table">
              <thead><tr><th>Tipo Participante</th><th>Tipo Actor</th><th>RUT / Núm. Documento</th><th>Nombre</th><th>Tipo Persona</th><th>Correo Electrónico</th><th style="width:80px">Acciones</th></tr></thead>
              <tbody>
                @for (pt of participantes(); track $index) {
                  <tr><td>{{ pt.tipo }}</td><td>{{ pt.actor }}</td><td>{{ pt.rut }}</td><td>{{ pt.nombre }}</td><td>{{ pt.persona }}</td><td>{{ pt.correo }}</td>
                    <td class="acts"><app-icon name="edit" [size]="15" class="g" /><app-icon name="trash" [size]="15" class="r" (click)="quitar($index)" /></td></tr>
                }
                @if (!participantes().length) {
                  <tr><td colspan="7" class="vacio">
                    <div class="empty-state"><app-icon name="users" [size]="28" /><p>No hay participantes agregados</p></div>
                  </td></tr>
                }
              </tbody>
            </table>
            <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
          </div>
        }

        @if (step() === 3) {
          <div class="section-header">
            <div class="section-icon"><app-icon name="folder" [size]="18" /></div>
            <div>
              <div class="section-title">Adjuntar Documentos</div>
              <div class="section-desc">Adjunte el documento principal y los anexos requeridos.</div>
            </div>
            <label class="chk-sil"><input type="checkbox" /><span>Bajo silencio administrativo</span></label>
          </div>

          <div class="adj-section">
            <div class="adj">
              <div class="adj-head">
                <div class="adj-head-left"><app-icon name="file" [size]="16" /><b>Documento Principal</b></div>
                <button class="btn btn-sm btn-ghost"><app-icon name="paperclip" [size]="14" /> Adjuntar ▾</button>
              </div>
              <div class="adj-meta">Tamaño máximo permitido por archivo: 10 MB</div>
              <div class="adj-empty"><app-icon name="file" [size]="24" /><p>No se ha adjuntado ningún documento principal</p><button class="btn btn-sm btn-ghost"><app-icon name="paperclip" [size]="13" /> Seleccionar archivo</button></div>
            </div>
            <div class="adj">
              <div class="adj-head">
                <div class="adj-head-left"><app-icon name="folder" [size]="16" /><b>Anexos</b></div>
                <button class="btn btn-sm btn-ghost"><app-icon name="paperclip" [size]="14" /> Adjuntar ▾</button>
              </div>
              <div class="adj-meta">Tamaño máximo permitido por archivo: 10 MB</div>
              <div class="adj-empty"><app-icon name="folder" [size]="24" /><p>No se han adjuntado anexos</p><button class="btn btn-sm btn-ghost"><app-icon name="paperclip" [size]="13" /> Seleccionar archivo</button></div>
            </div>
          </div>
        }
      </div>

      <div class="foot">
        <button class="btn btn-ghost foot-prev" (click)="prev()"><app-icon name="chevron-left" [size]="16" /> Anterior</button>
        @if (step() < 3) { <button class="btn foot-next" (click)="next()">Siguiente <app-icon name="chevron-right" [size]="16" /></button> }
        @else { <button class="btn btn-green foot-next" (click)="modo.set('select')"><app-icon name="check" [size]="16" /> Finalizar y Guardar</button> }
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

    /* Header del wizard */
    .wiz-header { margin-bottom: 20px; }
    .wiz-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
    .bc-link { color: var(--brand-blue); cursor: pointer; } .bc-link:hover { text-decoration: underline; }
    .bc-sep { color: var(--text-muted); font-size: 11px; }
    .bc-cur { font-weight: 600; color: var(--text); }
    .wiz-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .wiz-title { font-size: 22px; font-weight: 700; color: var(--text); margin: 0 0 4px; }
    .wiz-sub { font-size: 13px; color: var(--text-muted); margin: 0; }
    .step-badge { background: var(--brand-blue); color: #fff; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; white-space: nowrap; align-self: center; letter-spacing: .03em; }

    /* Stepper profesional */
    .wiz-card { padding: 28px 32px; }
    .stepper { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
    .st { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 130px; }
    .st .dot { width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--border); color: var(--text-muted); background: var(--surface); display: grid; place-items: center; font-size: 14px; font-weight: 700; transition: all .2s; }
    .st.on .dot { border-color: var(--brand-blue); color: var(--brand-blue); }
    .st.cur .dot { background: var(--brand-blue); color: #fff; border-color: var(--brand-blue); box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-blue) 15%, transparent); }
    .st.done .dot { background: var(--brand-blue); color: #fff; border-color: var(--brand-blue); }
    .st .lab { font-size: 12px; font-weight: 600; color: var(--text-muted); text-align: center; letter-spacing: .02em; }
    .st.on .lab { color: var(--brand-blue); }
    .st.cur .lab { color: var(--brand-blue); font-weight: 700; }
    .line { flex: 1; height: 2px; background: var(--border); margin-bottom: 26px; transition: background .2s; max-width: 120px; }
    .line.on { background: var(--brand-blue); }

    /* Section header */
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding: 16px 20px; background: var(--surface-2, #f8fafc); border-radius: 10px; border: 1px solid var(--border); }
    .section-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--brand-blue); color: #fff; display: grid; place-items: center; flex-shrink: 0; }
    .section-title { font-size: 15px; font-weight: 700; color: var(--text); }
    .section-desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .req-mark { color: #ef4444; font-weight: 700; }
    .btn-clear { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); background: none; border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; cursor: pointer; white-space: nowrap; }
    .btn-clear:hover { background: var(--surface); color: var(--text); }

    /* Campos paso 1 */
    .centro { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
    .field-group { display: flex; flex-direction: column; gap: 7px; }
    .field-label-row { display: flex; align-items: center; justify-content: space-between; }
    .flabel { font-size: 13px; color: var(--text); font-weight: 600; }
    .finput { border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; font-family: inherit; font-size: 14px; color: var(--text); background: var(--surface); transition: border-color .15s, box-shadow .15s; }
    .finput:focus { outline: none; border-color: var(--brand-blue); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-blue) 12%, transparent); }
    .fcnt { font-size: 11px; color: var(--text-muted); text-align: right; }

    /* Toggle público */
    .pub-toggle { display: flex; align-items: center; gap: 8px; }
    .tgl-track { width: 40px; height: 22px; border-radius: 999px; background: var(--brand-blue); display: flex; align-items: center; padding: 3px; cursor: pointer; transition: background .2s; }
    .tgl-track.on { background: var(--brand-blue); } .tgl-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; margin-left: auto; }
    .pub-label { font-size: 13px; font-weight: 600; color: var(--text); letter-spacing: .02em; }

    /* Editor */
    .editor { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .toolbar { display: flex; align-items: center; gap: 4px; padding: 8px 10px; background: var(--surface-2, #f8fafc); border-bottom: 1px solid var(--border); flex-wrap: wrap; }
    .tb-group { display: flex; gap: 2px; }
    .tb-btn { width: 28px; height: 28px; border: none; background: none; border-radius: 5px; cursor: pointer; color: var(--text-muted); font-size: 13px; display: grid; place-items: center; }
    .tb-btn:hover { background: var(--border); color: var(--text); }
    .tb-sep { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }
    .tb-sel { border: 1px solid var(--border); border-radius: 5px; padding: 3px 6px; font-size: 12px; color: var(--text-muted); background: var(--surface); cursor: pointer; }
    .editor textarea { width: 100%; border: none; padding: 14px; font-family: inherit; font-size: 14px; color: var(--text); resize: vertical; background: var(--surface); }
    .editor textarea:focus { outline: none; }
    .editor-footer { padding: 6px 14px 10px; background: var(--surface); text-align: right; }

    /* Paso 2 — participantes */
    .part-form { background: var(--surface-2, #f8fafc); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 24px; }
    .form-grid.g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1100px) { .form-grid.g4 { grid-template-columns: repeat(2, 1fr); } }
    .chk { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .seg { display: flex; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .seg .s { flex: 1; border: none; background: var(--surface); padding: 10px; font-weight: 600; font-size: 13px; color: var(--text-muted); cursor: pointer; transition: all .15s; }
    .seg .s.on { background: var(--brand-blue); color: #fff; }
    .add-row { display: flex; justify-content: flex-end; margin-top: 16px; }

    /* Tabla participantes */
    .lista { }
    .lista-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .lista-title { font-size: 13px; font-weight: 700; color: var(--text); }
    .lista-count { background: var(--surface-2, #f0f4f8); color: var(--text-muted); font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
    .acts { display: flex; gap: 12px; align-items: center; }
    .acts .g { color: #16a34a; cursor: pointer; } .acts .r { color: #dc2626; cursor: pointer; }
    .vacio { padding: 0 !important; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); }
    .empty-state p { margin: 0; font-size: 13px; }

    /* Paso 3 — documentos */
    .chk-sil { display: flex; align-items: center; gap: 8px; margin-left: auto; font-size: 12px; font-weight: 600; color: var(--text-muted); cursor: pointer; }
    .adj-section { display: flex; flex-direction: column; gap: 20px; }
    .adj { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
    .adj-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: var(--surface-2, #f8fafc); border-bottom: 1px solid var(--border); }
    .adj-head-left { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--text); }
    .adj-meta { font-size: 12px; color: var(--text-muted); padding: 8px 18px; border-bottom: 1px solid var(--border); }
    .adj-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 36px; color: var(--text-muted); background: var(--surface); }
    .adj-empty p { margin: 0; font-size: 13px; }

    /* Footer */
    .foot { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding: 16px 0; }
    .foot-prev { display: flex; align-items: center; gap: 6px; }
    .foot-next { display: flex; align-items: center; gap: 6px; padding: 10px 24px; font-size: 14px; }
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
