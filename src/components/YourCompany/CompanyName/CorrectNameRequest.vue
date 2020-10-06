<template>
  <v-form id="correct-nr-form" ref="correctNrForm" v-model="valid" lazy-validation>
    <v-layout row>
      <v-flex md1 class="pa-3 pl-0">
        <v-btn x-small fab outlined disabled color="#1A5A96" class="step-icon">1</v-btn>
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="nameRequestNumber"
          class="text-input-field"
          filled
          label="Enter the NR Number"
          hint="Example: NR 1234567"
          persistent-hint
          :rules="entityNumRules"
          data-test="business-identifier"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex md1 class="pa-3 pl-0">
        <v-btn x-small fab outlined disabled color="#1A5A96" class="step-icon">2</v-btn>
      </v-flex>
      <v-flex md5>
        <v-text-field
          v-model="entityPhone"
          class="text-input-field"
          filled
          label="Applicant's Phone Number"
          hint="Example: 555-555-5555"
          persistent-hint
          type="tel"
          :rules="entityPhoneNumberRules"
          data-test="entity-phone"
        ></v-text-field>
      </v-flex>
      <div class="ma-5">or</div>
      <v-flex>
        <v-text-field
          v-model="entityEmail"
          class="text-input-field"
          filled
          label="Applicant's Notification Email"
          hint="Example: name@email.com"
          persistent-hint
          :rules="entityEmailRules"
          data-test="entity-email"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Mixins
import { NameRequestMixin } from '@/mixins'

// Interfaces & Enums
import {
  ActionBindingIF,
  NameRequestApplicantIF,
  NameRequestIF,
  NrCorrectionIF
} from '@/interfaces'
import { CorrectionTypes } from '@/enums'

@Component({})
export default class CorrectNameRequest extends Mixins(NameRequestMixin) {
  /** Form Submission Prop */
  @Prop({ default: null }) formType: CorrectionTypes

  @Action setNameRequest!: ActionBindingIF

  @Getter getNameRequest!: NameRequestIF
  @Getter getNameRequestNumber!: string
  @Getter getNameRequestApplicant!: NameRequestApplicantIF

  private valid = false
  private nameRequestNumber: string = ''
  private entityPhone: string = ''
  private entityEmail: string = ''

  // Form Ref
  $refs: { correctNrForm: HTMLFormElement }

  // Rules
  private entityNumRules = [
    v => !!v || 'Name Request Number is required',
    v => this.validateNameRequestNumber(v) || 'Name Request Number is invalid'
  ]
  private entityPhoneNumberRules = [
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => !(v?.length > 12) || 'Phone number is invalid'
  ]
  private entityEmailRules = [
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => this.isValidateEmail(v) || 'Email is Invalid'
  ]

  mounted (): void {
    if (this.getNameRequestNumber) this.nameRequestNumber = this.getNameRequestNumber
    if (this.getNameRequestApplicant) {
      this.entityPhone = this.getNameRequestApplicant.phoneNumber
      this.entityEmail = this.getNameRequestApplicant.emailAddress
    }
  }

  // Validations
  private get isFormValid (): boolean {
    return this.valid && !!this.nameRequestNumber &&
      (!!this.entityPhone || !!this.entityEmail)
  }

  private isValidateEmail (value: any) {
    if (value?.length < 1) return true
    return ((!!this.entityPhone && !!value) || !!this.validateEmailFormat(value))
  }

  private validateNameRequestNumber (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(NR )\d{7}$/)
    return VALID_FORMAT.test(value.toUpperCase())
  }

  private validateEmailFormat (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  private resetForm () {
    this.$refs.correctNrForm.resetValidation()
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    if (this.formType === CorrectionTypes.CORRECT_NEW_NR) {
      await this.validateNameRequest(this.nameRequestNumber, this.entityPhone, this.entityEmail)
        .then(response => {
          const nrCorrection: NrCorrectionIF = {
            nrNumber: this.nameRequestNumber,
            legalName: this.getNrApprovedName(response),
            applicant: {
              phoneNumber: this.entityPhone,
              emailAddress: this.entityEmail
            }
          }
          this.setNameRequest({ ...this.getNameRequest, ...nrCorrection })
          this.emitDone(true)
        }).catch(() => {
          // Request is handling it's own errors
          // Inform parent process is complete
          this.emitDone()
        })
    }
  }

  /** Inform parent the process is complete. */
  @Emit('done')
  private emitDone (isSaved: boolean = false): boolean {
    if (!isSaved) this.resetForm()
    return isSaved
  }

  /** Inform parent when form is valid and ready for submission. */
  @Watch('valid')
  @Watch('entityPhone')
  @Watch('entityEmail')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>

<style lang="scss" scoped>
  .step-icon {
    font-size: small;
    font-weight: bold;
  }
</style>
