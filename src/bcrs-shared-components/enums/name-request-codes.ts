//
// Various codes found in NR objects.
// (may be sorted by code)
//

// ref: https://github.com/bcgov/namex/blob/main/api/namex/constants/__init__.py
export enum NrRequestTypeCodes {
  // DEPRECATION WARNING - these will be removed!
  BC_COMPANY = 'BC', // use NEW_BC instead
  BC_CORPORATION = 'CR', // use NEW_CORP instead
  BC_UNLIMITED = 'UL', // use NEW_ULC instead
  COOP = 'CP', // use NEW_COOP instead
  NR_SOLE_PROP = 'FR', // use NEW_FIRM instead
  XPRO_CORPORATION = 'XCR', // use NEW_XPRO_CORP instead

  // change name (or resubmit)
  CHANGE_BEN = 'BEC',
  CHANGE_CCC = 'CCC',
  CHANGE_COOP = 'CCP',
  CHANGE_CORP = 'CCR', // BC Limited
  CHANGE_FIRM = 'CFR', // SP, DBA or GP
  CHANGE_ULC = 'CUL',

  // continuation in (move or resubmit)
  CONTINUATION_IN_BEN = 'BECT',
  CONTINUATION_IN_CCC = 'CCCT',
  CONTINUATION_IN_COOP = 'CTC',
  CONTINUATION_IN_CORP = 'CT',
  CONTINUATION_IN_ULC = 'ULCT',

  // convert (or resubmit)
  CONVERT_BEN = 'BECV',
  CONVERT_CCC = 'CCV',
  CONVERT_CORP = 'BECR',
  CONVERT_ULC = 'UC',

  // new (or resubmit)
  NEW_BC = 'BC',
  NEW_CCC = 'CC',
  NEW_COOP = 'CP',
  NEW_CORP = 'CR', // BC Limited
  NEW_FIRM = 'FR', // SP, DBA or GP
  NEW_ULC = 'UL',
  NEW_XPRO_CORP = 'XCR',

  // restoration
  RESTORATION_CCC = 'RCC',
  RESTORATION_COOP = 'RCP',
  RESTORATION_CORP = 'RCR', // BC Limited
  RESTORATION_SOC = 'RSO',
  RESTORATION_BEN = 'BERE',
  RESTORATION_ULC = 'RUL',
}

export enum NrRequestActionCodes {
  AMALGAMATE = 'AML',
  ASSUMED = 'ASSUMED', // FUTURE: should be AS?
  CHANGE_NAME = 'CHG',
  CONVERSION = 'CNV',
  DBA = 'DBA',
  MOVE = 'MVE',
  NEW_BUSINESS = 'NEW', // incorporate or register
  RESTORE = 'REH', // restore or reinstate
  RENEW = 'REN',
  RESTORATION = 'REST', // FUTURE: is this used?
  RESUBMIT = 'RESUBMIT', // FUTURE: is this used?
}
