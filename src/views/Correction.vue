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
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { GetFeatureFlag, IsAuthorized } from '@/utils/'
import { CommonMixin } from '@/mixins/'
import { LegalServices } from '@/services/'
import { CorrectionFilingIF } from '@/interfaces/'
import { AuthorizedActions, FilingStatus, FilingTypes } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import CoopCorrection from '@/views/Correction/CoopCorrection.vue'
import CorpCorrection from '@/views/Correction/CorpCorrection.vue'
import FirmCorrection from '@/views/Correction/FirmCorrection.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { useStore } from '@/store/store'

@Component({
  components: {
    ViewWrapper,
    CoopCorrection,
    CorpCorrection,
    FirmCorrection
  }
})
export default class Correction extends Mixins(CommonMixin) {
  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  // Store getters
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) isEntityCoop!: boolean
  @Getter(useStore) isEntityCorp!: boolean
  @Getter(useStore) isEntityFirm!: boolean

  // Store actions
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void

  correctionFiling = null as CorrectionFilingIF

  /** The dynamic component to render. */
  get component (): string {
    if (this.isEntityCoop) return 'CoopCorrection'
    if (this.isEntityCorp) return 'CorpCorrection'
    if (this.isEntityFirm) return 'FirmCorrection'
    return null // should never happen
  }

  /** Whether user is authorized to use this correction filing. */
  get isAuthorized (): boolean {
    if (this.isEntityCoop) return IsAuthorized(AuthorizedActions.COOP_CORRECTION_FILING)
    if (this.isEntityCorp) return IsAuthorized(AuthorizedActions.CORP_CORRECTION_FILING)
    if (this.isEntityFirm) return IsAuthorized(AuthorizedActions.FIRM_CORRECTION_FILING)
    return false // should never happen
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

      // do not proceed if this isn't a DRAFT filing
      if (filing.header?.status !== FilingStatus.DRAFT) {
        throw new Error('Invalid correction status')
      }

      // set entity type for misc functionality to work
      this.setEntityType(filing.business?.legalType || null)

      // do not proceed if this isn't a base company / firm / coop correction
      if (!this.isEntityCorp && !this.isEntityFirm && !this.isEntityCoop) {
        throw new Error('Invalid correction type')
      }

      // do not proceed if not authorized
      if (!this.isAuthorized) {
        window.alert('You are not authorized to use Correction filings.')
        this.$root.$emit('go-to-dashboard', true)
        return
      }

      // do not process if FF doesn't include this entity type
      if (!GetFeatureFlag('supported-correction-entities')?.includes(this.getEntityType)) {
        window.alert('Corrections for this entity type are not available at the moment.\n' +
          'Please check again later.')
        this.$root.$emit('go-to-dashboard', true)
        return
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
  emitFetchError (err = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitHaveData (haveData = true): void {}
}
</script>
