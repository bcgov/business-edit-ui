<template>
  <div id="nature-of-business-shared">
    <NatureOfBusinessShared
      v-if="haveNaics"
      :showErrors="invalidSection"
      :naics="getCurrentNaics"
      :NaicsServices="NaicsServices"
      :hasNaicsChanges="hasNatureOfBusinessChanged"
      :class="{'invalidSection': invalidSection}"
      @valid="onEditingChanged($event)"
      @undoNaics="setNaics(originalNaics)"
      @setNaics="setNaics($event)"
    />
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NaicsServices } from '@/services'
import { ActionBindingIF, BusinessInformationIF, EntitySnapshotIF, NaicsIF } from '@/interfaces'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business'

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
  .invalidSection .col-sm-3:first-child label {
    color: $app-red !important;
  }

  .v-input .v-label {
    font-weight: normal;
  }

  #nob-change-btn {
    padding-right: 2px;
  }

  #nob-more-actions {
   margin-right: -14px;
  }
}
</style>
