import { AxiosInstance as axios } from '@/utils/'
import { CorpTypeCd, FilingCodes } from '@/bcrs-shared-components/enums'
import { FeesIF } from '@/interfaces'

/**
 * Class that provides integration with the Pay API.
 */
export default class PayServices {
  /**
   * Fetches filing fees.
   * @param filingCode the filing code (eg, OTADD)
   * @param entityType the entity type (eg, BC)
   * @param isFutureEffective whether this is a future effective filing
   * @returns a promise to return the fees for a filing
   */
  static async fetchFilingFees (filingCode: FilingCodes, entityType: CorpTypeCd, isFutureEffective = false)
  : Promise<FeesIF> {
    let url = sessionStorage.getItem('PAY_API_URL') + 'fees/' + entityType + '/' + filingCode
    if (isFutureEffective) {
      url += '?futureEffective=true'
    }
    return axios.get(url)
      .then(response => {
        const fees = response?.data
        if (fees.filingFees == null) {
          throw new Error('Invalid API response')
        }
        return fees
      })
  }
}
