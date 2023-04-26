<template>
  <ViewWrapper>
    <component
      :is="component"
      :correctionFiling="correctionFiling"
      @fetchError="emitFetchError($event)"
      @haveData="emitHaveData($event)"
    />
  </ViewWrapper>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { GetFeatureFlag } from '@/utils/'
import { CommonMixin } from '@/mixins/'
import { LegalServices } from '@/services/'
import { ActionBindingIF, CorrectionFilingIF } from '@/interfaces/'
import { FilingStatus, FilingTypes } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import CorpCorrection from '@/views/Correction/CorpCorrection.vue'
import FirmCorrection from '@/views/Correction/FirmCorrection.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { useStore } from '@/store/store'

@Component({
  components: {
    ViewWrapper,
    CorpCorrection,
    FirmCorrection
  },
  mixins: [CommonMixin]
})
export default class Correction extends Vue {
  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  // Global getters
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isBenBcCccUlc!: boolean
  @Getter(useStore) isFirm!: boolean

  // Global actions
  @Action(useStore) setFilingId!: ActionBindingIF
  @Action(useStore) setEntityType!: ActionBindingIF

  correctionFiling = null as CorrectionFilingIF

  /** The dynamic component to render. */
  get component (): string {
    if (this.isBenBcCccUlc) return 'CorpCorrection'
    if (this.isFirm) return 'FirmCorrection'
    return null // should never happen
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The id of the correction being edited. */
  get correctionId (): number {
    return +this.$route.query['correction-id'] || 0
  }

  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can correct a filing.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // fetch the correction filing
    try {
      // do not proceed if we don't have the necessary query param
      if (!this.correctionId) {
        throw new Error('Invalid correction filing ID')
      }

      // store the filing ID
      this.setFilingId(this.correctionId)

      // fetch draft correction to resume
      const filing =
        await LegalServices.fetchFilingById(this.getBusinessId, this.correctionId) as CorrectionFilingIF

      // do not proceed if header object is missing
      // or this isn't a correction filing
      if (!filing.header || (filing.header?.name !== FilingTypes.CORRECTION)) {
        throw new Error('Invalid header info')
      }

      // do not proceed if business object is missing
      if (!filing.business) {
        throw new Error('Invalid business info')
      }

      // do not proceed if correction object is missing
      if (!filing.correction) {
        throw new Error('Invalid correction info')
      }

      // set entity type for misc functionality to work
      // do not proceed if this isn't a BC or firm correction
      this.setEntityType(filing.business?.legalType)
      if (!this.isBenBcCccUlc && !this.isFirm) {
        throw new Error('Invalid correction type')
      }

      // NB: specific entities are targeted via LaunchDarkly
      if (!GetFeatureFlag('supported-correction-entities')?.includes(this.getEntityType)) {
        window.alert('Corrections for this entity type are not available at the moment.\n' +
          'Please check again later.')
        this.$root.$emit('go-to-dashboard', true)
        return
      }

      // do not proceed if this isn't a DRAFT filing
      if (filing.header?.status !== FilingStatus.DRAFT) {
        throw new Error('Invalid correction status')
      }

      // assign prop to trigger sub-components
      this.correctionFiling = filing
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitHaveData (haveData = true): void {}
}
</script>
