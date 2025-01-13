<template>
  <v-container
    id="action-buttons-container"
    class="list-item"
  >
    <!-- don't show buttons until Entity Type is identified -->
    <template v-if="!!getEntityType">
      <div class="buttons-left">
        <!-- disable Save button for now -->
        <v-btn
          id="save-btn"
          large
          outlined
          color="primary"
          :disabled="isSaveButtonDisabled"
          :loading="isSaving"
          @click="onClickSave()"
        >
          <span>Save</span>
        </v-btn>

        <v-btn
          id="save-resume-btn"
          large
          outlined
          color="primary"
          :disabled="isSaveResumeButtonDisabled"
          :loading="isSavingResuming"
          @click="onClickSaveResume()"
        >
          <span>Save and Resume Later</span>
        </v-btn>
      </div>

      <div class="buttons-right">
        <v-fade-transition hide-on-leave>
          <v-btn
            id="file-pay-btn"
            large
            color="primary"
            :disabled="isFilePayButtonDisabled"
            :loading="isFilingPaying"
            @click="onClickFilePay()"
          >
            <span>File and Pay</span>
          </v-btn>
        </v-fade-transition>

        <v-btn
          id="app-cancel-btn"
          large
          outlined
          color="primary"
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
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { DateMixin, FilingTemplateMixin, NameRequestMixin } from '@/mixins/'
import { LegalServices } from '@/services/'
import { Navigate, GetFeatureFlag } from '@/utils/'
import { useStore } from '@/store/store'

/** This component is only implemented for Correction filings atm. */
@Component({})
export default class Actions extends Mixins(DateMixin, FilingTemplateMixin, NameRequestMixin) {
  // Store getters
  @Getter(useStore) getFilingId!: number
  // @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) hasAlterationDataChanged!: boolean // for testing state-getters
  @Getter(useStore) havePeopleAndRolesChanged!: boolean // for testing state-getters
  @Getter(useStore) isBusySaving!: boolean
  @Getter(useStore) isCorrectionEditing!: boolean
  @Getter(useStore) isCorrectionValid!: boolean
  @Getter(useStore) isFilingPaying!: boolean
  @Getter(useStore) isSaving!: boolean
  @Getter(useStore) isSavingResuming!: boolean
  @Getter(useStore) hasCorrectionDataChanged!: boolean

  // Store actions
  @Action(useStore) setIsSaving!: (x: boolean) => void
  @Action(useStore) setIsSavingResuming!: (x: boolean) => void
  @Action(useStore) setIsFilingPaying!: (x: boolean) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void

  /** True if the Save button should be disabled. */
  get isSaveButtonDisabled (): boolean {
    return (this.isBusySaving || this.isCorrectionEditing)
  }

  /** True if the Save and Resume button should be disabled. */
  get isSaveResumeButtonDisabled (): boolean {
    return (this.isBusySaving || this.isCorrectionEditing)
  }

  /** True if the Empty Corrections filed and LD flag is True */
  get isAllowEmptyCorrections (): boolean {
    const isAllowEmptyCorrectionsLd = GetFeatureFlag('allow-empty-corrections')
    if (!this.hasCorrectionDataChanged && !isAllowEmptyCorrectionsLd) {
      return false
    }
    return true
  }

  /** True if the File and Pay button should be disabled. */
  get isFilePayButtonDisabled (): boolean {
    return (this.isBusySaving || !this.isCorrectionValid || this.isCorrectionEditing || !this.isAllowEmptyCorrections)
  }

  /**
   * Called when Save button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  async onClickSave (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsSaving(true)

    try {
      const filing = this.buildCorrectionFiling(true)
      await LegalServices.updateFiling(this.getBusinessId, this.getFilingId, filing, true)
      // clear flag
      this.setHaveUnsavedChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsSaving(false)
      return
    }

    this.setIsSaving(false)
  }

  /**
   * Called when Save and Resume Later button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  async onClickSaveResume (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    // If Save and Resume is successful setIsSavingResuming should't be reset to false,
    // this prevent buttons from being re-enabled if the page is slow to redirect.
    this.setIsSavingResuming(true)

    try {
      const filing = this.buildCorrectionFiling(true)
      await LegalServices.updateFiling(this.getBusinessId, this.getFilingId, filing, true)
      // clear flag
      this.setHaveUnsavedChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsSavingResuming(false)
      return
    }

    this.$root.$emit('go-to-dashboard')
  }

  /**
   * Called when File and Pay button is clicked.
   * @returns a promise (ie, this is an async method)
   */
  async onClickFilePay (): Promise<void> {
    // prevent double saving
    if (this.isBusySaving) return
    this.setIsFilingPaying(true)

    // If we have a (new) NR, validate it before filing submission. This method is different
    // from processNameRequest() in App.vue. This method shows a generic message if the Name
    // Request is invalid, and clicking OK in the pop up redirects to My Business Registry.
    if (this.getNameRequestNumber) {
      try {
        if (this.getNameRequest.applicants) {
          await this.fetchValidateNameRequest(
            this.getNameRequestNumber,
            this.getNameRequest.applicants.phoneNumber,
            this.getNameRequest.applicants.emailAddress)
        } else {
          await this.fetchValidateNameRequest(this.getNameRequestNumber)
        }
      } catch (error) {
        // "fetchValidateNameRequest" handles its own errors
        this.setIsFilingPaying(false)
        return
      }
    }

    let filingComplete: any
    try {
      const filing = this.buildCorrectionFiling(false)
      filingComplete = await LegalServices.updateFiling(this.getBusinessId, this.getFilingId, filing, false)
      // clear flag
      this.setHaveUnsavedChanges(false)
    } catch (error) {
      this.$root.$emit('save-error-event', error)
      this.setIsFilingPaying(false)
      return
    }

    const paymentToken = filingComplete?.header?.paymentToken
    if (paymentToken) {
      const isPaymentActionRequired: boolean = filingComplete.header?.isPaymentActionRequired
      const returnUrl = sessionStorage.getItem('DASHBOARD_URL') + this.getBusinessId +
        `?filing_id=${this.getFilingId}`

      // if payment action is required, navigate to Pay URL
      if (isPaymentActionRequired) {
        const authUrl = sessionStorage.getItem('AUTH_WEB_URL')
        const payUrl = authUrl + 'makepayment/' + paymentToken + '/' + encodeURIComponent(returnUrl)
        // assume Pay URL is always reachable
        // otherwise user will have to retry payment later
        Navigate(payUrl)
      } else {
        // otherwise go straight to dashboard
        Navigate(returnUrl)
      }
    } else {
      const error = new Error('Missing Payment Token')
      this.$root.$emit('save-error-event', error)
      this.setIsFilingPaying(false)
    }
  }

  /** Called when Cancel button is clicked. */
  onClickCancel (): void {
    this.$root.$emit('go-to-dashboard')
  }
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
