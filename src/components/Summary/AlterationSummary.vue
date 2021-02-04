<template>
  <v-card flat id="alteration-summary" v-if="isSummaryMode">

    <confirm-dialog
      ref="confirm"
      attach="#app"
    />

    <!-- Section Header -->
    <div class="summary-header">
      <v-layout row class="mx-0">
        <v-flex xs9>
          <img  class="my-n1" src="@/assets/images/currency-usd-circle.svg">
          <label class="summary-title">Alteration Notice Changes ($100.00 Fee)</label>
        </v-flex>

        <!-- Actions -->
        <v-flex xs3 class="mt-n2">
          <div class="actions mr-4">
            <v-btn
              text color="primary"
              id="btn-change-alteration"
              @click="setSummaryMode(false)"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Change</span>
            </v-btn>
            <v-btn
              text color="primary"
              id="btn-delete-alteration"
              @click="restoreOriginalSnapshot()"
            >
              <v-icon small>mdi-delete</v-icon>
              <span>Remove</span>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </div>

    <!-- Business Name -->
    <template v-if="hasBusinessNameChanged">
      <div class="section-container business-name-summary">
        <v-layout row class="mx-0 mt-4">
          <v-flex xs3>
            <v-layout column>
              <label><strong>Company Name</strong></label>
            </v-layout>
          </v-flex>

          <v-flex xs8 class="mt-n1">
            <div class="company-name font-weight-bold">{{ companyName }}</div>
            <div class="company-name">{{ getNameRequest.nrNumber }}</div>
          </v-flex>
        </v-layout>
      </div>
      <v-divider class="mx-4" />
    </template>

    <!-- Business Type -->
    <template v-if="hasBusinessTypeChanged">
      <div class="section-container business-type-summary">
        <v-layout row class="mx-0 mt-4">
          <v-flex xs3>
            <label><strong>Business Type</strong></label>
          </v-flex>

          <v-flex xs8>
            <template>
              <span class="info-text">
                Changing from a {{ getEntityDesc(originalEntityType) }} to a {{getEntityDesc(getEntityType)}}
              </span>
              <template>
                <p class="subtitle mt-2 pt-2">Benefit Company Articles</p>
                <div class="confirmed-msg">
                  <v-icon color="success" class="confirmed-icon">mdi-check</v-icon>
                  <span class="info-text text-body-3 confirmed-icon ml-2">
              The company has completed a set Benefit Company Articles containing a benefit provision, and a copy of
              these articles has been added to the company's record book.
              </span>
                </div>
              </template>
            </template>
          </v-flex>
        </v-layout>
      </div>
      <v-divider class="mx-4" />
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ConfirmDialog } from '@/components/dialogs'
import { ActionBindingIF, ConfirmDialogType, NameRequestIF } from '@/interfaces'
import { CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { EntityTypes } from '@/enums'

@Component({
  components: {
    ConfirmDialog
  }
})
export default class AlterationSummary extends Mixins(CommonMixin, DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Global Getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEntityType!: EntityTypes
  @Getter isSummaryMode!: boolean
  @Getter getNameRequest!: NameRequestIF
  // Alteration Flag Getters
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasBusinessTypeChanged!: boolean

  // Actions
  @Action setSummaryMode!: ActionBindingIF

  /** The company name (from NR, or incorporation number). */
  private get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  private get originalEntityType (): string {
    return this.getOriginalSnapshot[0]?.business?.legalType
  }

  private restoreOriginalSnapshot (): void {
    // open confirmation dialog and wait for response
    this.$refs.confirm.open(
      'Remove Changes',
      'This will remove the changes made to your business. Do you want to continue?',
      {
        width: '45rem',
        persistent: true,
        yes: 'Return to my application',
        no: null,
        cancel: 'Remove'
      }
    ).then(() => {
      // if we get here, Yes was clicked
      // nothing to do
    }).catch(async () => {
      // Restore original data
      this.parseBusinessSnapshot()
      this.setSummaryMode(false)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.25rem 1rem;

  .sub-section {
    margin-top: 1.5rem;
  }
}

.summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.confirmed-msg {
  display: flex;
  .confirmed-icon, .confirmed-note {
    display: block;
  }
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
</style>
