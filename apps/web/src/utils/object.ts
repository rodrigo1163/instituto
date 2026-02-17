/** biome-ignore-all lint/complexity/useOptionalChain: <we need to use optional chain to compare data> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to use any to compare any type of data> */

/**
 * Funções utilitárias para mesclagem e manipulação de objetos.
 */

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Mescla profundamente múltiplos objetos em um objeto alvo.
 *
 * @param target - O objeto alvo que receberá as propriedades mescladas
 * @param sources - Os objetos fonte a serem mesclados
 * @returns O objeto alvo com todas as propriedades mescladas
 * @example
 * merge({ a: 1 }, { b: 2 }, { c: 3 }) // { a: 1, b: 2, c: 3 }
 * merge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export const merge = (target: any, ...sources: any[]): any => {
  if (!sources.length) return target

  const source = sources.shift()

  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} })
      merge(target[key], source[key])
    } else {
      Object.assign(target, { [key]: source[key] })
    }
  }

  return merge(target, ...sources)
}
