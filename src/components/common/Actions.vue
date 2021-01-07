<template>
  <v-container id="action-buttons-container" class="list-item">
    <!-- don't show buttons until Entity Type is identified -->
    <template v-if="isEntityType">
      <div class="buttons-left">
        <!-- disable Save button for now -->
        <v-btn id="save-btn" large
          :disabled="isSaveButtonDisabled"
          :loading="isSaving"
          @click="onClickSave()"
        >
          <span>Save</span>
        </v-btn>

        <!-- disable Save and Resume Later button for now -->
        <v-btn id="save-resume-btn" large
          :disabled="isSaveResumeButtonDisabled"
          :loading="isSavingResuming"
          @click="onClickSaveResume()"
        >
          <span>Save and Resume Later</span>
        </v-btn>
      </div>

      <div class="buttons-right">
        <v-fade-transition hide-on-leave>
          <v-btn id="file-pay-btn" large color="primary"
            :disabled="isFilePayButtonDisabled"
            :loading="isFilingPaying"
            @click="onClickFilePay()"
          >
            <span>File and Pay</span>
          </v-btn>
        </v-fade-transition>

        <v-btn id="app-cancel-btn" large outlined color="primary"
          :disabled="isBusySaving"
          @click="onClickCancel()"
        >
          <span>Cancel</span>
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Emit } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

// Interfaces
import { GetterIF, ActionBindingIF } from '@/interfaces'

// Mixins
import { DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins'

@Component({})
export default class Actions extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin, NameRequestMixin) {
  // Global getters
  @Getter isEntityType!: boolean
  @Getter isBusySaving!: boolean
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter isFilingChanged!: boolean
  @Getter isFilingValid!: boolean
  @Getter hasNewNr!: boolean
  @Getter isSaving!: boolean
  @Getter isSavingResuming!: boolean
  @Getter isFilingPaying!: boolean
  @Getter isEditing!: boolean

  // Global setters
  @Action setIsSaving!: ActionBindingIF
  @Action setIsSavingResuming!: ActionBindingIF
  @Action setIsFilingPaying!: ActionBindingIF
  @Action setHaveChanges!: ActionBindingIF

  /** True if the Save button should be disabled. */
  private get isSaveButtonDisabled (): boolean {
    return (this.isBusySaving || this.isEditing)
  }

  /** True if the Save and Resume button should be disabled. */
  private get isSaveResumeButtonDisabled (): boolean {
    return (this.isBusySaving || this.isEditing)
  }

  /** True if the File and Pay button should be disabled. */
  private get isFilePayButtonDisabled (): boolean {
    return (!this.isFilingChanged || this.isBusySaving || !this.isFilingValid || this.isEditing)
  }

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
      const filing = await this.buildIaCorrectionFiling(true)
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
      const filing = await this.buildIaCorrectionFiling(true)
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

    /** If it is a named company IA, validate NR before filing submission. This method is different
     * from the processNameRequest method in App.vue. This method shows a generic message if
     * the Name Request is not valid and clicking ok in the pop up redirects to the Manage Businesses
     * dashboard */
    if (this.isNamedBusiness && this.hasNewNr) {
      try {
        await this.validateNameRequest(this.getNameRequestNumber)
      } catch (error) {
        this.setIsFilingPaying(false)
        return
      }
    }

    let filingComplete: any
    try {
      const filing = await this.buildIaCorrectionFiling(false)
      filingComplete = await this.saveFiling(filing, false)
      // reset flag
      this.setHaveChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsFilingPaying(false)
      return
    }

    const paymentToken = filingComplete?.header?.paymentToken
    if (paymentToken) {
      const isPaymentActionRequired: boolean = filingComplete.header?.isPaymentActionRequired
      const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')

      // if payment action is required, redirect to Pay URL
      if (isPaymentActionRequired) {
        const authUrl = sessionStorage.getItem('AUTH_URL')
        const returnUrl = encodeURIComponent(dashboardUrl + this.getBusinessId)
        const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + returnUrl
        // assume Pay URL is always reachable
        // otherwise user will have to retry payment later
        window.location.assign(payUrl)
      } else {
        // redirect to Dashboard URL
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
