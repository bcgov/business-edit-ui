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
import { Component, Vue } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { NaicsServices } from '@/services/'
import { ActionBindingIF, FlagsCompanyInfoIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { NatureOfBusiness as NatureOfBusinessShared } from '@/bcrs-shared-components/nature-of-business/'
import { CommonMixin } from '@/mixins'
import { useStore } from '@/store/store'

@Component({
  components: {
    NatureOfBusinessShared
  },
  mixins: [CommonMixin]
})
export default class NatureOfBusiness extends Vue {
  readonly NaicsServices = NaicsServices

  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCurrentNaics!: NaicsIF
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) hasNaicsChanged!: boolean
  @Getter(useStore) getSnapshotNaics!: NaicsIF

  @Action(useStore) setNaics!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidNatureOfBusiness)
  }

  protected onValidChanged (valid: boolean): void {
    this.setValidComponent({ key: 'isValidNatureOfBusiness', value: valid })
  }
}
</script>
