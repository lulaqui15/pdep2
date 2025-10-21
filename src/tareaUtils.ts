import { EstadoTarea, DificultadTarea } from './types';

// Obtener Estado
export function obtenerEstado(estado: number): string {
  switch(estado) {
    case 1: return "Pendiente";
    case 2: return "En Curso";
    case 3: return "Terminada";
    case 4: return "Cancelada";
    default: return "Incorrecto";
  }
}

// Obtener Dificultad
export function obtenerTextoDificultad(dificultad: number): string {
  switch(dificultad) {
    case 1: return "Dificil";
    case 2: return "Medio";
    case 3: return "Facil";
    default: return "Incorrecto";
  }
}

// Formatear fecha en formato local argentino
export function formatearFecha(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-AR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/,/g, '');
}