<template>
  <NatureOfBusinessShared
    :showErrors="invalidSection"
    :naics="getCurrentNaics"
    :NaicsServices="NaicsServices"
    :hasNaicsChanges="hasNaicsChanged"
    :editLabel="getEditLabel"
    :editedLabel="getEditedLabel"
    @valid="onValidChanged($event)"
    @undoNaics="setNaics(getSnapshotNaics)"
    @setNaics="setNaics($event)"
  />
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NaicsServices } from '@/services/'
import { ActionBindingIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business/'
import { CommonMixin } from '@/mixins'

@Component({
  components: {
    NatureOfBusinessShared
  }
})
export default class NatureOfBusiness extends Mixins(CommonMixin) {
  /** Whether to show invalid section styling. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  readonly NaicsServices = NaicsServices

  @Getter getCurrentNaics!: NaicsIF
  @Getter getEditLabel!: string
  @Getter getEditedLabel!: string
  @Getter hasNaicsChanged!: boolean
  @Getter getSnapshotNaics!: NaicsIF

  @Action setNaics!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  protected onValidChanged (valid: boolean): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: valid })
  }
}
</script>
