<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="name-request-error-dialog"
  >
    <v-card>
      <v-card-title>Name Request Not Found</v-card-title>

      <v-card-text>
        <p v-if="type === NameRequestStates.EXPIRED">
          The specified name request has expired.
        </p>

        <p v-else-if="type === NameRequestStates.NOT_APPROVED">
          The specified name request has not been approved.
        </p>

        <p v-else-if="type === NameRequestStates.NEED_CONSENT">
          The specified name request is awaiting consent.
        </p>

        <p v-else-if="type === NameRequestStates.CONSUMED">
          The specified name request has already been consumed.
        </p>

        <p
          v-else-if="type === NameRequestStates.NOT_FOUND ||
            type === NameRequestStates.INCORRECT_CONTACT ||
            type === NameRequestStates.NO_CONTACT"
        >
          We could not find a match for the information you have entered.
          Please verify the NR Number and the phone number or email address and try again.
        </p>

        <p v-else-if="type === NameRequestStates.INVALID">
          The specified name request is not valid.
        </p>

        <p v-else>
          An unexpected error has occurred.
        </p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          id="dialog-ok-button"
          color="primary"
          text
          @click="emitClose()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'
import { NameRequestStates } from '@/enums/'

@Component({})
export default class NameRequestErrorDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop() readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop() readonly attach!: string

  /** Prop to provide message type. */
  @Prop({ default: null }) readonly type!: NameRequestStates

  /** Enum definition for use in template. */
  readonly NameRequestStates = NameRequestStates

  @Emit('close')
  protected emitClose (): void {}
}
</script>

<style lang="scss" scoped>
.v-card__text {
  font-size: 1rem;
}
</style>
