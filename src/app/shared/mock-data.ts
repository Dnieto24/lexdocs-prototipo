// Datos ficticios para el prototipo (organismos y nombres inventados).
// ponytail: datos en duro, reemplazar por servicios HTTP cuando exista backend.

export interface Column { key: string; label: string; type?: 'badge' | 'toggle' | 'chips' | 'edit' | 'icon' | 'file'; icon?: string; iconKey?: string; }

export const expedienteColumns: Column[] = [
  { key: 'folio', label: 'Folio' },
  { key: 'fechaIngreso', label: 'Fecha ingreso' },
  { key: 'organismo', label: 'Organismo' },
  { key: 'responsable', label: 'Responsable' },
  { key: 'etapa', label: 'Etapa actual' },
  { key: 'estado', label: 'Estado', type: 'badge' },
];

export const organismos = ['Dirección Regional Norte', 'Unidad de Proyectos', 'Oficina Central', 'Departamento Jurídico', 'Subdirección de Operaciones'];
export const procedimientos = ['Asignación directa', 'Casi sumario', 'Expediente documental', 'Prueba combinado'];

export interface Expediente {
  folio: string; fechaIngreso: string; organismo: string; responsable: string;
  procedimiento: string; etapa: string; estado: string;
}

export const expedientes: Expediente[] = [
  { folio: '2026-00094-S-000001', fechaIngreso: '24-06-2026', organismo: 'Dirección Regional Norte', responsable: 'Juan Pérez', procedimiento: 'Expediente documental', etapa: 'Calificación de la solicitud', estado: 'En trámite' },
  { folio: '2026-00094-S-000002', fechaIngreso: '20-06-2026', organismo: 'Dirección Regional Norte', responsable: 'Juan Pérez', procedimiento: 'Expediente documental', etapa: 'Resolución', estado: 'En trámite' },
  { folio: '2026-00094-S-000005', fechaIngreso: '19-06-2026', organismo: 'Dirección Regional Norte', responsable: 'Pedro Lagos', procedimiento: 'Expediente documental', etapa: 'Revisión de antecedentes', estado: 'En trámite' },
  { folio: '2026-00088-S-000014', fechaIngreso: '18-06-2026', organismo: 'Unidad de Proyectos', responsable: 'Marta Soto', procedimiento: 'Casi sumario', etapa: 'Revisión de antecedentes', estado: 'Observado' },
  { folio: '2026-00088-S-000011', fechaIngreso: '12-06-2026', organismo: 'Unidad de Proyectos', responsable: 'Carlos Díaz', procedimiento: 'Expediente documental', etapa: 'Notificación', estado: 'Terminado' },
  { folio: '2026-00088-S-000009', fechaIngreso: '10-06-2026', organismo: 'Unidad de Proyectos', responsable: 'Carlos Díaz', procedimiento: 'Asignación directa', etapa: 'Cierre', estado: 'Terminado' },
  { folio: '2026-00075-S-000007', fechaIngreso: '05-06-2026', organismo: 'Oficina Central', responsable: 'Ana Rivas', procedimiento: 'Expediente documental', etapa: 'Ingreso de documentos', estado: 'En trámite' },
  { folio: '2026-00075-S-000003', fechaIngreso: '02-06-2026', organismo: 'Oficina Central', responsable: 'Ana Rivas', procedimiento: 'Prueba combinado', etapa: 'Cierre', estado: 'Terminado' },
  { folio: '2026-00071-S-000022', fechaIngreso: '01-06-2026', organismo: 'Departamento Jurídico', responsable: 'Luis Fuentes', procedimiento: 'Expediente documental', etapa: 'Resolución', estado: 'En trámite' },
  { folio: '2026-00071-S-000018', fechaIngreso: '29-05-2026', organismo: 'Departamento Jurídico', responsable: 'Luis Fuentes', procedimiento: 'Casi sumario', etapa: 'Revisión de antecedentes', estado: 'Observado' },
  { folio: '2026-00060-S-000019', fechaIngreso: '28-05-2026', organismo: 'Subdirección de Operaciones', responsable: 'Juan Pérez', procedimiento: 'Expediente documental', etapa: 'Resolución', estado: 'Rechazado' },
  { folio: '2026-00060-S-000012', fechaIngreso: '22-05-2026', organismo: 'Subdirección de Operaciones', responsable: 'Sofía Reyes', procedimiento: 'Expediente documental', etapa: 'Cierre', estado: 'Terminado' },
];

export const auditoriaColumns: Column[] = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'usuario', label: 'Usuario' },
  { key: 'accion', label: 'Tipo acción' },
  { key: 'detalle', label: 'Detalle' },
  { key: 'expediente', label: 'Expediente' },
  { key: 'materia', label: 'Materia' },
  { key: 'objeto', label: 'Objeto' },
];

export const auditoria = [
  { fecha: '19-06-2026 10:06:59', usuario: 'Juan Pérez', accion: 'Documento actualizado', detalle: '—', expediente: '2026-00094-S-000001', materia: '12', objeto: 'Documento' },
  { fecha: '19-06-2026 10:06:21', usuario: 'Juan Pérez', accion: 'Documento derivado', detalle: 'Se ha derivado el documento a admin.', expediente: '2026-00094-S-000001', materia: '12', objeto: 'Documento' },
  { fecha: '19-06-2026 10:05:29', usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: 'Se agregó OFICIO una "12" al expediente 2026-00094-S-000001.', expediente: '2026-00094-S-000001', materia: '-', objeto: 'Expediente' },
  { fecha: '19-06-2026 10:05:29', usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: 'Se ha subido el documento.', expediente: '2026-00094-S-000001', materia: '12', objeto: 'Documento' },
  { fecha: '19-06-2026 10:04:50', usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: 'Se agregó OFICIO una "12" al expediente 2026-00094-S-000001.', expediente: '2026-00094-S-000001', materia: '-', objeto: 'Expediente' },
  { fecha: '19-06-2026 10:04:50', usuario: 'Juan Pérez', accion: 'Ingreso documento', detalle: 'Se ha subido el documento.', expediente: '2026-00094-S-000001', materia: '12', objeto: 'Documento' },
  { fecha: '19-06-2026 10:04:35', usuario: 'Juan Pérez', accion: 'Ingreso al expediente', detalle: 'Ha ingresado al expediente 2026-00094-S-000001.', expediente: '2026-00094-S-000001', materia: '-', objeto: 'Expediente' },
];

export const documentoColumns: Column[] = [
  { key: 'nombre', label: 'Nombre', type: 'file', iconKey: 'icon' },
  { key: 'propietario', label: 'Propietario' },
  { key: 'ultimaEdicion', label: 'Última edición' },
];

export const documentos = [
  { icon: 'folder', nombre: 'Plantillas', propietario: '—', ultimaEdicion: '—' },
  { icon: 'folder', nombre: 'Proyectos', propietario: '—', ultimaEdicion: '—' },
  { icon: 'folder', nombre: 'Solicitudes', propietario: '—', ultimaEdicion: '—' },
  { icon: 'file', nombre: '119037-16-2026_1.pdf', propietario: 'admin', ultimaEdicion: '20-02-2026' },
  { icon: 'file', nombre: 'Resolucion_exenta_452.pdf', propietario: 'jperez', ultimaEdicion: '18-02-2026' },
  { icon: 'file', nombre: 'Oficio_conductor_003.pdf', propietario: 'admin', ultimaEdicion: '12-02-2026' },
  { icon: 'file', nombre: 'Caratula_expediente.pdf', propietario: 'msoto', ultimaEdicion: '05-02-2026' },
];

export const mantenedores = [
  { slug: 'usuarios', titulo: 'Usuarios', desc: 'Administra los usuarios del sistema y sus roles.', icon: '👤', color: 'blue', badge: 'Genérico' },
  { slug: 'grupos', titulo: 'Grupos', desc: 'Configura grupos y permisos heredados.', icon: '👥', color: 'green', badge: 'Genérico' },
  { slug: 'tipos-documento', titulo: 'Tipos de documento', desc: 'Define los tipos de documento disponibles.', icon: '📄', color: 'purple', badge: 'Genérico' },
  { slug: 'procedimientos', titulo: 'Procedimientos administrativos', desc: 'Mantiene los procedimientos y sus etapas.', icon: '⚙️', color: 'orange', badge: 'Configurable' },
  { slug: 'tamanos', titulo: 'Tipos de tamaño de documento', desc: 'Configura los tamaños permitidos de archivo.', icon: '📐', color: 'blue', badge: 'Genérico' },
  { slug: 'plantillas', titulo: 'Plantillas', desc: 'Gestiona las plantillas de documentos.', icon: '🧩', color: 'green', badge: 'Genérico' },
];

// ---- Mantenedores: una definición por submenú (forma MINVU, datos neutros) ----
export interface MantFiltro { label: string; type: 'input' | 'select' | 'checkbox'; placeholder?: string; options?: string[]; }
export interface MantDef {
  titulo: string; meta?: string;
  filtros: MantFiltro[]; acciones: string[];
  columns: Column[]; rows: Record<string, any>[];
  iconActions?: string[];     // iconos de la columna Acciones (si vacío y actions!==false, usa menú •••)
  actions?: boolean;          // false = sin columna de acciones
  itemsPorPagina?: boolean;   // muestra selector "Items por página"
  general?: { label: string; texto: string };  // banner GENERAL (ej. tamaño máximo)
}
export const mantenedorData: Record<string, MantDef> = {
  usuarios: {
    titulo: 'Mantenedor de Usuarios',
    filtros: [
      { label: 'Buscar por nombre', type: 'input', placeholder: 'Nombre…' },
      { label: 'Nombre usuario', type: 'input', placeholder: 'Usuario…' },
      { label: 'Rol', type: 'select', options: ['Seleccione rol', 'Administrador General', 'Oficial de Partes', 'Ciudadano'] },
      { label: 'Buscar por RUT', type: 'input', placeholder: 'RUT…' },
      { label: 'Mis grupos', type: 'checkbox' },
    ],
    acciones: ['Cargar usuarios', 'Limpiar', 'Buscar', '+ Nuevo'],
    iconActions: ['edit'],
    columns: [
      { key: 'usuario', label: 'Nombre usuario' }, { key: 'nombre', label: 'Nombre' }, { key: 'rol', label: 'Rol' },
      { key: 'unidad', label: 'Unidad' }, { key: 'subrogante', label: 'Subrogante' }, { key: 'activo', label: 'Activo' },
      { key: 'habilitado', label: 'Deshabilitado/Habilitado', type: 'toggle' },
    ],
    rows: [
      { usuario: 'dnieto', nombre: 'Dayana Nieto', rol: 'Administrador General', unidad: 'Oficina Central', subrogante: 'No', activo: 'Sí', habilitado: true },
      { usuario: 'jperez', nombre: 'Juan Pérez Soto', rol: 'Administrador General', unidad: 'Dirección Regional Norte', subrogante: 'No', activo: 'Sí', habilitado: true },
      { usuario: 'msoto', nombre: 'Marta Soto Díaz', rol: 'Oficial de Partes', unidad: 'Unidad de Proyectos', subrogante: 'Sí', activo: 'Sí', habilitado: true },
      { usuario: 'crivas', nombre: 'Carla Rivas Lagos', rol: 'Ciudadano', unidad: '—', subrogante: 'No', activo: 'Sí', habilitado: false },
      { usuario: 'lfuentes', nombre: 'Luis Fuentes Vera', rol: 'Auditor', unidad: 'Departamento Jurídico', subrogante: 'No', activo: 'Sí', habilitado: true },
    ],
  },
  grupos: {
    titulo: 'Mantenedor de Grupos',
    filtros: [
      { label: 'Nombre grupo', type: 'input', placeholder: 'Nombre del grupo…' },
      { label: 'Nombre coordinador', type: 'input', placeholder: 'Coordinador…' },
    ],
    acciones: ['Limpiar', 'Buscar', '+ Nuevo'],
    iconActions: ['edit', 'users', 'user', 'trash'],
    columns: [{ key: 'grupo', label: 'Grupo' }, { key: 'coordinador', label: 'Coordinador' }],
    rows: [
      { grupo: 'Administrador General', coordinador: '—' },
      { grupo: 'Prueba grupo 1', coordinador: 'Dayana Nieto' },
      { grupo: 'Dirección Regional Norte', coordinador: 'Juan Pérez' },
      { grupo: 'Unidad de Proyectos', coordinador: 'Marta Soto' },
      { grupo: 'Oficina Central', coordinador: 'Juan Pérez' },
      { grupo: 'Departamento Jurídico', coordinador: 'Luis Fuentes' },
      { grupo: 'Subdirección de Operaciones', coordinador: 'Ana Rivas' },
    ],
  },
  procedimientos: {
    titulo: 'Mantenedor de procedimientos administrativos',
    meta: 'Versión de despliegue: v24.0 · Fecha de último despliegue: 11-06-2026',
    filtros: [],
    acciones: ['Agregar flujo', 'Desplegar'],
    iconActions: ['refresh', 'download', 'eye'],
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }, { key: 'organizacion', label: 'Organización' },
      { key: 'version', label: 'Versión' }, { key: 'desplegada', label: 'Versión desplegada' }, { key: 'actualizacion', label: 'Fecha actualización' },
    ],
    rows: [
      { nombre: 'prueba', descripcion: 'Flujo BPM de prueba', organizacion: 'Todos', version: '1.0', desplegada: '1.0', actualizacion: '02-02-2026' },
      { nombre: 'validate-and-sign', descripcion: 'Proceso de validar y firmar', organizacion: 'Todos', version: '1.0', desplegada: '1.0', actualizacion: '20-01-2026' },
      { nombre: 'request', descripcion: 'Proceso de derivación', organizacion: 'Todos', version: '15.0', desplegada: '15.0', actualizacion: '11-06-2026' },
      { nombre: 'Visación', descripcion: 'Visación', organizacion: 'Todos', version: '10.0', desplegada: '10.0', actualizacion: '11-06-2026' },
      { nombre: 'Revisión', descripcion: 'Revisión', organizacion: 'Todos', version: '6.0', desplegada: '6.0', actualizacion: '11-06-2026' },
      { nombre: 'simple', descripcion: 'Flujo BPM simple de formulario personalizado', organizacion: 'Todos', version: '3.0', desplegada: '3.0', actualizacion: '02-02-2026' },
      { nombre: 'Archivar', descripcion: 'Archivar', organizacion: 'Todos', version: '9.0', desplegada: '9.0', actualizacion: '11-06-2026' },
    ],
  },
  'tipos-documento': {
    titulo: 'Tipos de Documentos',
    filtros: [
      { label: 'Buscar', type: 'input', placeholder: 'Buscar…' },
      { label: 'Estado', type: 'select', options: ['Selecciona el estado', 'Activo', 'Inactivo'] },
    ],
    acciones: ['Limpiar', 'Buscar', '+ Agregar'],
    itemsPorPagina: true,
    columns: [
      { key: 'tipo', label: 'Tipo de documento' }, { key: 'sigla', label: 'Sigla' }, { key: 'tipoFirma', label: 'Tipo firma' },
      { key: 'multiples', label: 'Múltiples firmas', type: 'toggle' }, { key: 'organismo', label: 'Organismo' },
      { key: 'oficinaParte', label: 'Oficina de parte', type: 'toggle' }, { key: 'entradaSalida', label: 'Entrada/Salida' },
      { key: 'estado', label: 'Estado', type: 'toggle' },
    ],
    rows: [
      { tipo: 'prueba', sigla: 'A', tipoFirma: 'Firma simple, FEA', multiples: true, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: true },
      { tipo: 'Circular', sigla: 'CIR', tipoFirma: 'Firma simple, FEA', multiples: false, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: true },
      { tipo: 'Carta', sigla: 'CAR', tipoFirma: 'Firma simple, FEA', multiples: true, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: false },
      { tipo: 'Documento entrada', sigla: 'DEP', tipoFirma: 'Firma simple', multiples: false, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: true },
      { tipo: 'Documento salida', sigla: 'DSP', tipoFirma: 'Firma simple', multiples: true, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: false },
      { tipo: 'Numeración manual', sigla: 'MAN', tipoFirma: 'Firma simple, FEA', multiples: true, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: false },
      { tipo: 'Resolución médica', sigla: 'RM', tipoFirma: '—', multiples: false, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: true },
      { tipo: 'Antecedente', sigla: 'ANTE', tipoFirma: '—', multiples: false, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: true },
      { tipo: 'Oficio', sigla: 'OFI', tipoFirma: '—', multiples: false, organismo: 'Todos', oficinaParte: true, entradaSalida: 'Ambos', estado: true },
    ],
  },
  plantillas: {
    titulo: 'Mantenedor de Plantillas',
    filtros: [
      { label: 'Selecciona el tipo', type: 'select', options: ['Selecciona el tipo', 'Expediente documental', 'Documento'] },
      { label: 'Estado', type: 'select', options: ['Selecciona el estado', 'Habilitado', 'Deshabilitado'] },
    ],
    acciones: ['Limpiar', 'Buscar', '+ Nuevo'],
    actions: false,
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'tipo', label: 'Tipo' }, { key: 'grupos', label: 'Grupos', type: 'chips' },
      { key: 'documaker', label: 'Tipo Documaker' },
      { key: 'modDoc', label: 'Modificar documento', type: 'edit' }, { key: 'modPlantilla', label: 'Modificar plantilla', type: 'edit' },
      { key: 'habilitado', label: 'Habilitar/Deshabilitar', type: 'toggle' },
    ],
    rows: [
      { nombre: 'prueba nuevo docx', tipo: 'Expediente documental', grupos: ['Dirección Regional Norte'], documaker: '—', habilitado: true },
      { nombre: 'c', tipo: 'Expediente documental', grupos: [], documaker: '—', habilitado: true },
      { nombre: 'plantilla nueva', tipo: 'Expediente documental', grupos: ['Oficina Central'], documaker: '—', habilitado: true },
      { nombre: 'prueba 29', tipo: 'Expediente documental', grupos: ['Oficina Central', 'Departamento Jurídico'], documaker: '—', habilitado: true },
    ],
  },
  tamanos: {
    titulo: 'Tamaño documento',
    general: { label: 'GENERAL', texto: 'Tamaño máximo soportado para la subida de archivos. 150' },
    filtros: [{ label: 'Buscar', type: 'input', placeholder: 'Buscar…' }],
    acciones: ['Buscar', 'Limpiar', '+ Agregar'],
    itemsPorPagina: true,
    iconActions: ['edit', 'trash'],
    columns: [
      { key: 'nombre', label: 'Nombre' }, { key: 'maximo', label: 'Tamaño máximo' },
      { key: 'descripcion', label: 'Descripción' }, { key: 'habilitado', label: 'Habilitar/Deshabilitar', type: 'toggle' },
    ],
    rows: [
      { nombre: 'word', maximo: '100 MB', descripcion: 'Valida tamaño máximo de documentos word', habilitado: true },
      { nombre: 'excel', maximo: '111 MB', descripcion: '—', habilitado: true },
      { nombre: 'PDF', maximo: '50 MB', descripcion: '—', habilitado: true },
    ],
  },
};

// ---- Tareas / Solicitudes ----
export const tareaColumns: Column[] = [
  { key: 'tipo', label: 'Tipo' }, { key: 'asunto', label: 'Asunto' }, { key: 'asignado', label: 'Asignado a' },
  { key: 'vencimiento', label: 'Vencimiento' }, { key: 'estado', label: 'Estado', type: 'badge' },
];
export const tareas = [
  { tipo: 'Revisión', asunto: 'Revisar antecedentes 2026-00088-S-000014', asignado: 'Marta Soto', vencimiento: '28-06-2026', estado: 'Pendiente' },
  { tipo: 'Firma', asunto: 'Firmar resolución exenta 452', asignado: 'Juan Pérez', vencimiento: '27-06-2026', estado: 'En curso' },
  { tipo: 'Despacho', asunto: 'Despachar oficio conductor 003', asignado: 'Carlos Díaz', vencimiento: '26-06-2026', estado: 'Terminado' },
  { tipo: 'Revisión', asunto: 'Calificar solicitud 2026-00094-S-000001', asignado: 'Juan Pérez', vencimiento: '29-06-2026', estado: 'Pendiente' },
];

// ---- Oficina de Partes ----
export const oficinaColumns: Column[] = [
  { key: 'documento', label: 'Documento' }, { key: 'remitente', label: 'Remitente' }, { key: 'fecha', label: 'Fecha recepción' },
  { key: 'tipo', label: 'Tipo' }, { key: 'estado', label: 'Estado', type: 'badge' },
];
export const oficinaPartes = [
  { documento: 'OFICIO-2026-1124', remitente: 'Unidad de Proyectos', fecha: '25-06-2026', tipo: 'Ingreso', estado: 'Sin asignar' },
  { documento: 'CARTA-2026-0098', remitente: 'Ciudadano · R. González', fecha: '24-06-2026', tipo: 'Ingreso', estado: 'Derivado' },
  { documento: 'OFICIO-2026-1119', remitente: 'Subdirección de Operaciones', fecha: '23-06-2026', tipo: 'Despacho', estado: 'Despachado' },
];

// ---- Oficina de Partes: Entrante (forma MINVU, skin LexDocs) ----
export const opEntranteColumns: Column[] = [
  { key: 'expediente', label: 'Expediente' },
  { key: 'nDoc', label: 'Número documento' },
  { key: 'materia', label: 'Materia documento' },
  { key: 'origen', label: 'Origen (de)' },
  { key: 'fechaIngreso', label: 'Fecha ingreso' },
  { key: 'para', label: 'Para' },
  { key: 'ingresadoPor', label: 'Ingresado por' },
];
export const opEntranteAcciones = [
  'Rechazar', 'Marcar como reservado', 'Visualizar', 'Historial', 'Asignar a Expediente',
  'Abrir documento', 'Recepcionar y derivar', 'Nuevo Expediente', 'Editar información documento',
  'Eliminar', 'Abrir comprobante',
];
export const opEntranteAccionesIconos: Record<string, string> = {
  'Rechazar': 'x-circle', 'Marcar como reservado': 'lock', 'Visualizar': 'eye', 'Historial': 'clock',
  'Asignar a Expediente': 'edit', 'Abrir documento': 'file', 'Recepcionar y derivar': 'forward',
  'Nuevo Expediente': 'log-in', 'Editar información documento': 'file-text', 'Eliminar': 'trash',
  'Abrir comprobante': 'file',
};

// ---- Oficina de Partes: Saliente (tabs Firmados / Publicados / Despachados) ----
export const salienteColumns: Column[] = [
  { key: 'expediente', label: 'Expediente' },
  { key: 'nDocSalida', label: 'Núm. doc. salida' },
  { key: 'materia', label: 'Materia documento' },
  { key: 'origen', label: 'Origen (de)' },
  { key: 'fechaIngreso', label: 'Fecha ingreso' },
  { key: 'para', label: 'Para' },
  { key: 'ingresadoPor', label: 'Ingresado por' },
];
export const salienteDespachadosColumns: Column[] = [
  ...salienteColumns,
  { key: 'despachos', label: 'Despachos', type: 'icon', icon: 'swap' },
];
export const salienteFirmados = [
  { expediente: '2026-00094-A-000017', nDocSalida: 'Sin folio', materia: 'Resolución de aprobación', origen: '-', fechaIngreso: '01-06-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
];
export const salientePublicados = [
  { expediente: '2026-00094-A-000018', nDocSalida: 'Sin folio', materia: 'Oficio de notificación', origen: '-', fechaIngreso: '01-06-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
];
export const salienteDespachados = [
  { expediente: '2026-00094-A-000003', nDocSalida: '2026-00094-RES-000010', materia: 'Resolución exenta', origen: '-', fechaIngreso: '24-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: '2026-00094-A-000003', nDocSalida: '2026-00094-OFI-000001', materia: 'Oficio conductor', origen: '-', fechaIngreso: '21-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: '2026-00094-A-000003', nDocSalida: 'Sin folio', materia: 'Memorándum interno', origen: '-', fechaIngreso: '20-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: '2026-00094-A-000003', nDocSalida: 'Sin folio', materia: 'Carta de respuesta', origen: '-', fechaIngreso: '17-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: '2026-00094-A-000003', nDocSalida: 'Sin folio', materia: 'Informe técnico', origen: '-', fechaIngreso: '17-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
];
export const salienteMenus: Record<string, string[]> = {
  firmados: ['Marcar como reservado', 'Visualizar', 'Publicar', 'Historial', 'Abrir documento', 'Anular Documento', 'Derivar'],
  publicados: ['Marcar como reservado', 'Visualizar', 'Historial', 'Abrir documento', 'Compartir documento', 'DocDigital', 'Despacho Manual', 'Notificación Correo'],
  despachados: ['Marcar como reservado', 'Visualizar', 'Historial', 'Abrir documento', 'Registro Envío Archivo Nacional', 'Registro Publicación Diario Oficial', 'DocDigital', 'Despacho Manual', 'Notificación Correo'],
};
export const salienteMenuIconos: Record<string, string> = {
  'Marcar como reservado': 'lock', 'Visualizar': 'eye', 'Publicar': 'upload', 'Historial': 'clock',
  'Abrir documento': 'file', 'Anular Documento': 'x-circle', 'Derivar': 'swap',
  'Compartir documento': 'share', 'DocDigital': 'file-text', 'Despacho Manual': 'monitor', 'Notificación Correo': 'mail',
  'Registro Envío Archivo Nacional': 'send', 'Registro Publicación Diario Oficial': 'send',
};
export const opEntrante = [
  { expediente: 'Sin expediente', nDoc: '-', materia: 'Ingreso de prueba', origen: '-', fechaIngreso: '14-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: 'Sin expediente', nDoc: '-', materia: 'Solicitud de certificado', origen: '-', fechaIngreso: '12-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: 'Sin expediente', nDoc: '-', materia: 'Oficio de derivación', origen: '-', fechaIngreso: '09-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: 'Sin expediente', nDoc: '-', materia: 'Carta de respuesta', origen: '-', fechaIngreso: '13-02-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: 'Sin expediente', nDoc: '-', materia: 'Memorándum interno', origen: '-', fechaIngreso: '13-02-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
];

// ---- Bandeja de Entrada (Por Resolver / Mis Pendientes / Historial) ----
export interface SolicitudHist { autor: string; fecha: string; texto: string; }
export interface Solicitud {
  variante: 'revision' | 'visar-firmar';
  titulo: string; expedienteLabel: string;
  solicitadoPor: string; fechaSolicitud: string; asignadoPor: string; fechaAsignacion: string;
  materia: string; tipoDoc: string;
  fechaLimite: string; estado: string; estadoTexto: string;
  docPrincipal: string; anexos: string[];
  historial: SolicitudHist[]; detalles: string;
}

const histDeriv = (fecha: string, instr: string): SolicitudHist =>
  ({ autor: 'Dayana Nieto', fecha, texto: `Solicitud derivada a Dayana Nieto con la instrucción de "${instr}"` });

export const porResolver: Solicitud[] = [
  { variante: 'revision', titulo: 'Revisión documento N°17 - Distribución', expedienteLabel: '2026-00094-A-000017 test',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '23-04-2026, 15:57', asignadoPor: 'Dayana Nieto', fechaAsignacion: '23-04-2026, 15:57',
    materia: 'Ingreso expediente', tipoDoc: 'CIRCULAR', fechaLimite: '23-04-2026, 15:57', estado: 'Vencida', estadoTexto: 'Vencida hace 67 días',
    docPrincipal: 'PL2.pdf', anexos: [], historial: [histDeriv('23-04-26 15:57', 'Distribución')],
    detalles: 'Documento recibido por Oficina de Partes. Favor revisar antecedentes y distribuir a la unidad correspondiente.' },
  { variante: 'revision', titulo: 'Visación documento N°15 - Solicitud de Visación', expedienteLabel: '2026-00094-A-000018 prueba expediente',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '08-06-2026, 12:46', asignadoPor: 'Dayana Nieto', fechaAsignacion: '16-06-2026, 11:38',
    materia: 'Solicitud de visación', tipoDoc: 'OFICIO', fechaLimite: '16-06-2026, 10:38', estado: 'Vencida', estadoTexto: 'Vencida hace 14 días',
    docPrincipal: 'Oficio_visacion.pdf', anexos: ['Anexo_1.pdf'], historial: [histDeriv('16-06-26 11:38', 'Visación')],
    detalles: 'Requiere visación de la jefatura antes de continuar el trámite.' },
  { variante: 'revision', titulo: 'Revisión documento N°17 - Revisión', expedienteLabel: '2026-00094-A-000020 asd',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '16-06-2026, 10:41', asignadoPor: 'Dayana Nieto', fechaAsignacion: '16-06-2026, 10:41',
    materia: 'Revisión de antecedentes', tipoDoc: 'OFICIO', fechaLimite: '16-06-2026, 17:00', estado: 'Vencida', estadoTexto: 'Vencida hace 13 días',
    docPrincipal: 'Documento_revision.pdf', anexos: [], historial: [histDeriv('16-06-26 10:41', 'Revisión')],
    detalles: 'Revisar conformidad de los antecedentes adjuntos.' },
  { variante: 'revision', titulo: 'Revisión documento N°18 - Revisión', expedienteLabel: '2026-00094-A-000020 asd',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '16-06-2026, 10:41', asignadoPor: 'Dayana Nieto', fechaAsignacion: '16-06-2026, 10:41',
    materia: 'Observación de documento', tipoDoc: 'OFICIO', fechaLimite: '16-06-2026, 17:00', estado: 'Vencida', estadoTexto: 'Vencida hace 13 días',
    docPrincipal: 'Documento_obs.pdf', anexos: [], historial: [histDeriv('16-06-26 10:41', 'Revisión')],
    detalles: 'Se observan inconsistencias en el folio. Verificar.' },
  { variante: 'visar-firmar', titulo: 'Enviar a visar o firmar documento N°21 - [Revisar]Solicitud de Visación', expedienteLabel: '2026-00094-S-000001 aa',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '19-06-2026, 10:06', asignadoPor: 'Dayana Nieto', fechaAsignacion: '19-06-2026, 10:07',
    materia: 'Solicitud de visación', tipoDoc: 'OFICIO', fechaLimite: '19-06-2026, 18:00', estado: 'Vencida', estadoTexto: 'Vencida hace 10 días',
    docPrincipal: 'test-document.pdf', anexos: [], historial: [histDeriv('19-06-26 10:07', 'Revisar')],
    detalles: 'Documento listo para visación o firma. Revisar antes de enviar.' },
];

// -- Tareas rechazadas (Oficina de Partes): tareas devueltas, todas vencidas -> modal Resolver --
export const tareasRechazadas: Solicitud[] = [
  { variante: 'revision', titulo: 'Revisión documento N°18 - [Devolución]Revisión', expedienteLabel: '2026-00094-A-000018 trámite',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '30-04-2026, 09:38', asignadoPor: 'Dayana Nieto', fechaAsignacion: '30-04-2026, 10:02',
    materia: 'Revisión de antecedentes', tipoDoc: 'RESOLUCIÓN', fechaLimite: '30-04-2026, 17:00', estado: 'Vencida', estadoTexto: 'Vencida hace 60 días',
    docPrincipal: 'Documento sin título.pdf', anexos: [], historial: [histDeriv('30-04-26 10:02', 'Revisión')],
    detalles: 'Tarea devuelta por la unidad de destino. Revisar observaciones y reasignar.' },
  { variante: 'revision', titulo: 'Revisión documento N°22 - [Devolución]Distribución', expedienteLabel: '2026-00094-A-000022 distribución',
    solicitadoPor: 'Dayana Nieto', fechaSolicitud: '12-05-2026, 11:20', asignadoPor: 'Dayana Nieto', fechaAsignacion: '12-05-2026, 11:45',
    materia: 'Distribución de oficio', tipoDoc: 'OFICIO', fechaLimite: '12-05-2026, 18:00', estado: 'Vencida', estadoTexto: 'Vencida hace 48 días',
    docPrincipal: 'Oficio_distribucion.pdf', anexos: [], historial: [histDeriv('12-05-26 11:45', 'Distribución')],
    detalles: 'Distribución rechazada: unidad incorrecta. Corregir destino.' },
];

// -- Mis Pendientes / Historial (tarjetas con "ojo" -> modal solo lectura) --
export interface SolicitudLista {
  titulo: string; modalTitulo: string;
  ultimaActividad: string; procedimiento: string;
  fechaCreacion: string; fechaResolucion: string; estado: string;
  docPrincipal: string; anexos: string[];
  historial: SolicitudHist[]; detalles: string;
  infoTipoDoc: string; infoMateria: string;
}
const pend = (n: number, ult: string, proc: string, creacion: string): SolicitudLista =>
  ({ titulo: `Visación N°${n} - Solicitud de Visación`, modalTitulo: `N°${n} - Solicitud de Visación`,
     ultimaActividad: ult, procedimiento: proc, fechaCreacion: creacion, fechaResolucion: creacion.replace(/, .*/, ', 18:00'),
     estado: 'PENDIENTE', docPrincipal: 'aaaa.pdf', anexos: [], historial: [histDeriv(creacion, 'Visación')],
     detalles: 'Solicitud pendiente de visación.', infoTipoDoc: 'OFICIO', infoMateria: 'Solicitud de visación' });
export const misPendientes: SolicitudLista[] = [
  pend(8, '[Revisión] - Solicitud resuelta con el comentario: conforme', 'Visación simple', '27-03-2026, 11:42'),
  pend(6, '[Revisión] - Solicitud resuelta con el comentario: conforme', 'Expediente documental', '27-03-2026, 11:22'),
  pend(9, '[Solicitud de Visación] - Solicitud reenviada al emisor', 'Visación simple', '27-03-2026, 11:47'),
  pend(5, '[Solicitud de Visación] - Solicitud reenviada al emisor', 'Prueba combinado', '27-03-2026, 11:11'),
  pend(4, '[Solicitud de Visación] - Solicitud reenviada al emisor', 'Expediente documental', '25-03-2026, 16:29'),
  pend(3, '[Solicitud de Visación] - Solicitud reenviada al emisor', 'Visación simple', '25-03-2026, 15:10'),
];
export const historialSolicitudes: SolicitudLista[] = [
  { titulo: 'Visación N°17 - Solicitud de Visación', modalTitulo: 'N°17 - Solicitud de Visación', ultimaActividad: 'Solicitud derivada con la instrucción de Revisión', procedimiento: '', fechaCreacion: '16-06-2026, 10:41', fechaResolucion: '16-06-2026, 18:00', estado: 'PENDIENTE', docPrincipal: 'test-document.pdf', anexos: [], historial: [histDeriv('16-06-26 10:41', 'Revisión')], detalles: 'En espera de revisión.', infoTipoDoc: 'OFICIO', infoMateria: 'Solicitud de visación' },
  { titulo: 'Visación N°18 - Solicitud de Visación', modalTitulo: 'N°18 - Solicitud de Visación', ultimaActividad: 'Solicitud derivada con la instrucción de Revisión', procedimiento: '', fechaCreacion: '16-06-2026, 10:41', fechaResolucion: '16-06-2026, 18:00', estado: 'PENDIENTE', docPrincipal: 'test-document.pdf', anexos: [], historial: [histDeriv('16-06-26 10:41', 'Revisión')], detalles: 'En espera de revisión.', infoTipoDoc: 'OFICIO', infoMateria: 'Solicitud de visación' },
  { titulo: 'Revisión N°24 - Solicitud de Revisión', modalTitulo: 'N°24 - Solicitud de Revisión', ultimaActividad: '[Revisión] - Solicitud resuelta sin comentarios', procedimiento: '', fechaCreacion: '16-06-2026, 12:25', fechaResolucion: '16-06-2026, 18:00', estado: 'RESUELTA', docPrincipal: 'Documento_revision.pdf', anexos: [], historial: [histDeriv('16-06-26 12:25', 'Revisión'), { autor: 'Dayana Nieto', fecha: '16-06-26 13:10', texto: 'Revisión terminada sin comentarios.' }], detalles: 'Revisión conforme.', infoTipoDoc: 'OFICIO', infoMateria: 'Revisión de antecedentes' },
  { titulo: 'Visación N°19 - Solicitud de Visación', modalTitulo: 'N°19 - Solicitud de Visación', ultimaActividad: '[Revisión] - Solicitud resuelta sin comentarios', procedimiento: '', fechaCreacion: '16-06-2026, 12:28', fechaResolucion: '16-06-2026, 18:00', estado: 'PENDIENTE', docPrincipal: 'test-document.pdf', anexos: [], historial: [histDeriv('16-06-26 12:28', 'Revisión')], detalles: 'En espera de visación.', infoTipoDoc: 'OFICIO', infoMateria: 'Solicitud de visación' },
  { titulo: 'Visación N°20 - Solicitud de Visación', modalTitulo: 'N°20 - Solicitud de Visación', ultimaActividad: 'Solicitud enviada a archivar con el motivo: duplicado', procedimiento: '', fechaCreacion: '16-06-2026, 12:29', fechaResolucion: '16-06-2026, 18:00', estado: 'RESUELTA', docPrincipal: 'Oficio_visacion.pdf', anexos: [], historial: [histDeriv('16-06-26 12:29', 'Revisión'), { autor: 'Dayana Nieto', fecha: '16-06-26 14:00', texto: 'Solicitud archivada (duplicado).' }], detalles: 'Archivada por duplicidad.', infoTipoDoc: 'OFICIO', infoMateria: 'Solicitud de visación' },
  { titulo: 'Revisión N°22 - Solicitud de Revisión', modalTitulo: 'N°22 - Solicitud de Revisión', ultimaActividad: '[Revisión] - Solicitud resuelta con comentarios', procedimiento: '', fechaCreacion: '15-06-2026, 09:40', fechaResolucion: '15-06-2026, 18:00', estado: 'RESUELTA', docPrincipal: 'Documento_revision.pdf', anexos: [], historial: [histDeriv('15-06-26 09:40', 'Revisión'), { autor: 'Dayana Nieto', fecha: '15-06-26 11:20', texto: 'Revisión terminada con comentarios.' }], detalles: 'Revisión con observaciones menores.', infoTipoDoc: 'OFICIO', infoMateria: 'Revisión de antecedentes' },
];

// ---- Portal Ciudadano ----
// ---- Reportes y Estadísticas ----
export const reportesCards = [
  { titulo: 'Documentos entrada y salida', icon: '🧾', ruta: 'reportes/documentos-es' },
  { titulo: 'Silencio Administrativo', icon: '🗂️', ruta: 'reportes/silencio' },
  { titulo: 'Archivo Nacional', icon: '🏛️', ruta: 'reportes/archivo-nacional' },
  { titulo: 'Diario Oficial', icon: '📰', ruta: 'reportes/diario-oficial' },
  { titulo: 'Documentos cancelados', icon: '🚫', ruta: 'reportes/cancelados' },
  { titulo: 'Asignaciones pendientes', icon: '⏳', ruta: 'reportes/asignaciones' },
];

export interface ReportDef {
  titulo: string; subtitulo: string; kpis: { val: string; label: string }[];
  chart: { tipo: 'bar' | 'donut'; labels: string[]; data: number[] };
  columns: Column[]; rows: Record<string, any>[];
}
export const reportDefs: Record<string, ReportDef> = {
  'documentos-es': {
    titulo: 'Documentos entrada y salida', subtitulo: 'Flujo de documentos recibidos y despachados.',
    kpis: [{ val: '482', label: 'Total documentos' }, { val: '310', label: 'Entrada' }, { val: '172', label: 'Salida' }],
    chart: { tipo: 'bar', labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], data: [62, 78, 91, 70, 95, 86] },
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'tipo', label: 'Tipo' }, { key: 'operacion', label: 'Operación', type: 'badge' }, { key: 'fecha', label: 'Fecha' }, { key: 'organismo', label: 'Organismo' }],
    rows: [
      { documento: 'OFICIO-2026-1124', tipo: 'Oficio', operacion: 'Entrada', fecha: '25-06-2026', organismo: 'Unidad de Proyectos' },
      { documento: 'OFICIO-2026-1119', tipo: 'Oficio', operacion: 'Salida', fecha: '23-06-2026', organismo: 'Subdirección de Operaciones' },
      { documento: 'MEMO-2026-0451', tipo: 'Memorándum', operacion: 'Entrada', fecha: '24-06-2026', organismo: 'Departamento Jurídico' },
    ],
  },
  silencio: {
    titulo: 'Silencio Administrativo', subtitulo: 'Expedientes según el plazo legal de respuesta.',
    kpis: [{ val: '41', label: 'A tiempo' }, { val: '6', label: 'En riesgo' }, { val: '2', label: 'Vencidos' }],
    chart: { tipo: 'donut', labels: ['A tiempo', 'En riesgo', 'Vencido'], data: [41, 6, 2] },
    columns: [{ key: 'expediente', label: 'Expediente' }, { key: 'materia', label: 'Materia' }, { key: 'plazo', label: 'Plazo' }, { key: 'dias', label: 'Días restantes' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { expediente: '2026-00088-S-000014', materia: 'Solicitud de subsidio', plazo: '30-06-2026', dias: 4, estado: 'En riesgo' },
      { expediente: '2026-00071-S-000018', materia: 'Recepción de obra', plazo: '28-06-2026', dias: 2, estado: 'En riesgo' },
      { expediente: '2026-00060-S-000019', materia: 'Reclamo', plazo: '20-06-2026', dias: -2, estado: 'Vencido' },
    ],
  },
  'archivo-nacional': {
    titulo: 'Archivo Nacional', subtitulo: 'Expedientes transferidos al Archivo Nacional.',
    kpis: [{ val: '128', label: 'Enviados' }, { val: '14', label: 'Pendientes' }, { val: '3', label: 'Rechazados' }],
    chart: { tipo: 'bar', labels: ['2022', '2023', '2024', '2025', '2026'], data: [18, 24, 31, 37, 18] },
    columns: [{ key: 'expediente', label: 'Expediente' }, { key: 'lote', label: 'Lote' }, { key: 'fechaEnvio', label: 'Fecha envío' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { expediente: '2025-00012-S-000004', lote: 'LT-2026-04', fechaEnvio: '12-06-2026', estado: 'Enviado' },
      { expediente: '2025-00010-S-000002', lote: 'LT-2026-04', fechaEnvio: '12-06-2026', estado: 'Pendiente' },
    ],
  },
  'diario-oficial': {
    titulo: 'Diario Oficial', subtitulo: 'Resoluciones enviadas a publicación.',
    kpis: [{ val: '57', label: 'Publicados' }, { val: '9', label: 'En cola' }, { val: '2', label: 'Observados' }],
    chart: { tipo: 'bar', labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], data: [8, 11, 9, 7, 12, 10] },
    columns: [{ key: 'resolucion', label: 'Resolución' }, { key: 'edicion', label: 'Edición' }, { key: 'fecha', label: 'Fecha publicación' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { resolucion: 'RES-EX-452', edicion: 'N° 43.901', fecha: '18-06-2026', estado: 'Publicado' },
      { resolucion: 'RES-EX-449', edicion: '—', fecha: '—', estado: 'En cola' },
    ],
  },
  cancelados: {
    titulo: 'Documentos cancelados', subtitulo: 'Documentos anulados y su motivo.',
    kpis: [{ val: '23', label: 'Cancelados' }, { val: '5', label: 'Este mes' }, { val: 'Duplicado', label: 'Motivo principal' }],
    chart: { tipo: 'donut', labels: ['Duplicado', 'Error de carga', 'Solicitud usuario'], data: [11, 7, 5] },
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'motivo', label: 'Motivo' }, { key: 'fecha', label: 'Fecha' }, { key: 'usuario', label: 'Usuario' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { documento: 'OFICIO-2026-1088', motivo: 'Duplicado', fecha: '19-06-2026', usuario: 'Marta Soto', estado: 'Cancelado' },
      { documento: 'MEMO-2026-0440', motivo: 'Error de carga', fecha: '15-06-2026', usuario: 'Carlos Díaz', estado: 'Cancelado' },
    ],
  },
  asignaciones: {
    titulo: 'Asignaciones pendientes', subtitulo: 'Tareas asignadas sin resolver por responsable.',
    kpis: [{ val: '18', label: 'Pendientes' }, { val: '4', label: 'Vencidas' }, { val: '6', label: 'Vencen hoy' }],
    chart: { tipo: 'bar', labels: ['J. Pérez', 'M. Soto', 'C. Díaz', 'A. Rivas', 'L. Fuentes'], data: [5, 4, 3, 4, 2] },
    columns: [{ key: 'tarea', label: 'Tarea' }, { key: 'asignado', label: 'Asignado a' }, { key: 'expediente', label: 'Expediente' }, { key: 'vencimiento', label: 'Vencimiento' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { tarea: 'Revisar antecedentes', asignado: 'Marta Soto', expediente: '2026-00088-S-000014', vencimiento: '28-06-2026', estado: 'Pendiente' },
      { tarea: 'Calificar solicitud', asignado: 'Juan Pérez', expediente: '2026-00094-S-000001', vencimiento: '29-06-2026', estado: 'Pendiente' },
      { tarea: 'Firmar resolución', asignado: 'Ana Rivas', expediente: '2026-00075-S-000007', vencimiento: '26-06-2026', estado: 'Vencida' },
    ],
  },
};

// ---- Buscador de documentos (resultados tipo card) ----
export const documentosBusqueda = [
  { nombre: '📄 Resolucion_452.pdf', materia: '2202030331165', tipo: 'Circular', nDoc: 'Sin folio', anio: '2026', autor: 'Juan Pérez', origen: '—', operacion: 'Salida', fechaIngreso: '30-04-2026', para: '—' },
  { nombre: '📝 anexo-200.docx', materia: 'Registro adjunto', tipo: 'Adjunto', nDoc: '—', anio: '2026', autor: 'Marta Soto', origen: '—', operacion: 'Entrada', fechaIngreso: '24-04-2026', para: '—' },
  { nombre: '📄 anexo-199.pdf', materia: 'Registro adjunto', tipo: 'Adjunto', nDoc: '—', anio: '2026', autor: 'Marta Soto', origen: '—', operacion: 'Entrada', fechaIngreso: '24-04-2026', para: '—' },
  { nombre: '📝 anexo-198.docx', materia: 'Registro adjunto', tipo: 'Adjunto', nDoc: '—', anio: '2026', autor: 'Carlos Díaz', origen: '—', operacion: 'Entrada', fechaIngreso: '24-04-2026', para: '—' },
  { nombre: '📄 oficio-conductor-003.pdf', materia: 'Oficio de despacho', tipo: 'Oficio', nDoc: '003', anio: '2026', autor: 'Juan Pérez', origen: 'Oficina de Partes', operacion: 'Salida', fechaIngreso: '12-04-2026', para: 'Unidad de Proyectos' },
  { nombre: '📝 acta-recepcion-014.docx', materia: 'Acta de recepción', tipo: 'Antecedente', nDoc: '014', anio: '2026', autor: 'Ana Rivas', origen: '—', operacion: 'Entrada', fechaIngreso: '05-04-2026', para: '—' },
];

export const ciudadanoSolicitudes = [
  { folio: '2026-00094-S-000001', fechaIngreso: '24-06-2026', organismo: 'Dirección Regional Norte', responsable: '—', procedimiento: 'Expediente documental', etapa: 'Calificación de la solicitud', estado: 'En trámite' },
  { folio: '2026-00075-S-000003', fechaIngreso: '02-06-2026', organismo: 'Oficina Central', responsable: '—', procedimiento: 'Prueba combinado', etapa: 'Cierre', estado: 'Terminado' },
];

// ---- Documento: versiones y permisos ----
export const versionColumns: Column[] = [
  { key: 'version', label: 'Versión' }, { key: 'fecha', label: 'Fecha' }, { key: 'autor', label: 'Autor' }, { key: 'comentario', label: 'Comentario' },
];
export const documentoVersiones = [
  { version: 'v3', fecha: '20-02-2026', autor: 'admin', comentario: 'Corrección de carátula' },
  { version: 'v2', fecha: '18-02-2026', autor: 'jperez', comentario: 'Ajuste de numeración' },
  { version: 'v1', fecha: '12-02-2026', autor: 'admin', comentario: 'Versión inicial' },
];
export const permisoColumns: Column[] = [
  { key: 'destino', label: 'Usuario / Grupo' }, { key: 'tipo', label: 'Tipo' }, { key: 'permiso', label: 'Permiso', type: 'badge' },
];
export const documentoPermisos = [
  { destino: 'Juan Pérez', tipo: 'Usuario', permiso: 'Edición' },
  { destino: 'Grupo Jurídico', tipo: 'Grupo', permiso: 'Lectura' },
  { destino: 'Marta Soto', tipo: 'Usuario', permiso: 'Lectura' },
];

// ---- Bandeja de Firmas (estructura del gestor: nombre, tipo, materia, expediente, doc, fecha, estado, tipo firma, visaciones) ----
export interface DocFirma {
  nombre: string; tipoDoc: string; materia: string; expediente: string; documento: string;
  fechaCreacion: string; estado: string; tipoFirma: string; folio: string; fechaFirma: string;
}
export const documentosPorFirmar: DocFirma[] = [
  // Por firmar (Pendiente / Fallido)
  { nombre: 'prueba_1.pdf', tipoDoc: 'ANTECEDENTE', materia: 'Antecedente adjunto', expediente: '2026-00875-A-000053', documento: '97562', fechaCreacion: '16-06-2026', estado: 'Pendiente', tipoFirma: '—', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: 'test-document.pdf', tipoDoc: 'CIRCULAR', materia: 'Circular informativa', expediente: '2026-00094-A-000008', documento: '91824', fechaCreacion: '16-06-2026', estado: 'Pendiente', tipoFirma: '—', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: 'Documento sin título.pdf', tipoDoc: 'RESOLUCIÓN', materia: 'Resolución exenta', expediente: '2026-00874-A-000058', documento: '97470', fechaCreacion: '11-06-2026', estado: 'Pendiente', tipoFirma: 'Firma Gob', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: 'test-document.pdf', tipoDoc: 'OFICIO', materia: 'Oficio de respuesta', expediente: '2026-00094-A-000019', documento: '97453', fechaCreacion: '10-06-2026', estado: 'Pendiente', tipoFirma: '—', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: 'Prueba_tareas.pdf', tipoDoc: 'OFICIO', materia: 'Solicitud de firma', expediente: '2026-00094-A-000009', documento: '92833', fechaCreacion: '08-05-2026', estado: 'Pendiente', tipoFirma: '—', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: '30mb.pdf', tipoDoc: 'RESOLUCIÓN', materia: 'Resolución de archivo', expediente: '2026-00094-A-000003', documento: '91732', fechaCreacion: '24-04-2026', estado: 'Fallido', tipoFirma: 'Firma Gob', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: '10mb.pdf', tipoDoc: 'RESOLUCIÓN', materia: 'Resolución de cierre', expediente: '2026-00094-A-000003', documento: '91730', fechaCreacion: '24-04-2026', estado: 'Fallido', tipoFirma: 'Firma Gob', folio: 'Sin folio', fechaFirma: '—' },
  // Procesados (Procesando)
  { nombre: 'prueba_1.pdf', tipoDoc: 'ANTECEDENTE', materia: 'Antecedente adjunto', expediente: '2026-00875-S-000002', documento: '73820', fechaCreacion: '10-06-2026', estado: 'Procesando', tipoFirma: 'Firma simple', folio: 'Sin folio', fechaFirma: '—' },
  { nombre: 'Prueba_tareas.pdf', tipoDoc: 'RESOLUCIÓN', materia: 'Preparar doc con anexo para firmar', expediente: '2025-00874-A-000089', documento: '67148', fechaCreacion: '02-06-2026', estado: 'Procesando', tipoFirma: 'Firma Gob', folio: 'Sin folio', fechaFirma: '—' },
  // Firmados (Firmado)
  { nombre: 'Documento copia.pdf', tipoDoc: 'RESOLUCIÓN', materia: 'Resolución firmada 2', expediente: '2026-00874-A-000058', documento: '97468', fechaCreacion: '10-06-2026', estado: 'Firmado', tipoFirma: 'Firma Gob', folio: '2026-00874-RES-000010', fechaFirma: '11-06-2026' },
  { nombre: 'Documento copia.pdf', tipoDoc: 'RESOLUCIÓN', materia: 'Resolución firmada', expediente: '2026-00874-A-000058', documento: '97466', fechaCreacion: '10-06-2026', estado: 'Firmado', tipoFirma: 'Firma Gob', folio: '2026-00874-RES-000009', fechaFirma: '11-06-2026' },
  { nombre: '1366_2000.pdf', tipoDoc: 'OFICIO', materia: 'Oficio firmado', expediente: '2026-00094-A-000018', documento: '93700', fechaCreacion: '31-05-2026', estado: 'Firmado', tipoFirma: 'Firma simple', folio: 'Sin folio', fechaFirma: '01-06-2026' },
  { nombre: 'archive.pdf', tipoDoc: 'OFICIO', materia: 'Oficio firmado 2', expediente: '2026-00094-A-000017', documento: '93691', fechaCreacion: '31-05-2026', estado: 'Firmado', tipoFirma: 'Firma simple', folio: 'Sin folio', fechaFirma: '01-06-2026' },
];

// ---- Preparación de documentos (expediente) ----
export const preparacionColumns: Column[] = [
  { key: 'orden', label: 'Orden' }, { key: 'documento', label: 'Documento' },
  { key: 'tipo', label: 'Tipo' }, { key: 'estado', label: 'Estado', type: 'badge' },
];
export const preparacionDocumentos = [
  { orden: 1, documento: 'Caratula_expediente.pdf', tipo: 'Carátula', estado: 'Validado' },
  { orden: 2, documento: 'Oficio_conductor_003.pdf', tipo: 'Oficio', estado: 'Validado' },
  { orden: 3, documento: 'Resolucion_exenta_452.pdf', tipo: 'Resolución', estado: 'Pendiente' },
  { orden: 4, documento: 'Anexo_planos.pdf', tipo: 'Anexo', estado: 'Cargado' },
];

export const resumenCards = [
  { key: 'reportes', name: 'Expedientes', count: 24, label: 'En trámite', chip: 'chip-indigo', icon: '📁', ruta: 'expedientes' },
  { key: 'documentos', name: 'Documentos', count: 312, label: 'Almacenados', chip: 'chip-blue', icon: '📄', ruta: 'documentos' },
  { key: 'firma', name: 'Bandeja de Firmas', count: 7, label: 'Pendientes', chip: 'chip-green', icon: '✒️', ruta: 'firma' },
  { key: 'tareas', name: 'Tareas', count: 3, label: 'Asignadas', chip: 'chip-orange', icon: '✅', ruta: 'tareas' },
  { key: 'auditoria', name: 'Auditoría', count: 1280, label: 'Acciones', chip: 'chip-purple', icon: '🛡️', ruta: 'auditoria' },
  { key: 'buscadores', name: 'Buscador', count: 18, label: 'Resultados recientes', chip: 'chip-blue', icon: '🔍', ruta: 'buscador' },
];

export interface NavChild { label: string; ruta: string; }
export interface NavItem { key: string; label: string; icon: string; ruta?: string; children?: NavChild[]; hidden?: boolean; }

// Menú plano (forma MINVU, skin LexDocs). Sin encabezados de sección.
export const navItems: NavItem[] = [
  // ponytail: Reportes oculto por ahora (hidden:true). Reactivar quitando hidden. Ver memoria "menus-ocultos".
  { key: 'reportes', label: 'Reportes', icon: 'clipboard-list', ruta: 'reportes', hidden: true },
  { key: 'dashboard', label: 'Dashboard', icon: 'bar-chart', ruta: 'dashboard', hidden: true },
  { key: 'ingresos', label: 'Ingresos', icon: 'file-plus', children: [
    { label: 'Expediente', ruta: 'ingresos/expediente' },
    { label: 'Documento', ruta: 'ingresos/documento' },
  ]},
  { key: 'buscadores', label: 'Buscadores', icon: 'search', children: [
    { label: 'Documentos', ruta: 'buscador/documentos' },
    { label: 'Expedientes', ruta: 'buscador' },
  ]},
  { key: 'bandeja', label: 'Bandeja de Entrada', icon: 'inbox', children: [
    { label: 'Por Resolver', ruta: 'bandeja/por-resolver' },
    { label: 'Mis Pendientes', ruta: 'bandeja/mis-pendientes' },
    { label: 'Historial', ruta: 'bandeja/historial' },
  ]},
  { key: 'firma', label: 'Bandeja de Firmas', icon: 'pen-tool', ruta: 'firma' },
  { key: 'oficina-partes', label: 'Oficina de Partes', icon: 'building', children: [
    { label: 'Entrante', ruta: 'oficina-partes/entrante' },
    { label: 'Saliente', ruta: 'oficina-partes/saliente' },
    { label: 'Pre Ingreso', ruta: 'oficina-partes/pre-ingreso' },
    { label: 'Manual', ruta: 'oficina-partes/manual' },
    { label: 'Distribuciones rechazadas', ruta: 'oficina-partes/distribuciones-rechazadas' },
    { label: 'Tareas rechazadas', ruta: 'oficina-partes/tareas-rechazadas' },
  ]},
  { key: 'mantenedores', label: 'Mantenedores', icon: 'settings', children: [
    { label: 'Usuarios', ruta: 'mantenedores/usuarios' },
    { label: 'Grupos', ruta: 'mantenedores/grupos' },
    { label: 'Procedimientos', ruta: 'mantenedores/procedimientos' },
    { label: 'Tipo documento', ruta: 'mantenedores/tipos-documento' },
    { label: 'Plantillas', ruta: 'mantenedores/plantillas' },
    { label: 'Tamaño documento', ruta: 'mantenedores/tamanos' },
  ]},
  { key: 'auditoria', label: 'Auditoría Usuario', icon: 'shield', ruta: 'auditoria' },
];

// ---- Roles y menús permitidos (forma MINVU). Claves = 'key' de navItems ----
// ponytail: solo se muestran estos 3 roles en el login. roleRoutes conserva los demás por si se reactivan.
export const ROLES = ['Administrador General', 'Oficial de Partes', 'Ciudadano'];

export const roleRoutes: Record<string, string[]> = {
  'Administrador General': ['inicio', 'reportes', 'dashboard', 'ingresos', 'buscadores', 'bandeja', 'firma', 'oficina-partes', 'mantenedores', 'auditoria'],
  'Oficial de Partes': ['inicio', 'reportes', 'ingresos', 'buscadores', 'bandeja', 'firma', 'oficina-partes'],
  'Administrador de Procesos': ['inicio', 'ingresos', 'mantenedores'],
  'Auditor': ['inicio', 'reportes', 'dashboard', 'auditoria', 'buscadores'],
  'Usuario General': ['inicio', 'ingresos', 'buscadores', 'bandeja', 'firma'],
  'Ciudadano': ['inicio', 'ingresos', 'buscadores', 'bandeja', 'firma'],
};

// Restricción a nivel de submenú por rol (clave = ruta del hijo). Si un rol no aparece, ve todos los hijos.
export const roleChildren: Record<string, string[]> = {
  'Ciudadano': ['ingresos/documento', 'buscador', 'bandeja/por-resolver', 'bandeja/mis-pendientes'],
};

// ---- Bandejas de Oficina de Partes (un dataset por submenú) ----
export const oficinaBandejas: Record<string, { titulo: string; desc: string; columns: Column[]; rows: Record<string, any>[] }> = {
  entrante: { titulo: 'Documentos entrantes', desc: 'Documentos recibidos pendientes de derivar.',
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'remitente', label: 'Remitente' }, { key: 'fecha', label: 'Fecha recepción' }, { key: 'tipo', label: 'Tipo' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { documento: 'OFICIO-2026-1124', remitente: 'Unidad de Proyectos', fecha: '25-06-2026', tipo: 'Oficio', estado: 'Sin asignar' },
      { documento: 'CARTA-2026-0098', remitente: 'Ciudadano · R. González', fecha: '24-06-2026', tipo: 'Carta', estado: 'Sin asignar' },
      { documento: 'MEMO-2026-0451', remitente: 'Departamento Jurídico', fecha: '24-06-2026', tipo: 'Memorándum', estado: 'En revisión' },
    ]},
  saliente: { titulo: 'Documentos salientes', desc: 'Documentos despachados a otras unidades.',
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'destinatario', label: 'Destinatario' }, { key: 'fecha', label: 'Fecha despacho' }, { key: 'tipo', label: 'Tipo' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { documento: 'OFICIO-2026-1119', destinatario: 'Subdirección de Operaciones', fecha: '23-06-2026', tipo: 'Oficio', estado: 'Despachado' },
      { documento: 'OFICIO-2026-1101', destinatario: 'Oficina Central', fecha: '21-06-2026', tipo: 'Oficio', estado: 'Despachado' },
    ]},
  'pre-ingreso': { titulo: 'Pre ingreso', desc: 'Documentos en pre ingreso, pendientes de validación.',
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'origen', label: 'Origen' }, { key: 'fecha', label: 'Fecha' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { documento: 'PRE-2026-0034', origen: 'Ventanilla digital', fecha: '25-06-2026', estado: 'Pendiente' },
      { documento: 'PRE-2026-0033', origen: 'Correo institucional', fecha: '24-06-2026', estado: 'Pendiente' },
    ]},
  manual: { titulo: 'Ingreso manual', desc: 'Registro manual de documentos físicos.',
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'remitente', label: 'Remitente' }, { key: 'fecha', label: 'Fecha' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { documento: 'MAN-2026-0012', remitente: 'Oficina de Partes Regional', fecha: '20-06-2026', estado: 'Ingresado' },
    ]},
  'distribuciones-rechazadas': { titulo: 'Distribuciones rechazadas', desc: 'Distribuciones devueltas por la unidad de destino.',
    columns: [{ key: 'documento', label: 'Documento' }, { key: 'destino', label: 'Destino' }, { key: 'motivo', label: 'Motivo' }, { key: 'fecha', label: 'Fecha' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { documento: 'OFICIO-2026-1088', destino: 'Departamento Jurídico', motivo: 'Unidad incorrecta', fecha: '19-06-2026', estado: 'Rechazado' },
    ]},
  // ponytail: pre-ingreso usa su propio componente (pre-ingreso.ts); estas filas/columnas las consume él.
  'tareas-rechazadas': { titulo: 'Tareas rechazadas', desc: 'Tareas devueltas al remitente.',
    columns: [{ key: 'tarea', label: 'Tarea' }, { key: 'asignado', label: 'Asignado a' }, { key: 'motivo', label: 'Motivo' }, { key: 'fecha', label: 'Fecha' }, { key: 'estado', label: 'Estado', type: 'badge' }],
    rows: [
      { tarea: 'Revisión OFICIO-2026-1088', asignado: 'Marta Soto', motivo: 'Falta antecedente', fecha: '18-06-2026', estado: 'Rechazado' },
    ]},
};

// ---- Pre Ingreso (Oficina de Partes) ----
export const tiposDocumento = ['ANTECEDENTE', 'CIRCULAR', 'OFICIO', 'RESOLUCIÓN', 'MEMORÁNDUM'];

export const preIngresoColumns: Column[] = [
  { key: 'expediente', label: 'Expediente' }, { key: 'numero', label: 'Número documento' },
  { key: 'materia', label: 'Materia documento' }, { key: 'origen', label: 'Origen (de)' },
  { key: 'fecha', label: 'Fecha ingreso' }, { key: 'para', label: 'Para' }, { key: 'ingresadoPor', label: 'Ingresado por' },
];
export const preIngresoRows: Record<string, any>[] = [
  { expediente: 'Sin expediente', numero: 'DOC-1024', materia: 'Solicitud de certificado', origen: 'Ventanilla digital', fecha: '19-05-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: 'Sin expediente', numero: '-', materia: 'Consulta ciudadana', origen: 'Correo institucional', fecha: '11-02-2026', para: '-', ingresadoPor: 'admin' },
  { expediente: 'Sin expediente', numero: '-', materia: 'Antecedentes adjuntos', origen: '-', fecha: '11-02-2026', para: '-', ingresadoPor: 'M. Soto' },
  { expediente: 'Sin expediente', numero: '-', materia: 'Derivación interna', origen: '-', fecha: '11-02-2026', para: '-', ingresadoPor: 'C. Díaz' },
  { expediente: 'Sin expediente', numero: '-', materia: 'Oficio de respuesta', origen: '-', fecha: '11-02-2026', para: '-', ingresadoPor: 'C. Díaz' },
];
export const preIngresoAcciones = ['Adjuntar documento', 'Visualizar', 'Historial', 'Asignar a Expediente', 'Abrir QR Individual', 'Eliminar'];
export const preIngresoAccionesIconos: Record<string, string> = {
  'Adjuntar documento': 'paperclip', 'Visualizar': 'eye', 'Historial': 'clock',
  'Asignar a Expediente': 'folder', 'Abrir QR Individual': 'monitor', 'Eliminar': 'trash',
};

// ---- Ingreso Manual (Oficina de Partes) ----
export const manualColumns: Column[] = [
  { key: 'expediente', label: 'Expediente' }, { key: 'correlativo', label: 'Correlativo manual interno' },
  { key: 'materia', label: 'Materia documento' }, { key: 'fecha', label: 'Fecha ingreso' }, { key: 'ingresadoPor', label: 'Ingresado por' },
];
export const manualRows: Record<string, any>[] = [
  { expediente: '2026-00874-A-000029', correlativo: '2026-00874-M:OFI-000002', materia: 'Numeración oficio salida', fecha: '10-02-2026', ingresadoPor: 'ldelgadillo' },
  { expediente: '2026-00874-A-000029', correlativo: '2026-00874-M:OFI-000001', materia: 'Oficio conductor', fecha: '10-02-2026', ingresadoPor: 'ldelgadillo' },
  { expediente: '2026-00874-A-000026', correlativo: '2026-00874-M:RES-000003', materia: 'Resolución exenta', fecha: '06-02-2026', ingresadoPor: 'admin' },
  { expediente: '2026-00874-A-000026', correlativo: '2026-00874-M:RES-000004', materia: 'Resolución de archivo', fecha: '06-02-2026', ingresadoPor: 'admin' },
];
export const manualAcciones = ['Marcar como reservado', 'Actualizar doc principal', 'Visualizar', 'Historial', 'Abrir documento', 'Adjuntos', 'Abrir comprobante'];
export const manualAccionesIconos: Record<string, string> = {
  'Marcar como reservado': 'lock', 'Actualizar doc principal': 'paperclip', 'Visualizar': 'eye',
  'Historial': 'clock', 'Abrir documento': 'file', 'Adjuntos': 'folder', 'Abrir comprobante': 'clipboard-list',
};
export const manualNumeracionColumns: Column[] = [
  { key: 'materia', label: 'Materia' }, { key: 'tipo', label: 'Tipo documento' }, { key: 'expediente', label: 'Expediente' },
  { key: 'estado', label: 'Estado', type: 'badge' }, { key: 'fecha', label: 'Fecha' },
];
// ---- Distribuciones rechazadas (Oficina de Partes) ----
export const distRechColumns: Column[] = [
  { key: 'expediente', label: 'Expediente' }, { key: 'numero', label: 'Número documento' },
  { key: 'materia', label: 'Materia documento' }, { key: 'origen', label: 'Origen (de)' },
  { key: 'fecha', label: 'Fecha ingreso' }, { key: 'para', label: 'Para' }, { key: 'ingresadoPor', label: 'Ingresado por' },
  { key: 'despachos', label: 'Despachos', type: 'icon', icon: 'swap' },
];
export const distRechRows: Record<string, any>[] = [
  { expediente: '2026-00094-PCM-000001', numero: '-', materia: 'Solicitud de revisión', origen: '-', fecha: '15-04-2026', para: '-', ingresadoPor: 'Dayana Nieto' },
  { expediente: '2025-00094-A-000010', numero: '-', materia: 'Antecedentes adjuntos', origen: '-', fecha: '2025-12-30', para: '-', ingresadoPor: 'Dayana Nieto' },
];
export const distRechAcciones = ['Marcar como reservado', 'Visualizar', 'Historial', 'Abrir documento', 'Adjuntos', 'DocDigital', 'Despacho Manual', 'Notificación Correo'];
export const distRechAccionesIconos: Record<string, string> = {
  'Marcar como reservado': 'lock', 'Visualizar': 'eye', 'Historial': 'clock', 'Abrir documento': 'file',
  'Adjuntos': 'folder', 'DocDigital': 'file-text', 'Despacho Manual': 'forward', 'Notificación Correo': 'mail',
};
export interface DespachoEvento { tipo: 'Distribución' | 'Rechazo'; fecha: string; autor: string; destinatarios?: string; rol?: string; motivo?: string; }
export const despachosHistorial: DespachoEvento[] = [
  { tipo: 'Distribución', fecha: '05-05-2026 12:12:23', autor: 'Juan Pérez', destinatarios: 'Juan Pérez' },
  { tipo: 'Rechazo', fecha: '05-05-2026 12:12:49', autor: 'Juan Pérez', rol: 'Oficial de Partes', motivo: 'Unidad incorrecta' },
];

export const manualNumeracionRows: Record<string, any>[] = [
  { materia: 'Oficio conductor', tipo: 'OFICIO', expediente: '2026-00037-A-000002', estado: 'Pendiente numeración manual', fecha: '09-04-2026' },
  { materia: 'Oficio de respuesta', tipo: 'OFICIO', expediente: '2026-00037-A-000002', estado: 'Pendiente numeración manual', fecha: '09-04-2026' },
  { materia: 'Antecedentes', tipo: 'OFICIO', expediente: '2026-00037-A-000002', estado: 'Pendiente numeración manual', fecha: '09-04-2026' },
  { materia: 'Circular informativa', tipo: 'CIRCULAR', expediente: '2026-00875-A-000052', estado: 'Pendiente numeración manual', fecha: '09-04-2026' },
  { materia: 'Oficio de archivo', tipo: 'OFICIO', expediente: '2026-00875-A-000052', estado: 'Pendiente numeración manual', fecha: '09-04-2026' },
];
