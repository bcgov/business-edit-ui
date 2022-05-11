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

        <ChangeSummary
          class="mt-10"
          :validate="getAppValidate"
        />

        <DocumentsDelivery
          class="mt-10"
          sectionNumber="1."
          :validate="getAppValidate"
          @valid="setDocumentOptionalEmailValidity($event)"
        />

        <CompletingParty
          class="mt-10"
          sectionNumber="2."
          :validate="getAppValidate"
        />

        <CertifySection
          class="mt-10"
          sectionNumber="3."
          :validate="getAppValidate"
        />
      </div>
    </v-slide-x-reverse-transition>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getFeatureFlag } from '@/utils/'
import { ChangeSummary, DocumentsDelivery, TransactionalFolioNumber } from '@/components/Alteration/'
import CompletingParty from '@/components/Change/CompletingParty.vue'
import { CertifySection, PeopleAndRoles, StaffPayment, YourCompany } from '@/components/common/'
import { AuthServices } from '@/services/'
import { CommonMixin, FilingTemplateMixin, LegalApiMixin, PayApiMixin } from '@/mixins/'
import { ActionBindingIF, EmptyFees, EntitySnapshotIF, FilingDataIF } from '@/interfaces/'
import { FilingCodes, FilingStatus, OrgPersonTypes } from '@/enums/'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'
import { cloneDeep } from 'lodash'
import { SoleProprietorshipResource, GeneralPartnershipResource } from '@/resources/Conversion/'

@Component({
  components: {
    CertifySection,
    ChangeSummary,
    CompletingParty,
    DocumentsDelivery,
    PeopleAndRoles,
    StaffPayment,
    TransactionalFolioNumber,
    YourCompany
  }
})
export default class Conversion extends Mixins(
  CommonMixin,
  LegalApiMixin,
  FilingTemplateMixin,
  PayApiMixin
) {
  // Global getters
  @Getter isSummaryMode!: boolean
  @Getter getFilingData!: FilingDataIF
  @Getter getAppValidate!: boolean
  @Getter showFeeSummary!: boolean
  @Getter isTypeSoleProp!: boolean
  @Getter isTypePartnership!: boolean

  // Global actions
  @Action setHaveUnsavedChanges!: ActionBindingIF
  @Action setFilingData!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF
  @Action setValidCourtOrder!: ActionBindingIF
  @Action setCurrentFees!: ActionBindingIF
  @Action setFeePrices!: ActionBindingIF
  @Action setResource!: ActionBindingIF

  /** Whether App is ready. */
  @Prop({ default: false })
  readonly appReady: boolean

  /** The id of the conversion filing being edited. */
  get changeId (): number {
    return +this.$route.query['change-id'] || 0
  }

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource file for a firm conversion filing. */
  get firmConversionResource (): any {
    if (this.isTypeSoleProp) return SoleProprietorshipResource
    if (this.isTypePartnership) return GeneralPartnershipResource
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
      this.$root.$emit('go-to-dashboard')
      return
    }

    // try to fetch data
    try {
      const firmSnapshot = await this.fetchFirmSnapshot()

      if (this.changeId) {
        // store the filing ID
        this.setFilingId(this.changeId)

        // fetch draft conversion filing to resume
        const changeFiling = await this.fetchFilingById(this.changeId)

        // do not proceed if this isn't a conversion  filing
        if (!changeFiling.conversion) {
          throw new Error('Invalid conversion filing')
        }

        // do not proceed if this isn't a DRAFT filing
        if (changeFiling.header.status !== FilingStatus.DRAFT) {
          throw new Error('Invalid conversion status')
        }

        // parse firm conversion filing and original business snapshot into store
        await this.parseFirmConversion(changeFiling, firmSnapshot)
      } else {
        // parse business data into store
        await this.parseEntitySnapshot(firmSnapshot)
      }

      if (this.firmConversionResource) {
        // set the specific resource
        this.setResource(this.firmConversionResource)

        // initialize Fee Summary data
        this.setFilingData(this.firmConversionResource.filingData)
      } else {
        // go to catch()
        throw new Error(`Invalid conversion resource entity type = ${this.getEntityType}`)
      }

      // update the current fees for the Filing
      this.setCurrentFees(
        await this.fetchFilingFees(
          FilingCodes.CONVERSION, this.getEntityType
        ).catch(() => cloneDeep(EmptyFees))
      )

      // fetches the fee prices to display in the text
      this.setFeePrices(
        await this.fetchFilingFees(
          FilingCodes.CONVERSION, this.getEntityType
        ).catch(() => cloneDeep(EmptyFees))
      )

      // tell App that we're finished loading
      this.emitHaveData()
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    Vue.nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /** Fetches the business snapshot. */
  private async fetchFirmSnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      this.fetchBusinessInfo(),
      AuthServices.fetchAuthInfo(this.getBusinessId),
      this.fetchAddresses(),
      this.fetchOrgPersons(OrgPersonTypes.PARTIES)
    ])

    if (items.length !== 4) throw new Error('Failed to fetch entity snapshot')

    // WORK-AROUND WARNING !!!
    // convert orgPersons from "middleInitial" to "middleName"
    const orgPersons = items[3].map(orgPerson => {
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
      addresses: items[2],
      orgPersons
    }
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  private emitHaveData (haveData: boolean = true): void {}
}
</script>
