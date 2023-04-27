/* response from Pay API "fees" endpoint */
export interface PayData {
  filingFees: number
  filingType: string
  filingTypeCode: string
  futureEffectiveFees: number
  priorityFees: number
  processingFees: number
  serviceFees: number
  tax: {
    gst: number
    pst: number
  }
  total: number
}
