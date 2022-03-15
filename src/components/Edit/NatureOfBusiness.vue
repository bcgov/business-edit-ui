<template>
  <div id="nature-of-business-info">
    <NatureOfBusinessShared
      v-if="haveNaics"
      :showErrors="false"
      :naics="getCurrentNaics"
      :NaicsServices="NaicsServices"
      :hasNaicsChanges="hasNatureOfBusinessChanged"
      @undoNaics="setNaics(originalNaics)"
      @setNaics="setNaics($event)"
    />
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue } from 'vue-property-decorator'
import { NaicsServices } from '@/services'
import { ActionBindingIF, BusinessInformationIF, EntitySnapshotIF, NaicsIF } from '@/interfaces'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business'

@Component({
  components: {
    NatureOfBusinessShared
  }
})
export default class NatureOfBusiness extends Vue {
  private NaicsServices = NaicsServices

  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getCurrentNaics!: NaicsIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF

  /** The naics data on record for the business. */
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
