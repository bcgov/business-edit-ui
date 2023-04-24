<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="confirm-delete-all-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Delete Alterations
      </v-card-title>

      <v-card-text id="dialog-text">
        All changes made to company information will be deleted, except for changes that
        do not require a fee, such as updates to your Registered Office Contact Information.
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          id="dialog-delete-btn"
          color="primary"
          text
          @click="confirm()"
        >
          Delete Alterations
        </v-btn>
        <v-btn
          id="dialog-cancel-btn"
          color="primary"
          text
          @click="cancel()"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class ConfirmDeleteAllDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop() readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop() readonly attach!: string

  // Pass click event to parent.
  @Emit() protected confirm (): void {}

  // Pass click event to parent.
  @Emit() protected cancel (): void {}
}
</script>

<style lang="scss" scoped>
#dialog-delete-btn {
  font-weight: bold;
}
</style>
