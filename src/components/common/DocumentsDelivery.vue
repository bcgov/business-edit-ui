<template>
  <section id="document-delivery-section">
    <h2>{{sectionNumber}} Documents Delivery</h2>

    <div class="document-info py-4">
      Copies of the {{ getFilingName.toLowerCase() }} documents will be sent
      to the following email address listed below.
    </div>

    <div :class="{ 'invalid-section': documentDeliveryInvalid }">
      <v-card flat class="section-container py-6">
        <v-row no-gutters>
          <v-col cols="3" class="px-0">
            <label><strong>Registered Office</strong></label>
          </v-col>
          <v-col cols="9" class="px-0">
            <span class="info-text">{{getBusinessContact.email || '(Not entered)'}}</span>
          </v-col>
        </v-row>

        <v-row v-if="isRoleStaff" no-gutters class="mt-6">
          <v-col cols="3" class="px-0">
            <label :class="{ 'error-text': documentDeliveryInvalid }"><strong>Completing Party</strong></label>
          </v-col>
          <v-col cols="9" class="px-0">
            <v-text-field
              v-model="optionalEmail"
              id="optionalEmail"
              class="email-input-field mb-n2"
              filled
              label="Client Email Address (Optional)"
              hint="Example: name@email.com"
              persistent-hint
              validate-on-blur
              :rules="entityEmailRules"
            />
          </v-col>
        </v-row>

        <v-row v-else no-gutters class="mt-6">
          <v-col cols="3" class="px-0">
            <label><strong>Completing Party</strong></label>
          </v-col>
          <v-col cols="9" class="px-0">
            <span class="info-text">{{ getUserEmail }}</span>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Emit, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins/'
import { FilingNames } from '@/enums/'
import { ActionBindingIF, FlagsReviewCertifyIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

// FUTURE: update this component so it doesn't set changes flag initially

@Component({})
export default class DocumentsDelivery extends Mixins(CommonMixin) {
  // Global getters
  @Getter getUserEmail!: string
  @Getter getBusinessContact!: ContactPointIF
  @Getter isRoleStaff!: boolean
  @Getter getDocumentOptionalEmail!: string
  @Getter getFlagsReviewCertify!: FlagsReviewCertifyIF
  @Getter getFilingName!: FilingNames

  // Global actions
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber!: string

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  // Local properties
  private optionalEmail = ''

  private entityEmailRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.validateEmailFormat(v) || 'Enter valid email address'
  ]

  /** Called when component is mounted. */
  mounted (): void {
    this.optionalEmail = this.getDocumentOptionalEmail
  }

  private validateEmailFormat (value: string): boolean {
    // allow empty as the email is optional
    if (!value) {
      return true
    } else {
      const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      return VALID_FORMAT.test(value)
    }
  }

  /** True if invalid class should be set for certify container. */
  get documentDeliveryInvalid (): boolean {
    return (this.validate && !this.getFlagsReviewCertify.isValidDocumentOptionalEmail)
  }

  @Watch('optionalEmail')
  onOptionalEmailChanged (val: string): void {
    if (this.validateEmailFormat(val)) {
      this.setDocumentOptionalEmail(val)
      this.setDocumentOptionalEmailValidity(true)
    } else {
      this.setDocumentOptionalEmailValidity(false)
    }
  }

  @Emit('valid')
  private async emitValid (): Promise<boolean> {
    // wait for form to update itself before checking validity
    await this.$nextTick()
    return (this.validateEmailFormat(this.optionalEmail))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep(.v-label) {
  font-weight: normal;
}

#document-delivery-section {
  &.invalid {
    border-left: 4px solid $BCgovInputError;
    padding-left: calc(2rem - 4px);
    h2 {
      color: $BCgovInputError;
    }
  }
}
</style>
