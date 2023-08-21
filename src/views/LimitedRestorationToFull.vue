<template>
  <ViewWrapper v-if="isDataLoaded">
    <section
      id="limited-restoration-full"
      class="pb-10"
    >
      <!-- Company Information page-->
      <v-slide-x-transition hide-on-leave>
        <div
          v-if="!isSummaryMode"
          id="question_container"
        >
          <header>
            <h1>Conversion to Full Restoration</h1>
          </header>

          <QuestionWrapper
            id="applicant-relationship"
            title="Applicant Relationship"
            subtitle="Please select applicant's relationship to the company at the time the company was dissolved:"
          >
            <RelationshipsPanel
              class="pl-5 pt-1"
              :draft-relationships="getRelationships"
              :show-validation-errors="getComponentValidate"
              @changed="setRestorationRelationships($event)"
              @valid="setValidComponent({ key: 'isValidRelationship', value: $event })"
            />
          </QuestionWrapper>

          <QuestionWrapper
            id="applicant-information"
            title="Applicant Information"
          >
            <PeopleAndRoles />
          </QuestionWrapper>

          <QuestionWrapper
            id="approval-type"
            title="Approval Type"
          >
            <ApprovalType
              class="white-background px-9 py-4 mt-4"
              :courtOrderNumber="getCourtOrderNumberText"
              :approvedByRegistrar="isApprovedByRegistrar"
              :isCourtOrderOnly="isCourtOrderOnly"
              :isCourtOrderRadio="showCourtOrderRadio"
              :invalidSection="!getApprovalTypeValid"
              @courtNumberChange="setRestorationCourtOrder({ 'fileNumber': $event })"
              @valid="setValidComponent({ key: 'isValidApprovalType', value: $event })"
            />
          </QuestionWrapper>

          <YourCompanyWrapper class="mt-10">
            <div>
              <EntityName />
              <NameTranslation />
            </div>
            <RecognitionDateTime />
            <OfficeAddresses />
            <BusinessContactInfo />
            <FolioInformation />
          </YourCompanyWrapper>
        </div>
      </v-slide-x-transition>

      <!-- Review and Certify page -->
      <v-slide-x-reverse-transition hide-on-leave>
        <div v-if="isSummaryMode && showFeeSummary">
          <header>
            <h1>Review and Certify</h1>
          </header>

          <div class="document-info py-4">
            Review and certify the information in your application. If you need to change or complete anything,
            return to the previous step to make the necessary change.
          </div>

          <!-- Applicant list -->
          <v-card
            id="people-and-roles-vcard"
            flat
            class="mt-6"
          >
            <!-- Header -->
            <div class="section-container header-container">
              <v-icon color="appDkBlue">
                mdi-account-multiple-plus
              </v-icon>
              <label class="font-weight-bold pl-2">{{ orgPersonLabel }} Information</label>
            </div>
            <div
              no-gutters
              class="mt-4 section-container"
            >
              <ListPeopleAndRoles
                :isSummaryView="true"
                :showDeliveryAddressColumn="false"
                :showRolesColumn="false"
                :showEmailColumn="true"
              />
            </div>
          </v-card>

          <YourCompanySummary class="mt-10" />

          <DocumentsDelivery
            class="mt-10"
            sectionNumber="1."
            :validate="getAppValidate"
            :userEmailOptional="userEmailOptional"
            :userAltEmail="applicantEmail"
            @valid="setDocumentOptionalEmailValidity($event)"
          />

          <CertifySection
            class="mt-10"
            sectionNumber="2."
            :validate="getAppValidate"
          />

          <StaffPayment
            class="mt-10"
            sectionNumber="3."
            @haveChanges="onStaffPaymentChanges()"
          />
        </div>
      </v-slide-x-reverse-transition>
    </section>
  </ViewWrapper>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
import { GetFeatureFlag } from '@/utils/'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import { BusinessContactInfo, CertifySection, CourtOrderPoa, DocumentsDelivery, EntityName,
  FolioInformation, ListPeopleAndRoles, NameTranslation, OfficeAddresses, PeopleAndRoles,
  QuestionWrapper, RecognitionDateTime, StaffPayment, YourCompanyWrapper } from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin, OrgPersonMixin } from '@/mixins/'
import {
  ActionKvIF,
  EntitySnapshotIF,
  OrgPersonIF,
  ResourceIF,
  RestorationFilingIF
} from '@/interfaces/'
import { BcRestorationResource, BenRestorationResource, CccRestorationResource, UlcRestorationResource }
  from '@/resources/LimitedRestorationToFull/'
import { ApprovalTypes, FilingStatus, RoleTypes } from '@/enums/'
import { RelationshipTypes } from '@bcrs-shared-components/enums'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import { ApprovalType } from '@bcrs-shared-components/approval-type'
import { FeeSummary as FeeSummaryShared } from '@bcrs-shared-components/fee-summary/'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { useStore } from '@/store/store'

@Component({
  components: {
    ApprovalType,
    BusinessContactInfo,
    CertifySection,
    CourtOrderPoa,
    DocumentsDelivery,
    EntityName,
    FeeSummaryShared,
    FolioInformation,
    ListPeopleAndRoles,
    NameTranslation,
    OfficeAddresses,
    PeopleAndRoles,
    QuestionWrapper,
    RecognitionDateTime,
    RelationshipsPanel,
    RestorationSummary,
    StaffPayment,
    ViewWrapper,
    YourCompanySummary,
    YourCompanyWrapper
  }
})
export default class LimitedRestorationToFull extends Mixins(
  CommonMixin,
  FeeMixin,
  FilingTemplateMixin,
  OrgPersonMixin
) {
  // Global getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getApprovalTypeValid!: boolean
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getCourtOrderNumberText!: string
  @Getter(useStore) getRelationships!: RelationshipTypes[]
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) isBcCcc!: boolean
  @Getter(useStore) isBcCompany!: boolean
  @Getter(useStore) isBcUlcCompany!: boolean
  @Getter(useStore) isBenefitCompany!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Global actions
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setResource!: (x: ResourceIF) => void
  @Action(useStore) setStateFilingRestoration!: (x: Promise<any>) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** The restoration filing ID. */
  @Prop({ default: 0 }) readonly restorationId!: number

  /**
   * "isDataLoaded" is a flag that is to "true" after all data is loaded.
   * This is to prevent using the state filing restoration before it's fetched.
   */
  isDataLoaded = false

  /** The resource object for a restoration filing. */
  get restorationResource (): ResourceIF {
    switch (true) {
      case this.isBcCompany: return BcRestorationResource
      case this.isBenefitCompany: return BenRestorationResource
      case this.isBcCcc: return CccRestorationResource
      case this.isBcUlcCompany: return UlcRestorationResource
    }
    return null // should never happen
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if FF is disabled
    // bypass this when Vitest is running as FF are not fetched
    if (!this.isVitestRunning && !GetFeatureFlag('restoration-ui-enabled')) {
      window.alert('Restorations are not available at the moment. Please check again later.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      window.alert('Only staff can extend or convert a limited restoration.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // fetch the restoration filing
    try {
      // do not proceed if we don't have the necessary query param
      if (!this.restorationId) {
        throw new Error('Invalid restoration filing ID')
      }

      // store the filing ID
      this.setFilingId(this.restorationId)

      // fetch draft restoration to resume
      const restorationFiling =
        await LegalServices.fetchFilingById(this.getBusinessId, this.restorationId) as RestorationFilingIF

      // do not proceed if this isn't a RESTORATION filing
      if (!restorationFiling.restoration) {
        throw new Error('Invalid Restoration filing')
      }

      // do not proceed if this isn't a DRAFT filing
      if (restorationFiling.header?.status !== FilingStatus.DRAFT) {
        throw new Error('Invalid Restoration status')
      }

      // fetch entity snapshot
      const entitySnapshot = await this.fetchEntitySnapshot()
      const stateFiling = entitySnapshot.businessInfo.stateFiling
      const filing = stateFiling && await LegalServices.fetchFiling(stateFiling)

      if (!filing) {
        throw new Error(`Invalid fetched stateFiling = ${this.getBusinessId}`)
      }

      // get applicant from state filing and set into orgPersons
      const applicant = this.getApplicant(filing) // throws error if not found
      entitySnapshot.orgPersons = [applicant]

      this.setEntitySnapshot(entitySnapshot)

      // parse draft restoration filing into store
      this.parseRestorationFiling(restorationFiling)

      // set the previously filed limited restoration in the store
      // (will throw on error)
      await this.setStateFilingRestoration()

      if (!this.restorationResource) {
        throw new Error(`Invalid restoration resource entity type = ${this.getEntityType}`)
      }

      // set the specific resource
      this.setResource(this.restorationResource)

      // initialize Fee Summary data
      this.setFilingData([this.restorationResource.filingData])

      // update the current fees for this filing
      await this.setCurrentFeesFromFilingData()

      // update the fee prices for the notice changes
      await this.setFeePricesFromFilingData(true)

      // tell App that we're finished loading
      this.emitHaveData()
      this.isDataLoaded = true
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // now that all data is loaded, wait for things to stabilize and reset flag
    this.$nextTick(() => this.setHaveUnsavedChanges(false))
  }

  /**
   * Gets applicant from restoration filing parties and returns a new object.
   * @param filing the restoration state filing
   * @returns a new applicant object
   */
  private getApplicant (filing: RestorationFilingIF): OrgPersonIF {
    const parties = filing.restoration?.parties || []

    // find first applicant from fetched parties
    const applicant = parties.find(
      orgPerson => orgPerson.roles.some(role => role.roleType === RoleTypes.APPLICANT)
    )

    if (!applicant) {
      throw new Error(`Applicant not found for ${this.getBusinessId}`)
    }

    // make a copy of the original object and assign a new id (for UI use only)
    const copy = cloneDeep(applicant)
    copy.officer.id = uuidv4()

    return copy
  }

  /** Fetches the entity snapshot. */
  private async fetchEntitySnapshot (): Promise<EntitySnapshotIF> {
    const items = await Promise.all([
      LegalServices.fetchBusinessInfo(this.getBusinessId),
      AuthServices.fetchAuthInfo(this.getBusinessId),
      LegalServices.fetchAddresses(this.getBusinessId),
      LegalServices.fetchNameTranslations(this.getBusinessId),
      LegalServices.fetchDirectors(this.getBusinessId)
    ])

    if (items.length !== 5) throw new Error('Failed to fetch entity snapshot')

    return {
      businessInfo: items[0],
      authInfo: items[1],
      addresses: items[2],
      nameTranslations: items[3],
      orgPersons: items[4]
    } as EntitySnapshotIF
  }

  /** Resource getters. */
  get orgPersonLabel (): string {
    return this.getResource.changeData?.orgPersonInfo.orgPersonLabel
  }

  get userEmailOptional (): boolean {
    return this.getResource.userEmailOptional
  }

  get currentPeopleAndRoles (): Array<OrgPersonIF> {
    return this.getOrgPeople.filter(orgPerson => !this.wasRemoved(orgPerson))
  }

  get applicantEmail (): string {
    const currentApplicant = this.getOrgPeople.filter(orgPerson => !this.wasRemoved(orgPerson))
    return currentApplicant[0].officer.email
  }

  /** The limited restoration state filing's approval type. */
  get approvalType (): ApprovalTypes {
    return this.getStateFilingRestoration?.approvalType
  }

  /** The court order draft file number. */
  get courtOrderNumberText (): string {
    return this.getRestoration.courtOrder?.fileNumber || ''
  }

  get isApprovedByRegistrar (): boolean {
    return this.getStateFilingRestoration?.approvalType === ApprovalTypes.VIA_REGISTRAR
  }

  get isCourtOrderOnly (): boolean {
    return this.getStateFilingRestoration?.approvalType === ApprovalTypes.VIA_COURT_ORDER
  }

  get showCourtOrderRadio (): boolean {
    let courtOrderRadio
    if (this.getStateFilingRestoration?.approvalType === ApprovalTypes.VIA_COURT_ORDER) {
      courtOrderRadio = false
    } else {
      courtOrderRadio = true
    }
    return courtOrderRadio
  }

  /** Emits Fetch Error event. */
  @Emit('fetchError')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitFetchError (err: unknown = null): void {}

  /** Emits Have Data event. */
  @Emit('haveData')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitHaveData (haveData = true): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}
</style>
