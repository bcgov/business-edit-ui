<template>
  <div id="nature-of-business-info">
    <NatureOfBusiness
      v-if="haveNaics"
      :showErrors="false"
      :naics="currentNaics"
      :naics-services="naicsServices"
      :hasNaicsChanges="hasNatureOfBusinessChanged"
      @undoNaics="setNaics(originalNaics)"
      @setNaics="setNaics($event)"
    />
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import { NatureOfBusiness } from '@bcrs-shared-components/nature-of-business'
import { NaicsServices } from '@/services'
import { ActionIF, BusinessInformationIF, EntitySnapshotIF, NaicsIF } from '@/interfaces'

@Component({
  components: {
    NatureOfBusiness
  }
})
export default class NatureOfBusinessInfo extends Vue {
  private naicsServices = NaicsServices

  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionIF

  private get currentNaics (): NaicsIF {
    return {
      naicsCode: this.getBusinessInformation.naicsCode,
      naicsDescription: this.getBusinessInformation.naicsDescription
    }
  }

  private get originalNaics (): NaicsIF {
    return {
      naicsCode: this.getEntitySnapshot.businessInfo.naicsCode,
      naicsDescription: this.getEntitySnapshot.businessInfo.naicsDescription
    }
  }

  private get haveNaics (): boolean {
    return (!!this.getBusinessInformation.naicsCode && !!this.getBusinessInformation.naicsDescription)
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

::v-deep {
  #nob-change-btn {
    padding-right: 2px;
  }

  #nob-more-actions {
   margin-right: -14px;
  }
}
</style>
