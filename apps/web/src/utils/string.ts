/** biome-ignore-all lint/complexity/useOptionalChain: <we need to use optional chain to compare data> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to use any to compare any type of data> */

/**
 * Funções utilitárias para manipulação e formatação de strings.
 */

/**
 * Capitaliza a primeira letra de cada palavra em uma string.
 *
 * @param value - A string a ser capitalizada
 * @returns A string com cada palavra capitalizada
 * @example
 * capitalize('hello world') // 'Hello World'
 * capitalize('test string') // 'Test String'
 */
export function capitalize(value: string) {
  const words = value.split(' ')
  const capitalizedWords = words.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  )
  return capitalizedWords.join(' ')
}

/**
 * Trunca uma string mantendo os primeiros e últimos caracteres, adicionando "..." no meio.
 *
 * @param fan - A string a ser truncada
 * @returns A string truncada ou a string original se for menor que o limite
 * @example
 * truncateFan('12345678901234567890') // '123456789012...567890'
 * truncateFan('short') // 'short'
 */
export const truncateFan = (fan: string) => {
  const init_size = 12
  const last_size = 8
  return fan.length > init_size + last_size
    ? `${fan.slice(0, init_size)}...${fan.slice(-last_size)}`
    : fan
}
