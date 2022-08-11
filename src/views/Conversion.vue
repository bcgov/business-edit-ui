<template>
  <section class="pb-10" id="conversion-view">
    <!-- Business Information page-->
    <v-slide-x-transition hide-on-leave>
      <div v-if="!isSummaryMode || !showFeeSummary">
        <header>
          <h1>Record Conversion</h1>
        </header>

        <section class="mt-6">
          You must promptly file updates to your business information. Necessary fees will be applied as updates are
          made.
        </section>

        <YourCompany class="mt-10" />

        <PeopleAndRoles class="mt-10" />
      </div>
    </v-slide-x-transition>

    <!-- Review and Confirmm page -->
    <v-slide-x-reverse-transition hide-on-leave>
      <div v-if="isSummaryMode && showFeeSummary">
        <header>
          <h1>Review and Confirm</h1>
        </header>

        <section class="mt-6">
          <p id="intro-text">
            Changes were made to your business information that require a filing. Review and certify the changes you
            are about the make to your business.
          </p>
        </section>

        <ConversionSummary
          class="mt-10"
          :validate="getAppValidate"
        />

        <CompletingParty
          class="mt-10"
          sectionNumber="1."
          :validate="getAppValidate"
        />
      </div>
    </v-slide-x-reverse-transition>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils/'
import { PeopleAndRoles, CompletingParty, YourCompany } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin } from '@/mixins/'
import { ActionBindingIF, EntitySnapshotIF } from '@/interfaces/'
import { FilingStatus } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { SoleProprietorshipResource, GeneralPartnershipResource } from '@/resources/Conversion/'
import { ConversionSummary } from '@/components/Conversion'
import { NOT_FOUND } from 'http-status-codes'

@Component({
  components: {
    ConversionSummary,
    CompletingParty,
    PeopleAndRoles,
    YourCompany
  }
})
export default class Conversion extends Mixins(
  CommonMixin,
  FeeMixin,
  FilingTemplateMixin
) {
  // Global getters
  @Getter isRoleStaff!: boolean
  @Getter isSummaryMode!: boolean
  @Getter getAppValidate!: boolean
  @Getter showFeeSummary!: boolean

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setValidCourtOrder!: ActionBindingIF
  @Action setResource!: ActionBindingIF
  @Action setCertifyStateValidity!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** The id of the conversion filing being edited. */
  get conversionId (): number {
    return +this.$route.query['conversion-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource file for a firm conversion filing. */
  get firmConversionResource (): any {
    if (this.isEntityTypeSP) return SoleProprietorshipResource
    if (this.isEntityTypeGP) return GeneralPartnershipResource
    return null
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    // bypass this when Jest is running as FF are not fetched
    if (!this.isJestRunning && !getFeatureFlag('conversion-ui-enabled')) {
      window.alert('Conversion filings are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can convert a record.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // try to fetch data
    try {
      // fetch business snapshot
      const firmSnapshot = await this.fetchFirmSnapshot()

      if (this.conversionId) {
        // store the filing ID
        this.setFilingId(this.conversionId)

        // fetch draft conversion filing to resume
        const conversionFiling = await LegalServices.fetchFilingById(this.getBusinessId, this.conversionId)

        // do not proceed if this isn't a conversion  filing
        if (!conversionFiling.conversion) {
          throw new Error('Invalid conversion filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (conversionFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid conversion status')
        }

        // parse draft conversion filing and business snapshot into store
        this.parseFirmConversionFiling(conversionFiling, firmSnapshot)
      } else {
        // parse just the business snapshot into store
        this.parseEntitySnapshot(firmSnapshot)
      }

      if (this.firmConversionResource) {
        // set the specific resource
        this.setResource(this.firmConversionResource)

        // initialize Fee Summary data
        this.setFilingData([this.firmConversionResource.filingData])
      } else {
        // go to catch()
        throw new Error(`Invalid conversion resource entity type = ${this.getEntityType}`)
      }

      // update the current fees for the Filing
      await this.setCurrentFeesFromFilingData()

      // fetches the fee prices to display in the text
      await this.setFeePricesFromFilingData()

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // since this filing type has no Certify component,
    // just set its validity to True
    this.setCertifyStateValidity(true)

    // now that all data is loaded, wait for things to stabilize and reset flag
    this.$nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches the business snapshot. */
  private async fetchFirmSnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      LegalServices.fetchBusinessInfo(this.getBusinessId),
      AuthServices.fetchAuthInfo(this.getBusinessId),
      LegalServices.fetchParties(this.getBusinessId)
    ])

    if (items.length !== 3) throw new Error('Failed to fetch entity snapshot')

    const addresses = await LegalServices.fetchAddresses(this.getBusinessId)
      .catch(reason => {
        // error message for business address has the pattern "FMXXXXXXX address not found"
        if (reason.response?.status === NOT_FOUND &&
          reason.response?.data.message.includes('address')) return { businessOffice: null }
        throw new Error('Failed to fetch entity addresses')
      })

    // WORK-AROUND WARNING !!!
    // convert orgPersons from "middleInitial" to "middleName"
    const orgPersons = items[2].map(orgPerson => {
      const middleInitial = orgPerson.officer['middleInitial']
      if (middleInitial !== undefined) {
        orgPerson.officer.middleName = middleInitial
        delete orgPerson.officer['middleInitial']
      }
      return orgPerson
    })

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses,
      orgPersons
    } as EntitySnapshotIF
  }
  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: boolean = true): void {}
}
</script>
