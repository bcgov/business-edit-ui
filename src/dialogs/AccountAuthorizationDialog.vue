<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="account-authorization-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Account Authorization
      </v-card-title>

      <v-card-text>
        <p class="font-15">
          This account appears to be unable to access this name request, incorporation application,
          or business. You can retry, or you can exit and return to the dashboard.
        </p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-btn
          id="dialog-exit-button"
          color="primary"
          text
          @click="exit()"
        >
          Exit
        </v-btn>
        <v-spacer />
        <v-btn
          id="dialog-retry-button"
          color="primary"
          text
          @click="retry()"
        >
          Retry
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class AccountAuthorizationDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop() readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop() readonly attach!: string

  // Pass click events to parent.
  @Emit() protected exit (): void {}
  @Emit() protected retry (): void {}
}
</script>
