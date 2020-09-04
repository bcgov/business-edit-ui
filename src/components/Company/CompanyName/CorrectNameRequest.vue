<template>
  <v-form ref="addNRForm" v-model="valid" lazy-validation>
    <v-text-field
      v-model="nameRequestNumber"
      filled
      label="Enter a Name Request Number"
      hint="Example: NR 1234567"
      req
      persistent-hint
      :rules="entityNumRules"
      data-test="business-identifier"
    ></v-text-field>
    <v-text-field
      v-model="entityPhone"
      filled
      label="Enter the Applicant Phone Number"
      hint="Example: 555-555-5555"
      persistent-hint
      type="tel"
      :rules="entityPhoneNumberRules"
      data-test="entity-phone"
    ></v-text-field>
    <div class="font-weight-bold ml-3 mb-2">or</div>
    <v-text-field
      v-model="entityEmail"
      filled
      label="Enter the Applicant Email Address"
      hint="Example: name@email.com"
      persistent-hint
      :rules="entityEmailRules"
      data-test="entity-email"
    >
    </v-text-field>
  </v-form>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class CorrectNameRequest extends Vue {
  /** Trigger form submission */
  @Prop({ default: false }) triggerSubmit: boolean

  private valid = false
  private nameRequestNumber: string = ''
  private entityPhone: string = ''
  private entityEmail: string = ''

  // Rules
  private entityNumRules = [
    v => !!v || 'Name Request Number is required',
    v => this.validateNameRequestNumber(v) || 'Name Request Number is invalid'
  ]
  private entityPhoneNumberRules = [
    v => this.isInputEntered(v, 'phone') || 'Phone number is required',
    v => !(v.length > 12) || 'Phone number is invalid'
  ]
  private entityEmailRules = [
    v => this.isInputEntered(v, 'email') || 'Email is required',
    v => this.isValidateEmail(v) || 'Email is Invalid'
  ]

  // Data

  // Validations
  private isFormValid (): boolean {
    return !!this.nameRequestNumber &&
      (!!this.entityPhone || !!this.entityEmail)
  }

  private isInputEntered (value: any, inputType: string) {
    return (!!((inputType === 'email') ? this.entityPhone : this.entityEmail) || !!value)
  }

  private isValidateEmail (value: any) {
    return ((!!this.entityPhone && !!value) || !!this.validateEmailFormat(value))
  }

  private validateNameRequestNumber (value: string):boolean {
    const VALID_FORMAT = new RegExp(/^(NR )?\d+$/)
    return VALID_FORMAT.test(value.toUpperCase())
  }

  private validateEmailFormat (value: string):boolean {
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  /** Called when parent triggers form submission */
  @Watch('triggerSubmit', { immediate: true })
  private onTriggerSubmit (): void {
    console.log(this.isFormValid())
  }
}
</script>

<style lang="scss" scoped>
</style>
