// =======================
// TIPOS FUNCIONALES
// =======================

export enum EstadoTarea {
  PENDIENTE = 1,
  EN_CURSO = 2,
  TERMINADA = 3,
  CANCELADA = 4
}

export enum DificultadTarea {
  DIFICIL = 1,
  MEDIO = 2,
  FACIL = 3
}

export enum PrioridadTarea {
  BAJA = 1,
  MEDIA = 2,
  ALTA = 3,
  URGENTE = 4
}

// Tipo inmutable para Tarea
export type Tarea = Readonly<{
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
  dificultad: DificultadTarea;
  fechaCreacion: number;
  fechaUltimaEdicion: number;
}>;

// ====================================
// FUNCIONES PURAS PARA CREAR TAREAS
// ====================================

export const crearTarea = (
  titulo: string,
  descripcion: string = "",
  estado: EstadoTarea = EstadoTarea.PENDIENTE,
  dificultad: DificultadTarea = DificultadTarea.FACIL
): Tarea => Object.freeze({
  titulo,
  descripcion,
  estado,
  dificultad,
  fechaCreacion: Date.now(),
  fechaUltimaEdicion: Date.now()
});

// ====================================
// FUNCIONES PURAS DE ACTUALIZACIÓN
// ====================================

export const actualizarTitulo = (tarea: Tarea, titulo: string): Tarea =>
  Object.freeze({ ...tarea, titulo, fechaUltimaEdicion: Date.now() });

export const actualizarDescripcion = (tarea: Tarea, descripcion: string): Tarea =>
  Object.freeze({ ...tarea, descripcion, fechaUltimaEdicion: Date.now() });

export const actualizarEstado = (tarea: Tarea, estado: EstadoTarea): Tarea =>
  Object.freeze({ ...tarea, estado, fechaUltimaEdicion: Date.now() });

export const actualizarDificultad = (tarea: Tarea, dificultad: DificultadTarea): Tarea =>
  Object.freeze({ ...tarea, dificultad, fechaUltimaEdicion: Date.now() });

// ====================================
// FUNCIONES PURAS DE CONSULTA
// ====================================

export const estaCompletada = (tarea: Tarea): boolean =>
  tarea.estado === EstadoTarea.TERMINADA;

export const estadoATexto = (estado: EstadoTarea): string => {
  const textos: Record<EstadoTarea, string> = {
    [EstadoTarea.PENDIENTE]: "Pendiente",
    [EstadoTarea.EN_CURSO]: "En Curso",
    [EstadoTarea.TERMINADA]: "Terminada",
    [EstadoTarea.CANCELADA]: "Cancelada"
  };
  return textos[estado] ?? "Desconocido";
};

export const dificultadATexto = (dificultad: DificultadTarea): string => {
  const textos: Record<DificultadTarea, string> = {
    [DificultadTarea.DIFICIL]: "Difícil",
    [DificultadTarea.MEDIO]: "Medio",
    [DificultadTarea.FACIL]: "Fácil"
  };
  return textos[dificultad] ?? "Desconocido";
};

export const formatearFecha = (timestamp: number): string =>
  new Date(timestamp).toLocaleString('es-AR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });