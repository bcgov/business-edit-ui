/**
 * Converts a string in "camelCase" (or "PascalCase") to separate, title-case words,
 * suitable for a title or proper name.
 * @param s the string to convert
 * @returns the converted string
 */
export function CamelCaseToWords (s: string): string {
  return s?.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase()) || ''
}
