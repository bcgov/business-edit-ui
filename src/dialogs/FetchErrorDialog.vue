<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="fetch-error-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Unable to Retrieve Filing
      </v-card-title>

      <v-card-text>
        <p class="font-15">
          We were unable to retrieve your filing. You can try to retrieve your
          filing now, or you can exit and return to the dashboard.
        </p>

        <template v-if="!IsAuthorized(AuthorizedActions.NO_CONTACT_INFO)">
          <p class="font-15">
            If this error persists, please contact us:
          </p>
          <ErrorContact />
        </template>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-btn
          id="dialog-exit-button"
          color="primary"
          text
          @click="exit()"
        >
          Return to dashboard
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
import { ErrorContact } from '@/components/common/'
import { AuthorizedActions } from '@/enums'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    ErrorContact
  }
})
export default class FetchErrorDialog extends Vue {
  // for template
  readonly IsAuthorized = IsAuthorized
  readonly AuthorizedActions = AuthorizedActions

  /** Prop to display the dialog. */
  @Prop() readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop() readonly attach!: string

  // Pass click events to parent.
  @Emit() protected exit (): void {}
  @Emit() protected retry (): void {}
}
</script>
