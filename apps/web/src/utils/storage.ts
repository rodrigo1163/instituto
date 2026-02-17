// ----------------------------------------------------------------------

/**
 * Verifica se o localStorage está disponível no navegador.
 * @returns true se o localStorage estiver disponível, false caso contrário
 * @example
 * localStorageAvailable() // true ou false dependendo do navegador
 */
export function localStorageAvailable() {
  try {
    const key = '__some_random_key_you_are_not_going_to_use__'
    window.localStorage.setItem(key, key)
    window.localStorage.removeItem(key)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * Obtém um item do localStorage de forma segura.
 * @param key - A chave do item a ser recuperado
 * @param defaultValue - O valor padrão caso o item não exista (padrão: '')
 * @returns O valor do item ou o valor padrão
 * @example
 * localStorageGetItem('user', 'guest') // retorna o valor ou 'guest'
 */
export function localStorageGetItem(key: string, defaultValue = '') {
  const storageAvailable = localStorageAvailable()

  let value: string | null = null

  if (storageAvailable) {
    value = localStorage.getItem(key) || defaultValue
  }

  return value
}
