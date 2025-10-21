// =======================
// TIPOS Y CLASES OOP
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

// ABSTRACCIÓN: Interfaz base para todas las tareas
export interface ITarea {
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
  fechadecreacion: number;
  
  mostrarResumen(): string;
  estaCompletada(): boolean;
  obtenerDiasDesdeCreacion(): number;
}

// ABSTRACCIÓN: Clase abstracta base (NO se puede instanciar directamente)
export abstract class TareaBase implements ITarea {
  // ENCAPSULAMIENTO: Propiedades protegidas
  protected _titulo: string;
  protected _descripcion: string;
  protected _estado: EstadoTarea;
  protected _fechadecreacion: number;

  constructor(titulo: string, descripcion: string, estado: EstadoTarea = EstadoTarea.PENDIENTE) {
    this._titulo = titulo;
    this._descripcion = descripcion;
    this._estado = estado;
    this._fechadecreacion = Date.now();
  }

  // ENCAPSULAMIENTO: Getters y Setters con validación
  get titulo(): string {
    return this._titulo;
  }

  set titulo(valor: string) {
    if (valor.trim().length === 0) {
      throw new Error("El título no puede estar vacío");
    }
    this._titulo = valor;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  set descripcion(valor: string) {
    this._descripcion = valor;
  }

  get estado(): EstadoTarea {
    return this._estado;
  }

  set estado(valor: EstadoTarea) {
    this._estado = valor;
  }

  get fechadecreacion(): number {
    return this._fechadecreacion;
  }

  // Método común para todas las tareas
  estaCompletada(): boolean {
    return this._estado === EstadoTarea.TERMINADA;
  }

  obtenerDiasDesdeCreacion(): number {
    const ahora = Date.now();
    const diferencia = ahora - this._fechadecreacion;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  // ABSTRACCIÓN: Métodos abstractos que cada clase hija DEBE implementar
  abstract mostrarResumen(): string;
  abstract calcularPrioridad(): PrioridadTarea;
}

// ========================================
// HERENCIA: TareaSimple extiende TareaBase
// ========================================
export class TareaSimple extends TareaBase {
  private _dificultad: DificultadTarea;

  constructor(
    titulo: string,
    descripcion: string,
    estado: EstadoTarea = EstadoTarea.PENDIENTE,
    dificultad: DificultadTarea = DificultadTarea.MEDIO
  ) {
    super(titulo, descripcion, estado); // Llamada al constructor padre
    this._dificultad = dificultad;
  }

  // ENCAPSULAMIENTO: Getter y Setter
  get dificultad(): DificultadTarea {
    return this._dificultad;
  }

  set dificultad(valor: DificultadTarea) {
    this._dificultad = valor;
  }

  // POLIMORFISMO: Implementación específica del método abstracto
  mostrarResumen(): string {
    const estadoTexto = this.obtenerTextoEstado();
    const dificultadTexto = this.obtenerTextoDificultad();
    return `[${estadoTexto}] ${this._titulo} - Dificultad: ${dificultadTexto}`;
  }

  calcularPrioridad(): PrioridadTarea {
    // Lógica: prioridad basada en dificultad y estado
    if (this._estado === EstadoTarea.PENDIENTE && this._dificultad === DificultadTarea.DIFICIL) {
      return PrioridadTarea.ALTA;
    } else if (this._estado === EstadoTarea.EN_CURSO) {
      return PrioridadTarea.MEDIA;
    }
    return PrioridadTarea.BAJA;
  }

  // Métodos privados auxiliares
  private obtenerTextoEstado(): string {
    switch (this._estado) {
      case EstadoTarea.PENDIENTE: return "Pendiente";
      case EstadoTarea.EN_CURSO: return "En Curso";
      case EstadoTarea.TERMINADA: return "Terminada";
      case EstadoTarea.CANCELADA: return "Cancelada";
      default: return "Desconocido";
    }
  }

  private obtenerTextoDificultad(): string {
    switch (this._dificultad) {
      case DificultadTarea.DIFICIL: return "Difícil";
      case DificultadTarea.MEDIO: return "Medio";
      case DificultadTarea.FACIL: return "Fácil";
      default: return "Desconocido";
    }
  }

  // Método público para obtener texto de dificultad (usado externamente)
  obtenerTextoDificultadPublico(): string {
    return this.obtenerTextoDificultad();
  }
}

// ====================================================
// HERENCIA: TareaConFechaLimite extiende TareaBase
// ====================================================
export class TareaConFechaLimite extends TareaBase {
  private _fechaLimite: number;
  private _prioridad: PrioridadTarea;

  constructor(
    titulo: string,
    descripcion: string,
    fechaLimite: Date,
    estado: EstadoTarea = EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea = PrioridadTarea.MEDIA
  ) {
    super(titulo, descripcion, estado);
    this._fechaLimite = fechaLimite.getTime();
    this._prioridad = prioridad;
  }

  get fechaLimite(): number {
    return this._fechaLimite;
  }

  set fechaLimite(valor: number) {
    this._fechaLimite = valor;
  }

  get prioridad(): PrioridadTarea {
    return this._prioridad;
  }

  set prioridad(valor: PrioridadTarea) {
    this._prioridad = valor;
  }

  // POLIMORFISMO: Implementación específica
  mostrarResumen(): string {
    const estadoTexto = this.obtenerTextoEstado();
    const diasRestantes = this.obtenerDiasRestantes();
    const urgencia = diasRestantes <= 2 ? "¡URGENTE! " : "";
    return `${urgencia}[${estadoTexto}] ${this._titulo} - Vence en ${diasRestantes} días`;
  }

  calcularPrioridad(): PrioridadTarea {
    const diasRestantes = this.obtenerDiasRestantes();
    
    if (diasRestantes <= 1) {
      return PrioridadTarea.URGENTE;
    } else if (diasRestantes <= 3) {
      return PrioridadTarea.ALTA;
    } else if (diasRestantes <= 7) {
      return PrioridadTarea.MEDIA;
    }
    return PrioridadTarea.BAJA;
  }

  obtenerDiasRestantes(): number {
    const ahora = Date.now();
    const diferencia = this._fechaLimite - ahora;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  estaVencida(): boolean {
    return Date.now() > this._fechaLimite && !this.estaCompletada();
  }

  private obtenerTextoEstado(): string {
    switch (this._estado) {
      case EstadoTarea.PENDIENTE: return "Pendiente";
      case EstadoTarea.EN_CURSO: return "En Curso";
      case EstadoTarea.TERMINADA: return "Terminada";
      case EstadoTarea.CANCELADA: return "Cancelada";
      default: return "Desconocido";
    }
  }
}

// ================================================
// HERENCIA: TareaRecurrente extiende TareaBase
// ================================================
export class TareaRecurrente extends TareaBase {
  private _frecuenciaDias: number;
  private _ultimaEjecucion: number;

  constructor(
    titulo: string,
    descripcion: string,
    frecuenciaDias: number,
    estado: EstadoTarea = EstadoTarea.PENDIENTE
  ) {
    super(titulo, descripcion, estado);
    this._frecuenciaDias = frecuenciaDias;
    this._ultimaEjecucion = Date.now();
  }

  get frecuenciaDias(): number {
    return this._frecuenciaDias;
  }

  set frecuenciaDias(valor: number) {
    if (valor <= 0) {
      throw new Error("La frecuencia debe ser mayor a 0");
    }
    this._frecuenciaDias = valor;
  }

  // POLIMORFISMO: Implementación específica
  mostrarResumen(): string {
    const estadoTexto = this.obtenerTextoEstado();
    return `[${estadoTexto}] ${this._titulo} - Se repite cada ${this._frecuenciaDias} días`;
  }

  calcularPrioridad(): PrioridadTarea {
    const diasDesdeUltimaEjecucion = this.obtenerDiasDesdeUltimaEjecucion();
    
    if (diasDesdeUltimaEjecucion >= this._frecuenciaDias) {
      return PrioridadTarea.ALTA;
    } else if (diasDesdeUltimaEjecucion >= this._frecuenciaDias - 1) {
      return PrioridadTarea.MEDIA;
    }
    return PrioridadTarea.BAJA;
  }

  obtenerDiasDesdeUltimaEjecucion(): number {
    const ahora = Date.now();
    const diferencia = ahora - this._ultimaEjecucion;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  marcarComoEjecutada(): void {
    this._ultimaEjecucion = Date.now();
    this._estado = EstadoTarea.TERMINADA;
  }

  reiniciar(): void {
    this._estado = EstadoTarea.PENDIENTE;
    this._ultimaEjecucion = Date.now();
  }

  private obtenerTextoEstado(): string {
    switch (this._estado) {
      case EstadoTarea.PENDIENTE: return "Pendiente";
      case EstadoTarea.EN_CURSO: return "En Curso";
      case EstadoTarea.TERMINADA: return "Terminada";
      case EstadoTarea.CANCELADA: return "Cancelada";
      default: return "Desconocido";
    }
  }
}