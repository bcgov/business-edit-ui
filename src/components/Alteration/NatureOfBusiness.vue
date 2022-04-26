<template>
  <NatureOfBusinessShared
    v-if="haveNaics"
    :showErrors="invalidSection"
    :naics="getCurrentNaics"
    :NaicsServices="NaicsServices"
    :hasNaicsChanges="hasNatureOfBusinessChanged"
    @valid="onEditingChanged($event)"
    @undoNaics="setNaics(originalNaics)"
    @setNaics="setNaics($event)"
  />
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NaicsServices } from '@/services/'
import { ActionBindingIF, BusinessInformationIF, EntitySnapshotIF, NaicsIF } from '@/interfaces/'
import { NatureOfBusinessShared } from '@/components/shared'

@Component({
  components: {
    NatureOfBusinessShared
  }
})
export default class NatureOfBusiness extends Vue {
  /** Whether to show invalid section styling. */
  @Prop({ default: false })
  readonly invalidSection!: boolean

  readonly NaicsServices = NaicsServices

  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getCurrentNaics!: NaicsIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** The naics data on record for the business. */
  get originalNaics (): NaicsIF {
    return {
      naicsCode: this.getEntitySnapshot.businessInfo.naicsCode,
      naicsDescription: this.getEntitySnapshot.businessInfo.naicsDescription
    }
  }

  get haveNaics (): boolean {
    return (!!this.getBusinessInformation.naicsCode && !!this.getBusinessInformation.naicsDescription)
  }

  onEditingChanged (event): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: event })
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
