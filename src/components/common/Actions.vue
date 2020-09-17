<template>
  <v-container id="action-buttons-container" class="list-item">

    <div class="buttons-left">
      <!-- disable Save button for now -->
      <v-btn id="save-btn" large
        :disabled="!isEntityType || isBusySaving"
        :loading="stateModel.tombstone.isSaving"
        @click="onClickSave()"
      >
        <span>Save</span>
      </v-btn>

      <!-- disable Save and Resume Later button for now -->
      <v-btn id="save-resume-btn" large
        :disabled="!isEntityType || isBusySaving"
        :loading="stateModel.tombstone.isSavingResuming"
        @click="onClickSaveResume()"
      >
        <span>Save and Resume Later</span>
      </v-btn>
    </div>

    <div class="buttons-right">
      <v-fade-transition hide-on-leave>
        <v-btn id="file-pay-btn" large color="primary"
          :disabled="!getHaveCorrection || isBusySaving"
          :loading="stateModel.tombstone.isFilingPaying"
          @click="onClickFilePay()"
        >
          <span>File and Pay</span>
        </v-btn>
      </v-fade-transition>

      <v-btn id="app-cancel-btn" large
        :disabled="isBusySaving"
        @click="onClickCancel()"
      >
        <span>Cancel</span>
      </v-btn>
    </div>

  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Emit } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { StateModelIF, GetterIF, ActionBindingIF } from '@/interfaces'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'

@Component({})
export default class Actions extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin) {
  // Global state
  @State stateModel!: StateModelIF

  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter isEnableFilePayBtn!: GetterIF
  @Getter isBusySaving!: GetterIF
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter getEffectiveDate!: Date
  @Getter getHaveCorrection!: boolean

  // Global setters
  @Action setIsSaving!: ActionBindingIF
  @Action setIsSavingResuming!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF
  @Action setIsIncorporationDateTimeValid!: ActionBindingIF

  /** Called when Cancel button is clicked. */
  private onClickCancel (): void {
    this.emitGoToDashboard()
  }

  /**
   * Called when Save button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  private async onClickSave (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return

    this.setIsSaving(true)
    let filingComplete

    try {
      const filing = await this.buildIaCorrectionFiling()
      console.log(filing)
      filingComplete = await this.saveFiling(filing, true)
      // reset flag
      this.setHaveChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
    }

    this.setIsSaving(false)
  }

  /**
   * Called when Save and Resume Later button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  private async onClickSaveResume (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return

    this.setIsSavingResuming(true)
    let filingComplete

    try {
      const filing = await this.buildIaCorrectionFiling()
      filingComplete = await this.saveFiling(filing, true)
      // reset flag
      this.setHaveChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsSavingResuming(false)
      return
    }

    this.setIsSavingResuming(false)
    this.emitGoToDashboard()
  }

  /**
  * Called when File and Pay button is clicked.
  * @returns a promise (ie, this is an async method)
  */
  private async onClickFilePay (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return

    this.setIsFilingPaying(true)
    let filingComplete

    if (this.getEffectiveDate && !this.isValidDateTime(this.getEffectiveDate)) {
      this.setIsIncorporationDateTimeValid(false)
      this.setIsFilingPaying(false)
      window.scrollTo({ top: 1250, behavior: 'smooth' })
      return
    }

    /** If it is a named company IA, validate NR before filing submission. This method is different
     * from the processNameRequest method in App.vue. This method shows a generic message if
     * the Name Request is not valid and clicking ok in the pop up redirects to the Manage Businesses
     * dashboard */
    if (this.isNamedBusiness) {
      try {
        await this.validateNameRequest(this.getNameRequestNumber)
      } catch (error) {
        this.setIsFilingPaying(false)
        return
      }
    }

    try {
      const filing = await this.buildIaCorrectionFiling()
      filingComplete = await this.saveFiling(filing, false)
      // reset flag
      this.setHaveChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsFilingPaying(false)
      return
    }

    const paymentToken = filingComplete?.header?.paymentToken
    const paymentCompleted = filingComplete.header?.paymentStatusCode === 'COMPLETED'
    if (paymentToken) {
      // redirect to pay and return to the dashboard
      const authUrl = sessionStorage.getItem('AUTH_URL')
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')

      // assume Pay URL is always reachable
      // otherwise user will have to retry payment later
      if (!paymentCompleted) {
        const returnUrl = encodeURIComponent(dashboardUrl + this.getBusinessId)
        const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + returnUrl
        window.location.assign(payUrl)
      } else {
        // Payment has been completed, redirect to dashboard without going through pay
        window.location.assign(dashboardUrl + this.getBusinessId)
      }
    } else {
      const error = new Error('Missing Payment Token')
      this.$root.$emit('save-error-event', error)
      this.setIsFilingPaying(false)
    }
  }

  /** Emits Go To Dashboard event. */
  @Emit('goToDashboard')
  private emitGoToDashboard (): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#action-buttons-container {
  background-color: $gray1;
  margin-top: 2rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid $gray5;

  .buttons-left {
    width: 50%;
  }

  .buttons-right {
    margin-left: auto;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}
</style>
