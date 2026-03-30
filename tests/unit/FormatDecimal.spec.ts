import { FormatDecimal } from '@/utils/FormatDecimal'

describe('FormatDecimal', () => {
  it('has default options', () => {
    // minDecimals = 0
    // grouping = false
    // locale = 'en-US'
    expect(FormatDecimal(1000000, {})).toBe('1000000')
    expect(FormatDecimal(1000000, { minDecimals: 2 })).toBe('1000000.00')
    expect(FormatDecimal(1000000, { grouping: true })).toBe('1,000,000')
    expect(FormatDecimal(1000000, { grouping: true, locale: 'en-IN' })).toBe('10,00,000')
  })

  it('displays very small numbers properly', () => {
    // max 38 characters input
    expect(FormatDecimal(1E-36, { minDecimals: 0, grouping: true })).toBe('0.000000000000000000000000000000000001')
  })

  it('formats numbers with at least 2 decimal places', () => {
    expect(FormatDecimal(0.292397, { minDecimals: 2, grouping: true })).toBe('0.292397')
    expect(FormatDecimal(0.5, { minDecimals: 2, grouping: true })).toBe('0.50')
    expect(FormatDecimal(1.2345, { minDecimals: 2, grouping: true })).toBe('1.2345')
    expect(FormatDecimal(100, { minDecimals: 2, grouping: true })).toBe('100.00')
    expect(FormatDecimal(9999999.99, { minDecimals: 2, grouping: true })).toBe('9,999,999.99')
  })

  it('formats numbers with no decimal places (unless needed)', () => {
    expect(FormatDecimal(0.292397, { minDecimals: 0, grouping: true })).toBe('0.292397')
    expect(FormatDecimal(0.5, { minDecimals: 0, grouping: true })).toBe('0.5')
    expect(FormatDecimal(1.2345, { minDecimals: 0, grouping: true })).toBe('1.2345')
    expect(FormatDecimal(100, { minDecimals: 0, grouping: true })).toBe('100')
    expect(FormatDecimal(9999999.99, { minDecimals: 0, grouping: true })).toBe('9,999,999.99')
  })

  it('formats very large numbers properly with grouping', () => {
    // max 38 characters input
    expect(FormatDecimal(1E37, { minDecimals: 0, grouping: true }))
      .toBe('10,000,000,000,000,000,000,000,000,000,000,000,000')
  })

  it('formats very large numbers properly without grouping', () => {
    // max 38 characters input
    expect(FormatDecimal(1E37, { minDecimals: 0, grouping: false })).toBe('10000000000000000000000000000000000000')
  })

  it('expands unusual scientific notation correctly', () => {
    // exponent smaller than fractional length
    // string instead of number input
    // etc
    expect(FormatDecimal(1.234E-2, { minDecimals: 0, grouping: false })).toBe('0.01234')
    expect(FormatDecimal('1.234E-2', { minDecimals: 0, grouping: false })).toBe('0.01234')
    expect(FormatDecimal(1.234E2, { minDecimals: 0, grouping: false })).toBe('123.4')
    expect(FormatDecimal('1.234E2', { minDecimals: 0, grouping: false })).toBe('123.4')
    expect(FormatDecimal(12E-1, { minDecimals: 0, grouping: false })).toBe('1.2')
    expect(FormatDecimal('12E-1', { minDecimals: 0, grouping: false })).toBe('1.2')
    expect(FormatDecimal(100E3, { minDecimals: 0, grouping: false })).toBe('100000')
    expect(FormatDecimal('100E3', { minDecimals: 0, grouping: false })).toBe('100000')
  })

  it('handles max-significant-digits numbers', () => {
    // max 38 characters input
    expect(FormatDecimal(1234567890123456, { minDecimals: 0, grouping: false })).toBe('1234567890123456')
    expect(FormatDecimal(1.234567890123456E15, { minDecimals: 0, grouping: false })).toBe('1234567890123456')
    expect(FormatDecimal(1.234567890123456E-1, { minDecimals: 0, grouping: false })).toBe('0.1234567890123456')
  })
})
