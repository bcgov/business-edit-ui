<template>
  <v-card flat id="restoration-summary">
    <!-- Business Name -->
    <template v-if="hasBusinessNameChanged">
      <v-divider class="mx-4" />
      <div class="section-container business-name-summary">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Company Name</strong></label>
          </v-col>

          <v-col cols="8" class="mt-n1">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>
            <div class="company-name mt-2">{{ getNameRequestNumber }}</div>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Name Translation -->
    <template v-if="haveNameTranslationsChanged">
      <v-divider class="mx-4" />
      <div class="name-translation-summary">
        <NameTranslation :isSummaryMode="true" />
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { FeesIF } from '@/interfaces/'
import { DateMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { NameTranslation } from '@/components/common/'
import { useStore } from '@/store/store'

@Component({
  components: {
    NameTranslation
  },
  mixins: [DateMixin, FeeMixin, FilingTemplateMixin]
})
export default class RestorationSummary extends Vue {
  // Global getters
  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) getCurrentFees!: FeesIF[]
  @Getter(useStore) getNameRequestLegalName!: string
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) hasBusinessNameChanged!: boolean
  @Getter(useStore) haveNameTranslationsChanged!: boolean
  @Getter(useStore) isBusySaving!: boolean

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

.company-name {
  font-size: 1.5rem;
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

#effective-date-text {
  color: $gray7;
}

// hide first v-divider
.v-divider:first-of-type {
  display: none;
}
</style>
