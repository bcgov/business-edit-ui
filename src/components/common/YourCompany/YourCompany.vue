<template>
  <v-card flat id="your-company" class="pb-2">
    <div class="section-container define-company-header">
      <v-icon class="header-icon">mdi-domain</v-icon>
      <label class="define-company-title">Your {{ getResource.entityReference }}</label>
    </div>

    <!-- Business/Company Name + Name Request Applicant -->
    <div id="company-name-section" class="section-container" :class="{'invalid-section': invalidNameSection}">
      <v-row no-gutters class="mt-4">
        <v-col cols="3" class="pr-2">
          <label :class="{'error-text': invalidNameSection}">
            <strong>{{ getResource.entityReference }} Name</strong>
          </label>
          <v-flex md1>
            <v-chip
              v-if="hasCompanyNameChanged || (hasBusinessNameChanged && (isAlterationFiling || isFirmChangeFiling ||
                isFirmConversionFiling || isSpecialResolutionFiling))"
              id="corrected-lbl"
              x-small label
              color="primary"
              text-color="white"
            >
              {{editedLabel}}
            </v-chip>
          </v-flex>
        </v-col>

        <!-- Display Mode -->
        <template v-if="!isEditingNames">
          <v-col cols="7">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>

            <!-- Business Type Info -->
            <template v-if="!hasNewNr && (hasBusinessNameChanged && (isAlterationFiling || isFirmChangeFiling
              || isFirmConversionFiling))"
            >
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span class="info-text">{{GetCorpFullDescription(getEntityType)}}</span>
              </div>
              <div class="info-text pt-3">
                <span>The name of this business will be the current Incorporation Number followed by "B.C. Ltd."</span>
              </div>
            </template>

            <!-- Name Request Info -->
            <template v-if="hasNewNr && (isAlterationFiling || isFirmChangeFiling || isSpecialResolutionFiling)">
              <div class="company-name mt-2">{{getNameRequestNumber || 'Unknown'}}</div>
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span :class="{ 'has-conflict': isConflictingLegalType}"
                      class="info-text">{{GetCorpFullDescription(getNameRequest.legalType)}}
                </span>
                <v-tooltip
                  v-if="isConflictingLegalType"
                  top
                  content-class="top-tooltip"
                  transition="fade-transition"
                  nudge-right="3"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" color="error" small>
                      mdi-alert
                    </v-icon>
                  </template>
                  <span>Business Types do not match. The Name Request type must match the business type before
                    you can continue.</span>
                </v-tooltip>
              </div>
              <div class="company-info">
                <span class="subtitle">Request Type: </span>
                <span class="info-text">{{getNrRequestDesc(getNameRequest.requestType)}}</span>
              </div>
              <div class="company-info">
                <span class="subtitle">Expiry Date: </span>
                <span class="info-text">{{expiryDate || 'Unknown'}}</span>
              </div>
              <div class="company-info">
                <span class="subtitle">Status: </span>
                <span class="info-text text-capitalize">{{nrStatus}}</span>
              </div>
            </template>
          </v-col>

          <!-- Actions -->
          <v-col cols="2" class="mt-n2">
            <div class="actions mr-4">
              <!-- FUTURE: only show buttons for named company -->
              <v-btn
                v-if=" hasCompanyNameChanged || (hasBusinessNameChanged && (isAlterationFiling ||
                  isFirmChangeFiling || isSpecialResolutionFiling))"
                text color="primary"
                id="btn-undo-company-name"
                class="undo-action"
                @click="resetName()"
              >
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
              <v-btn
                v-else-if="!isFirmConversionFiling"
                text color="primary"
                id="btn-correct-company-name"
                @click="isEditingNames = true"
              >
                <v-icon small>mdi-pencil</v-icon>
                <span>{{editLabel}}</span>
              </v-btn>
              <span class="more-actions" v-if=" hasCompanyNameChanged || (hasBusinessNameChanged &&
                (isAlterationFiling || isFirmChangeFiling || isSpecialResolutionFiling))"
              >
                <v-menu
                  offset-y left nudge-bottom="4"
                  v-model="dropdown"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text small color="primary"
                      id="btn-more-actions"
                      v-on="on"
                    >
                      <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="pa-0">
                    <v-list-item
                      class="v-list-item"
                      id="btn-more-actions-edit"
                      @click="isEditingNames = true; dropdown = false"
                    >
                      <v-list-item-subtitle>
                        <v-icon small color="primary">mdi-pencil</v-icon>
                        <span class="drop-down-action ml-1">Change</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </v-col>
        </template>

        <!-- Editing Mode -->
        <v-col cols="9" v-else>
          <CorrectNameOptions
            :correctionNameChoices="nameChangeOptions"
            @isSaved="nameChangeHandler($event)"
            @cancel="isEditingNames = false"
          />
        </v-col>
      </v-row>

      <!-- Name Request Applicant -->
      <v-row no-gutters v-if="hasNewNr && (isAlterationFiling || isFirmChangeFiling || isFirmConversionFiling ||
          isSpecialResolutionFiling)"
        class="sub-section"
      >
        <v-col cols="3">
          <label class="pr-4">Name Request Applicant</label>
        </v-col>

        <v-col cols="7">
          <div class="name-request-applicant-info">
            <span class="subtitle">Name: </span>
            <span class="info-text">{{nrApplicant.fullName}}</span>
          </div>
          <div class="name-request-applicant-info">
            <span class="subtitle">Address: </span>
            <span class="info-text">{{nrApplicant.fullAddress}}</span>
          </div>
          <div class="name-request-applicant-info">
            <span class="subtitle">Email: </span>
            <span class="info-text">{{nrApplicant.emailAddress || 'N/A'}}</span>
          </div>
          <div class="name-request-applicant-info">
            <span class="subtitle">Phone: </span>
            <span class="info-text">{{phoneNumber || 'N/A'}}</span>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-divider
      v-if="isFirmChangeFiling || isFirmConversionFiling || isFirmCorrectionFiling || isSpecialResolutionFiling"
      class="mx-4 my-1"
    />

    <!-- Business Type -->
    <div v-if="showChangeBusinessType"
      id="company-type-section"
      class="section-container"
      :class="{'invalid-section': invalidTypeSection}"
    >
      <ChangeBusinessType
        :invalidSection="invalidTypeSection"
        @isEditingBusinessType="isEditingType = $event"
      />
    </div>

    <!-- Name Translation(s) (alterations and BEN corrections only) -->
    <div v-if="isAlterationFiling || isBenCorrectionFiling"
      id="name-translate-section"
      class="section-container"
      :class="{'invalid-section': invalidTranslationSection}"
    >
      <CorrectNameTranslation
        :invalidSection="invalidTranslationSection"
        @isEditingTranslations="isEditingTranslations = $event"
      />
    </div>

    <v-divider v-if="isEntityTypeCP" class="mx-4 my-1" />

    <!--- Association Type (coop only) -->
    <div v-if="isEntityTypeCP"
        id="association-type-section"
        class="section-container"
        :class="{'invalid-section': invalidAssociationTypeSection}"
    >
      <AssociationType
        :invalidSection="invalidAssociationTypeSection"
        @isEditingAssociationType="isEditingAssociationType = $event"
      />
    </div>

    <!-- Business Start Date (changes, conversions and firm corrections only) -->
    <template v-if="isFirmChangeFiling || isFirmConversionFiling || isFirmCorrectionFiling">
      <v-divider class="mx-4 my-1" />

      <BusinessStartDate
        class="section-container"
        :class="{'invalid-section': invalidStartDate}"
        :invalidSection="invalidStartDate"
      />
    </template>

    <!-- Nature of Business (firm changes and corrections only) -->
    <template v-if="isFirmChangeFiling || isFirmCorrectionFiling">
      <v-divider class="mx-4 my-1" />

      <NatureOfBusiness
        class="section-container"
        :class="{'invalid-section': invalidNatureOfBusiness}"
        :invalidSection="invalidNatureOfBusiness"
      />
    </template>

    <!-- Nature of Business (firm conversions only) -->
    <template v-if="isFirmConversionFiling">
      <v-divider class="mx-4 my-1" />

      <ConversionNOB
        class="section-container"
        :class="{'invalid-section': invalidNatureOfBusiness}"
        :invalidSection="invalidNatureOfBusiness"
      />
    </template>

    <!-- Recognition Date and Time (alterations and BEN corrections only) -->
    <template v-if="isAlterationFiling || isBenCorrectionFiling">
      <v-divider class="mx-4 my-1" />

      <div class="section-container">
        <v-row no-gutters>
          <v-col cols="3" class="pr-2">
            <label><strong>Recognition Date and Time</strong></label>
          </v-col>

          <v-col cols="9">
              <span class="info-text mr-1">{{recognitionDateTime || 'Unknown'}}</span>
          </v-col>
        </v-row>
      </div>
    </template>

    <v-divider class="mx-4 my-1" />

    <!-- Office addresses -->
    <div class="section-container" :class="{'invalid-section': invalidAddressSection}">
      <OfficeAddresses :invalidSection="invalidAddressSection" />
    </div>

    <!-- Business Contact Information -->
    <template v-if="showBusinessContactInformation">
      <v-divider class="mx-4 my-1" />

      <div id="contact-info-section" class="section-container" :class="{'invalid-section': invalidContactSection}">
        <BusinessContactInfo
          :invalidSection="invalidContactSection"
        />
      </div>
    </template>

    <!-- Folio Information (all except SP or GP) -->
    <template v-if="isPremiumAccount && !isEntityTypeFirm">
      <v-divider class="mx-4 my-1" />

      <div id="folio-number-section" class="section-container" :class="{'invalid-section': invalidFolioSection}">
        <FolioInformation
          :invalidSection="invalidFolioSection"
        />
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, EntitySnapshotIF, FlagsCompanyInfoIF, NameRequestApplicantIF, NameRequestIF }
  from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { AssociationType, BusinessContactInfo, ChangeBusinessType, FolioInformation, CorrectNameTranslation,
  CorrectNameOptions, NatureOfBusiness, OfficeAddresses, BusinessStartDate } from './'
import { CommonMixin, DateMixin, NameRequestMixin } from '@/mixins/'
import { AssociationTypes, CorrectionTypes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ConversionNOB } from '@/components/Conversion'

@Component({
  components: {
    AssociationType,
    BusinessContactInfo,
    ChangeBusinessType,
    CorrectNameOptions,
    CorrectNameTranslation,
    NatureOfBusiness,
    OfficeAddresses,
    FolioInformation,
    ConversionNOB,
    BusinessStartDate
  }
})
export default class YourCompany extends Mixins(
  CommonMixin,
  DateMixin,
  NameRequestMixin
) {
  // for template
  readonly GetCorpFullDescription = GetCorpFullDescription

  // Global getters
  @Getter getNameRequestLegalName!: string
  @Getter getNameRequestNumber!: string
  @Getter getBusinessNumber!: string
  @Getter getComponentValidate!: boolean
  @Getter getNameRequest!: NameRequestIF
  @Getter getCorrectedFilingDate!: string
  @Getter getBusinessFoundingDateTime!: string
  @Getter isConflictingLegalType!: boolean
  @Getter isNumberedCompany!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getBusinessContact!: ContactPointIF
  @Getter isEntityTypeFirm!: boolean
  @Getter isEntityTypeCP!: boolean
  @Getter isBenCorrectionFiling!: boolean
  @Getter isFirmCorrectionFiling!: boolean
  @Getter getEntityType!: CorpTypeCd
  @Getter getAssociationType!: AssociationTypes

  // Alteration flag getters
  @Getter hasBusinessNameChanged!: boolean
  @Getter getFlagsCompanyInfo!: FlagsCompanyInfoIF

  // Global actions
  @Action setEditingCompanyName!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF

  /** V-model for dropdown menu. */
  protected dropdown: boolean = null

  /** Whether company name has changed (only used by corrections). */
  protected hasCompanyNameChanged = false

  protected correctNameChoices: Array<string> = []
  protected isEditingAssociationType = false
  protected isEditingNames = false
  protected isEditingType = false
  protected isEditingTranslations = false

  /** True if a new NR number has been entered. */
  get hasNewNr (): boolean {
    return !!this.getNameRequestNumber
  }

  /** The name section validity state (when prompted by app). */
  get invalidNameSection (): boolean {
    return (this.getComponentValidate && this.isEditingNames)
  }

  /** The type section validity state (when prompted by app). */
  get invalidTypeSection (): boolean {
    return (this.getComponentValidate && this.isEditingType)
  }

  /** The association type section validity state (when prompted by app). */
  get invalidAssociationTypeSection (): boolean {
    return (this.getComponentValidate && this.isEditingAssociationType)
  }

  /** The translation section validity state (when prompted by app). */
  get invalidTranslationSection (): boolean {
    return (this.getComponentValidate && this.isEditingTranslations)
  }

  get invalidStartDate (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidStartDate)
  }

  /** The nature of business section validity state (when prompted by app). */
  get invalidNatureOfBusiness (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidNatureOfBusiness)
  }

  /** The address section validity state (when prompted by app). */
  get invalidAddressSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidAddress)
  }

  /** The contact section validity state (when prompted by app). */
  get invalidContactSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidContactInfo)
  }

  /** The folio section validity state (when prompted by app). */
  get invalidFolioSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidFolioInfo)
  }

  /** The company name (from NR, or incorporation number). */
  get companyName (): string {
    if (this.getNameRequestLegalName) return this.getNameRequestLegalName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** Name Request applicant info */
  get nrApplicant (): NameRequestApplicantIF {
    return this.getNameRequest?.applicant
  }

  /** Name Request status */
  get nrStatus (): string {
    return (this.getNameRequest?.status || '').toLowerCase()
  }

  /** Name Request expiry */
  get expiryDate (): string {
    const expiry = this.getNameRequest?.expiry
    if (expiry) {
      return this.apiToPacificDateTime(expiry)
    }
    return null
  }

  /** Name Request phone number */
  get phoneNumber (): string {
    return this.toDisplayPhone(this.nrApplicant.phoneNumber)
  }

  /** The recognition date or business start date string. */
  get recognitionDateTime (): string {
    if (this.isBenCorrectionFiling) {
      if (this.getBusinessFoundingDateTime) {
        return this.apiToPacificDateTime(this.getBusinessFoundingDateTime)
      }
      if (this.getCorrectedFilingDate) {
        return this.apiToPacificDateTime(this.getCorrectedFilingDate)
      }
    }
    if (this.isAlterationFiling) {
      if (this.getBusinessFoundingDateTime) {
        return this.apiToPacificDateTime(this.getBusinessFoundingDateTime)
      }
    }
    return null
  }

  /** Whether a new business legal name was entered.. */
  get isNewName () {
    const originalName = this.getNameRequestLegalName
    const currentName = this.getEntitySnapshot?.businessInfo.legalName
    return (originalName !== currentName)
  }

  /** The current options for change of name correction or edit. */
  get nameChangeOptions (): Array<CorrectionTypes> {
    // remove name-to-numbered-company option when already a numbered company
    if (this.isNumberedCompany) {
      return this.getResource.changeData.nameChangeOptions
        .filter(option => option !== CorrectionTypes.CORRECT_NAME_TO_NUMBER)
    }
    return this.getResource.changeData.nameChangeOptions
  }

  /**
   * Whether to show Business Type section.
   * (Alterations, all firm filings, and Special Resolutions only)
   */
  get showChangeBusinessType (): boolean {
    return (
      this.isAlterationFiling ||
      this.isFirmCorrectionFiling ||
      this.isFirmChangeFiling ||
      this.isFirmConversionFiling ||
      this.isSpecialResolutionFiling
    )
  }

  /**
   * Whether to show Business Contact Information section.
   * Currently excluding isFirmConversionFiling
   */
  get showBusinessContactInformation (): boolean {
    return (
      this.isAlterationFiling ||
      this.isFirmChangeFiling ||
      this.isFirmCorrectionFiling ||
      this.isSpecialResolutionFiling ||
      this.isBenCorrectionFiling
    )
  }

  /** Reset company name values to original. */
  protected resetName () {
    // reset business information, except for association type.
    const businessInfo = { ...this.getEntitySnapshot.businessInfo, associationType: this.getAssociationType }
    this.setBusinessInformation(businessInfo)

    // reset name request
    this.setNameRequest({
      legalType: this.getEntitySnapshot.businessInfo.legalType,
      legalName: this.getEntitySnapshot.businessInfo.legalName,
      nrNumber: this.getEntitySnapshot.businessInfo.nrNumber
    })

    // reset flag
    this.hasCompanyNameChanged = false
  }

  /** Updates UI when Name Request is updated (ie, on resume draft). */
  @Watch('getNameRequest')
  private onNameRequestChange (): void {
    this.nameChangeHandler()
  }

  /** Updates UI when correct name options are done.  */
  private nameChangeHandler (isSaved = false): void {
    this.hasCompanyNameChanged = this.isNewName
    if (isSaved) this.isEditingNames = false
  }

  /** Updates store initially and when isEditingName property has changed. */
  @Watch('isEditingNames', { immediate: true })
  private onEditingNameChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidCompanyName', value: !val })
    this.setEditingCompanyName(val)
  }

  /** Updates store initially and when isEditingType property has changed. */
  @Watch('isEditingType', { immediate: true })
  private onEditingTypeChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidBusinessType', value: !val })
  }

  /** Updates store initially and when isEditingTranslations property has changed. */
  @Watch('isEditingTranslations', { immediate: true })
  private onEditingTranslationChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidNameTranslation', value: !val })
  }

  /** Updates store initially and when isEditingAssociationType property has changed. */
  @Watch('isEditingAssociationType', { immediate: true })
  private onEditingAssociationTypeChanged (isEditing: boolean): void {
    this.setValidComponent({ key: 'isValidAssociationType', value: !isEditing })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  font-weight: bold;
  color: $primary-blue;
}

.define-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.define-company-title {
 padding-left: 0.5rem;
}

.company-name {
  font-size: 1.5rem;
}

.company-info {
  padding-top: 0.5rem;
}

.name-request-applicant-info:not(:first-child) {
  padding-top: 0.5rem
}

.actions {
  position: absolute;
  right: 0;

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

#contact-info-section {
  border-bottom-left-radius: 0 !important;
}

</style>
