export interface FilingData {
  // The filing description to display. If undefined, whatever comes from service call will be shown.
  filingDescription?: string

  // The filing type code, eg, OTADD, OTANN, etc
  filingTypeCode: string

  // The entity type, eg, BC, CP.
  entityType: string

  // A flag to specify whether to waive the fees.
  waiveFees: boolean

  // A flag to specify whether to get priority fee.
  priority: boolean

  // A flag to specify whether to get future effective fee.
  futureEffective: boolean
}
