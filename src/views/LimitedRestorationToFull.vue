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
            id="applicant-relationship-section"
            title="Applicant Relationship"
            subtitle="Please select applicant's relationship to the company at the time the company was dissolved:"
          >
            <RelationshipsPanel
              class="pl-5 pt-1"
              :draftRelationships="getRestorationRelationships"
              :showValidationErrors="getComponentValidate"
              @changed="setRestorationRelationships($event)"
              @valid="setValidComponent({ key: 'isValidRelationship', value: $event })"
            />
          </QuestionWrapper>

          <QuestionWrapper
            id="applicant-information"
            title="Applicant Information"
          >
            <PeopleAndRoles class="pt-2" />
          </QuestionWrapper>

          <QuestionWrapper
            id="approval-type-section"
            title="Approval Type"
          >
            <ApprovalType
              class="white-background mt-4 pa-8"
              :courtOrderNumber="getRestorationCourtOrderNumber"
              :noticeDate="getRestoration.noticeDate"
              :applicationDate="getRestoration.applicationDate"
              :approvedByRegistrar="approvedByRegistrar"
              :approvedByCourtOrder="approvedByCourtOrder"
              :isCourtOrderRadio="isCourtOrderRadio"
              :invalidSection="!getApprovalTypeValid"
              :validate="getComponentValidate"
              @courtNumberChange="onCourtNumberChange($event)"
              @update:noticeDate="onUpdateNoticeDate($event)"
              @update:applicationDate="onUpdateApplicationDate($event)"
              @approvalTypeChange="onApprovalTypeChange($event)"
              @valid="setApprovalTypeValid($event)"
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
            :disableEdit="false"
          />

          <StaffPayment
            v-if="IsAuthorized(AuthorizedActions.STAFF_PAYMENT)"
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
import { cloneDeep } from 'lodash'
import { GetFeatureFlag, IsAuthorized } from '@/utils/'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import {
  BusinessContactInfo, CertifySection, CourtOrderPoa, DocumentsDelivery, EntityName,
  FolioInformation, ListPeopleAndRoles, NameTranslation, OfficeAddresses, PeopleAndRoles,
  QuestionWrapper, RecognitionDateTime, StaffPayment, YourCompanyWrapper
} from '@/components/common/'
import { AuthServices, LegalServices } from '@/services/'
import { CommonMixin, FeeMixin, FilingTemplateMixin, OrgPersonMixin } from '@/mixins/'
import {
  ActionKvIF, EntitySnapshotIF, FlagsCompanyInfoIF, OrgPersonIF, ResourceIF, RestorationFilingIF
} from '@/interfaces/'
import * as Resources from '@/resources/LimitedRestorationToFull/'
import { ApprovalTypes, AuthorizedActions, FilingStatus, RoleTypes } from '@/enums/'
import { RelationshipTypes } from '@bcrs-shared-components/enums'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import { ApprovalType } from '@bcrs-shared-components/approval-type'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

@Component({
  components: {
    ApprovalType,
    BusinessContactInfo,
    CertifySection,
    CourtOrderPoa,
    DocumentsDelivery,
    EntityName,
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
  // Store getters
  @Getter(useStore) getAppValidate!: boolean
  @Getter(useStore) getApprovalTypeValid!: boolean
  @Getter(useStore) getComponentValidate!: boolean
  // @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) getResource!: ResourceIF
  // @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getRestorationCourtOrderNumber!: string
  @Getter(useStore) getRestorationRelationships!: RelationshipTypes[]
  // @Getter(useStore) getStateFilingRestoration!: StateFilingRestorationIF
  @Getter(useStore) isSummaryMode!: boolean
  @Getter(useStore) showFeeSummary!: boolean

  // Store actions
  @Action(useStore) setApprovalTypeValid!: (x: boolean) => void
  @Action(useStore) setDocumentOptionalEmailValidity!: (x: boolean) => void
  @Action(useStore) setFilingId!: (x: number) => void
  @Action(useStore) setHaveUnsavedChanges!: (x: boolean) => void
  @Action(useStore) setResource!: (x: ResourceIF) => void
  // @Action(useStore) setRestorationCourtOrder!: (courtOrder: CourtOrderIF) => void
  // @Action(useStore) setRestorationRelationships!: (x: RelationshipTypes[]) => void
  @Action(useStore) setStateFilingRestoration!: () => Promise<void>
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  /** Whether App is ready. */
  @Prop({ default: false }) readonly appReady!: boolean

  /** The restoration filing ID. */
  @Prop({ default: 0 }) readonly restorationId!: number

  /**
   * "isDataLoaded" is a flag that is to "true" after all data is loaded.
   * This is to prevent using the state filing data before it's fetched.
   */
  isDataLoaded = false

  /**
   * Whether to show the court order radio button.
   * Gets set once after data is loaded.
   */
  isCourtOrderRadio = null as boolean

  /** True if user is authenticated. */
  get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** The resource object for a restoration filing. */
  get restorationResource (): ResourceIF {
    switch (this.getEntityType) {
      case CorpTypeCd.BC_CCC: return Resources.RestorationResourceCc
      case CorpTypeCd.BC_COMPANY: return Resources.RestorationResourceBc
      case CorpTypeCd.BC_ULC_COMPANY: return Resources.RestorationResourceUlc
      case CorpTypeCd.BEN_CONTINUE_IN: return Resources.RestorationResourceCben
      case CorpTypeCd.BENEFIT_COMPANY: return Resources.RestorationResourceBen
      case CorpTypeCd.CCC_CONTINUE_IN: return Resources.RestorationResourceCcc
      case CorpTypeCd.CONTINUE_IN: return Resources.RestorationResourceC
      case CorpTypeCd.ULC_CONTINUE_IN: return Resources.RestorationResourceCul
      default: return null // should never happen
    }
  }

  /** Called when App is ready and this component can load its data. */
  @Watch('appReady')
  private async onAppReady (val: boolean): Promise<void> {
    // do not proceed if app is not ready
    if (!val) return

    // do not proceed if we are not authenticated (safety check - should never happen)
    if (!this.isAuthenticated) return

    // do not proceed if not authorized
    if (!IsAuthorized(AuthorizedActions.RESTORATION_REINSTATEMENT_FILING)) {
      window.alert('You are not authorized to use Restoration filings.')
      this.$root.$emit('go-to-dashboard', true)
      return
    }

    // do not proceed if FF is disabled
    // bypass this when Vitest is running as FF are not fetched
    if (!this.isVitestRunning && !GetFeatureFlag('restoration-ui-enabled')) {
      window.alert('Restorations are not available at the moment. Please check again later.')
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
      const stateFiling = entitySnapshot?.businessInfo?.stateFiling || null
      const filing = stateFiling && await LegalServices.fetchFiling(stateFiling)

      if (!filing) {
        throw new Error(`Invalid fetched stateFiling = ${this.getBusinessId}`)
      }

      // get applicant from state filing and set into orgPersons
      const applicant = this.getApplicant(filing) // throws error if not found
      entitySnapshot.orgPersons = [applicant]

      this.setEntitySnapshot(entitySnapshot)

      // set the previously filed limited restoration in the store
      // (will throw on error)
      await this.setStateFilingRestoration()

      // parse draft restoration filing into store
      this.parseRestorationFiling(restorationFiling)

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

      // show the court order radio button only if the original limited restoration was NOT approved by court order
      this.isCourtOrderRadio = (this.getStateFilingRestoration.approvalType !== ApprovalTypes.VIA_COURT_ORDER)

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

    // make a copy of the original object
    const copy = cloneDeep(applicant)
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

  get approvalType (): ApprovalTypes {
    return this.getRestoration.approvalType
  }

  get courtOrderNumberText (): string {
    return this.getRestoration.courtOrder?.fileNumber || ''
  }

  get approvedByRegistrar (): boolean {
    return (this.approvalType === ApprovalTypes.VIA_REGISTRAR)
  }

  get approvedByCourtOrder (): boolean {
    return (this.approvalType === ApprovalTypes.VIA_COURT_ORDER)
  }

  onCourtNumberChange (fileNumber: string): void {
    this.setRestorationCourtOrder({ fileNumber })
  }

  onUpdateNoticeDate (noticeDate: string): void {
    // use $set as we're adding an optional properly that we want reactive
    this.$set(this.getRestoration, 'noticeDate', noticeDate)
  }

  onUpdateApplicationDate (applicationDate: string): void {
    // use $set as we're adding an optional properly that we want reactive
    this.$set(this.getRestoration, 'applicationDate', applicationDate)
  }

  onApprovalTypeChange (approvalType: ApprovalTypes): void {
    this.getRestoration.approvalType = approvalType
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
