import type * as ExcelJS from 'exceljs';

/**
 * Utilidades comunes para leer y escribir celdas de Excel.
 *
 * Formatos:
 * - En la app las fechas se guardan como `yyyy-MM-dd` y las horas como `HH:mm`.
 * - En los Excel generados las fechas se escriben como `dd/MM/yyyy`.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Convierte el valor de una celda en texto, sea cual sea su tipo
 * (fecha, hora, fórmula, texto con formato, hipervínculo, número…).
 */
export function cellToText(value: ExcelJS.CellValue | undefined | null): string {
  if (value == null) return '';

  if (value instanceof Date) return dateCellToText(value);

  if (typeof value === 'object') {
    if ('result' in value) return cellToText(value.result as ExcelJS.CellValue);
    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join('').trim();
    }
    if ('text' in value && typeof value.text === 'string') return value.text.trim();
    if ('error' in value) return '';
    return '';
  }

  return String(value).trim();
}

/**
 * ExcelJS devuelve fechas y horas como Date en UTC. Una celda que solo tiene
 * hora llega con fecha 30/12/1899 (el origen de fechas de Excel).
 */
function dateCellToText(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const hasTime = hours !== 0 || minutes !== 0;

  if (date.getUTCFullYear() < 1901) {
    return `${pad(hours)}:${pad(minutes)}`;
  }

  const day = `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
  return hasTime ? `${day} ${pad(hours)}:${pad(minutes)}` : day;
}

/** `2026-11-20` → `20/11/2026`. Cualquier otro texto se devuelve igual. */
export function toDisplayDate(value: string | undefined | null): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  return match ? `${match[3]}/${match[2]}/${match[1]}` : (value ?? '');
}

/** `20/11/2026` (o `20-11-2026`) → `2026-11-20`. Cualquier otro texto se devuelve igual. */
export function toIsoDate(value: string | undefined | null): string {
  const match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec((value ?? '').trim());
  return match ? `${match[3]}-${pad(Number(match[2]))}-${pad(Number(match[1]))}` : (value ?? '');
}

/**
 * Los enteros se escriben como número para que Excel no avise de
 * "número almacenado como texto" y se puedan sumar. Se respetan los ceros
 * a la izquierda (códigos como "007" siguen siendo texto).
 */
export function toExcelValue(value: unknown): unknown {
  if (typeof value === 'string' && /^(0|[1-9]\d{0,14})$/.test(value)) {
    return Number(value);
  }
  return value;
}

/** Normaliza un texto para comparar cabeceras: sin tildes, mayúsculas, espacios simples. */
export function normalizeHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/** Ancho de columna adecuado para una cabecera. */
export function columnWidthFor(header: string): number {
  const h = normalizeHeader(header);
  if (/OBSERVACION|DESCRIPCION|DETALLE|MOTIVO|CONSECUENCIA/.test(h)) return 40;
  return Math.min(Math.max(header.length + 4, 12), 32);
}

/**
 * Alto de fila aproximado para que el texto largo (con ajuste de línea) se vea
 * entero al abrir el Excel. Excel no lo recalcula solo si el alto es fijo.
 */
export function rowHeightFor(
  values: unknown[],
  widths: number[],
  lineHeight = 12.5,
  minHeight = 19,
): number {
  const lines = values.reduce<number>((max, value, index) => {
    const text = value == null ? '' : String(value);
    if (!text) return max;
    const width = Math.max((widths[index] ?? 12) - 1, 4);
    const needed = text
      .split('\n')
      .reduce((acc, line) => acc + Math.max(1, Math.ceil(line.length / width)), 0);
    return Math.max(max, needed);
  }, 1);
  return Math.max(minHeight, Math.ceil(lines * lineHeight + 4));
}

/** Marca de tiempo para nombres de archivo: `20-11-26_0805`. */
export function fileTimestamp(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${yy}_${pad(date.getHours())}${pad(date.getMinutes())}`;
}
