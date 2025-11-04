// =======================
// PUNTO DE ENTRADA (Adaptado a Funcional)
// =======================

import { input, close } from '../lib/nodeImperativo';
import { crearGestorVacio, EstadoGestor } from './gestorTareas';
import { InterfazUsuario } from './interfazUsuario';

async function main(): Promise<void> {
  // Estado inmutable - usamos let solo para reasignar la referencia
  let estado = crearGestorVacio();
  
  // Funciones para acceder/actualizar el estado
  const getEstado = () => estado;
  const setEstado = (nuevoEstado: EstadoGestor) => {
    estado = nuevoEstado;
  };
  
  // Crear interfaz pasándole las funciones de acceso
  const interfaz = new InterfazUsuario(getEstado, setEstado);
  
  let opcion: string;

  console.clear();

  do {
    interfaz.mostrarMenuPrincipal();
    opcion = await input("Opcion: ");

    switch (opcion) {
      case "0":
        console.log("\n\n.Gracias por disfrutar de nuestro sistema\n");
        console.log("\tHASTA LA PROXIMA!!\n");
        break;

      case "1":
        await interfaz.verTareas();
        await input("\nPresione Enter para continuar...");
        console.clear();
        break;

      case "2":
        console.clear();
        await interfaz.buscarTareas();
        await input("\nPresione Enter para continuar...");
        console.clear();
        break;

      case "3":
        console.clear();
        await interfaz.agregarTarea();
        console.clear();
        break;

      case "4":
        await interfaz.mostrarEstadisticas();
        console.clear();
        break;

      default:
        console.log("\nOpcion incorrecta!!");
        await input("\nPresione Enter para continuar...");
        console.clear();
        break;
    }

  } while (opcion !== "0");

  close();
}

main().catch((error) => {
  console.error("Error fatal:", error);
  close();
});