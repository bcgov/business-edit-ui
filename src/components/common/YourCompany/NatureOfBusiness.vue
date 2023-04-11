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
import { Action, Getter } from 'pinia-class'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NaicsServices } from '@/services/'
import { ActionBindingIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { NatureOfBusiness as NatureOfBusinessShared } from '@bcrs-shared-components/nature-of-business/'
import { CommonMixin } from '@/mixins'
import { useStore } from '@/store/store'

@Component({
  components: {
    NatureOfBusinessShared
  }
})
export default class NatureOfBusiness extends Mixins(CommonMixin) {
  /** Whether to show invalid section styling. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  readonly NaicsServices = NaicsServices

  @Getter(useStore) getCurrentNaics!: NaicsIF
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) hasNaicsChanged!: boolean
  @Getter(useStore) getSnapshotNaics!: NaicsIF

  @Action(useStore) setNaics!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF

  protected onValidChanged (valid: boolean): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: valid })
  }
}
</script>
