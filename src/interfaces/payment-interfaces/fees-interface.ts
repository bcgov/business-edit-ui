/** Interface for Fees from Payment API. */
import { TaxesIF } from '@/interfaces'

interface FeesIF {
    filingFees: number
    filingType: string
    filingTypeCode: string
    futureEffectiveFees?: number
    priorityFees?: number
    processingFees?: number
    serviceFees?: number
    tax?: TaxesIF
    total?: number
}

const emptyFees = {
  filingFees: null,
  filingType: null,
  filingTypeCode: null,
  futureEffectiveFees: null,
  priorityFees: null,
  processingFees: null,
  serviceFees: null,
  tax: {
    pst: null,
    gst: null
  },
  total: null
}

export { FeesIF, emptyFees }
