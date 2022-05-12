<template>
  <v-card flat id="conversion-summary">
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
    <template v-if="hasNatureOfBusinessChanged">
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
    <template v-if="hasOfficeAddressesChanged">
      <v-divider class="mx-8" />
      <article id="address-summary-section" class="section-container">
        <OfficeAddresses :isSummaryView="true" />
      </article>
    </template>

    <!-- Org Persons -->
    <template v-if="hasPeopleAndRolesChanged">
      <v-divider class="mx-8" />
      <article id="org-person-summary-section" class="section-container pb-0">
        <v-row no-gutters>
          <v-col cols="12" sm="3">
            <label>{{ getResource.entityType === 'SP' ? 'Proprietor' : 'Partner' }} Information</label>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-4">
          <v-col cols="12">
            <ListPeopleAndRoles
              :peopleAndRoles="getPeopleAndRoles"
              :isSummaryView="true"
              :hasMinimumPartners="hasMinimumPartners"
            />
          </v-col>
        </v-row>
      </article>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { OfficeAddresses, ListPeopleAndRoles } from '@/components/common/'
import { ActionBindingIF, ResourceIF } from '@/interfaces/'
import { DateMixin, SharedMixin, FilingTemplateMixin, LegalApiMixin, PayApiMixin } from '@/mixins/'

@Component({
  components: {
    OfficeAddresses,
    ListPeopleAndRoles
  }
})
export default class ConversionSummary extends Mixins(
  DateMixin,
  SharedMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  PayApiMixin
) {
  // Global getters
  @Getter getBusinessNumber!: string
  @Getter getResource!: ResourceIF
  @Getter hasMinimumPartners!: boolean

  // Global actions
  @Action setSummaryMode!: ActionBindingIF

  /** Whether to perform validation. */
  @Prop() readonly validate: boolean

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

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