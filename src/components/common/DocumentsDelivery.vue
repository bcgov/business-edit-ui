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
            <VerifiedEmail
              class="email-input-field mb-n2"
              label="Client Email Address (Optional)"
              :email="getDocumentOptionalEmail"
              @update:email="setDocumentOptionalEmail($event)"
              @valid="setDocumentOptionalEmailValidity($event)"
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
import VerifiedEmail from '@/components/common/VerifiedEmail.vue'

// FUTURE: update this component so it doesn't set changes flag initially

@Component({
  components: { VerifiedEmail }
})
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

  /** True if invalid class should be set for document delivery container. */
  get documentDeliveryInvalid (): boolean {
    return (this.validate && !this.getFlagsReviewCertify.isValidDocumentOptionalEmail)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

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
