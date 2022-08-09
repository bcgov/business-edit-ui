import { ActionBindingIF, EmptyFees, FeesIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, StaffPaymentOptions } from '@bcrs-shared-components/enums'
import { FilingDataIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { axios } from '@/utils/'
import { cloneDeep } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

/**
 * Mixin that provides common functions also provides integration with PAY API.
 */
@Component({})
export default class FeeMixin extends Vue {
  // Global getters
  @Getter getFeePrices!: FeesIF[]
  @Getter getFilingData!: FilingDataIF[]
  @Getter getStaffPayment!: StaffPaymentIF

  // Global actions
  @Action setCurrentFees!: ActionBindingIF
  @Action setFeePrices!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF

  /** Provides the filing fees price. */
  get filingFeesPrice (): string {
    const validFilingFeesPrices = this.getFeePrices.filter(f => f.filingFees !== null)
    if (validFilingFeesPrices.length === 0) {
      return ''
    }
    const filingFeesSum = validFilingFeesPrices.map(f => f.filingFees).reduce((a, b) => a + b, 0)
    return `$${filingFeesSum.toFixed(2)}`
  }

  /** Provides the future effective fees price. */
  get futureEffectiveFeesPrice (): string {
    const validFutureFeePrices = this.getFeePrices.filter(f => f.futureEffectiveFees !== null)
    if (validFutureFeePrices.length === 0) {
      return ''
    }
    const futureEffectiveFeesSum = validFutureFeePrices.map(f => f.futureEffectiveFees).reduce((a, b) => a + b, 0)
    return `$${futureEffectiveFeesSum.toFixed(2)}`
  }

  /** Called when staff payment data has changed. */
  protected onStaffPaymentChanges (): void {
    // update filing data with staff payment fields
    const filingData = this.getFilingData
    filingData.forEach(fd => {
      fd.priority = this.getStaffPayment.isPriority
      fd.waiveFees = (this.getStaffPayment.option === StaffPaymentOptions.NO_FEE)
    })
    this.setFilingData(filingData)
  }

  /** Sets the current fees by fetching fee using filing data. */
  protected async setCurrentFeesFromFilingData (isFutureEffective: boolean = false): Promise<void> {
    this.setCurrentFees(await this.getFilingFeesFromFilingData(isFutureEffective))
  }

  /** Sets the fee prices by fetching fee using filing data. */
  protected async setFeePricesFromFilingData (isFutureEffective: boolean = false): Promise<void> {
    this.setFeePrices(await this.getFilingFeesFromFilingData(isFutureEffective))
  }

  /** Lines up promises to fetch for filing fees, falls back to empty fees.  */
  protected async getFilingFeesFromFilingData (isFutureEffective: boolean = false): Promise<FeesIF[]> {
    try {
      const feePromises = this.getFilingData
        .map(fd => this.fetchFilingFees(fd.filingTypeCode, fd.entityType, isFutureEffective))
      return await Promise.all(feePromises)
    } catch (error) {
      console.log(error)
      return this.getFilingData.map(fd => cloneDeep(EmptyFees))
    }
  }

  /**
   * Fetches filing fees.
   * @returns a promise to return the fees for a filing
   */
  protected async fetchFilingFees (filingCode: FilingCodes, entityType: CorpTypeCd, isFutureEffective: boolean = false):
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
