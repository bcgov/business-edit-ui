<template>
  <v-dialog v-model="dialog" persistent :attach="attach" max-width="60%">
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
        <slot name="text">The specified name request is invalid or not found.</slot>
      </v-card-text>
      <v-card-actions>
        <v-btn large color="error" @click="emitClose" data-test="dialog-ok-button">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class InvalidNrDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop() private dialog: boolean

  /** Prop to provide attachment selector. */
  @Prop() private attach: string

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
