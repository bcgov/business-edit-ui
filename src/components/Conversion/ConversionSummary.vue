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

    <!-- Nature of Business -->
    <template v-if="hasNaicsChanged">
      <v-divider class="mx-8" />
      <article id="nob-summary-section" class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3">
            <label>Nature of Business</label>
          </v-col>

          <v-col cols="12" sm="8">
            <span class="info-text">{{naicsSummary || '(Not entered)'}}</span>
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

    <!-- Proprietor/Partner Information -->
    <template v-if="havePeopleAndRolesChanged">
      <v-divider class="mx-8" />
      <article id="org-person-summary-section" class="section-container pb-0">
        <v-row no-gutters>
          <v-col cols="12" sm="3">
            <label>{{ isSoleProp ? 'Proprietor' : 'Partner' }} Information</label>
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
import { Getter } from 'vuex-class'
import { ListPeopleAndRoles } from '@/components/common/'
import { OfficeAddresses } from '@/components/common/YourCompany'
import { ActionBindingIF, ResourceIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'

@Component({
  components: {
    OfficeAddresses,
    ListPeopleAndRoles
  }
})
export default class ConversionSummary extends Vue {
  // Global getters
  @Getter hasNaicsChanged!: boolean
  @Getter haveOfficeAddressesChanged!: boolean
  @Getter havePeopleAndRolesChanged!: boolean
  @Getter getResource!: ResourceIF
  @Getter getCurrentNaics!: NaicsIF
  @Getter isSoleProp!: boolean

  /** Whether to perform validation. */
  @Prop() readonly validate!: boolean

  /** The NAICS code, description or null. */
  get naicsSummary (): string {
    const naics = this.getCurrentNaics
    if (naics.naicsCode && naics.naicsDescription) {
      return `${naics.naicsCode} - ${naics.naicsDescription}`
    } else if (naics.naicsDescription) {
      return naics.naicsDescription
    }
    return null
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
