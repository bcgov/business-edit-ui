<template>
  <v-card flat id="change-summary">
    <!-- Section Header -->
    <div class="summary-header px-4 mb-2 rounded-t">
      <v-row no-gutters>
        <v-col cols="9">
          <v-icon color="primary">mdi-file-document-edit-outline</v-icon>
          <label class="summary-title">Summary of Changes to File</label>
        </v-col>

        <!-- Actions -->
        <v-col cols="3" class="mt-n2">
          <div class="actions mr-4">
            <v-btn
              text color="primary"
              id="btn-change"
              :disabled="isBusySaving"
              @click="onChangeClicked()"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
            <v-btn
              text color="primary"
              id="btn-delete"
              :disabled="isBusySaving"
              @click="onDeleteClicked()"
            >
              <v-icon small>mdi-delete</v-icon>
              <span>Delete</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Business Name -->
    <template v-if="hasBusinessNameChanged">
      <v-divider class="mx-4" />
      <div class="section-container business-name-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Business Name</strong></label>
          </v-col>

          <v-col cols="8" class="mt-n1">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>
            <div class="company-name mt-2">{{ getNameRequest.nrNumber }}</div>
          </v-col>
        </v-row>
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces'
import { DateMixin, EnumMixin, FilingTemplateMixin, LegalApiMixin, PayApiMixin } from '@/mixins'

@Component({
  components: {}
})
export default class ChangeSummary extends Mixins(
  DateMixin,
  EnumMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  PayApiMixin
) {
  // Global getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter isBusySaving!: boolean

  // Change flag getters
  @Getter hasBusinessNameChanged!: boolean

  // Global actions
  @Action setSummaryMode!: ActionBindingIF

  /** Prop to perform validation. */
  @Prop() readonly validate: boolean

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  async onChangeClicked (): Promise<void> {
    this.setSummaryMode(false)
    // We don't change views just interchange components, so scroll to top for better UX.
    await this.scrollToTop(document.getElementById('app'))
  }

  onDeleteClicked (): void {
    this.$root.$emit('delete-all')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.summary-title {
  padding-left: 0.5rem;
}

.company-name {
  font-size: 1.5rem;
}

.actions {
  position: absolute;
  right: 0;

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.inner-col-1 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, decrease width by 1/2 container margin + padding
  flex: 0 0 calc(25% - 1.5rem);
}

.inner-col-2 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, increase width by 1/2 container margin + padding
  flex: 0 0 calc(75% + 1.5rem);
  max-width: calc(75% + 1.5rem);
}

// hide first v-divider
.v-divider:first-of-type {
  display: none;
}
</style>
