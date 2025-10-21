// =======================
// PUNTO DE ENTRADA DEL PROGRAMA
// =======================

import { input, close } from '../lib/nodeImperativo';
import { GestorTareas } from './gestorTareas';
import { InterfazUsuario } from './interfazUsuario';

// Función Principal
async function main(): Promise<void> {
  // Crear instancias (ENCAPSULAMIENTO)
  const gestor = new GestorTareas();
  const interfaz = new InterfazUsuario(gestor);
  
  let opcion: string;

  console.clear();

  // Bucle principal del programa
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

// Ejecutar el programa
main().catch((error) => {
  console.error("Error fatal:", error);
  close();
});