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
      <!-- TODO: Replace container content with Name Request Summary when it is ready -->
      <v-layout row>
        <v-flex md4>
          <label><strong>Company Name</strong></label>
        </v-flex>
        <v-flex md8>
          <div class="company-name">{{ companyName }}</div>
          <div class="company-type">{{ getCorpTypeDescription(getEntityType) }}</div>
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
      <OfficeAddresses />
    </div>

    <v-divider />

    <div class="section-container">
      <BusinessContactInfo />
    </div>

    <div class="section-container" v-if="isPremiumAccount">
      <FolioInformation />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { BusinessContactInfo, CorrectNameOptions, FolioInformation, OfficeAddresses } from '@/components/common/'
import { CommonMixin } from '@/mixins/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

@Component({
  components: {
    BusinessContactInfo,
    CorrectNameOptions,
    OfficeAddresses,
    FolioInformation
  }
})
export default class SummaryDefineCompany extends Mixins(CommonMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter isPremiumAccount!: boolean
  @Getter getNameTranslations!: Array<string>
  @Getter isDefineCompanyStepValid!: boolean

  @Prop({ default: false })
  readonly isSummary: boolean

  // declaration for template
  readonly CorpTypeCd = CorpTypeCd

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
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
