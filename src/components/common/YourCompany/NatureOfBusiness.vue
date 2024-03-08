<template>
  <div
    id="nature-of-business"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
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
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { NaicsServices } from '@/services/'
import { ActionKvIF, FlagsCompanyInfoIF } from '@/interfaces/'
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
  readonly NaicsServices = NaicsServices

  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCurrentNaics!: NaicsIF
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) hasNaicsChanged!: boolean
  @Getter(useStore) getSnapshotNaics!: NaicsIF

  @Action(useStore) setNaics!: (x: NaicsIF) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidNatureOfBusiness)
  }

  onValidChanged (valid: boolean): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: valid })
  }
}
</script>
