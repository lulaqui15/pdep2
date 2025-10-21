// =======================
// GESTOR DE TAREAS 
// =======================

import { 
  TareaBase, 
  TareaSimple, 
  TareaConFechaLimite, 
  TareaRecurrente, 
  EstadoTarea,
  PrioridadTarea 
} from './types';

// ABSTRACCIÓN: Interface para estrategias de filtrado (Patrón Strategy)
interface IEstrategiaFiltrado {
  filtrar(tareas: TareaBase[]): TareaBase[];
}

// POLIMORFISMO: Diferentes estrategias de filtrado

class FiltrarPorEstado implements IEstrategiaFiltrado {
  constructor(private estado: EstadoTarea) {}
  
  filtrar(tareas: TareaBase[]): TareaBase[] {
    return tareas.filter(t => t.estado === this.estado);
  }
}

class FiltrarPorPrioridad implements IEstrategiaFiltrado {
  constructor(private prioridad: PrioridadTarea) {}
  
  filtrar(tareas: TareaBase[]): TareaBase[] {
    return tareas.filter(t => t.calcularPrioridad() === this.prioridad);
  }
}

class FiltrarTareasVencidas implements IEstrategiaFiltrado {
  filtrar(tareas: TareaBase[]): TareaBase[] {
    return tareas.filter(t => {
      if (t instanceof TareaConFechaLimite) {
        return t.estaVencida();
      }
      return false;
    });
  }
}

class FiltrarTareasRecurrentes implements IEstrategiaFiltrado {
  filtrar(tareas: TareaBase[]): TareaBase[] {
    return tareas.filter(t => t instanceof TareaRecurrente);
  }
}

class FiltrarTodasLasTareas implements IEstrategiaFiltrado {
  filtrar(tareas: TareaBase[]): TareaBase[] {
    return tareas;
  }
}

// ========================================
// CLASE PRINCIPAL: GESTOR DE TAREAS
// ========================================
export class GestorTareas {
  private tareas: TareaBase[] = [];
  private estrategiaActual: IEstrategiaFiltrado | null = null;

  // POLIMORFISMO: Agregar cualquier tipo de tarea
  agregarTarea(tarea: TareaBase): void {
    this.tareas.push(tarea);
  }

  // Eliminar tarea
  eliminarTarea(indice: number): boolean {
    if (indice >= 0 && indice < this.tareas.length) {
      this.tareas.splice(indice, 1);
      return true;
    }
    return false;
  }

  // Obtener todas las tareas
  obtenerTodas(): TareaBase[] {
    return [...this.tareas]; // Retorna copia para proteger el array original
  }

  // Obtener tarea por índice
  obtenerTarea(indice: number): TareaBase | undefined {
    if (indice >= 0 && indice < this.tareas.length) {
      return this.tareas[indice];
    }
    return undefined;
  }

  // Obtener número de tareas
  obtenerNumTareas(): number {
    return this.tareas.length;
  }

  // Actualizar tarea
  actualizarTarea(indice: number, tarea: TareaBase): boolean {
    if (indice >= 0 && indice < this.tareas.length) {
      this.tareas[indice] = tarea;
      return true;
    }
    return false;
  }

  // Buscar tareas por título
  buscarPorTitulo(busqueda: string): TareaBase[] {
    return this.tareas.filter(t => 
      t.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  // Estrategia de filtrado
  establecerEstrategiaFiltrado(estrategia: IEstrategiaFiltrado): void {
    this.estrategiaActual = estrategia;
  }

  // Filtrar con la estrategia actual
  filtrarConEstrategia(): TareaBase[] {
    if (this.estrategiaActual) {
      return this.estrategiaActual.filtrar(this.tareas);
    }
    return this.tareas;
  }

  // Métodos de filtrado específicos
  filtrarPorEstado(estado: EstadoTarea): TareaBase[] {
    this.establecerEstrategiaFiltrado(new FiltrarPorEstado(estado));
    return this.filtrarConEstrategia();
  }

  obtenerTodasLasTareas(): TareaBase[] {
    this.establecerEstrategiaFiltrado(new FiltrarTodasLasTareas());
    return this.filtrarConEstrategia();
  }


  // Obtener estadísticas
  obtenerEstadisticas(): {
    total: number;
    pendientes: number;
    enCurso: number;
    terminadas: number;
    canceladas: number;
  } {
    return {
      total: this.tareas.length,
      pendientes: this.tareas.filter(t => t.estado === EstadoTarea.PENDIENTE).length,
      enCurso: this.tareas.filter(t => t.estado === EstadoTarea.EN_CURSO).length,
      terminadas: this.tareas.filter(t => t.estado === EstadoTarea.TERMINADA).length,
      canceladas: this.tareas.filter(t => t.estado === EstadoTarea.CANCELADA).length,
    };
  }

  // Mostrar resumen de todas las tareas (POLIMORFISMO en acción)
  mostrarResumenTodas(): void {
    console.log("\n=== RESUMEN DE TAREAS ===\n");
    this.tareas.forEach((tarea, index) => {
      console.log(`[${index + 1}] ${tarea.mostrarResumen()}`);
    });
  }

  // Limpiar tareas completadas
  limpiarTareasCompletadas(): number {
    const cantidadInicial = this.tareas.length;
    this.tareas = this.tareas.filter(t => !t.estaCompletada());
    return cantidadInicial - this.tareas.length;
  }
}