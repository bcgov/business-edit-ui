import { Component, Vue } from 'vue-property-decorator'
import { axios } from '@/utils/'
import { FilingCodes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { FeesIF } from '@/interfaces/'

/**
 * Mixin that provides integration with the Auth API.
 */
@Component({})
export default class PayApiMixin extends Vue {
  /**
   * Fetches filing fees.
   * @returns a promise to return the fees for a filing
   */
  async fetchFilingFees (filingCode: FilingCodes, entityType: CorpTypeCd, isFutureEffective: boolean = false):
    Promise<FeesIF> {
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
