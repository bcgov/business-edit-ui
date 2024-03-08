<template>
  <div v-if="hasBusinessTypeChanged">
    <v-divider class="mx-4" />
    <div class="section-container business-type-summary">
      <v-row no-gutters>
        <v-col cols="3">
          <label><strong>Business Type</strong></label>
        </v-col>

        <v-col cols="8">
          <span class="info-text">
            Changing from a {{ GetCorpFullDescription(getOriginalLegalType) }} to a
            {{ GetCorpFullDescription(getEntityType) }}
          </span>

          <div>
            <p class="subtitle mt-2 pt-2">
              {{ articleTitle }}
            </p>
            <div class="confirmed-msg d-flex">
              <v-icon
                color="success"
                class="confirmed-icon d-block"
              >
                mdi-check
              </v-icon>
              <span class="info-text text-body-3 confirmed-icon ml-2 d-block">
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
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceUtilities } from '@/utils/resource-utils'

@Component({})
export default class BusinessType extends Mixins(FilingTemplateMixin) {
  readonly GetCorpFullDescription = GetCorpFullDescription // for template

  get articleInfo (): string {
    return ResourceUtilities.articleInfo(this.getEntityType)
  }

  get articleTitle (): string {
    return ResourceUtilities.articleTitle(this.getEntityType)
  }
}
</script>

<style lang="scss" scoped>
// hide first v-divider
.v-divider:first-of-type {
  display: none;
}
</style>
