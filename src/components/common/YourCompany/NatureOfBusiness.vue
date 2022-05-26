<template>
  <NatureOfBusinessShared
    v-if="haveNaics"
    :showErrors="invalidSection"
    :naics="naics"
    :NaicsServices="NaicsServices"
    :hasNaicsChanges="hasNatureOfBusinessChanged"
    @valid="onEditingChanged($event)"
    @undoNaics="setNaics(getSnapshotNaics)"
    @setNaics="setNaics($event)"
  />
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NaicsServices } from '@/services/'
import { ActionBindingIF, BusinessInformationIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business/'

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
  @Getter getSnapshotNaics!: NaicsIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  get naics (): NaicsIF {
    return {
      naicsCode: this.getCurrentNaics.naicsCode || '000000', // fallback so component doesn't break
      naicsDescription: this.getCurrentNaics.naicsDescription
    }
  }

  get haveNaics (): boolean {
    return (this.getBusinessInformation.naicsCode !== undefined &&
      this.getBusinessInformation.naicsDescription !== undefined)
  }

  protected onEditingChanged (event): void {
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
