// =======================
// Librería NodeImperativo
// (Archivo: lib/nodeImperativo.ts)
// =======================

import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función auxiliar estilo "scanf"
export function input(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Función para cerrar la consola (similar a liberar recursos)
export function close(): void {
  rl.close();
}