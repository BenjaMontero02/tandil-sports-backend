//separa un string, separador por comas y
export function splitUrls(input: string): string[] {
    return input
      .split(',')                     // separar por coma
      .map(url => url.trim())        // quitar espacios en blanco
      .filter(url => url.length > 0) // eliminar posibles vacíos
  }