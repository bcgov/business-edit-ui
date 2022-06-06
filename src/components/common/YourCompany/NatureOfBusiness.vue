<template>
  <NatureOfBusinessShared
    :showErrors="invalidSection"
    :naics="getCurrentNaics"
    :NaicsServices="NaicsServices"
    :hasNaicsChanges="hasNatureOfBusinessChanged"
    @valid="onValidChanged($event)"
    @undoNaics="setNaics(getSnapshotNaics)"
    @setNaics="setNaics($event)"
  />
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NaicsServices } from '@/services/'
import { ActionBindingIF } from '@/interfaces/'
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
  readonly invalidSection: boolean

  readonly NaicsServices = NaicsServices

  @Getter getCurrentNaics!: NaicsIF
  @Getter getSnapshotNaics!: NaicsIF
  @Getter hasNatureOfBusinessChanged!: boolean

  @Action setNaics!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  protected onValidChanged (valid: boolean): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: valid })
  }
}
</script>
