/** Interface for Fees from Payment API. */
import { TaxesIF } from '@/interfaces'

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
