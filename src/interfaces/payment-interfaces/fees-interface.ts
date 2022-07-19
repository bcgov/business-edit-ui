/** Interface for Fees from Payment API. */
import { TaxesIF } from '@/interfaces/'

export interface FeesIF {
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

/** NB: use cloneDeep() to copy this as this has a nested object. */
export const EmptyFees: FeesIF = {
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
