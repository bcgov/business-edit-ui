import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, EmptyFees, FeesIF } from '@/interfaces'
import { PayServices } from '@/services/'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'
import { FilingDataIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { cloneDeep } from 'lodash'

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
    /** Calculate the sum of filing fees. */
    const filingFeesSum = validFilingFeesPrices.map(f => f.filingFees).reduce((a, b) => a + b, 0)
    return `$${filingFeesSum.toFixed(2)}`
  }

  /** Provides the future effective fees price. */
  get futureEffectiveFeesPrice (): string {
    const validFutureFeePrices = this.getFeePrices.filter(f => f.futureEffectiveFees !== null)
    if (validFutureFeePrices.length === 0) {
      return ''
    }
    /** Calculates the sum of future effective fees. */
    const futureEffectiveFeesSum = validFutureFeePrices.map(f => f.futureEffectiveFees).reduce((a, b) => a + b, 0)
    return `$${futureEffectiveFeesSum.toFixed(2)}`
  }

  /** Called when staff payment data has changed. */
  protected onStaffPaymentChanges (): void {
    // update filing data with staff payment fields
    const filingData = [...this.getFilingData]
    filingData.forEach(fd => {
      fd.priority = this.getStaffPayment.isPriority
      fd.waiveFees = (this.getStaffPayment.option === StaffPaymentOptions.NO_FEE)
    })
    this.setFilingData(filingData)
  }

  /** Sets the current fees by fetching fee using filing data. */
  protected async setCurrentFeesFromFilingData (isFutureEffective = false): Promise<void> {
    this.setCurrentFees(await this.getFilingFeesFromFilingData(isFutureEffective))
  }

  /** Sets the fee prices by fetching fee using filing data. */
  protected async setFeePricesFromFilingData (isFutureEffective = false): Promise<void> {
    this.setFeePrices(await this.getFilingFeesFromFilingData(isFutureEffective))
  }

  /** Lines up promises to fetch for filing fees, falls back to empty fees.  */
  private async getFilingFeesFromFilingData (isFutureEffective = false): Promise<FeesIF[]> {
    try {
      const feePromises = this.getFilingData
        .map(fd => PayServices.fetchFilingFees(fd.filingTypeCode, fd.entityType, isFutureEffective))
      return await Promise.all(feePromises)
    } catch (error) {
      console.log(error)
      return this.getFilingData.map(() => cloneDeep(EmptyFees))
    }
  }
}
