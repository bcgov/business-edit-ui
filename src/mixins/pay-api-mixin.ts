// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { axios } from '@/utils'

// Shared Interfaces
import { AlterationFilingIF, EffectiveDateTimeIF } from '@/interfaces'

import { FilingCodes } from '@/enums/filingCodes'
import { CorpTypeCd } from '@/enums'
/**
 * Mixin that provides integration with the Auth API.
 */
@Component({})
export default class PayApiMixin extends Vue {
  /**
   * Fetches filing fees.
   * @returns a promise to return the fees for a filing
   */
  async fetchFilingFees (filingCode: FilingCodes, entityType: CorpTypeCd, isFutureEffective: boolean): Promise<any> {
    let url = sessionStorage.getItem('PAY_API_URL') + 'fees/' + entityType + '/' + filingCode
    if (isFutureEffective) {
      url += '?futureEffective=true'
    }
    return axios.get(url)
      .then(response => {
        const fees = response?.data
        if (!fees.filingFees) {
          throw new Error('Invalid API response')
        }
        return fees
      })
      .catch((error) => {
        throw error
      })
  }
}
