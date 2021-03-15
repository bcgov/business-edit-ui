<template>
  <v-card flat>
     <div class="define-company-header">
        <v-icon>mdi-domain</v-icon>
        <label class="define-company-title"><strong>Your Company</strong></label>
    </div>

    <div v-if="!isDefineCompanyStepValid && !isSummary" class="defineCompanyStepErrorMessage">
      <span>
        <v-icon color="blue darken-2">mdi-information-outline</v-icon>
        This step is not complete.
        <router-link :to="{ path: '/define-company', query: { showErrors: true } }">
          Return to this step to complete it.
        </router-link>
      </span>
    </div>

    <div class="section-container">
      <!--TODO: Replace container content with Name Request Summary when it is ready -->
      <v-layout row>
        <v-flex md4>
          <label><strong>Company Name</strong></label>
        </v-flex>
        <v-flex md8>
          <div class="company-name">{{ companyName }}</div>
          <div class="company-type">
            <span v-if="entityFilter(EntityTypes.BENEFIT_COMPANY)">BC Benefit Company</span>
            <span v-else-if="entityFilter(EntityTypes.COOP)">BC Cooperative Association</span>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
        <v-flex md4>
          <label><strong>Name Translation</strong></label>
        </v-flex>
        <v-flex md8>
          <div v-for="(name, index) in getNameTranslations" :key="`name_translation_${index}`">{{name}}</div>
        </v-flex>
      </v-layout>
    </div>

    <v-divider />

    <div class="section-container">
      <OfficeAddresses :inputAddresses="getOfficeAddresses" :isEditing="false" />
    </div>

    <v-divider />

    <div class="section-container">
      <BusinessContactInfo :initialValue="getBusinessContact" :isEditing="false" />
    </div>

    <div class="section-container" v-if="isPremiumAccount">
      <FolioNumber :initialValue="getFolioNumber" :isEditing="false" />
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces
import { GetterIF } from '@/interfaces'

// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'

// Components
import { FolioNumber, BusinessContactInfo, OfficeAddresses } from '@/components/YourCompany'
import { CorrectNameOptions } from '@/components/YourCompany/CompanyName'

// Mixins
import { CommonMixin } from '@/mixins'

// Enums
import { EntityTypes } from '@/enums'

@Component({
  components: {
    BusinessContactInfo,
    CorrectNameOptions,
    OfficeAddresses,
    FolioNumber
  }
})
export default class SummaryDefineCompany extends Mixins(CommonMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter isPremiumAccount!: GetterIF
  @Getter getNameTranslations!: Array<string>
  @Getter getOfficeAddresses!: any
  @Getter getFolioNumber!: string
  @Getter isDefineCompanyStepValid!: boolean
  @Getter getBusinessContact!: ContactPointIF

  @Prop({ default: false })
  private isSummary: boolean

  // Entity Enum
  readonly EntityTypes = EntityTypes

  /** The company name (from NR, or incorporation number). */
  private get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  font-weight: bold;
  color: $primary-blue;
}

.define-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-company-title {
 padding-left: 0.5rem;
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold
}

.company-type {
  padding-top: 0.5rem
}
</style>
