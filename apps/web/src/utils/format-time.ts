import {
  add,
  format,
  formatDistanceToNow,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  isValid,
  parseISO,
  startOfDay,
  sub,
} from 'date-fns'

// ----------------------------------------------------------------------

export type DatePickerFormat = Date | string | number | null | undefined

/**
 * Helper function to convert various date formats to Date object
 */
function parseDate(date: DatePickerFormat): Date | null {
  if (!date) {
    return null
  }

  if (date instanceof Date) {
    return date
  }

  if (typeof date === 'number') {
    return new Date(date)
  }

  if (typeof date === 'string') {
    // Try parsing as ISO string first
    const parsed = parseISO(date)
    if (isValid(parsed)) {
      return parsed
    }
    // Fallback to Date constructor
    const fallback = new Date(date)
    return isValid(fallback) ? fallback : null
  }

  return null
}

/**
 * Docs: https://date-fns.org/docs/format
 */
export const formatStr = {
  dateTime: 'dd MMM yyyy h:mm a', // 17 Apr 2022 12:00 am
  date: 'dd MMM yyyy', // 17 Apr 2022
  time: 'h:mm a', // 12:00 am
  split: {
    dateTime: 'dd/MM/yyyy h:mm a', // 17/04/2022 12:00 am
    date: 'dd/MM/yyyy', // 17/04/2022
  },
  paramCase: {
    dateTime: 'dd-MM-yyyy h:mm a', // 17-04-2022 12:00 am
    date: 'dd-MM-yyyy', // 17-04-2022
  },
}

/**
 * Retorna a data de hoje formatada.
 * @param formatPattern - Padrão de formatação opcional (padrão: 'dd MMM yyyy')
 * @returns A data de hoje formatada
 * @example
 * today() // '17 Apr 2022'
 * today('dd/MM/yyyy') // '17/04/2022'
 */
export function today(formatPattern?: string) {
  const todayDate = startOfDay(new Date())
  return formatPattern
    ? format(todayDate, formatPattern)
    : format(todayDate, formatStr.date)
}

// ----------------------------------------------------------------------

/**
 * Formata uma data e hora em uma string.
 * @param date - A data a ser formatada
 * @param formatPattern - Padrão de formatação opcional (padrão: 'dd MMM yyyy h:mm a')
 * @returns A data e hora formatada ou null se inválida
 * @example
 * fDateTime(new Date()) // '17 Apr 2022 12:00 am'
 */
export function fDateTime(date: DatePickerFormat, formatPattern?: string) {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  if (!parsedDate || !isValid(parsedDate)) {
    return 'Invalid time value'
  }

  return format(parsedDate, formatPattern ?? formatStr.dateTime)
}

// ----------------------------------------------------------------------

/**
 * Formata uma data em uma string.
 *
 * @param date - A data a ser formatada
 * @param formatPattern - Padrão de formatação opcional (padrão: 'dd MMM yyyy')
 * @returns A data formatada ou null se inválida
 * @example
 * fDate(new Date()) // '17 Apr 2022'
 */
export function fDate(date: DatePickerFormat, formatPattern?: string) {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  if (!parsedDate || !isValid(parsedDate)) {
    return 'Invalid time value'
  }

  return format(parsedDate, formatPattern ?? formatStr.date)
}

// ----------------------------------------------------------------------

/**
 * Formata apenas a hora de uma data em uma string.
 * @param date - A data a ser formatada
 * @param formatPattern - Padrão de formatação opcional (padrão: 'h:mm a')
 * @returns A hora formatada ou null se inválida
 * @example
 * fTime(new Date()) // '12:00 am'
 */
export function fTime(date: DatePickerFormat, formatPattern?: string) {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  if (!parsedDate || !isValid(parsedDate)) {
    return 'Invalid time value'
  }

  return format(parsedDate, formatPattern ?? formatStr.time)
}

// ----------------------------------------------------------------------

/**
 * Converte uma data em timestamp (milissegundos desde 1 de janeiro de 1970).
 * @param date - A data a ser convertida
 * @returns O timestamp em milissegundos ou null se inválida
 * @example
 * fTimestamp(new Date()) // 1713250100000
 */
export function fTimestamp(date: DatePickerFormat) {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  if (!parsedDate || !isValid(parsedDate)) {
    return 'Invalid time value'
  }

  return parsedDate.getTime()
}

// ----------------------------------------------------------------------

/**
 * Retorna a distância de tempo relativa de uma data até agora (ex: "a few seconds", "2 years").
 * @param date - A data a ser comparada
 * @returns A distância de tempo formatada ou null se inválida
 * @example
 * fToNow(new Date(Date.now() - 60000)) // 'a minute'
 */
export function fToNow(date: DatePickerFormat) {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  if (!parsedDate || !isValid(parsedDate)) {
    return 'Invalid time value'
  }

  return formatDistanceToNow(parsedDate, { addSuffix: false })
}

// ----------------------------------------------------------------------

/**
 * Verifica se uma data está entre duas outras datas.
 * @param inputDate - A data a ser verificada
 * @param startDate - A data de início do intervalo
 * @param endDate - A data de fim do intervalo
 * @returns true se a data estiver entre as datas fornecidas, false caso contrário
 * @example
 * fIsBetween(new Date('2024-05-15'), new Date('2024-05-01'), new Date('2024-05-31')) // true
 */
export function fIsBetween(
  inputDate: DatePickerFormat,
  startDate: DatePickerFormat,
  endDate: DatePickerFormat
) {
  if (!inputDate || !startDate || !endDate) {
    return false
  }

  const formattedInputDate = fTimestamp(inputDate)
  const formattedStartDate = fTimestamp(startDate)
  const formattedEndDate = fTimestamp(endDate)

  if (formattedInputDate && formattedStartDate && formattedEndDate) {
    return (
      formattedInputDate >= formattedStartDate &&
      formattedInputDate <= formattedEndDate
    )
  }

  return false
}

// ----------------------------------------------------------------------

/**
 * Verifica se a primeira data é posterior à segunda data.
 * @param startDate - A primeira data
 * @param endDate - A segunda data
 * @returns true se startDate for posterior a endDate, false caso contrário
 * @example
 * fIsAfter(new Date('2024-05-15'), new Date('2024-05-10')) // true
 */
export function fIsAfter(
  startDate: DatePickerFormat,
  endDate: DatePickerFormat
) {
  const parsedStartDate = parseDate(startDate)
  const parsedEndDate = parseDate(endDate)

  if (!parsedStartDate || !parsedEndDate) {
    return false
  }

  return isAfter(parsedStartDate, parsedEndDate)
}

// ----------------------------------------------------------------------

export type DateUnit = 'day' | 'month' | 'year'

/**
 * Verifica se duas datas são iguais em uma unidade específica (dia, mês ou ano).
 * @param startDate - A primeira data
 * @param endDate - A segunda data
 * @param units - A unidade de comparação ('day', 'month' ou 'year', padrão: 'year')
 * @returns true se as datas forem iguais na unidade especificada, false caso contrário, ou 'Invalid time value' se inválidas
 * @example
 * fIsSame(new Date('2024-05-15'), new Date('2024-05-20'), 'month') // true
 * fIsSame(new Date('2024-05-15'), new Date('2024-06-15'), 'year') // true
 */
export function fIsSame(
  startDate: DatePickerFormat,
  endDate: DatePickerFormat,
  units?: DateUnit
) {
  if (!startDate || !endDate) {
    return false
  }

  const parsedStartDate = parseDate(startDate)
  const parsedEndDate = parseDate(endDate)

  if (
    !parsedStartDate ||
    !parsedEndDate ||
    !isValid(parsedStartDate) ||
    !isValid(parsedEndDate)
  ) {
    return 'Invalid time value'
  }

  const unit = units ?? 'year'

  switch (unit) {
    case 'day':
      return isSameDay(parsedStartDate, parsedEndDate)
    case 'month':
      return isSameMonth(parsedStartDate, parsedEndDate)
    case 'year':
      return isSameYear(parsedStartDate, parsedEndDate)
    default:
      return isSameYear(parsedStartDate, parsedEndDate)
  }
}

// ----------------------------------------------------------------------

/**
 * Gera um rótulo curto para um intervalo de datas, otimizando a exibição baseado na similaridade das datas.
 * @param startDate - A data de início
 * @param endDate - A data de fim
 * @param initial - Se true, retorna o formato completo sem otimização
 * @returns Um rótulo formatado do intervalo de datas ou 'Invalid time value' se inválido
 * @example
 * fDateRangeShortLabel(new Date('2024-04-25'), new Date('2024-04-26')) // '25 - 26 Apr 2024'
 * fDateRangeShortLabel(new Date('2024-04-25'), new Date('2024-04-25')) // '26 Apr 2024'
 */
export function fDateRangeShortLabel(
  startDate: DatePickerFormat,
  endDate: DatePickerFormat,
  initial?: boolean
) {
  const parsedStartDate = parseDate(startDate)
  const parsedEndDate = parseDate(endDate)

  const datesValid =
    parsedStartDate &&
    parsedEndDate &&
    isValid(parsedStartDate) &&
    isValid(parsedEndDate)

  const isAfterResult = fIsAfter(startDate, endDate)

  if (!datesValid || isAfterResult) {
    return 'Invalid time value'
  }

  let label = `${fDate(startDate)} - ${fDate(endDate)}`

  if (initial) {
    return label
  }

  const sameYear = fIsSame(startDate, endDate, 'year')
  const sameMonth = fIsSame(startDate, endDate, 'month')
  const sameDay = fIsSame(startDate, endDate, 'day')

  if (sameYear && !sameMonth) {
    label = `${fDate(startDate, 'dd MMM')} - ${fDate(endDate)}`
  } else if (sameYear && sameMonth && !sameDay) {
    label = `${fDate(startDate, 'dd')} - ${fDate(endDate)}`
  } else if (sameYear && sameMonth && sameDay) {
    label = `${fDate(endDate)}`
  }

  return label
}

// ----------------------------------------------------------------------

export type DurationProps = {
  years?: number
  months?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

/**
 * Adiciona uma duração à data atual e retorna como string ISO.
 * @param props - Objeto com as propriedades de duração a serem adicionadas
 * @param props.years - Anos a adicionar (padrão: 0)
 * @param props.months - Meses a adicionar (padrão: 0)
 * @param props.days - Dias a adicionar (padrão: 0)
 * @param props.hours - Horas a adicionar (padrão: 0)
 * @param props.minutes - Minutos a adicionar (padrão: 0)
 * @param props.seconds - Segundos a adicionar (padrão: 0)
 * @param props.milliseconds - Milissegundos a adicionar (padrão: 0)
 * @returns A data resultante como string ISO
 * @example
 * fAdd({ days: 7 }) // '2024-05-28T05:55:31+00:00' (7 dias a partir de hoje)
 */
export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: DurationProps) {
  const duration: {
    years?: number
    months?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
  } = {}

  if (years !== 0) duration.years = years
  if (months !== 0) duration.months = months
  if (days !== 0) duration.days = days
  if (hours !== 0) duration.hours = hours
  if (minutes !== 0) duration.minutes = minutes
  if (seconds !== 0) duration.seconds = seconds

  let result = new Date()

  if (Object.keys(duration).length > 0) {
    result = add(result, duration)
  }

  if (milliseconds !== 0) {
    result = new Date(result.getTime() + milliseconds)
  }

  return result.toISOString()
}

/**
 * Subtrai uma duração da data atual e retorna como string ISO.
 * @param props - Objeto com as propriedades de duração a serem subtraídas
 * @param props.years - Anos a subtrair (padrão: 0)
 * @param props.months - Meses a subtrair (padrão: 0)
 * @param props.days - Dias a subtrair (padrão: 0)
 * @param props.hours - Horas a subtrair (padrão: 0)
 * @param props.minutes - Minutos a subtrair (padrão: 0)
 * @param props.seconds - Segundos a subtrair (padrão: 0)
 * @param props.milliseconds - Milissegundos a subtrair (padrão: 0)
 * @returns A data resultante como string ISO
 * @example
 * fSub({ days: 7 }) // '2024-05-14T05:55:31+00:00' (7 dias antes de hoje)
 */
export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: DurationProps) {
  const duration: {
    years?: number
    months?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
  } = {}

  if (years !== 0) duration.years = years
  if (months !== 0) duration.months = months
  if (days !== 0) duration.days = days
  if (hours !== 0) duration.hours = hours
  if (minutes !== 0) duration.minutes = minutes
  if (seconds !== 0) duration.seconds = seconds

  let result = new Date()

  if (Object.keys(duration).length > 0) {
    result = sub(result, duration)
  }

  if (milliseconds !== 0) {
    result = new Date(result.getTime() - milliseconds)
  }

  return result.toISOString()
}
