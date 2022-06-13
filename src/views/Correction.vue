<template>
  <div>
    <BenCorrection
      v-if="isTypeBcomp"
      :correctionFiling="correctionFiling"
      @fetchError="emitFetchError($event)"
      @haveData="emitHaveData($event)"
    />
    <FmCorrection
      v-if="isTypeFirm"
      :correctionFiling="correctionFiling"
      @fetchError="emitFetchError($event)"
      @haveData="emitHaveData($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils/'
import { CommonMixin, LegalApiMixin } from '@/mixins/'
import { ActionBindingIF, CorrectionFilingIF } from '@/interfaces/'
import { FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import BenCorrection from '@/views/Correction/BenCorrection.vue'
import FmCorrection from '@/views/Correction/FmCorrection.vue'

@Component({
  components: {
    BenCorrection,
    FmCorrection
  }
})
export default class Correction extends Mixins(CommonMixin, LegalApiMixin) {
  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  // Global getters
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isTypeFirm!: boolean

  // Global actions
  @Action setFilingId!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF

  protected correctionFiling: CorrectionFilingIF = null

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

    // do not proceed if FF is disabled
    // bypass this when Jest is running as FF are not fetched
    if (!this.isJestRunning && !getFeatureFlag('correction-ui-enabled')) {
      window.alert('Corrections are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can correct an Incorporation Application.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // do not proceed if we don't have the necessary query param
    if (!this.correctionId) {
      throw new Error('Invalid correction filing ID')
    }

    // fetch the correction filing
    try {
      // store the filing ID
      this.setFilingId(this.correctionId)

      // fetch draft correction to resume
      const filing = await this.fetchFilingById(this.correctionId) as CorrectionFilingIF

      // do not proceed if this isn't a CORRECTION filing
      if (!filing.correction) {
        throw new Error('Invalid correction filing')
      }

      // do not proceed if this isn't a BEN or SP/GP correction
      this.setEntityType(filing.business?.legalType)
      if (!this.isTypeBcomp && !this.isTypeFirm) {
        throw new Error('Invalid correction type')
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
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: Boolean = true): void {}
}
</script>
