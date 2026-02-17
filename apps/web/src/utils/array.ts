/** biome-ignore-all lint/complexity/useOptionalChain: <we need to use optional chain to compare data> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to use any to compare any type of data> */

/**
 * Funções utilitárias para transformação, achatamento, ordenação e agregação de arrays.
 *
 * Referências:
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

/**
 * Achata recursivamente um array de objetos aninhados baseado em uma chave específica.
 *
 * @param list - O array de objetos a ser achatado
 * @param key - A chave que contém os filhos (padrão: 'children')
 * @returns Um array achatado com todos os itens
 * @example
 * flattenArray([{ id: 1, children: [{ id: 2 }] }]) // [{ id: 1 }, { id: 2 }]
 */
export function flattenArray<T>(list: T[], key = 'children'): T[] {
  let children: T[] = []

  const flatten = list?.map((item: any) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]]
    }
    return item
  })

  return flatten?.concat(
    children.length ? flattenArray(children, key) : children
  )
}

/**
 * Achata um array aninhado em qualquer nível de profundidade.
 *
 * @param array - O array a ser achatado
 * @returns Um array completamente achatado
 * @example
 * flattenDeep([1, [2, [3, [4]]]]) // [1, 2, 3, 4]
 */
export function flattenDeep(array: any): any[] {
  const isArray = array && Array.isArray(array)

  if (isArray) {
    return array.flat(Infinity)
  }
  return []
}

/**
 * Ordena um array de objetos por uma ou mais propriedades.
 *
 * @param array - O array a ser ordenado
 * @param properties - Array de propriedades para ordenação
 * @param orders - Array opcional de direções de ordenação ('asc' ou 'desc')
 * @returns Um novo array ordenado
 * @example
 * orderBy([{ name: 'b', age: 2 }, { name: 'a', age: 1 }], ['name']) // [{ name: 'a', age: 1 }, { name: 'b', age: 2 }]
 * orderBy([{ name: 'a', age: 2 }, { name: 'a', age: 1 }], ['name', 'age'], ['asc', 'desc']) // [{ name: 'a', age: 2 }, { name: 'a', age: 1 }]
 */
export function orderBy<T>(
  array: T[],
  properties: (keyof T)[],
  orders?: ('asc' | 'desc')[]
): T[] {
  return array.slice().sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i]
      const order = orders && orders[i] === 'desc' ? -1 : 1

      const aValue = a[property]
      const bValue = b[property]

      if (aValue < bValue) return -1 * order
      if (aValue > bValue) return 1 * order
    }
    return 0
  })
}

/**
 * Transforma um array em um objeto indexado por uma chave específica.
 *
 * @param array - O array a ser transformado
 * @param key - A propriedade a ser usada como chave
 * @returns Um objeto indexado pela chave fornecida
 * @example
 * keyBy([{ id: 1, name: 'a' }, { id: 2, name: 'b' }], 'id') // { '1': { id: 1, name: 'a' }, '2': { id: 2, name: 'b' } }
 */
export function keyBy<T>(
  array: T[],
  key: keyof T
): {
  [key: string]: T
} {
  return (array || []).reduce((result, item) => {
    const keyValue = key ? item[key] : item

    // biome-ignore lint/performance/noAccumulatingSpread: <we need to spread the result>
    return { ...result, [String(keyValue)]: item }
  }, {})
}

/**
 * Calcula a soma dos valores retornados pela função iteratee para cada item do array.
 *
 * @param array - O array a ser processado
 * @param iteratee - A função que retorna o valor numérico a ser somado
 * @returns A soma total dos valores
 * @example
 * sumBy([{ value: 1 }, { value: 2 }, { value: 3 }], item => item.value) // 6
 */
export function sumBy<T>(array: T[], iteratee: (item: T) => number): number {
  return array.reduce((sum, item) => sum + iteratee(item), 0)
}
