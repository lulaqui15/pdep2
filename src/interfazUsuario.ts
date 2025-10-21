// =======================
// INTERFAZ DE USUARIO 
// =======================

import { input } from '../lib/nodeImperativo';
import { GestorTareas } from './gestorTareas';
import { 
  TareaBase, 
  TareaSimple, 
  TareaConFechaLimite, 
  TareaRecurrente,
  EstadoTarea,
  DificultadTarea,
  PrioridadTarea 
} from './types';

export class InterfazUsuario {
  constructor(private gestor: GestorTareas) {}

  // ==================
  // MENÚ PRINCIPAL
  // ==================
  mostrarMenuPrincipal(): void {
    console.clear();
    console.log("\n.BIENVENIDOS A NUESTRO SISTEMA");
    console.log("----------- MENU -----------");
    console.log("[1] Ver Tareas...");
    console.log("[2] Buscar Tareas...");
    console.log("[3] Agregar Tarea");
    console.log("[4] Estadisticas...");
    console.log("[0] Salir...");
  }

  // ==================
  // MENÚ VER TAREAS
  // ==================
  async verTareas(): Promise<void> {
    let opcion: string;
    
    do {
      console.clear();
      console.log("\n..VER TAREAS..\n");
      console.log("[1] Todas");
      console.log("[2] Pendientes");
      console.log("[3] En curso");
      console.log("[4] Terminadas");
      console.log("[5] Canceladas");
      console.log("[0] Volver al Menu");
      opcion = await input(".Opcion: ");

      console.clear();

      switch (opcion) {
        case "1":
          console.log("TODAS LAS TAREAS:\n");
          await this.mostrarTareasPorEstado(0);
          break;
        case "2":
          console.log("TAREAS PENDIENTES:\n");
          await this.mostrarTareasPorEstado(EstadoTarea.PENDIENTE);
          break;
        case "3":
          console.log("TAREAS EN CURSO:\n");
          await this.mostrarTareasPorEstado(EstadoTarea.EN_CURSO);
          break;
        case "4":
          console.log("TAREAS TERMINADAS:\n");
          await this.mostrarTareasPorEstado(EstadoTarea.TERMINADA);
          break;
        case "5":
          console.log("TAREAS CANCELADAS:\n");
          await this.mostrarTareasPorEstado(EstadoTarea.CANCELADA);
          break;
        case "0":
          return;
        default:
          console.log("\nOpcion incorrecta!!");
          await input("\nPresione Enter para continuar...");
          break;
      }
    } while (opcion !== "0");
  }

  // ==================
  // MOSTRAR TAREAS POR ESTADO
  // ==================
  async mostrarTareasPorEstado(estado: number): Promise<void> {
    let tareas: TareaBase[];

    if (estado === 0) {
      tareas = this.gestor.obtenerTodasLasTareas();
    } else {
      tareas = this.gestor.filtrarPorEstado(estado);
    }

    if (tareas.length === 0) {
      console.log("No se encontraron tareas!");
      await input("\nPresione Enter para continuar...");
      return;
    }

    // Mostrar lista de tareas
    tareas.forEach((tarea, index) => {
      console.log(`[${index + 1}] ${tarea.titulo}`);
    });

    console.log("\nSi desea ver los detalles:");
    console.log("Ingrese el numero del titulo [..] - [0] para volver:");

    const seleccion = parseInt(await input(".Opcion: "));

    if (seleccion > 0 && seleccion <= tareas.length) {
      const tareaSeleccionada = tareas[seleccion - 1];
      const indiceReal = this.gestor.obtenerTodas().indexOf(tareaSeleccionada);
      await this.mostrarDetallesTarea(indiceReal);
    }
  }
  async mostrarDetallesTarea(indice: number): Promise<void> {
    const tarea = this.gestor.obtenerTarea(indice);
    if (!tarea) {
      console.log("\nNo se encontraron detalles");
      await input("\nPresione Enter para continuar...");
      return;
    }

    console.log("\n---------- DETALLES DE LA TAREA ----------");
    console.log(`Titulo:                    ${tarea.titulo}`);
    console.log(`Descripcion:               ${tarea.descripcion}`);
    console.log(`Estado:                    ${this.obtenerTextoEstado(tarea.estado)}`);
    console.log(`Fecha de creacion:         ${this.formatearFecha(tarea.fechadecreacion)}`);
    
    // Mostrar información específica según el tipo de tarea
    if (tarea instanceof TareaSimple) {
      console.log(`Dificultad:              ${tarea.obtenerTextoDificultadPublico()}`);
    }

    console.log("------------------------------------------");

    // Opción Editar
    console.log("\n.Desea editar esta tarea?");
    const opcionEditar = await input("[E] Editar - [0] Volver: ");

    if (opcionEditar.toLowerCase() === 'e') {
      console.clear();
      await this.editarTarea(indice);
    }
  }

  // ==================
  // EDITAR TAREA
  // ==================
  async editarTarea(indice: number): Promise<void> {
    const tarea = this.gestor.obtenerTarea(indice);
    if (!tarea) return;

    console.log("\n=== EDITAR TAREA ===\n");

    // EDITAR TÍTULO
    console.log(`Titulo: ${tarea.titulo}`);
    const editarTitulo = await input("Desea editar el titulo? [1] Si - [Enter] No: ");
    
    if (editarTitulo === "1") {
      const nuevoTitulo = await input("Nuevo titulo: ");
      try {
        tarea.titulo = nuevoTitulo;
        console.log(".Titulo actualizado");
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }

    // EDITAR DESCRIPCIÓN
    console.log(`\n\nDescripcion: ${tarea.descripcion}`);
    const editarDesc = await input("Desea editar la descripcion? [1] Si - [Enter] No: ");
    
    if (editarDesc === "1") {
      tarea.descripcion = await input("Nueva descripcion: ");
      console.log(".Descripcion actualizada");
    }

    // EDITAR ESTADO
    console.log(`\n\nEstado: ${this.obtenerTextoEstado(tarea.estado)}`);
    const editarEstado = await input("Desea editar el estado? [1] Si - [Enter] No: ");
    
    if (editarEstado === "1") {
      let nuevaOpcion: number;
      do {
        console.log("Nuevo estado: [1] Pendiente - [2] En Curso - [3] Terminada - [4] Cancelada");
        nuevaOpcion = parseInt(await input("Opcion: "));
        
        if (nuevaOpcion >= 1 && nuevaOpcion <= 4) {
          tarea.estado = nuevaOpcion;
          console.log(".Estado actualizado");
          break;
        } else {
          console.log("Opcion incorrecta!");
        }
      } while (true);
    }

    // EDITAR DIFICULTAD (solo para TareaSimple)
    if (tarea instanceof TareaSimple) {
      console.log(`\n\nDificultad: ${tarea.obtenerTextoDificultadPublico()}`);
      const editarDif = await input("Desea editar la dificultad? [1] Si - [Enter] No: ");
      
      if (editarDif === "1") {
        let nuevaOpcion: number;
        do {
          console.log("Nueva dificultad: [1] Dificil - [2] Medio - [3] Facil");
          nuevaOpcion = parseInt(await input("Opcion: "));
          
          if (nuevaOpcion >= 1 && nuevaOpcion <= 3) {
            tarea.dificultad = nuevaOpcion;
            console.log(".Dificultad actualizada");
            break;
          } else {
            console.log("Opcion incorrecta!");
          }
        } while (true);
      }
    }

    console.log("\n!!TAREA EDITADA EXITOSAMENTE!!");
    this.gestor.actualizarTarea(indice, tarea);
    await input("\nPresione Enter para continuar...");
  }

  // ==================
  // BUSCAR TAREAS
  // ==================
  async buscarTareas(): Promise<void> {
    console.log("BUSCAR TAREAS..\n");
    console.log("Ingrese el titulo para buscar su tarea");
    const busqueda = await input(".Titulo: ");

    const tareas = this.gestor.buscarPorTitulo(busqueda);

    if (tareas.length === 0) {
      console.log("\nNo se encontraron tareas con ese titulo.");
      await input("\nPresione Enter para continuar...");
      return;
    }

    console.log("\nEstas son tus tareas encontradas:\n");
    tareas.forEach((tarea, index) => {
      console.log(`[${index + 1}] ${tarea.titulo}`);
    });

    console.log("\nSi desea ver los detalles:");
    console.log("Ingrese el numero del titulo [..] - [0] para volver:");
    const seleccion = parseInt(await input(".Opcion: "));

    if (seleccion > 0 && seleccion <= tareas.length) {
      const tareaSeleccionada = tareas[seleccion - 1];
      const indiceReal = this.gestor.obtenerTodas().indexOf(tareaSeleccionada);
      await this.mostrarDetallesTarea(indiceReal);
    }
  }

  // ==================
  // AGREGAR TAREA
  // ==================
  async agregarTarea(): Promise<void> {
    console.log("AGREGAR TAREA..\n");
    console.log("..Ingrese los siguientes datos...\n");

    // DATOS BÁSICOS
    const titulo = await input(".Titulo: ");
    const descripcion = await input(".Descripcion: ");

    // ESTADO
    let opcionEstado: number;
    do {
      console.log(".Estado: [1]Pendiente - [2]En Curso - [3]Terminada - [4]Cancelada ");
      opcionEstado = parseInt(await input(" Opcion: "));
      
      if (opcionEstado >= 1 && opcionEstado <= 4) {
        break;
      } else {
        console.log("Opcion incorrecta!");
        console.log("Seleccione otro numero:");
      }
    } while (true);

    // DIFICULTAD
    let opcionDificultad: number;
    do {
      console.log(".Dificultad: [1]Dificil - [2]Medio - [3]Facil");
      opcionDificultad = parseInt(await input(" Opcion: "));
      
      if (opcionDificultad >= 1 && opcionDificultad <= 3) {
        break;
      } else {
        console.log("Opcion incorrecta!");
        console.log("Seleccione otro numero:");
      }
    } while (true);

    // Crear la tarea simple (la fecha se asigna automáticamente)
    const nuevaTarea = new TareaSimple(titulo, descripcion, opcionEstado, opcionDificultad);
    this.gestor.agregarTarea(nuevaTarea);

    console.log("\n\n!!TAREA AGREGADA EXITOSAMENTE!!");
    await input("\nPresione Enter para continuar...");
  }

  // ==================
  // MOSTRAR ESTADÍSTICAS
  // ==================
  async mostrarEstadisticas(): Promise<void> {
    console.clear();
    console.log("\nESTADISTICAS DEL SISTEMA\n");

    const stats = this.gestor.obtenerEstadisticas();

    console.log(`Total de tareas:        ${stats.total}`);
    console.log(`Pendientes:             ${stats.pendientes}`);
    console.log(`En curso:               ${stats.enCurso}`);
    console.log(`Terminadas:             ${stats.terminadas}`);
    console.log(`Canceladas:             ${stats.canceladas}`);

    await input("\nPresione Enter para continuar...");
  }

  // ==================
  // FUNCIONES AUXILIARES
  // ==================
  private obtenerTextoEstado(estado: number): string {
    switch (estado) {
      case EstadoTarea.PENDIENTE: return "Pendiente";
      case EstadoTarea.EN_CURSO: return "En Curso";
      case EstadoTarea.TERMINADA: return "Terminada";
      case EstadoTarea.CANCELADA: return "Cancelada";
      default: return "Desconocido";
    }
  }

  private formatearFecha(timestamp: number): string {
    return new Date(timestamp).toLocaleString('es-AR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}