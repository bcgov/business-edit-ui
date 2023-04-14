import { ToDisplayPhone } from '@/utils'

describe('ToDisplayPhone util', () => {
  it('correctly formats a phone number for display', () => {
    expect(ToDisplayPhone('123 456 7890')).toBe('(123) 456-7890')
    expect(ToDisplayPhone('0987654321')).toBe('(098) 765-4321')
    expect(ToDisplayPhone('123-456-7890')).toBe('(123) 456-7890')
    expect(ToDisplayPhone('123 4567')).toBe('123 4567')
    expect(ToDisplayPhone(null)).toBeNull()
  })
})
