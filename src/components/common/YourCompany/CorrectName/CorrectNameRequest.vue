<template>
  <v-form
    id="correct-nr-form"
    ref="correctNrForm"
    v-model="formValid"
    lazy-validation
  >
    <!-- Dialogs -->
    <ConfirmDialogShared
      ref="confirm"
      attach="#app"
    />

    <v-row no-gutters>
      <v-col
        cols="1"
        class="mt-1"
      >
        <v-btn
          x-small
          fab
          outlined
          :ripple="false"
          color="gray7"
          class="step-icon"
          tabindex="-1"
        >
          1
        </v-btn>
      </v-col>
      <v-col>
        <v-text-field
          id="nr-number"
          v-model="nameRequestNumber"
          class="text-input-field"
          filled
          label="Enter the NR Number"
          hint="Example: NR 1234567"
          persistent-hint
          :rules="done ? nrNumRules : []"
          @keyup="uppercase('nameRequestNumber')"
        />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="mt-4 mb-n1"
    >
      <v-col
        cols="1"
        class="mt-1"
      >
        <v-btn
          x-small
          fab
          outlined
          :ripple="false"
          color="gray7"
          class="step-icon"
          tabindex="-1"
        >
          2
        </v-btn>
      </v-col>
      <v-col cols="5">
        <v-text-field
          id="applicant-phone"
          v-model="applicantPhone"
          class="text-input-field"
          filled
          label="Applicant's Phone Number"
          hint="Example: 555-555-5555"
          persistent-hint
          type="tel"
          :rules="(!applicantEmail && done) ? phoneRules: []"
        />
      </v-col>
      <div class="ma-5">
        or
      </div>
      <v-col>
        <v-text-field
          id="applicant-email"
          v-model="applicantEmail"
          class="text-input-field"
          filled
          label="Applicant's Notification Email"
          hint="Example: name@email.com"
          persistent-hint
          type="email"
          :rules="(!applicantPhone && done) ? emailRules : []"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { CommonMixin, NameRequestMixin } from '@/mixins/'
import { ConfirmDialogType } from '@/interfaces/'
import { CorrectNameOptions } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { NameRequestIF } from '@bcrs-shared-components/interfaces'
import { useStore } from '@/store/store'

@Component({
  components: {
    ConfirmDialogShared
  }
})
export default class CorrectNameRequest extends Mixins(CommonMixin, NameRequestMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
    correctNrForm: HTMLFormElement
  }

  /** The form type. */
  @Prop({ default: null }) readonly formType!: CorrectNameOptions

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  @Getter(useStore) getNameRequest!: NameRequestIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFilingName!: string

  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void
  @Action(useStore) setEntityTypeChangedByName!: (x: boolean) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestLegalName!: (x: string) => void

  // Local properties
  formValid = false
  nameRequestNumber = ''
  applicantPhone = ''
  applicantEmail = ''
  done = true // used to turn on/off validations

  // Rules
  readonly nrNumRules = [
    (v: string) => !!v || 'Name Request Number is required',
    (v: string) => this.isValidNrNumber(v) || 'Name Request Number is invalid'
  ]
  readonly phoneRules = [
    (v: string) => !!v || 'Phone Number or Email is required',
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => !(v?.length > 12) || 'Phone number is invalid'
  ]
  readonly emailRules = [
    (v: string) => !!v || 'Phone Number or Email is required',
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.isValidEmail(v) || 'Email is invalid'
  ]

  // Validations
  get isFormValid (): boolean {
    return this.formValid && !!this.nameRequestNumber &&
      (!!this.applicantPhone || !!this.applicantEmail)
  }

  isValidEmail (value: string): boolean {
    if (value?.length < 1) return true
    return ((!!this.applicantPhone && !!value) || !!this.validateEmailFormat(value))
  }

  isValidNrNumber (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(NR)?\s*(\d{7})$/)
    if (VALID_FORMAT.test(value)) {
      this.nameRequestNumber = 'NR ' + value.match(VALID_FORMAT)[2]
      return true
    }
    return false
  }

  validateEmailFormat (value: string): boolean {
    // eslint-disable-next-line max-len
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  @Watch('validate')
  onValidate (): void {
    this.$refs.correctNrForm.validate()
  }

  /** Watches for form submission and emits results. */
  @Watch('formType')
  async onSubmit (): Promise<any> {
    // this component should only see correct-new-nr form type
    if (this.formType === CorrectNameOptions.CORRECT_NEW_NR) {
      try {
        // Fetch and validate the name request
        const nr = await this.fetchValidateNameRequest(
          this.nameRequestNumber,
          this.applicantPhone,
          this.applicantEmail
        )

        const nameRequestErrorText = this.nameRequestErrorText(nr)
        if (nameRequestErrorText) {
          // Invalid NR type - inform parent the process is done and prompt confirm dialog
          this.emitSaved()

          await this.showConfirmDialog(
            this.$refs.confirm,
            'Name Request Type Must Match',
            nameRequestErrorText,
            'OK'
          )
        } else {
          this.storeNameRequest(nr)
          // Set our entity type, if it's a conversion request
          if (nr.request_action_cd === NrRequestActionCodes.CONVERSION) {
            this.setEntityType(nr.legalType as any)
            this.setEntityTypeChangedByName(true)
          }
          this.emitSaved(true)
        }
      } catch {
        // "fetchValidateNameRequest" handles its own errors
        // Inform parent process is complete
        this.emitSaved()
      }
    }
  }

  /**
   * Returns error text depending on what is invalid, or null if there is no error.
   * @param nr the name request object
   */
  nameRequestErrorText (nr: NameRequestIF): string {
    const nameRequestTypes = this.getResource?.changeData?.nameRequestTypes
    // See also name-request-mixin.ts::isNrInvalid()
    const nameRequestTypeStrings = {
      [NrRequestActionCodes.CHANGE_NAME]: 'Change of Name',
      [NrRequestActionCodes.CONVERSION]: 'Alteration',
      [NrRequestActionCodes.RESTORE]: 'Restoration'
    }

    let validTypesString = ''
    for (const type of nameRequestTypes) {
      validTypesString += `<br>&bull; ${nameRequestTypeStrings[type]}`
    }

    // check for invalid name change NR
    if (nr.request_action_cd === NrRequestActionCodes.CHANGE_NAME) {
      if (!nameRequestTypes?.includes(NrRequestActionCodes.CHANGE_NAME)) {
        return `<p class="info-text whitespace-normal mb-0">
          This Name Request is for a Change of Name.<br><br>
          For this ${this.getFilingName}, you can only use the following Name Request types:
          ${validTypesString}</p>`
      }
      if (this.getEntityType !== nr.legalType) {
        return `<p class="info-text whitespace-normal mb-0">
          This Name Request is for a ${GetCorpFullDescription(nr.legalType as any)}.<br><br>
          You need to use a name request for a <b>${GetCorpFullDescription(this.getEntityType)}</b>.</p>`
      }
    }

    // check for invalid alteration NR
    if (nr.request_action_cd === NrRequestActionCodes.CONVERSION) {
      if (!nameRequestTypes?.includes(NrRequestActionCodes.CONVERSION)) {
        return `<p class="info-text whitespace-normal mb-0">
          This Name Request is for an Alteration.<br><br>
          For this ${this.getFilingName}, you can only use the following Name Request types:
          ${validTypesString}</p>`
      }
      const entityTypeOptions = this.getResource?.changeData?.entityTypeOptions
      if (!entityTypeOptions?.some(options => options.value === nr.legalType)) {
        return `<p class="info-text whitespace-normal mb-0">
          You cannot change a ${GetCorpFullDescription(this.getEntityType)} to a
          ${GetCorpFullDescription(nr.legalType as any)}</b>.<br><br>
          If you need assistance, contact BC Registry staff.</p>`
      }
    }

    // check for invalid restoration NR
    if (nr.request_action_cd === NrRequestActionCodes.RESTORE) {
      if (!nameRequestTypes?.includes(NrRequestActionCodes.RESTORE)) {
        return `<p class="info-text whitespace-normal mb-0">
          This Name Request is for a Restoration.<br><br>
          For this ${this.getFilingName}, you can only use the following Name Request types:
          ${validTypesString}</p>`
      }
      if (this.getEntityType !== nr.legalType) {
        return `<p class="info-text whitespace-normal mb-0">
          This Name Request is for a ${GetCorpFullDescription(nr.legalType as any)}.<br><br>
          You need to use a name request for a <b>${GetCorpFullDescription(this.getEntityType)}</b>.</p>`
      }
    }

    return null // no error
  }

  /**
   * Stores the new Name Request.
   * @param nameRequest the name request object
   */
  storeNameRequest (nameRequest: NameRequestIF): void {
    // overwrite the existing NR data with the new NR data
    this.setNameRequest({
      ...this.getNameRequest,
      ...nameRequest
    } as any)
    this.setNameRequestLegalName(this.getNrApprovedName(nameRequest) || null)
  }

  /** Inform parent the process is complete. */
  @Emit('saved')
  private emitSaved (isSaved = false): boolean {
    if (!isSaved) this.$refs.correctNrForm.resetValidation()
    return isSaved
  }

  /** Inform parent when form is valid and ready for submission. */
  @Watch('formValid')
  @Watch('nameRequestNumber')
  @Watch('applicantPhone')
  @Watch('applicantEmail')
  @Emit('valid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.step-icon {
  font-size: small;
  font-weight: bold;
  pointer-events: none;
}

:deep(#nr-number) {
  // hide uppercase transformation delay from user
  text-transform: uppercase;
}

:deep(.theme--light.v-label) {
  font-size: 1rem;
  color: $gray7;
  font-weight: normal;
}
</style>
