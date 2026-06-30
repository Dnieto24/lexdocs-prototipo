import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../../shared/icon';
import { expedientes } from '../../shared/mock-data';
import { DocViewer } from '../../shared/doc-viewer';
import { Session } from '../../shared/session';

@Component({
  selector: 'app-expediente-detalle',
  imports: [Icon],
  template: `
    @if (vista() === 'preparar') {
      <!-- Preparar documento -->
      <div class="card prep-hdr">
        <div class="prep-hdr-top">
          <span class="prep-folio">{{ exp.folio }}</span>
          <span class="badge badge-blue">{{ exp.etapa }}</span>
        </div>
        <div class="prep-hdr-meta">
          <div class="meta-item"><span class="meta-label">Expediente</span><span class="meta-value">{{ nombre }}</span></div>
          <div class="meta-item"><span class="meta-label">Fecha de ingreso</span><span class="meta-value">{{ exp.fechaIngreso }}</span></div>
          <div class="meta-item"><span class="meta-label">Estado</span><span class="meta-value">{{ exp.estado }}</span></div>
        </div>
      </div>

      <div class="wizard-banner">
        <div class="wiz-num">1</div>
        <div class="wiz-txt">
          <h2>Información del documento</h2>
          <p>Selecciona el tipo de documento, completa la materia y las palabras clave.</p>
          <div class="mtabs"><span class="on"><app-icon name="file" [size]="13"/> Información</span><span class="sep">›</span><span><app-icon name="users" [size]="13"/> Responde a</span><span class="sep">›</span><span><app-icon name="upload" [size]="13"/> Archivos</span><span class="sep">›</span><span><app-icon name="shield" [size]="13"/> Compartir</span></div>
        </div>
        <div class="wiz-paso">PASO 1 DE 4<div class="pbar"><i style="width:25%"></i></div></div>
      </div>

      <div class="stepper">
        <div class="st on cur"><span class="dot"><app-icon name="file" [size]="20"/></span><span class="lab">Información</span></div>
        <span class="line"></span>
        <div class="st"><span class="dot"><app-icon name="users" [size]="20"/></span><span class="lab">Responde a</span></div>
        <span class="line"></span>
        <div class="st"><span class="dot"><app-icon name="file" [size]="20"/></span><span class="lab">Documentos</span></div>
        <span class="line"></span>
        <div class="st"><span class="dot"><app-icon name="shield" [size]="20"/></span><span class="lab">Compartir</span></div>
      </div>

      <div class="card info-tip"><div class="tip-ic"><app-icon name="message" [size]="18"/></div><div>
        <b>¿Qué debes hacer en este paso?</b>
        <p class="muted">Selecciona el tipo de documento y completa la materia. Los campos adicionales aparecen según el tipo elegido.</p>
        <ul><li>La <b>materia</b> es siempre obligatoria y describe el asunto central.</li><li>Los <b>campos adicionales</b> varían según el tipo seleccionado.</li></ul>
      </div></div>

      <div class="card">
        <div class="sec-title">Información del documento</div>
        <p class="muted" style="margin:4px 0 16px;font-size:13px">Los campos marcados con (*) son obligatorios.</p>
        <div class="form-grid">
          <div class="field"><label>Tipo de documento (*)</label><select><option>Selecciona tipo de documento</option><option>Oficio</option><option>Circular</option><option>Antecedente</option></select></div>
          <div class="field"><label>Materia (*)</label><input placeholder="0/255" /></div>
          <div class="field full"><label>Palabras claves</label><input placeholder="Escriba un tag y presione Enter" /></div>
        </div>
        <div class="hito-tabs"><button class="ht active">Etapa</button><button class="ht">Generales</button></div>
        <input class="hito-filter" placeholder="Escriba un hito para filtrar…" />
        <div class="dual">
          <div class="col"><div class="opt">regreso a ingreso</div></div>
          <div class="arrows"><button class="rnd">›</button><button class="rnd">‹</button></div>
          <div class="col sel"><div class="sel-head">HITOS SELECCIONADOS</div><div class="empty">No hay hitos agregados</div></div>
        </div>
      </div>

      <div class="foot"><button class="btn btn-ghost" (click)="vista.set('tabs')">‹ Volver</button><button class="btn" disabled>Siguiente ›</button></div>

    } @else {
      <!-- Vista tabs -->
      <div class="exp-hdr card">
        <div class="exp-hdr-top">
          <div class="exp-hdr-title-wrap">
            <span class="exp-folio-badge">{{ exp.folio }}</span>
            <h2 class="exp-nombre">{{ nombre }}</h2>
          </div>
          <div class="exp-hdr-actions">
            <label class="archivada"><span class="tgl"></span> Archivada</label>
            <button class="btn btn-ghost btn-sm">Participantes</button>
            <button class="btn btn-sm">Expediente electrónico ▾</button>
          </div>
        </div>

        <div class="exp-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Fecha de ingreso</span>
            <span class="meta-value">{{ exp.fechaIngreso }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Estado</span>
            <span class="badge" [class]="exp.estado === 'En trámite' ? 'badge-blue' : 'badge-green'">{{ exp.estado }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Rol</span>
            <span class="meta-value">{{ exp.folio }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Responsable</span>
            <span class="meta-value">{{ exp.responsable }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Etapa actual</span>
            <span class="meta-value">{{ exp.etapa }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="tabs-bar">
          @for (t of tabs(); track t) {
            <button class="tab" [class.active]="t === tab()" (click)="tab.set(t)">{{ t }}</button>
          }
        </div>
        <div class="tab-body">
          @switch (tab()) {
            @case ('Expediente') {
              <table class="data-table">
                <thead><tr><th>Folio</th><th>Fecha ingreso</th><th>Tipo documento</th><th>Estado</th><th>Materia</th><th>Doc.</th><th>Responde a</th><th>Acciones</th></tr></thead>
                <tbody>
                  @for (d of docs; track $index) {
                    <tr>
                      <td>{{ d.folio }}</td><td>{{ d.fecha }}</td><td>{{ d.tipo }}</td>
                      <td><span class="badge" [class]="d.estado === 'Firmado' ? 'badge-green' : d.estado === 'Pendiente de firma' ? 'badge-orange' : 'badge-blue'">{{ d.estado }}</span></td>
                      <td>{{ d.materia }} @if (d.reservado) { <span class="badge badge-red">Reservado</span> }</td>
                      <td><button class="iconbtn" (click)="viewer.open(d.folio + '.pdf')"><app-icon name="file" [size]="16"/></button></td>
                      <td class="muted">{{ d.respondeA }}</td>
                      <td class="acts"><app-icon name="message" [size]="15"/><app-icon name="lock" [size]="15"/><app-icon name="clock" [size]="15"/><app-icon name="users" [size]="15"/><app-icon name="search" [size]="15"/></td>
                    </tr>
                  }
                </tbody>
              </table>
              <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
            }
            @case ('Participantes') {
              <table class="data-table">
                <thead><tr><th>Rut</th><th>Nombre</th><th>Tipo Parte</th><th>Tipo Actor</th><th>Tipo Persona</th><th>Correo</th></tr></thead>
                <tbody>
                  @for (p of participantes; track $index) {
                    <tr><td>{{ p.rut }}</td><td>{{ p.nombre }}</td><td>{{ p.tipoParte }}</td><td>{{ p.tipoActor }}</td><td>{{ p.tipoPersona }}</td><td class="muted">{{ p.correo }}</td></tr>
                  }
                </tbody>
              </table>
              <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
            }
            @case ('Comentarios') {
              <div class="tab-actions"><button class="btn btn-ghost btn-sm"><app-icon name="download" [size]="14" /> Exportar</button></div>
              @for (c of comentarios; track $index) {
                <div class="cmt">
                  <div class="cmt-top"><span class="av">{{ c.autor.charAt(0) }}</span><b>{{ c.autor }}</b><small class="muted fecha">{{ c.fecha }}</small></div>
                  <p>{{ c.texto }}</p>
                  <div class="cmt-acts"><app-icon name="reply" [size]="15"/><app-icon name="trash" [size]="15"/></div>
                </div>
              }
              <div class="cmt-input">
                <textarea placeholder="Escribe un comentario…" rows="2"></textarea>
                <div class="ci-foot"><small class="muted">0/6000 caracteres</small><button class="send"><app-icon name="send" [size]="16"/></button></div>
              </div>
            }
            @case ('Historial') {
              <table class="data-table">
                <thead><tr><th>Fecha ↓</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
                <tbody>
                  @for (h of historial; track $index) {
                    <tr>
                      <td><b>{{ h.fecha }}</b> <span class="muted">/ {{ h.hora }}</span></td>
                      <td class="muted">{{ h.usuario }}</td>
                      <td class="muted">{{ h.accion }}</td>
                      <td><span class="av-hist">JP</span> {{ h.detalle }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            }
            @case ('Preparar Docs') {
              <table class="data-table">
                <thead><tr><th>Fecha ingreso</th><th>Tipo documento</th><th>Materia</th><th>Documento</th><th>Adjunto</th><th>Acciones</th></tr></thead>
                <tbody>
                  <tr><td>06-04-2026</td><td>CIRCULAR</td><td>123</td>
                    <td><button class="iconbtn" (click)="viewer.open('circular-123.docx')"><app-icon name="file" [size]="16"/></button></td>
                    <td class="muted">-</td>
                    <td class="acts"><app-icon name="message" [size]="15"/><app-icon name="download" [size]="15"/><app-icon name="edit" [size]="15"/><app-icon name="trash" [size]="15"/><app-icon name="clock" [size]="15"/></td>
                  </tr>
                </tbody>
              </table>
              <div class="tab-actions tab-actions-end"><button class="btn" (click)="vista.set('preparar')">+ Preparar documento</button></div>
            }
            @case ('Plazos Hitos') {
              <table class="data-table">
                <thead><tr><th>Materia</th><th>Fecha inicio</th><th>Fecha vencimiento</th><th>Duración</th><th>Estado</th></tr></thead>
                <tbody>
                  <tr><td>test</td><td>31-03-2026</td><td>08-04-2026</td><td>5 días</td><td><span class="badge badge-red">Vencido</span></td></tr>
                </tbody>
              </table>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    /* Expediente header card */
    .exp-hdr { margin-bottom: 20px; }
    .exp-hdr-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
    .exp-hdr-title-wrap { display: flex; align-items: center; gap: 12px; }
    .exp-folio-badge { background: color-mix(in srgb, var(--brand-primary) 12%, transparent); color: var(--brand-primary); border: 1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent); border-radius: 8px; padding: 4px 12px; font-size: 13px; font-weight: 700; white-space: nowrap; }
    .exp-nombre { margin: 0; font-size: 18px; font-weight: 700; color: var(--text); }
    .exp-hdr-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .archivada { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; color: var(--text-muted); }
    .tgl { display: inline-block; width: 34px; height: 18px; border-radius: 999px; background: var(--border); position: relative; }

    .exp-meta-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px 20px; }
    @media (max-width: 1100px) { .exp-meta-grid { grid-template-columns: repeat(3, 1fr); } }

    .meta-item { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); font-weight: 700; }
    .meta-value { font-size: 13px; color: var(--text); font-weight: 500; }

    /* Tabs */
    .tabs-bar { display: flex; gap: 2px; padding: 0 4px; border-bottom: 1px solid var(--border); overflow-x: auto; }
    .tab { border: none; background: none; font-family: inherit; font-size: 13px; font-weight: 500; color: var(--text-muted); padding: 12px 16px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; transition: color .15s, border-color .15s; }
    .tab:hover { color: var(--text); }
    .tab.active { color: var(--brand-primary); font-weight: 700; border-bottom-color: var(--brand-primary); }
    .tab-body { padding: 18px 4px 4px; }
    .tab-actions { display: flex; margin-bottom: 14px; }
    .tab-actions-end { justify-content: flex-end; margin-top: 12px; }

    .acts { display: flex; gap: 12px; color: var(--brand-primary); align-items: center; }
    .acts app-icon { cursor: pointer; opacity: .7; transition: opacity .15s; }
    .acts app-icon:hover { opacity: 1; }
    .av-hist { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--brand-amber, #F59E0B); color: #fff; font-size: 10px; font-weight: 700; margin-right: 8px; vertical-align: middle; }

    /* Comentarios */
    .cmt { border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
    .cmt-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .cmt-top .fecha { margin-left: auto; }
    .av { width: 30px; height: 30px; border-radius: 50%; background: var(--brand-primary); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .cmt p { margin: 0 0 8px; font-size: 14px; }
    .cmt-acts { display: flex; gap: 12px; color: var(--brand-primary); align-items: center; }
    .cmt-acts app-icon { cursor: pointer; }
    .cmt-acts app-icon:last-child { color: #dc2626; }
    .cmt-input { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 8px; }
    .cmt-input textarea { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; font-size: 13px; transition: border-color .15s, box-shadow .15s; }
    .cmt-input textarea:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }
    .ci-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
    .send { border: none; background: none; color: var(--brand-primary); cursor: pointer; padding: 6px; border-radius: 6px; }
    .send:hover { background: color-mix(in srgb, var(--brand-primary) 10%, transparent); }

    /* Preparar wizard */
    .prep-hdr { margin-bottom: 20px; }
    .prep-hdr-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .prep-folio { font-weight: 700; font-size: 15px; }
    .prep-hdr-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 20px; }

    .wizard-banner { background: linear-gradient(110deg, var(--brand-primary-dark, #3730a3), var(--brand-primary)); color: #fff; border-radius: 12px; padding: 22px 26px; display: flex; align-items: center; gap: 20px; margin-bottom: 22px; }
    .wiz-num { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,.18); display: grid; place-items: center; font-weight: 800; font-size: 20px; flex-shrink: 0; }
    .wiz-txt { flex: 1; } .wiz-txt h2 { margin: 0 0 4px; font-size: 20px; } .wiz-txt p { margin: 0 0 8px; opacity: .85; font-size: 13px; }
    .mtabs { display: flex; gap: 8px; align-items: center; font-size: 12px; } .mtabs span { opacity: .55; display: inline-flex; align-items: center; gap: 4px; } .mtabs span.on { opacity: 1; font-weight: 700; } .mtabs .sep { opacity: .4; }
    .wiz-paso { font-size: 12px; font-weight: 700; text-align: right; flex-shrink: 0; } .pbar { width: 120px; height: 5px; background: rgba(255,255,255,.25); border-radius: 999px; margin-top: 6px; overflow: hidden; } .pbar i { display: block; height: 100%; background: #fff; }

    .stepper { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 22px; }
    .st { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: .4; } .st.on { opacity: 1; }
    .st .dot { width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--brand-primary); color: var(--brand-primary); display: grid; place-items: center; background: var(--surface); }
    .st.cur .dot { background: var(--brand-primary); color: #fff; } .st .lab { font-size: 12px; font-weight: 600; }
    .line { flex: 1; max-width: 200px; height: 2px; background: var(--border); }

    .info-tip { display: flex; gap: 14px; padding: 16px 18px; margin-bottom: 12px; border-left: 4px solid var(--brand-primary); }
    .tip-ic { color: var(--brand-primary); flex-shrink: 0; margin-top: 2px; }
    .info-tip ul { margin: 8px 0 0; padding-left: 18px; font-size: 13px; } .info-tip p { margin: 4px 0 0; font-size: 13px; }

    .sec-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .field { display: flex; flex-direction: column; gap: 6px; } .field.full { grid-column: 1 / -1; }
    .field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }
    .field input, .field select { border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; font-size: 13px; transition: border-color .15s, box-shadow .15s; }
    .field input:focus, .field select:focus { outline: none; border-color: var(--brand-primary); box-shadow: var(--ring); }

    .hito-tabs { display: flex; gap: 8px; margin-bottom: 12px; }
    .ht { border: none; background: var(--surface-2); border-radius: 999px; padding: 8px 18px; font-weight: 600; font-size: 13px; color: var(--text-muted); cursor: pointer; transition: background .15s, color .15s; }
    .ht.active { background: var(--brand-primary); color: #fff; }
    .hito-filter { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 9px 14px; font-family: inherit; margin-bottom: 12px; font-size: 13px; }
    .dual { display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px; align-items: center; }
    .col { border: 1px solid var(--border); border-radius: 10px; min-height: 160px; padding: 10px; }
    .col .opt { padding: 8px 10px; border-radius: 7px; font-size: 13px; cursor: pointer; } .col .opt:hover { background: var(--surface-2); }
    .col.sel .sel-head { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-muted); padding: 4px 6px 10px; }
    .col.sel .empty { color: var(--text-muted); text-align: center; padding-top: 40px; font-size: 13px; }
    .arrows { display: flex; flex-direction: column; gap: 10px; }
    .rnd { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 16px; display: grid; place-items: center; transition: background .15s; }
    .rnd:hover { background: var(--surface-2); }
    .foot { display: flex; justify-content: center; gap: 12px; margin-top: 22px; }
  `],
})
export class ExpedienteDetalle {
  viewer = inject(DocViewer);
  folio = inject(ActivatedRoute).snapshot.paramMap.get('folio') ?? '';
  exp = expedientes.find(e => e.folio === this.folio) ?? expedientes[0];
  get nombre() { return this.exp.procedimiento; }

  private session = inject(Session);
  vista = signal<'tabs' | 'preparar'>('tabs');
  tabs = computed(() => this.session.role() === 'Ciudadano'
    ? ['Expediente', 'Participantes']
    : ['Expediente', 'Participantes', 'Comentarios', 'Historial', 'Preparar Docs', 'Plazos Hitos']);
  tab = signal('Expediente');

  docs = [
    { folio: this.exp.folio.replace('-A-', '-OFI-'), fecha: '08-04-2026', tipo: 'OFICIO', estado: 'Firmado', materia: 'prueba', reservado: true, respondeA: '-' },
    { folio: 'Sin folio', fecha: '31-03-2026', tipo: 'CIRCULAR', estado: 'Firmado', materia: 'test', reservado: false, respondeA: '-' },
    { folio: 'Sin folio', fecha: '31-03-2026', tipo: 'ANTECEDENTE', estado: 'Público', materia: 'test', reservado: false, respondeA: '-' },
    { folio: 'Sin folio', fecha: '30-03-2026', tipo: 'prueba', estado: 'Pendiente de firma', materia: 'test', reservado: false, respondeA: '-' },
  ];
  participantes = [
    { rut: '22.222.222-2', nombre: 'María Soto', tipoParte: 'Solicitante', tipoActor: 'Extranjero', tipoPersona: 'Natural', correo: 'maria.soto@correo.cl' },
    { rut: '15.345.678-9', nombre: 'Pedro Rojas', tipoParte: 'Representante', tipoActor: 'Nacional', tipoPersona: 'Natural', correo: 'pedro.rojas@correo.cl' },
    { rut: '76.123.456-7', nombre: 'Constructora Andes SpA', tipoParte: 'Tercero', tipoActor: 'Nacional', tipoPersona: 'Jurídica', correo: 'contacto@andes.cl' },
  ];
  comentarios = [
    { autor: 'Juan Pérez', fecha: '26-06-26, 16:21', texto: 'Se revisaron los antecedentes y el expediente está listo para pasar a la siguiente etapa.' },
  ];
  historial = [
    { fecha: '30-06-2026', hora: '12:36:30', usuario: 'Juan Pérez', accion: 'Ingreso al expediente', detalle: `Ha ingresado al expediente ${this.exp.folio}.` },
    { fecha: '01-06-2026', hora: '13:12:10', usuario: 'Juan Pérez', accion: 'Ingreso al expediente', detalle: `Ha ingresado al expediente ${this.exp.folio}.` },
    { fecha: '01-06-2026', hora: '13:12:10', usuario: 'Juan Pérez', accion: 'Envío a firmar', detalle: `Se enviaron a firmar 1 documento(s) del expediente ${this.exp.folio}.` },
    { fecha: '26-05-2026', hora: '15:49:29', usuario: 'Juan Pérez', accion: 'Expediente creado', detalle: 'Se creó el expediente N° 2073 (Expediente documental).' },
  ];
}
