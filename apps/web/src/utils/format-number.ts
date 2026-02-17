// import { formatNumberLocale } from 'src/locales';

// TODO: adicionar o lacele para as funções

// ----------------------------------------------------------------------

/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

export type InputNumberValue = string | number | null | undefined

type Options = Intl.NumberFormatOptions | undefined

const DEFAULT_LOCALE = { code: 'en-US', currency: 'USD' }

function processInput(inputValue: InputNumberValue): number | null {
  if (inputValue == null || Number.isNaN(inputValue)) return null
  return Number(inputValue)
}

// ----------------------------------------------------------------------

/**
 * Formata um número usando Intl.NumberFormat.
 * @param inputValue - O valor numérico a ser formatado
 * @param options - Opções de formatação do Intl.NumberFormat
 * @returns A string formatada do número ou string vazia se inválido
 * @example
 * fNumber(1234.56) // '1,234.56'
 * fNumber(1234.56, { maximumFractionDigits: 0 }) // '1,235'
 */
export function fNumber(inputValue: InputNumberValue, options?: Options) {
  // const locale = formatNumberLocale() || DEFAULT_LOCALE;
  const locale = DEFAULT_LOCALE

  const number = processInput(inputValue)
  if (number === null) return ''

  const fm = new Intl.NumberFormat(locale.code, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number)

  return fm
}

// ----------------------------------------------------------------------

/**
 * Formata um número como moeda usando Intl.NumberFormat.
 * @param inputValue - O valor numérico a ser formatado
 * @param options - Opções de formatação do Intl.NumberFormat
 * @returns A string formatada como moeda ou string vazia se inválido
 * @example
 * fCurrency(1234.56) // '$1,234.56'
 * fCurrency(1234.56, { currency: 'EUR' }) // '€1,234.56'
 */
export function fCurrency(inputValue: InputNumberValue, options?: Options) {
  // const locale = formatNumberLocale() || DEFAULT_LOCALE;
  const locale = DEFAULT_LOCALE

  const number = processInput(inputValue)
  if (number === null) return ''

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'currency',
    currency: locale.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number)

  return fm
}

// ----------------------------------------------------------------------

/**
 * Formata um número como percentual usando Intl.NumberFormat.
 * @param inputValue - O valor numérico a ser formatado (já em percentual, ex: 50 para 50%)
 * @param options - Opções de formatação do Intl.NumberFormat
 * @returns A string formatada como percentual ou string vazia se inválido
 * @example
 * fPercent(50) // '50%'
 * fPercent(12.5) // '12.5%'
 */
export function fPercent(inputValue: InputNumberValue, options?: Options) {
  // const locale = formatNumberLocale() || DEFAULT_LOCALE;
  const locale = DEFAULT_LOCALE

  const number = processInput(inputValue)
  if (number === null) return ''

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(number / 100)

  return fm
}

// ----------------------------------------------------------------------

/**
 * Formata um número em notação compacta (ex: 1K, 1M, 1B).
 * @param inputValue - O valor numérico a ser formatado
 * @param options - Opções de formatação do Intl.NumberFormat
 * @returns A string formatada em notação compacta ou string vazia se inválido
 * @example
 * fShortenNumber(1000) // '1k'
 * fShortenNumber(1000000) // '1m'
 */
export function fShortenNumber(
  inputValue: InputNumberValue,
  options?: Options
) {
  // const locale = formatNumberLocale() || DEFAULT_LOCALE;
  const locale = DEFAULT_LOCALE

  const number = processInput(inputValue)
  if (number === null) return ''

  const fm = new Intl.NumberFormat(locale.code, {
    notation: 'compact',
    maximumFractionDigits: 2,
    ...options,
  }).format(number)

  return fm.replace(/[A-Z]/g, match => match.toLowerCase())
}

// ----------------------------------------------------------------------

/**
 * Formata um número de bytes em uma string legível (ex: 1024 bytes = 1 Kb).
 * @param inputValue - O valor em bytes a ser formatado
 * @returns A string formatada com a unidade apropriada
 * @example
 * fData(1024) // '1 Kb'
 * fData(1048576) // '1 Mb'
 */
export function fData(inputValue: InputNumberValue) {
  const number = processInput(inputValue)
  if (number === null || number === 0) return '0 bytes'

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
  const decimal = 2
  const baseValue = 1024

  const index = Math.floor(Math.log(number) / Math.log(baseValue))
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`

  return fm
}
