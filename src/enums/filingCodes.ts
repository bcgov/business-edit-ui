// *** TODO: combine this with shared version
export enum FilingCodes {
  ALTERATION = 'ALTER',
  CORRECTION = 'CRCTN',
  FM_CHANGE = 'FMCHANGE',
  FM_CONVERSION = 'FMCONV',
  FM_CORRECTION = 'FMCORR',
  INCORPORATION_BC = 'BCINC',
  INCORPORATION_CP = 'OTINC',
  RESTORATION_FULL = 'RESTF', // for BC/BEN/CC/ULC
  RESTORATION_LIMITED = 'RESTL', // for BC/BEN/CC/ULC
  RESTORATION_LTD_TO_FULL = 'RESXF', // for BC/BEN/CC/ULC
  RESTORATION_LTD_EXTEND = 'RESXL', // for BC/BEN/CC/ULC
  SPECIAL_RESOLUTION = 'SPRLN',
  SPECIAL_RESOLUTION_NAME_CHANGE = 'OTCON'
}
