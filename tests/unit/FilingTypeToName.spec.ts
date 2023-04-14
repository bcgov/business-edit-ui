import { FilingTypeToName } from '@/utils'

describe('Enum Mixin', () => {
  it('returns correct values for Filing Type to Name helper', () => {
    expect(FilingTypeToName(null)).toBe('Unknown Type')
    expect(FilingTypeToName('alteration' as any)).toBe('Alteration')
    expect(FilingTypeToName('changeOfRegistration' as any)).toBe('Change of Registration')
    expect(FilingTypeToName('conversion' as any)).toBe('Record Conversion')
    expect(FilingTypeToName('correction' as any)).toBe('Correction')
    expect(FilingTypeToName('incorporationApplication' as any)).toBe('Incorporation Application')
    expect(FilingTypeToName('registration' as any)).toBe('Registration')
    expect(FilingTypeToName('specialResolution' as any)).toBe('Special Resolution')
    expect(FilingTypeToName('other type' as any)).toBe('Other type')
  })
})
