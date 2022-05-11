import { FilingBusinessIF, FilingHeaderIF } from '@/interfaces/'
import { ConversionIF } from './conversion-interface'

/** Interface for data object UI sends to API. */
export interface FirmConversionIF {
  header: FilingHeaderIF
  business: FilingBusinessIF
  conversion: ConversionIF
}
