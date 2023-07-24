<template v-if="hasBusinessTypeChanged">
  <div>
    <v-divider class="mx-4" />
    <div class="section-container business-type-summary">
      <v-row no-gutters>
        <v-col cols="3">
          <label><strong>Business Type</strong></label>
        </v-col>

        <v-col cols="8">
          <span class="info-text">
            Changing from a {{ GetCorpFullDescription(originalLegalType) }} to a
            {{ GetCorpFullDescription(getEntityType) }}
          </span>

          <div>
            <p class="subtitle mt-2 pt-2">
              {{ articleTitle }}
            </p>
            <div class="confirmed-msg">
              <v-icon
                color="success"
                class="confirmed-icon"
              >
                mdi-check
              </v-icon>
              <span class="info-text text-body-3 confirmed-icon ml-2">
                {{ articleInfo }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { FilingTemplateMixin } from '@/mixins'
import { Component, Mixins } from 'vue-property-decorator'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ResourceUtilities } from '@/utils/resource-utils'

@Component({})
export default class BusinessType extends Mixins(FilingTemplateMixin) {
  readonly GetCorpFullDescription = GetCorpFullDescription // for template

  @Getter(useStore) isBenefitCompany!: boolean
  @Getter(useStore) isBcCcc!: boolean
  @Getter(useStore) isBcCompany!: boolean
  @Getter(useStore) isBcUlcCompany!: boolean

  get originalLegalType (): CorpTypeCd {
    return this.getEntitySnapshot?.businessInfo?.legalType
  }

  get articleInfo (): string {
    return ResourceUtilities.articleInfo(this.getEntityType)
  }

  get articleTitle (): string {
    return ResourceUtilities.articleTitle(this.getEntityType)
  }
}
</script>
