/**
 * Formats any JS number or numeric string. This works around the limitations of toLocaleString
 * (such as max 21 fractional digits). This function:
 * - Expands scientific notation
 * - Preserves all digits
 * - Shows at least "minDecimals"
 * - Leaves extra decimals untouched
 * - Adds grouping (thousands separators) using a locale if requested
 * - Avoids toLocaleString for the number itself (so tiny numbers stay intact)
 */
export function FormatDecimal (
  value: number | string,
  { minDecimals = 0, grouping = false, locale = 'en-US' }
): string {
  let str = String(value)

  // Expand scientific notation manually
  if (str.includes('e') || str.includes('E')) {
    const [coeff, expRaw] = str.toLowerCase().split('e')
    const exp = Number(expRaw)

    const [_intPart, fracPart = ''] = coeff.split('.')
    let intPart = _intPart

    const sign = intPart.startsWith('-') ? '-' : ''
    if (sign) intPart = intPart.slice(1)

    if (exp > 0) {
      const combined = intPart + fracPart
      const shiftIndex = intPart.length + exp
      let newInt: string
      let newFrac: string
      if (shiftIndex >= combined.length) {
        // Decimal point moves past the existing digits; pad with zeros.
        newInt = combined.padEnd(shiftIndex, '0')
        newFrac = ''
      } else {
        // Decimal point moves within the existing digits.
        newInt = combined.slice(0, shiftIndex)
        newFrac = combined.slice(shiftIndex)
      }
      str = sign + newInt + (newFrac ? '.' + newFrac : '')
    } else if (exp < 0) {
      const combined = intPart + fracPart
      const shift = Math.abs(exp)
      if (shift >= intPart.length) {
        const leadingZeros = '0'.repeat(shift - intPart.length)
        const newFrac = leadingZeros + combined
        str = sign + '0.' + newFrac
      } else {
        const splitPos = intPart.length - shift
        const newInt = intPart.slice(0, splitPos)
        const newFrac = intPart.slice(splitPos) + fracPart
        str = sign + newInt + (newFrac ? '.' + newFrac : '')
      }
    } else {
      str = sign + intPart + (fracPart ? '.' + fracPart : '')
    }
  }

  // Split into integer + fractional parts
  let intPart, fracPart
  if (str.includes('.')) {
    [intPart, fracPart] = str.split('.')
  } else {
    intPart = str
    fracPart = ''
  }

  // Enforce minimum decimals
  if (fracPart.length < minDecimals) {
    fracPart = fracPart.padEnd(minDecimals, '0')
  }

  // Apply grouping only if requested
  const groupedInt = grouping
    ? Number(intPart).toLocaleString(locale)
    : intPart

  // If no decimals required and none exist then return integer only
  if (minDecimals === 0 && fracPart.length === 0) {
    return groupedInt
  }

  return groupedInt + '.' + fracPart
}
