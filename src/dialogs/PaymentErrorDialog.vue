<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="payment-error-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Unable to process payment
      </v-card-title>

      <v-card-text id="dialog-text">
        <!-- display common message -->
        <div class="genErr">
          <p>
            We are unable to process your payment at this time. This {{ filingName }} has been saved
            as a DRAFT and you can retry your payment from the Business Dashboard at a later time.
          </p>
        </div>

        <!-- display generic message (no errors or warnings) -->
        <div
          v-if="!isRoleStaff && (numErrors + numWarnings) < 1"
          class="genErr"
        >
          <p>PayBC is normally available:</p>
          <ul>
            <li>Monday to Friday: 6:00am to 9:00pm</li>
            <li>Saturday: 12:00am to 7:00pm</li>
            <li>Sunday: 12:00pm to 12:00am</li>
          </ul>
        </div>

        <!-- display errors -->
        <div
          v-if="numErrors > 0"
          class="genErr mb-4"
        >
          <p>We were unable to process your payment due to the following errors:</p>
          <div
            v-for="(error, index) in errors"
            :key="index"
            class="d-flex"
          >
            <span class="flex-shrink-0"><v-icon>mdi-circle-medium</v-icon></span>
            <span
              class="flex-grow-1"
              v-html="error.message"
            />
          </div>
        </div>

        <!-- display warnings-->
        <div
          v-if="numWarnings > 0"
          class="genErr mb-4"
        >
          <p>Please note the following warnings:</p>
          <div
            v-for="(warning, index) in warnings"
            :key="index"
            class="d-flex"
          >
            <span class="flex-shrink-0"><v-icon>mdi-circle-medium</v-icon></span>
            <span
              class="flex-grow-1"
              v-html="warning.message"
            />
          </div>
        </div>

        <template v-if="!isRoleStaff">
          <p class="genErr">
            If this error persists, please contact us:
          </p>
          <error-contact />
        </template>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          id="dialog-exit-button"
          color="primary"
          text
          @click="exit()"
        >
          Return to dashboard
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { ErrorContact } from '@/components/common/'
import { useStore } from '@/store/store'

@Component({
  components: { ErrorContact }
})
export default class PaymentErrorDialog extends Vue {
  @Getter(useStore) isRoleStaff!: boolean

  /** Prop containing filing name. */
  @Prop({ default: 'Filing' }) readonly filingName!: string

  /** Prop to display the dialog. */
  @Prop() readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop() readonly attach!: string

  /** Prop containing error messages. */
  @Prop({ default: () => [] }) readonly errors!: object[]

  /** Prop containing warning messages. */
  @Prop({ default: () => [] }) readonly warnings!: object[]

  /** Pass click event to parent. */
  @Emit() protected exit (): void {}

  /** The number of errors in the passed-in array. */
  get numErrors (): number {
    return (this.errors?.length || 0)
  }

  /** The number of warnings in the passed-in array. */
  get numWarnings (): number {
    return (this.warnings?.length || 0)
  }
}
</script>
