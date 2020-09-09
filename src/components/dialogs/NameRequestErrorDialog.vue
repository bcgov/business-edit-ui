<template>
  <v-dialog v-model="dialog" persistent :attach="attach" max-width="600px">
    <v-card class="notify-dialog">
      <v-card-title>
        <slot name="icon">
          <v-icon large color="error">mdi-alert</v-icon>
        </slot>
        <span>
          <slot name="title">Error Adding Name Request</slot>
        </span>
      </v-card-title>
      <v-card-text>
        <slot name="text">
          <p class="genErr" v-if="type === NameRequestStates.EXPIRED">
            The specified name request has expired.</p>

          <p class="genErr" v-else-if="type === NameRequestStates.NOT_APPROVED">
            The specified name request has not been approved.</p>

          <p class="genErr" v-else-if="type === NameRequestStates.NEED_CONSENT">
            The specified name request is awaiting consent.</p>

          <p class="genErr" v-else-if="type === NameRequestStates.NOT_FOUND">
            The specified name request could not be found.</p>

          <p class="genErr" v-else-if="type === NameRequestStates.CONSUMED">
            The specified name request has already been consumed.</p>

          <p class="genErr" v-else-if="type === NameRequestStates.INVALID">
            The specified name request data is invalid.</p>

          <p class="genErr" v-else>An unexpected error has occurred.</p>
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-btn large color="error" @click="emitClose" data-test="dialog-ok-button">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { NameRequestStates } from '@/enums/nameRequestStates'

@Component({})
export default class InvalidNrDialog extends Vue {
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
  .notify-dialog .v-card__title {
    flex-direction: column;

    ::v-deep i {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  .notify-dialog .v-card__text {
    text-align: center;
  }

  .notify-dialog .v-card__actions {
    justify-content: center;
    padding: 1.5rem;
  }
</style>
