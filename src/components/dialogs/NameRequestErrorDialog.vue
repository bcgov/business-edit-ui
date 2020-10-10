<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="name-request-error-dialog">
    <v-card>
      <v-card-title>Name Request Not Found</v-card-title>

      <v-card-text>
        <p v-if="type === NameRequestStates.EXPIRED">The specified name request has expired.</p>

        <p v-else-if="type === NameRequestStates.NOT_APPROVED">The specified name request has not been approved.</p>

        <p v-else-if="type === NameRequestStates.NEED_CONSENT">The specified name request is awaiting consent.</p>

        <p v-else-if="type === NameRequestStates.CONSUMED">The specified name request has already been consumed.</p>

        <template v-else-if="type === NameRequestStates.NOT_FOUND || type === NameRequestStates.INVALID ||
                  type === NameRequestStates.INCORRECT_EMAIL || type === NameRequestStates.INCORRECT_PHONE">
          <p>We could not find a match for the information you have entered.
          Please verify the NR Number and the phone number or email address and try again.</p>
        </template>

        <p v-else>An unexpected error has occurred.</p>
      </v-card-text>

      <v-divider class="my-0"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="dialog-ok-button" color="primary" text @click="emitClose()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { NameRequestStates } from '@/enums/nameRequestStates'

@Component({})
export default class NameRequestErrorDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop() private dialog: boolean

  /** Prop to provide attachment selector. */
  @Prop() private attach: string

  /** Prop to provide message type. */
  @Prop({ default: null }) private type: NameRequestStates

  /** Enum definition for use in template. */
  readonly NameRequestStates = NameRequestStates

  @Emit('close')
  private emitClose (): void {}
}
</script>

<style lang="scss" scoped>
.v-card__text {
  font-size: 1rem;
}
</style>
