<template>
  <div id="verified-email">
    <v-text-field
      v-model="value"
      filled
      :label="label"
      :hint="hint"
      :error-messages="errorMessages"
      persistent-hint
      validate-on-blur
      @blur="verify()"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { EmailVerificationService } from '@/services/'

@Component({})
export default class VerifiedEmail extends Vue {
  @Prop({ default: null }) readonly email!: string
  @Prop({ default: 'Email Address' }) readonly label!: string
  @Prop({ default: 'Example: name@email.com' }) readonly hint!: string
  @Prop({ default: false }) readonly required!: boolean

  // local properties
  value: string = null
  valid: boolean = null

  /** Contains error message if email is invalid. */
  get errorMessages (): string[] {
    return this.valid ? [] : ['Enter valid email address']
  }

  /** Called to verify the email when user leaves the text field. */
  async verify (): Promise<void> {
    // trim here because v-model.trim doesn't remove trailing spaces
    this.value = this.value?.trim() || null

    // accept empty value if the email is optional
    if (!this.value && !this.required) {
      this.updateParent(true)
      return
    }

    // reject empty value if the email is required
    if (!this.value && this.required) {
      this.updateParent(false)
      return
    }

    // validate format locally
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!VALID_FORMAT.test(this.value)) {
      this.updateParent(false)
      return
    }

    // as we're still not sure, call verification service
    const valid = await EmailVerificationService.isValidEmail(this.value)
      .catch(() => true) // if error, assume email is valid
    this.updateParent(valid)
  }

  /** Initially, and when prop changes, updates model value and verifies it. */
  @Watch('email', { immediate: true })
  private async onEmailChanged (email: string): Promise<void> {
    this.value = email
    this.verify()
  }

  protected updateParent (valid: boolean): void {
    this.valid = valid
    this.$emit('valid', this.valid)
    this.$emit('update:email', this.value)
  }
}
</script>

<style lang="scss" scoped>
// ensure input label is not bold
:deep(.v-label) {
  font-weight: normal;
}
</style>
