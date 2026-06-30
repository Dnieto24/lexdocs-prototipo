import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../shared/icon';
import { organismos, procedimientos } from '../../shared/mock-data';

// ponytail: wizard de 3 pasos (demo). El mismo componente sirve para Expediente y Documento.
@Component({
  selector: 'app-ingreso-wizard',
  imports: [Icon],
  template: `
    <div class="breadcrumb"><a href="javascript:void(0)">Inicio</a> / @if (desdeOPEntrante()) { Oficina de Partes / Entrante } @else { Ingresos } / {{ esDoc() ? 'Documento' : 'Expediente' }}</div>

    <section class="banner">
      <div class="num">{{ step() }}</div>
      <div class="txt">
        <h2>{{ pasos()[step()-1].titulo }}</h2>
        <p>{{ pasos()[step()-1].sub }}</p>
        <div class="mtabs">
          @for (p of pasos(); track p.tab; let i = $index) {
            <span [class.on]="i + 1 <= step()">{{ p.tabIcon }} {{ p.tab }}</span>
            @if (i < pasos().length - 1) { <span class="sep">›</span> }
          }
        </div>
      </div>
      <div class="pasode">PASO {{ step() }} DE {{ pasos().length }}<div class="pbar"><i [style.width.%]="step() / pasos().length * 100"></i></div></div>
    </section>

    <div class="stepper">
      @for (p of pasos(); track p.tab; let i = $index) {
        <div class="st" [class.on]="i + 1 <= step()" [class.cur]="i + 1 === step()">
          <span class="dot">{{ p.icon }}</span><span class="lab">{{ p.stepper }}</span>
        </div>
        @if (i < pasos().length - 1) { <span class="line" [class.on]="i + 1 < step()"></span> }
      }
    </div>

    @if (step() === 1) {
      <div class="card info"><div class="ic">ℹ️</div><div>
        <b>¿Qué debes hacer en este paso?</b>
        <p class="muted">Selecciona el tipo y completa la materia. Los campos adicionales aparecen automáticamente según el tipo elegido.</p>
        <ul><li>La <b>materia</b> es siempre obligatoria y describe el asunto central.</li>
        <li>Los <b>campos adicionales</b> varían según el tipo seleccionado.</li>
        <li>Si está asociado a un expediente existente, búscalo para vincularlo.</li></ul>
      </div></div>

      <div class="card info"><div class="ic">🏷️</div><div>
        <b>Etiquetas (tags)</b>
        <p class="muted">Palabras o términos para clasificar y facilitar la búsqueda posterior.</p>
        <ul><li>Los <b>tags</b> permiten organizar, agrupar o filtrar según criterios propios del equipo.</li></ul>
      </div></div>

      <div class="card panel">
        <div class="assoc-head">
          <div><b>¿Este documento está asociado a un expediente?</b><p class="muted">Un expediente es un trámite que ya ingresaste anteriormente.</p></div>
          <div class="toggle">
            <button class="btn btn-sm" [class.btn-ghost]="!asociado()" (click)="asociado.set(true)">Sí, tiene expediente</button>
            <button class="btn btn-sm" [class.btn-ghost]="asociado()" (click)="asociado.set(false)">No, sin expediente</button>
          </div>
        </div>

        @if (asociado()) {
          <div class="radios">
            <label class="radio" [class.sel]="modo() === 'numero'" (click)="modo.set('numero')">
              <span class="ri"><app-icon name="file" [size]="20" /></span><div><b>Por número de expediente</b><small class="muted">Búsqueda directa si conoces el folio del trámite.</small></div>
              <span class="rk">{{ modo() === 'numero' ? '◉' : '○' }}</span>
            </label>
            <label class="radio" [class.sel]="modo() === 'rut'" (click)="modo.set('rut')">
              <span class="ri"><app-icon name="user" [size]="20" /></span><div><b>Por participante (RUT)</b><small class="muted">Busca por RUT y selecciona el expediente.</small></div>
              <span class="rk">{{ modo() === 'rut' ? '◉' : '○' }}</span>
            </label>
          </div>
          <div class="search-box">
            <p class="muted" style="margin:0 0 6px"><b>Ingresa el {{ modo() === 'numero' ? 'número de tu expediente' : 'RUT del participante' }}.</b></p>
            <label class="req">{{ modo() === 'numero' ? 'NÚMERO DE EXPEDIENTE' : 'RUT' }} (*)</label>
            <div class="search-row"><input placeholder="Buscar…" /><button class="btn btn-sm"><app-icon name="search" [size]="14" /> Buscar expediente</button></div>
          </div>
        } @else {
          <div class="form-grid">
            <div class="field"><label>Organismo</label><select>@for (o of organismos; track o) { <option>{{ o }}</option> }</select></div>
            <div class="field"><label>Tipo de {{ esDoc() ? 'documento' : 'expediente' }}</label><select><option>Oficio</option><option>Resolución</option><option>Carátula</option></select></div>
            <div class="field full"><label>Materia (*)</label><input placeholder="Describe el asunto central…" /></div>
            <div class="field full"><label>Etiquetas (tags)</label><input placeholder="Ej. subsidio, urgente" /></div>
          </div>
        }
      </div>
    }

    @if (step() === 2) {
      <div class="card panel">
        <b>{{ esDoc() ? 'Adjunta el documento' : 'Documentos del expediente' }}</b>
        <div class="drop"><app-icon name="paperclip" [size]="16" /> Arrastra archivos aquí o <a href="javascript:void(0)">selecciona</a></div>
        <div class="files">
          <div class="file"><app-icon name="file" [size]="15" /> Caratula_expediente.pdf <span class="badge badge-green">Cargado</span></div>
          <div class="file"><app-icon name="file" [size]="15" /> Oficio_conductor_003.pdf <span class="badge badge-green">Cargado</span></div>
        </div>
      </div>
    }

    @if (step() === 3) {
      <div class="card panel">
        <b>Compartir y permisos</b>
        <p class="muted">Define con quién se comparte y el procedimiento asociado.</p>
        <div class="form-grid">
          <div class="field"><label>Procedimiento</label><select>@for (p of procedimientos; track p) { <option>{{ p }}</option> }</select></div>
          <div class="field"><label>Unidad responsable</label><select>@for (o of organismos; track o) { <option>{{ o }}</option> }</select></div>
          <div class="field full"><label>Compartir con</label><input placeholder="Usuario o grupo…" /></div>
        </div>
      </div>
    }

    <div class="foot">
      @if (step() > 1) { <button class="btn btn-ghost" (click)="prev()">‹ Atrás</button> }
      <button class="btn" (click)="next()">{{ step() < pasos().length ? 'Siguiente ›' : 'Finalizar' }}</button>
    </div>
  `,
  styles: [`
    .banner { background: linear-gradient(110deg, var(--brand-primary-dark), var(--brand-primary)); color: #fff; border-radius: var(--radius); padding: 22px 26px; display: flex; align-items: center; gap: 20px; margin-bottom: 22px; }
    .banner .num { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,.18); display: grid; place-items: center; font-family: 'Exo'; font-weight: 800; font-size: 20px; flex-shrink: 0; }
    .banner .txt { flex: 1; }
    .banner h2 { margin: 0 0 4px; font-size: 20px; }
    .banner p { margin: 0 0 8px; opacity: .85; font-size: 13px; }
    .mtabs { display: flex; gap: 8px; align-items: center; font-size: 12px; }
    .mtabs span { opacity: .55; } .mtabs span.on { opacity: 1; font-weight: 700; } .mtabs .sep { opacity: .4; }
    .pasode { font-size: 12px; font-weight: 700; text-align: right; flex-shrink: 0; }
    .pbar { width: 130px; height: 5px; background: rgba(255,255,255,.25); border-radius: 999px; margin-top: 6px; overflow: hidden; }
    .pbar i { display: block; height: 100%; background: #fff; transition: width .25s; }
    .stepper { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 22px; }
    .st { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: .5; }
    .st.on { opacity: 1; }
    .st .dot { width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--brand-primary); color: var(--brand-primary); display: grid; place-items: center; font-size: 20px; background: var(--surface); }
    .st.cur .dot { background: var(--brand-primary); color: #fff; }
    .st .lab { font-size: 12px; font-weight: 600; }
    .line { flex: 1; max-width: 200px; height: 2px; background: var(--border); }
    .line.on { background: var(--brand-primary); }
    .info { display: flex; gap: 14px; padding: 18px 20px; margin-bottom: 14px; border-left: 4px solid var(--brand-primary); }
    .info .ic { font-size: 20px; }
    .info ul { margin: 8px 0 0; padding-left: 18px; color: var(--text); font-size: 13px; } .info li { margin-bottom: 4px; }
    .assoc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
    .toggle { display: flex; gap: 8px; flex-shrink: 0; }
    .radios { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
    .radio { display: flex; align-items: center; gap: 12px; border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; cursor: pointer; }
    .radio.sel { border-color: var(--brand-primary); background: var(--nav-active-bg); }
    .radio .ri { font-size: 20px; } .radio div { flex: 1; } .radio small { display: block; }
    .radio .rk { color: var(--brand-primary); font-size: 18px; }
    .search-box { border-top: 1px solid var(--border); padding-top: 16px; }
    .req { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: .04em; }
    .search-row { display: flex; gap: 10px; margin-top: 6px; }
    .search-row input { flex: 1; border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-family: inherit; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; } .field.full { grid-column: 1 / -1; }
    .field label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .field input, .field select { border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .drop { border: 2px dashed var(--border); border-radius: 10px; padding: 28px; text-align: center; color: var(--text-muted); margin: 12px 0; }
    .files { display: flex; flex-direction: column; gap: 8px; } .file { border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; display: flex; gap: 10px; align-items: center; }
    .foot { display: flex; justify-content: center; gap: 12px; margin-top: 22px; }
  `],
})
export class IngresoWizard {
  organismos = organismos;
  procedimientos = procedimientos;
  private route = inject(ActivatedRoute);
  private tipo = toSignal(this.route.paramMap);
  private query = toSignal(this.route.queryParamMap);
  esDoc = computed(() => (this.tipo()?.get('tipo') ?? 'documento') === 'documento');
  desdeOPEntrante = computed(() => this.query()?.get('origen') === 'op-entrante');
  pasos = computed(() => this.esDoc()
    ? [
        { titulo: 'Información del documento', sub: 'Selecciona el tipo de documento, completa la materia y las palabras clave.', tab: 'Información', tabIcon: '📄', stepper: 'Información documento', icon: '📄' },
        { titulo: 'Documentos', sub: 'Adjunta los archivos del documento.', tab: 'Archivos', tabIcon: '📎', stepper: 'Documentos', icon: '📁' },
        { titulo: 'Compartir', sub: 'Define permisos y procedimiento asociado.', tab: 'Compartir', tabIcon: '🛡️', stepper: 'Compartir', icon: '🔗' },
      ]
    : [
        { titulo: 'Información del expediente', sub: 'Completa los datos del nuevo expediente.', tab: 'Información', tabIcon: '📁', stepper: 'Información', icon: '📁' },
        { titulo: 'Participantes', sub: 'Agrega los participantes del expediente.', tab: 'Participantes', tabIcon: '👥', stepper: 'Participantes', icon: '👥' },
        { titulo: 'Documentos', sub: 'Adjunta los documentos iniciales.', tab: 'Documentos', tabIcon: '📎', stepper: 'Documentos', icon: '📄' },
      ]);

  step = signal(1);
  asociado = signal(true);
  modo = signal<'numero' | 'rut'>('numero');
  next() { if (this.step() < this.pasos().length) this.step.set(this.step() + 1); }
  prev() { if (this.step() > 1) this.step.set(this.step() - 1); }
}
