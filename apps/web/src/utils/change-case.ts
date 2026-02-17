// ----------------------------------------------------------------------

/**
 * Converte uma string para o formato param-case (kebab-case).
 * @param str - A string a ser convertida
 * @returns A string em formato param-case
 * @example
 * paramCase('Hello World') // 'hello-world'
 * paramCase('Test String 123') // 'test-string-123'
 */
export function paramCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// ----------------------------------------------------------------------

/**
 * Converte uma string para o formato snake_case.
 * @param str - A string a ser convertida
 * @returns A string em formato snake_case
 * @example
 * snakeCase('Hello World') // 'hello_world'
 * snakeCase('Test String 123') // 'test_string_123'
 */
export function snakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

// ----------------------------------------------------------------------

/**
 * Converte uma string para sentence case (primeira letra maiúscula).
 * @param string - A string a ser convertida
 * @returns A string com a primeira letra maiúscula
 * @example
 * sentenceCase('hello world') // 'Hello world'
 * sentenceCase('test') // 'Test'
 */
export function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
