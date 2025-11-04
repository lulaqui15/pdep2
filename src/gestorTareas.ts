// =======================
// GESTOR DE TAREAS FUNCIONAL
// =======================

import { Tarea, EstadoTarea, estaCompletada } from './types';

// Estado de la aplicación (inmutable)
export type EstadoGestor = Readonly<{
  tareas: ReadonlyArray<Tarea>;
}>;

// ====================================
// FUNCIONES PURAS DEL GESTOR
// ====================================

// Crear estado inicial
export const crearGestorVacio = (): EstadoGestor =>
  Object.freeze({ tareas: Object.freeze([]) });

// Agregar tarea (retorna NUEVO estado)
export const agregarTarea = (gestor: EstadoGestor, tarea: Tarea): EstadoGestor =>
  Object.freeze({
    ...gestor,
    tareas: Object.freeze([...gestor.tareas, tarea])
  });

// Eliminar tarea por índice (retorna NUEVO estado)
export const eliminarTarea = (gestor: EstadoGestor, indice: number): EstadoGestor => {
  if (indice < 0 || indice >= gestor.tareas.length) return gestor;
  
  return Object.freeze({
    ...gestor,
    tareas: Object.freeze(gestor.tareas.filter((_, i) => i !== indice))
  });
};

// Actualizar tarea por índice (retorna NUEVO estado)
export const actualizarTarea = (
  gestor: EstadoGestor,
  indice: number,
  tareaActualizada: Tarea
): EstadoGestor => {
  if (indice < 0 || indice >= gestor.tareas.length) return gestor;
  
  return Object.freeze({
    ...gestor,
    tareas: Object.freeze(
      gestor.tareas.map((tarea, i) => i === indice ? tareaActualizada : tarea)
    )
  });
};

// Obtener tarea por índice
export const obtenerTarea = (gestor: EstadoGestor, indice: number): Tarea | undefined =>
  gestor.tareas[indice];

// Obtener todas las tareas
export const obtenerTodas = (gestor: EstadoGestor): ReadonlyArray<Tarea> =>
  gestor.tareas;

// Contar tareas
export const contarTareas = (gestor: EstadoGestor): number =>
  gestor.tareas.length;

// ====================================
// FUNCIONES DE FILTRADO (PURAS)
// ====================================

// Filtrar por estado
export const filtrarPorEstado = (
  gestor: EstadoGestor,
  estado: EstadoTarea
): ReadonlyArray<Tarea> =>
  gestor.tareas.filter(t => t.estado === estado);

// Buscar por título
export const buscarPorTitulo = (
  gestor: EstadoGestor,
  busqueda: string
): ReadonlyArray<Tarea> =>
  gestor.tareas.filter(t => 
    t.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

// ====================================
// ESTADÍSTICAS (FUNCIÓN PURA)
// ====================================

export const calcularEstadisticas = (gestor: EstadoGestor) => {
  const stats = gestor.tareas.reduce(
    (acc, tarea) => {
      switch (tarea.estado) {
        case EstadoTarea.PENDIENTE:
          return { ...acc, pendientes: acc.pendientes + 1 };
        case EstadoTarea.EN_CURSO:
          return { ...acc, enCurso: acc.enCurso + 1 };
        case EstadoTarea.TERMINADA:
          return { ...acc, terminadas: acc.terminadas + 1 };
        case EstadoTarea.CANCELADA:
          return { ...acc, canceladas: acc.canceladas + 1 };
        default:
          return acc;
      }
    },
    {
      total: gestor.tareas.length,
      pendientes: 0,
      enCurso: 0,
      terminadas: 0,
      canceladas: 0
    }
  );
  
  return Object.freeze(stats);
};

// Limpiar tareas completadas (retorna NUEVO estado)
export const limpiarCompletadas = (gestor: EstadoGestor): EstadoGestor =>
  Object.freeze({
    ...gestor,
    tareas: Object.freeze(gestor.tareas.filter(t => !estaCompletada(t)))
  });