import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../../shared/icon';
import { expedientes } from '../../shared/mock-data';
import { DocViewer } from '../../shared/doc-viewer';
import { Session } from '../../shared/session';

// Detalle de expediente (forma MINVU, skin LexDocs). Tabs: Expediente, Comentarios, Preparar Docs, Plazos Hitos.
@Component({
  selector: 'app-expediente-detalle',
  imports: [Icon],
  template: `
    @if (vista() === 'preparar') {
      <!-- ===== Preparar documento (form, sin Siguiente) ===== -->
      <div class="card panel mini-hdr">
        <b>{{ exp.folio }} {{ nombre }}</b>
        <div class="mini-grid"><span><b>Nombre de expediente:</b> {{ nombre }}</span><span><b>Etapa:</b> {{ exp.etapa }}</span><span><b>Fecha de ingreso:</b> {{ exp.fechaIngreso }}</span></div>
      </div>

      <section class="banner">
        <div class="num">1</div>
        <div class="txt"><h2>Información del documento</h2>
          <p>Selecciona el tipo de documento, completa la materia y las palabras clave.</p>
          <div class="mtabs"><span class="on"><app-icon name="file" [size]="13"/> Información</span><span class="sep">›</span><span><app-icon name="users" [size]="13"/> Responde a</span><span class="sep">›</span><span><app-icon name="upload" [size]="13"/> Archivos</span><span class="sep">›</span><span><app-icon name="shield" [size]="13"/> Compartir</span></div>
        </div>
        <div class="pasode">PASO 1 DE 4<div class="pbar"><i style="width:25%"></i></div></div>
      </section>

      <div class="stepper">
        <div class="st on cur"><span class="dot"><app-icon name="file" [size]="20"/></span><span class="lab">Información documento</span></div>
        <span class="line"></span>
        <div class="st"><span class="dot"><app-icon name="users" [size]="20"/></span><span class="lab">Responde a:</span></div>
        <span class="line"></span>
        <div class="st"><span class="dot"><app-icon name="file" [size]="20"/></span><span class="lab">Documentos</span></div>
        <span class="line"></span>
        <div class="st"><span class="dot"><app-icon name="shield" [size]="20"/></span><span class="lab">Compartir</span></div>
      </div>

      <div class="card info"><div class="ic"><app-icon name="message" [size]="18"/></div><div>
        <b>¿Qué debes hacer en este paso?</b>
        <p class="muted">Selecciona el tipo de documento y completa la materia. Los campos adicionales aparecen según el tipo elegido.</p>
        <ul><li>La <b>materia</b> es siempre obligatoria y describe el asunto central.</li><li>Los <b>campos adicionales</b> varían según el tipo seleccionado.</li></ul>
      </div></div>
      <div class="card info"><div class="ic"><app-icon name="file" [size]="18"/></div><div>
        <b>Etiquetas (tags)</b>
        <p class="muted">Palabras o términos para clasificar el documento y facilitar su búsqueda.</p>
      </div></div>

      <div class="card panel">
        <b>Información documento</b>
        <p class="muted" style="margin:4px 0 16px">Nuevo documento · Los campos marcados con (*) son obligatorios.</p>
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

      <div class="foot"><button class="btn" (click)="vista.set('tabs')">‹ Volver</button><button class="btn btn-ghost" disabled>Siguiente ›</button></div>
    } @else {
      <!-- ===== Detalle ===== -->
      <div class="breadcrumb">Inicio / Expediente</div>

      <div class="card panel hdr" style="margin-bottom:20px">
        <div class="hdr-top">
          <h2>{{ exp.folio }} {{ nombre }}</h2>
          <button class="btn btn-sm">Expediente electrónico ▾</button>
        </div>
        <div class="hdr-actions">
          <button class="btn btn-sm">Participantes</button>
          <label class="archivada"><span class="tgl"></span> Archivada</label>
        </div>
        <div class="hdr-grid">
          <span><b>Fecha de ingreso:</b> {{ exp.fechaIngreso }}</span>
          <span><b>Nombre Expediente:</b> {{ nombre }}</span>
          <span><b>Estado:</b> {{ exp.estado }}</span>
          <span><b>Rol:</b> {{ exp.folio }}</span>
          <span><b>Autor:</b> {{ exp.responsable }}</span>
        </div>
        <div style="margin-top:8px"><b>Etapa:</b> {{ exp.etapa }}</div>
      </div>

      <div class="card panel">
        <div class="tabs">
          @for (t of tabs(); track t) { <button class="tab" [class.active]="t === tab()" (click)="tab.set(t)">{{ t }}</button> }
        </div>

        @switch (tab()) {
          @case ('Expediente') {
            <table class="data-table">
              <thead><tr><th>Folio</th><th>Fecha ingreso</th><th>Tipo documento</th><th>Estado documento</th><th>Materia</th><th>Documento</th><th>Responde a</th><th>Acciones</th></tr></thead>
              <tbody>
                @for (d of docs; track $index) {
                  <tr>
                    <td>{{ d.folio }}</td><td>{{ d.fecha }}</td><td>{{ d.tipo }}</td><td>{{ d.estado }}</td>
                    <td>{{ d.materia }} @if (d.reservado) { <span class="badge badge-red">Reservado</span> }</td>
                    <td><button class="iconbtn" (click)="viewer.open(d.folio + '.pdf')"><app-icon name="file" [size]="16"/></button></td>
                    <td>{{ d.respondeA }}</td>
                    <td class="acts"><app-icon name="message" [size]="15"/><app-icon name="lock" [size]="15"/><app-icon name="clock" [size]="15"/><app-icon name="users" [size]="15"/><app-icon name="search" [size]="15"/></td>
                  </tr>
                }
              </tbody>
            </table>
            <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
          }
          @case ('Participantes') {
            <table class="data-table">
              <thead><tr><th>Rut</th><th>Nombre</th><th>Tipo Parte</th><th>Tipo de Actor Relacionado</th><th>Tipo Persona</th><th>Correo</th></tr></thead>
              <tbody>
                @for (p of participantes; track $index) {
                  <tr><td>{{ p.rut }}</td><td>{{ p.nombre }}</td><td>{{ p.tipoParte }}</td><td>{{ p.tipoActor }}</td><td>{{ p.tipoPersona }}</td><td>{{ p.correo }}</td></tr>
                }
              </tbody>
            </table>
            <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
          }
          @case ('Comentarios') {
            <div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button class="btn btn-sm"><app-icon name="download" [size]="14" /> Exportar</button></div>
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
            <table class="data-table hist">
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
                <tr><td>06-04-2026</td><td>CIRCULAR</td><td>123</td><td><button class="iconbtn" (click)="viewer.open('circular-123.docx')"><app-icon name="file" [size]="16"/></button></td><td>-</td>
                  <td class="acts"><app-icon name="message" [size]="15"/><app-icon name="download" [size]="15"/><app-icon name="edit" [size]="15"/><app-icon name="trash" [size]="15"/><app-icon name="clock" [size]="15"/></td></tr>
              </tbody>
            </table>
            <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
            <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn" (click)="vista.set('preparar')">Preparar documento</button></div>
          }
          @case ('Plazos Hitos') {
            <table class="data-table">
              <thead><tr><th>Materia</th><th>Fecha inicio</th><th>Fecha vencimiento</th><th>Duración</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>test</td><td>31-03-2026</td><td>08-04-2026</td><td>5</td><td><span class="badge badge-red">Vencido</span></td></tr>
              </tbody>
            </table>
            <div class="pagination"><span><app-icon name="chevrons-left" [size]="13" /> Anterior</span><span class="active">1</span><span>Siguiente <app-icon name="chevrons-right" [size]="13" /></span></div>
          }
        }
      </div>
    }
  `,
  styles: [`
    .hdr-top { display: flex; justify-content: space-between; align-items: center; }
    .hdr-top h2 { margin: 0; font-size: 20px; }
    .hdr-actions { display: flex; justify-content: flex-end; align-items: center; gap: 14px; margin: 10px 0; }
    .archivada { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .hdr-grid { display: flex; flex-wrap: wrap; gap: 12px 40px; font-size: 13px; }
    .hdr-grid b, .url b { color: var(--text); }
    .url { margin-top: 0; }
    .url-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .url-row { display: flex; gap: 10px; align-items: center; }
    .url-row input { flex: 1; border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: monospace; font-size: 12px; color: var(--text-muted); }
    .acts { display: flex; gap: 12px; color: var(--brand-primary); align-items: center; }
    .acts app-icon { cursor: pointer; }
    .av-hist { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--brand-amber, #F59E0B); color: #fff; font-size: 10px; font-weight: 700; margin-right: 8px; vertical-align: middle; }
    /* comentarios */
    .cmt { border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
    .cmt-top { display: flex; align-items: center; gap: 10px; }
    .cmt-top .fecha { margin-left: auto; }
    .av { width: 30px; height: 30px; border-radius: 50%; background: var(--brand-primary); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 13px; }
    .cmt p { margin: 8px 0; }
    .cmt-acts { display: flex; gap: 12px; color: var(--brand-primary); align-items: center; }
    .cmt-acts app-icon { cursor: pointer; }
    .cmt-acts app-icon:last-child { color: #dc2626; }
    .cmt-input { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 6px; }
    .cmt-input textarea { width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .ci-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
    .send { border: none; background: none; color: var(--brand-blue); cursor: pointer; }
    /* preparar - banner/stepper (reuso patrón wizard) */
    .mini-hdr b { font-size: 16px; }
    .mini-grid { display: flex; gap: 40px; flex-wrap: wrap; margin-top: 8px; font-size: 13px; color: var(--text-muted); }
    .banner { background: linear-gradient(110deg, var(--brand-primary-dark), var(--brand-primary)); color: #fff; border-radius: var(--radius); padding: 22px 26px; display: flex; align-items: center; gap: 20px; margin-bottom: 22px; }
    .banner .num { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,.18); display: grid; place-items: center; font-family: 'Exo'; font-weight: 800; font-size: 20px; }
    .banner .txt { flex: 1; } .banner h2 { margin: 0 0 4px; font-size: 20px; } .banner p { margin: 0 0 8px; opacity: .85; font-size: 13px; }
    .mtabs { display: flex; gap: 8px; align-items: center; font-size: 12px; } .mtabs span { opacity: .55; display: inline-flex; align-items: center; gap: 4px; } .mtabs span.on { opacity: 1; font-weight: 700; }
    .pasode { font-size: 12px; font-weight: 700; text-align: right; } .pbar { width: 130px; height: 5px; background: rgba(255,255,255,.25); border-radius: 999px; margin-top: 6px; overflow: hidden; } .pbar i { display: block; height: 100%; background: #fff; }
    .stepper { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 22px; }
    .st { display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: .5; } .st.on { opacity: 1; }
    .st .dot { width: 46px; height: 46px; border-radius: 50%; border: 2px solid var(--brand-primary); color: var(--brand-primary); display: grid; place-items: center; background: var(--surface); }
    .st.cur .dot { background: var(--brand-primary); color: #fff; } .st .lab { font-size: 12px; font-weight: 600; }
    .line { flex: 1; max-width: 200px; height: 2px; background: var(--border); }
    .info { display: flex; gap: 14px; padding: 16px 18px; margin-bottom: 12px; border-left: 4px solid var(--brand-primary); }
    .info ul { margin: 8px 0 0; padding-left: 18px; font-size: 13px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; } .field.full { grid-column: 1 / -1; }
    .field label { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .field input, .field select { border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-family: inherit; }
    .hito-tabs { display: flex; gap: 8px; margin: 18px 0 12px; }
    .ht { border: none; background: var(--surface-2); border-radius: 999px; padding: 9px 20px; font-weight: 600; font-size: 13px; color: var(--text-muted); }
    .ht.active { background: var(--brand-primary); color: #fff; }
    .hito-filter { width: 100%; border: 1px solid var(--border); border-radius: 999px; padding: 9px 16px; font-family: inherit; margin-bottom: 12px; }
    .dual { display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px; align-items: center; }
    .col { border: 1px solid var(--border); border-radius: 10px; min-height: 180px; padding: 10px; }
    .col .opt { padding: 8px 10px; border-radius: 7px; } .col .opt:hover { background: var(--surface-2); }
    .col.sel .sel-head { font-size: 11px; font-weight: 700; color: var(--text-muted); padding: 4px 6px 10px; }
    .col.sel .empty { color: var(--text-muted); text-align: center; padding-top: 50px; }
    .arrows { display: flex; flex-direction: column; gap: 10px; }
    .rnd { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); cursor: pointer; }
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
  // El Ciudadano solo ve Expediente y Participantes.
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
    { fecha: '01-06-2026', hora: '13:12:10', usuario: 'Juan Pérez', accion: 'Envío a firmar documento(s)', detalle: `Se enviaron a firmar 1 documento(s) del expediente ${this.exp.folio}.` },
    { fecha: '01-06-2026', hora: '13:11:51', usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: `Se agregó OFICIO una "prueba" al expediente ${this.exp.folio}.` },
    { fecha: '26-05-2026', hora: '15:49:29', usuario: 'Juan Pérez', accion: 'Expediente creado', detalle: 'Se creó el expediente N° 2073 (Expediente documental).' },
  ];
}
