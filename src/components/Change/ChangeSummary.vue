<template>
  <v-card flat id="change-summary">
    <!-- Section Header -->
    <section class="section-container summary-header rounded-t">
      <v-row no-gutters>
        <v-col>
          <v-icon class="header-icon ml-n1">mdi-file-document-edit-outline</v-icon>
          <label class="summary-title">Summary of Changes to File</label>
        </v-col>
      </v-row>
    </section>

    <!-- Business Name -->
    <template v-if="hasBusinessNameChanged">
      <v-divider class="mx-8" />
      <article id="business-name-summary-section" class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3">
            <label>Business Name</label>
          </v-col>

          <v-col cols="12" sm="8" class="mt-n1">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>
            <div class="company-name mt-2">{{ getNameRequest.nrNumber }}</div>
          </v-col>
        </v-row>
      </article>
    </template>

    <!-- Nature of Business -->
    <template v-if="hasNaicsChanged">
      <v-divider class="mx-8" />
      <article id="nob-summary-section" class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3">
            <label>Nature of Business</label>
          </v-col>

          <v-col cols="12" sm="8">
            <span class="info-text">{{getCurrentNaics.naicsCode}} - {{getCurrentNaics.naicsDescription}}</span>
          </v-col>
        </v-row>
      </article>
    </template>

    <!-- Business Addresses -->
    <template v-if="haveOfficeAddressesChanged">
      <v-divider class="mx-8" />
      <article id="address-summary-section" class="section-container">
        <OfficeAddresses :isSummaryView="true" />
      </article>
    </template>

    <!-- Org Persons -->
    <template v-if="havePeopleAndRolesChanged">
      <v-divider class="mx-8" />
      <article id="org-person-summary-section" class="section-container pb-0">
        <v-row no-gutters>
          <v-col cols="12" sm="3">
            <label>{{ isTypeSP ? 'Proprietor' : 'Partner' }} Information</label>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-4">
          <v-col cols="12">
            <ListPeopleAndRoles :isSummaryView="true" />
          </v-col>
        </v-row>
      </article>
    </template>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { OfficeAddresses, ListPeopleAndRoles } from '@/components/common/'
import { ActionBindingIF, NameRequestIF, ResourceIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'

@Component({
  components: {
    OfficeAddresses,
    ListPeopleAndRoles
  }
})
export default class ChangeSummary extends Vue {
  // Global getters
  @Getter hasBusinessNameChanged!: boolean
  @Getter getNameRequest!: NameRequestIF
  @Getter hasNaicsChanged!: boolean
  @Getter getCurrentNaics!: NaicsIF
  @Getter haveOfficeAddressesChanged!: boolean
  @Getter havePeopleAndRolesChanged!: boolean
  @Getter getResource!: ResourceIF
  @Getter getNameRequestLegalName!: string
  @Getter getBusinessNumber!: string
  @Getter isTypeSP!: boolean

  // Global actions
  @Action setSummaryMode!: ActionBindingIF

  /** Whether to perform validation. */
  @Prop() readonly validate!: boolean

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

article {
  &:first-of-type {
    padding-top: 24px;
  }
  &:last-of-type {
    padding-bottom: 24px;
  }
}

.summary-header {
  background-color: $BCgovBlue5O;
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
