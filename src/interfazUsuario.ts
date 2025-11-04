// =======================
// INTERFAZ DE USUARIO (Adaptada a Funcional)
// =======================

import { input } from '../lib/nodeImperativo';
import {
  EstadoGestor,
  agregarTarea,
  actualizarTarea,
  obtenerTarea,
  obtenerTodas,
  filtrarPorEstado,
  buscarPorTitulo,
  calcularEstadisticas
} from './gestorTareas';
import {
  Tarea,
  EstadoTarea,
  DificultadTarea,
  crearTarea,
  actualizarTitulo,
  actualizarDescripcion,
  actualizarEstado,
  actualizarDificultad,
  estadoATexto,
  dificultadATexto,
  formatearFecha
} from './types';

export class InterfazUsuario {
  // Ahora solo guarda referencia al estado, no lo modifica directamente
  constructor(private getEstado: () => EstadoGestor, private setEstado: (e: EstadoGestor) => void) {}

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
  // VER TAREAS
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
          await this.mostrarTareasPorEstado(0);
          break;
        case "2":
          await this.mostrarTareasPorEstado(EstadoTarea.PENDIENTE);
          break;
        case "3":
          await this.mostrarTareasPorEstado(EstadoTarea.EN_CURSO);
          break;
        case "4":
          await this.mostrarTareasPorEstado(EstadoTarea.TERMINADA);
          break;
        case "5":
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
  // MOSTRAR TAREAS POR ESTADO (usa funciones puras)
  // ==================
  async mostrarTareasPorEstado(estado: number): Promise<void> {
    const gestor = this.getEstado();
    
    // Usar funciones puras para obtener tareas
    const tareas = estado === 0 
      ? obtenerTodas(gestor)
      : filtrarPorEstado(gestor, estado);

    if (tareas.length === 0) {
      console.log("No se encontraron tareas!");
      await input("\nPresione Enter para continuar...");
      return;
    }

    // Mostrar con map (función pura)
    tareas.forEach((tarea, index) => {
      console.log(`[${index + 1}] ${tarea.titulo}`);
    });

    console.log("\nSi desea ver los detalles:");
    console.log("Ingrese el numero del titulo [..] - [0] para volver:");

    const seleccion = parseInt(await input(".Opcion: "));

    if (seleccion > 0 && seleccion <= tareas.length) {
      const tareaSeleccionada = tareas[seleccion - 1];
      const indiceReal = gestor.tareas.indexOf(tareaSeleccionada);
      await this.mostrarDetallesTarea(indiceReal);
    }
  }

  async mostrarDetallesTarea(indice: number): Promise<void> {
    const gestor = this.getEstado();
    const tarea = obtenerTarea(gestor, indice);
    
    if (!tarea) {
      console.log("\nNo se encontraron detalles");
      await input("\nPresione Enter para continuar...");
      return;
    }

    console.log("\n---------- DETALLES DE LA TAREA ----------");
    console.log(`Titulo:                    ${tarea.titulo}`);
    console.log(`Descripcion:               ${tarea.descripcion}`);
    console.log(`Estado:                    ${estadoATexto(tarea.estado)}`);
    console.log(`Fecha de creacion:         ${formatearFecha(tarea.fechaCreacion)}`);
    console.log(`Dificultad:                ${dificultadATexto(tarea.dificultad)}`);
    console.log("------------------------------------------");

    console.log("\n.Desea editar esta tarea?");
    const opcionEditar = await input("[E] Editar - [0] Volver: ");

    if (opcionEditar.toLowerCase() === 'e') {
      console.clear();
      await this.editarTarea(indice);
    }
  }

  // ==================
  // EDITAR TAREA (usa funciones puras)
  // ==================
  async editarTarea(indice: number): Promise<void> {
    const gestor = this.getEstado();
    let tarea = obtenerTarea(gestor, indice);
    
    if (!tarea) return;

    console.log("\n=== EDITAR TAREA ===\n");

    // EDITAR TÍTULO (función pura)
    console.log(`Titulo: ${tarea.titulo}`);
    const editarTitulo = await input("Desea editar el titulo? [1] Si - [Enter] No: ");
    
    if (editarTitulo === "1") {
      const nuevoTitulo = await input("Nuevo titulo: ");
      tarea = actualizarTitulo(tarea, nuevoTitulo);
      console.log(".Titulo actualizado");
    }

    // EDITAR DESCRIPCIÓN (función pura)
    console.log(`\n\nDescripcion: ${tarea.descripcion}`);
    const editarDesc = await input("Desea editar la descripcion? [1] Si - [Enter] No: ");
    
    if (editarDesc === "1") {
      const nuevaDesc = await input("Nueva descripcion: ");
      tarea = actualizarDescripcion(tarea, nuevaDesc);
      console.log(".Descripcion actualizada");
    }

    // EDITAR ESTADO (función pura)
    console.log(`\n\nEstado: ${estadoATexto(tarea.estado)}`);
    const editarEstado = await input("Desea editar el estado? [1] Si - [Enter] No: ");
    
    if (editarEstado === "1") {
      let nuevaOpcion: number;
      do {
        console.log("Nuevo estado: [1] Pendiente - [2] En Curso - [3] Terminada - [4] Cancelada");
        nuevaOpcion = parseInt(await input("Opcion: "));
        
        if (nuevaOpcion >= 1 && nuevaOpcion <= 4) {
          tarea = actualizarEstado(tarea, nuevaOpcion);
          console.log(".Estado actualizado");
          break;
        } else {
          console.log("Opcion incorrecta!");
        }
      } while (true);
    }

    // EDITAR DIFICULTAD (función pura)
    console.log(`\n\nDificultad: ${dificultadATexto(tarea.dificultad)}`);
    const editarDif = await input("Desea editar la dificultad? [1] Si - [Enter] No: ");
    
    if (editarDif === "1") {
      let nuevaOpcion: number;
      do {
        console.log("Nueva dificultad: [1] Dificil - [2] Medio - [3] Facil");
        nuevaOpcion = parseInt(await input("Opcion: "));
        
        if (nuevaOpcion >= 1 && nuevaOpcion <= 3) {
          tarea = actualizarDificultad(tarea, nuevaOpcion);
          console.log(".Dificultad actualizada");
          break;
        } else {
          console.log("Opcion incorrecta!");
        }
      } while (true);
    }

    console.log("\n!!TAREA EDITADA EXITOSAMENTE!!");
    
    // Actualizar estado usando función pura
    this.setEstado(actualizarTarea(gestor, indice, tarea));
    
    await input("\nPresione Enter para continuar...");
  }

  // ==================
  // BUSCAR TAREAS (usa funciones puras)
  // ==================
  async buscarTareas(): Promise<void> {
    console.log("BUSCAR TAREAS..\n");
    console.log("Ingrese el titulo para buscar su tarea");
    const busqueda = await input(".Titulo: ");

    const gestor = this.getEstado();
    const tareas = buscarPorTitulo(gestor, busqueda);

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
      const indiceReal = gestor.tareas.indexOf(tareaSeleccionada);
      await this.mostrarDetallesTarea(indiceReal);
    }
  }

  // ==================
  // AGREGAR TAREA (usa funciones puras)
  // ==================
  async agregarTarea(): Promise<void> {
    console.log("AGREGAR TAREA..\n");
    console.log("..Ingrese los siguientes datos...\n");

    const titulo = await input(".Titulo: ");
    const descripcion = await input(".Descripcion: ");

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

    // Crear tarea usando función pura
    const nuevaTarea = crearTarea(titulo, descripcion, opcionEstado, opcionDificultad);
    
    // Agregar usando función pura (retorna nuevo estado)
    const gestor = this.getEstado();
    this.setEstado(agregarTarea(gestor, nuevaTarea));

    console.log("\n\n!!TAREA AGREGADA EXITOSAMENTE!!");
    await input("\nPresione Enter para continuar...");
  }

  // ==================
  // ESTADÍSTICAS (usa función pura)
  // ==================
  async mostrarEstadisticas(): Promise<void> {
    console.clear();
    console.log("\nESTADISTICAS DEL SISTEMA\n");

    const gestor = this.getEstado();
    const stats = calcularEstadisticas(gestor);

    console.log(`Total de tareas:       [${stats.total}]`);
    console.log(`Pendientes:             ${stats.pendientes}`);
    console.log(`En curso:               ${stats.enCurso}`);
    console.log(`Terminadas:             ${stats.terminadas}`);
    console.log(`Canceladas:             ${stats.canceladas}`);

    await input("\nPresione Enter para continuar...");
  }
}