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
        Unable to Process Payment
      </v-card-title>

      <v-card-text id="dialog-text">
        <!-- display common message -->
        <div
          v-if="numErrors == 0"
          class="genErr"
        >
          <p>We are unable to process your payment at this time.</p>
        </div>

        <!-- display errors -->
        <div
          v-else
          class="genErr mb-4"
        >
          <p>We were unable to process your payment due to the following error(s):</p>
          <ul>
            <li
              v-for="(error, index) in errors"
              :key="index"
            >
              {{ error.message }}
            </li>
          </ul>
        </div>

        <!-- display warnings-->
        <div
          v-if="numWarnings > 0"
          class="genErr mb-4"
        >
          <p>Please note the following warning(s):</p>
          <ul>
            <li
              v-for="(warning, index) in warnings"
              :key="index"
            >
              {{ warning.message }}
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          id="dialog-exit-button"
          color="primary"
          text
          @click="close()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'

@Component({})
export default class StaffPaymentErrorDialog extends Vue {
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
  @Emit() protected close (): void {}

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
