import { shallowMount } from '@vue/test-utils'
import ShareStructure from '@/components/common/ShareStructure/ShareStructure.vue'

describe('formatParValue()', () => {
  let wrapper

  beforeAll(() => {
    wrapper = shallowMount(ShareStructure)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('formats null par value correctly', () => {
    // NB: zero par values are invalid
    expect(wrapper.vm.formatParValue({ parValue: null })).toBe('No Par Value')
  })

  it('formats par values for specific currencies correctly', () => {
    const parValues = [
      // very small number
      { currency: 'CAD', parValue: 1E-20, expected: '$0.00000000000000000001' },
      // very large number
      { currency: 'CAD', parValue: 1E38, expected: '$100,000,000,000,000,000,000,000,000,000,000,000,000.00' },
      // maximum significant digits
      { currency: 'CAD', parValue: 0.1234567890123456, expected: '$0.1234567890123456' },
      { currency: 'CAD', parValue: 1234567890123456, expected: '$1,234,567,890,123,456.00' },
      // misc numbers / different currencies
      { currency: 'USD', parValue: 0.01, expected: '$0.01' },
      { currency: 'AUD', parValue: 0.01, expected: '$0.01' },
      { currency: 'CAD', parValue: 0.01, expected: '$0.01' },
      { currency: 'CAD', parValue: 0.1, expected: '$0.10' },
      { currency: 'CAD', parValue: 1, expected: '$1.00' },
      { currency: 'CAD', parValue: 1000000, expected: '$1,000,000.00' },
      { currency: 'CAD', parValue: 1000000.1234, expected: '$1,000,000.1234' }
    ]

    parValues.forEach(({ currency, parValue, expected }) => {
      expect(wrapper.vm.formatParValue({ parValue, currency })).toBe(expected)
    })
  })

  it('formats par values for other currencies correctly', () => {
    const parValues = [
      // very small number
      { currency: '', parValue: 1E-20, expected: '0.00000000000000000001' },
      // very large number
      { currency: '', parValue: 1E38, expected: '100,000,000,000,000,000,000,000,000,000,000,000,000' },
      // maximum significant digits
      { currency: '', parValue: 0.1234567890123456, expected: '0.1234567890123456' },
      { currency: '', parValue: 1234567890123456, expected: '1,234,567,890,123,456' },
      // misc numbers
      { currency: '', parValue: 0.01, expected: '0.01' },
      { currency: '', parValue: 0.1, expected: '0.1' },
      { currency: '', parValue: 1, expected: '1' },
      { currency: '', parValue: 1000000, expected: '1,000,000' },
      { currency: '', parValue: 1000000.1234, expected: '1,000,000.1234' }
    ]

    parValues.forEach(({ currency, parValue, expected }) => {
      expect(wrapper.vm.formatParValue({ parValue, currency })).toBe(expected)
    })
  })
})
