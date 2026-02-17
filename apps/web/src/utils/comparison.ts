/** biome-ignore-all lint/complexity/useOptionalChain: <we need to use optional chain to compare data> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to use any to compare any type of data> */

/**
 * Funções utilitárias para verificação de igualdade profunda e detecção de mudanças.
 */

/**
 * Verifica se os dados de um array mudaram comparando cada item usando JSON.stringify.
 * @param oldData - O array de dados antigos
 * @param newData - O array de dados novos
 * @returns true se os dados mudaram, false caso contrário
 * @example
 * hasDataChanged([{ id: 1 }], [{ id: 1 }]) // false
 * hasDataChanged([{ id: 1 }], [{ id: 2 }]) // true
 */
export function hasDataChanged<T>(oldData: T[], newData: T[]): boolean {
  if (oldData.length !== newData.length) {
    return true
  }

  for (let i = 0; i < newData.length; i += 1) {
    if (JSON.stringify(oldData[i]) !== JSON.stringify(newData[i])) {
      return true
    }
  }

  return false
}

/**
 * Compara dois valores profundamente, verificando igualdade recursiva para objetos e arrays.
 * @param a - O primeiro valor a ser comparado
 * @param b - O segundo valor a ser comparado
 * @returns true se os valores forem iguais, false caso contrário
 * @example
 * isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) // true
 * isEqual([1, 2, 3], [1, 2, 3]) // true
 * isEqual({ a: 1 }, { a: 2 }) // false
 */
export function isEqual(a: any, b: any): boolean {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b
  }

  if (typeof a !== typeof b) {
    return false
  }

  if (
    typeof a === 'string' ||
    typeof a === 'number' ||
    typeof a === 'boolean'
  ) {
    return a === b
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }

    return a.every((item, index) => isEqual(item, b[index]))
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a!)
    const keysB = Object.keys(b!)

    if (keysA.length !== keysB.length) {
      return false
    }

    return keysA.every(key => isEqual(a[key], b[key]))
  }

  return false
}
