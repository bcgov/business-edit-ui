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
import { ConfirmDialogType, NameRequestApplicantIF, NameRequestIF, NrCorrectionIF,
  NrResponseIF } from '@/interfaces/'
import { CorrectNameOptions } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'

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

  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void
  @Action(useStore) setEntityTypeChangedByName!: (x: boolean) => void

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

  /** Watch for form submission and emit results. */
  @Watch('formType')
  async onSubmit (): Promise<any> {
    // this component should only see correct-new-nr form type
    if (this.formType === CorrectNameOptions.CORRECT_NEW_NR) {
      try {
        // Validate and return the name request data
        const nr: NrResponseIF = await this.validateNameRequest(
          this.nameRequestNumber,
          this.applicantPhone,
          this.applicantEmail
        )

        if (this.isNameRequestInvalid(nr)) {
          // Invalid NR type, inform parent the process is done and prompt confirm dialog
          this.emitIsSaved()

          const dialogContent = this.nameRequestErrorText(nr)
          await this.showConfirmDialog(
            this.$refs.confirm,
            'Name Request Type Does Not Match Business Type',
            dialogContent,
            'OK'
          )
        } else {
          this.parseNameRequest(nr)
          // Set our entity type, if it's a conversion request
          if (nr.request_action_cd === NrRequestActionCodes.CONVERSION) {
            this.setEntityType(nr.legalType)
            this.setEntityTypeChangedByName(true)
          }
          this.emitIsSaved(true)
        }
      } catch {
        // "validateNameRequest" handles its own errors
        // Inform parent process is complete
        this.emitIsSaved()
      }
    }
  }

  /* Checks name request type or if it's an invalid conversion name request. */
  isNameRequestInvalid (nr: NrResponseIF): boolean {
    const isNameEntityTypeDifferent = this.getEntityType !== nr.legalType
    const entityTypeOptions = this.getResource?.changeData?.entityTypeOptions
    const isValidConversionNameRequest = nr.request_action_cd === NrRequestActionCodes.CONVERSION &&
      entityTypeOptions?.some(options => options.value === nr.legalType)
    return (isNameEntityTypeDifferent && !isValidConversionNameRequest)
  }

  /* Generate content of error depending on name request type. */
  nameRequestErrorText (nr: NrResponseIF): string {
    const isConversionOrAlterationNameRequest = nr.request_action_cd === NrRequestActionCodes.CONVERSION
    let dialogContent = ''
    if (isConversionOrAlterationNameRequest) {
      dialogContent = `<p class="info-text">
        This alteration name request does not match the current business type
        <b>${GetCorpFullDescription(this.getEntityType)}</b>.\n\n
        The Name Request type must match the business type before you can continue.</p>`
    } else {
      dialogContent = `<p class="info-text">
        This ${GetCorpFullDescription(nr.legalType)}
        Name Request does not match the current business type
        <b>${GetCorpFullDescription(this.getEntityType)}</b>.\n\n
        The Name Request type must match the business type before you can continue.</p>`
    }
    return dialogContent
  }

  /**
   * Parse and Set the Name Request date to Store.
   * @param nr The name request data
   */
  parseNameRequest (nr: NrResponseIF): void {
    const nrCorrection: NrCorrectionIF = {
      legalType: nr.legalType,
      nrNumber: this.nameRequestNumber,
      legalName: this.getNrApprovedName(nr) || '',
      expiry: nr.expirationDate,
      status: nr.state,
      requestType: nr.request_action_cd,
      applicant: {
        fullName: this.formatFullName(nr.applicants),
        fullAddress: this.formatFullAddress(nr.applicants),
        phoneNumber: nr.applicants.phoneNumber,
        emailAddress: nr.applicants.emailAddress
      } as NameRequestApplicantIF
    }

    // set the new correction NR data
    this.setNameRequest({ ...this.getNameRequest, ...nrCorrection })
  }

  /** Inform parent the process is complete. */
  @Emit('isSaved')
  emitIsSaved (isSaved = false): boolean {
    if (!isSaved) this.$refs.correctNrForm.resetValidation()
    return isSaved
  }

  /** Inform parent when form is valid and ready for submission. */
  @Watch('formValid')
  @Watch('nameRequestNumber')
  @Watch('applicantPhone')
  @Watch('applicantEmail')
  @Emit('isValid')
  emitValid (): boolean {
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
