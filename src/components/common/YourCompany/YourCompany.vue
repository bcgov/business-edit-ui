<template>
  <v-card flat id="your-company" class="pb-2">
    <div class="section-container define-company-header">
      <v-icon class="header-icon">mdi-domain</v-icon>
      <label class="define-company-title">Your {{ getResource.entityReference }}</label>
    </div>

    <!-- Business/Company Name + Name Request Applicant -->
    <div id="company-name-section" class="section-container" :class="{'invalid-section': invalidNameSection}">
      <v-row no-gutters class="mt-4">
        <v-col cols="3">
          <label :class="{'error-text': invalidNameSection}">
            <strong>{{ getResource.entityReference }} Name</strong>
          </label>
          <v-flex md1 class="mt-1">
            <v-chip
              v-if="companyNameChanges ||
                (hasBusinessNameChanged && (isAlterationFiling || isChangeFiling || isConversionFiling))"
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
          <v-col cols="7" class="mt-n1">
            <div class="company-name font-weight-bold text-uppercase">{{ companyName }}</div>

            <!-- Business Type Info -->
            <template v-if="!hasNewNr &&
              (hasBusinessNameChanged && (isAlterationFiling || isChangeFiling || isConversionFiling))"
            >
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span class="info-text">{{getCorpTypeDescription(getEntityType)}}</span>
              </div>
              <div class="info-text pt-3">
                <span>The name of this business will be the current Incorporation Number followed by "B.C. Ltd."</span>
              </div>
            </template>

            <!-- Name Request Info -->
            <template v-if="hasNewNr && (isAlterationFiling || isChangeFiling)">
              <div class="company-name mt-2">{{ getNameRequest.nrNumber }}</div>
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span :class="{ 'hasConflict': isConflictingLegalType}"
                      class="info-text">{{getCorpTypeDescription(getNameRequest.legalType)}}
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
                  <span>Business Types do not match. The Name Request type must match the business type before you can
                    continue.</span>
                </v-tooltip>
              </div>
              <div class="company-info">
                <span class="subtitle">Request Type: </span>
                <span class="info-text">{{getNrRequestDesc(getNameRequest.requestType)}}</span>
              </div>
              <div class="company-info">
                <span class="subtitle">Expiry Date: </span>
                <span class="info-text">{{expiryDate}}</span>
              </div>
              <div class="company-info">
                <span class="subtitle">Status: </span>
                <span class="info-text">{{getNameRequest.status}}</span>
              </div>
            </template>
          </v-col>

          <!-- Actions -->
          <v-col cols="2" class="mt-n2">
            <div class="actions mr-4">
              <!-- FUTURE: only show buttons for named company -->
              <v-btn
                v-if="companyNameChanges || (hasBusinessNameChanged && (isAlterationFiling || isChangeFiling))"
                text color="primary"
                id="btn-undo-company-name"
                class="undo-action"
                @click="resetName()"
              >
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
              <v-btn
                v-else-if="!isConversionFiling"
                text color="primary"
                id="btn-correct-company-name"
                @click="isEditingNames = true"
              >
                <v-icon small>mdi-pencil</v-icon>
                <span>{{editLabel}}</span>
              </v-btn>
              <span class="more-actions" v-if="companyNameChanges ||
                (hasBusinessNameChanged && (isAlterationFiling || isChangeFiling))"
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
            @done="nameChangeHandler"
            @cancel="isEditingNames = false"
          />
        </v-col>
      </v-row>

      <v-row no-gutters v-if="hasNewNr && (isAlterationFiling || isChangeFiling || isConversionFiling)"
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

    <v-divider v-if="isChangeFiling || isConversionFiling" class="mx-4 my-1" />

    <!-- Business Type -->
    <div
      v-if="isAlterationFiling || isChangeFiling || isConversionFiling"
      id="company-type-section"
      class="section-container"
      :class="{'invalid-section': invalidTypeSection}"
    >
      <ChangeBusinessType
        :invalidSection="invalidTypeSection"
        @haveChanges="companyTypeChanges = $event"
        @isEditingBusinessType="isEditingType = $event"
      />
    </div>

    <!-- Name Translation(s) -->
    <div
      v-if="isAlterationFiling || isCorrectionFiling"
      id="name-translate-section"
      class="section-container"
      :class="{'invalid-section': invalidTranslationSection}"
    >
      <CorrectNameTranslation
        :invalidSection="invalidTranslationSection"
        @haveChanges="nameTranslationChanges = $event"
        @isEditingTranslations="isEditingTranslations = $event"
      />
    </div>

    <v-divider class="mx-4 my-1" />

    <!-- Business Start Date -->
    <template v-if="isChangeFiling || isConversionFiling">
      <section class="section-container">
        <v-row no-gutters>
          <v-col cols="3">
            <label><strong>Business Start Date</strong></label>
          </v-col>

          <v-col cols="9">
            <span class="info-text mr-1">{{ recognitionDateTime }}</span>
            <v-tooltip top
                       content-class="top-tooltip"
                       transition="fade-transition"
                       nudge-right="3"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="info-icon">mdi-information-outline</v-icon>
              </template>
              <span>If the business start date is incorrect, it must be corrected through a correction filing.</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </section>
    </template>

    <!-- Nature of Business (change filing) -->
    <template v-if="isChangeFiling">
      <v-divider class="mx-4 my-1" />

      <NatureOfBusiness
        class="section-container"
        :class="{'invalid-section': invalidNatureOfBusiness}"
        :invalidSection="invalidNatureOfBusiness"
      />
    </template>

    <!-- Nature of Business (conversion filing) -->
    <template v-if="isConversionFiling">
      <v-divider class="mx-4 my-1" />

      <ConversionNOB
        class="section-container"
        :class="{'invalid-section': invalidNatureOfBusiness}"
        :invalidSection="invalidNatureOfBusiness"
      />
    </template>

    <!-- Recognition Date and Time -->
    <div class="section-container" v-if="isAlterationFiling || isCorrectionFiling">
      <v-row no-gutters>
        <v-col cols="3">
          <label><strong>Recognition Date and Time</strong></label>
        </v-col>

        <v-col cols="9">
          <div class="info-text">{{ recognitionDateTime }}</div>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mx-4 my-1" />

    <!-- Office addresses -->
    <OfficeAddresses
      class="section-container"
      :class="{'invalid-section': invalidAddressSection}"
      :invalidSection="invalidAddressSection"
      @haveChanges="officeAddressChanges = $event"
    />

    <v-divider class="mx-4 my-1" />

    <!-- Business Contact Information -->
    <div id="contact-info" class="section-container" :class="{'invalid-section': invalidContactSection}">
      <BusinessContactInfo
        :invalidSection="invalidContactSection"
      />
    </div>

    <!-- Folio Information (not SP or GP) -->
    <template v-if="isPremiumAccount && !isTypeFirm">
      <v-divider class="mx-4 my-1" />

      <div id="folio-number" class="section-container" :class="{'invalid-section': invalidFolioSection}">
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
import { ActionBindingIF, EntitySnapshotIF, FlagsCompanyInfoIF, IncorporationFilingIF, NameRequestApplicantIF,
  NameRequestIF, ResourceIF } from '@/interfaces/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { BusinessContactInfo, ChangeBusinessType, FolioInformation, CorrectNameTranslation, CorrectNameOptions,
  NatureOfBusiness, OfficeAddresses } from './'
import { CommonMixin, SharedMixin, DateMixin, LegalApiMixin, NameRequestMixin } from '@/mixins/'
import { CorrectionTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { cloneDeep } from 'lodash'
import { ConversionNOB } from '@/components/Conversion'

/** Note: this component is used by both corrections and alterations. */
@Component({
  components: {
    BusinessContactInfo,
    ChangeBusinessType,
    CorrectNameOptions,
    CorrectNameTranslation,
    NatureOfBusiness,
    OfficeAddresses,
    FolioInformation,
    ConversionNOB
  }
})
export default class YourCompany extends Mixins(
  CommonMixin,
  DateMixin,
  SharedMixin,
  LegalApiMixin,
  NameRequestMixin
) {
  // Global getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getComponentValidate!: boolean
  @Getter getNameRequest!: NameRequestIF
  @Getter hasNewNr!: boolean
  @Getter getOriginalEffectiveDateTime!: string
  @Getter getBusinessFoundingDate!: string // actually date-time
  @Getter isConflictingLegalType!: boolean
  @Getter isNumberedCompany!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getBusinessContact!: ContactPointIF
  @Getter getResource!: ResourceIF
  @Getter isTypeFirm!: boolean

  // Alteration flag getters
  @Getter hasBusinessNameChanged!: boolean
  @Getter getFlagsCompanyInfo!: FlagsCompanyInfoIF

  // Global actions
  @Action setDefineCompanyStepChanged!: ActionBindingIF
  @Action setEditingCompanyName!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF

  // Declaration for template
  readonly CorpTypeCd = CorpTypeCd

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  // Whether components have changes (only used by corrections)
  private companyNameChanges = false
  private companyTypeChanges = false
  private nameTranslationChanges = false
  private officeAddressChanges = false

  private correctNameChoices: Array<string> = []
  private isEditingNames = false
  private isEditingType = false
  private isEditingTranslations = false

  /** The name section validity state (when prompted by app). */
  get invalidNameSection (): boolean {
    return (this.getComponentValidate && this.isEditingNames)
  }

  /** The type section validity state (when prompted by app). */
  get invalidTypeSection (): boolean {
    return (this.getComponentValidate && this.isEditingType)
  }

  /** The translation section validity state (when prompted by app). */
  get invalidTranslationSection (): boolean {
    return (this.getComponentValidate && this.isEditingTranslations)
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
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** Name Request applicant info */
  get nrApplicant (): NameRequestApplicantIF {
    return this.getNameRequest?.applicant
  }

  /** Name Request expiry */
  get expiryDate (): string {
    const date = new Date(this.getNameRequest.expiry)
    return this.dateToPacificDateTime(date)
  }

  /** Name Request phone number */
  get phoneNumber (): string {
    return this.toDisplayPhone(this.nrApplicant.phoneNumber)
  }

  /** The recognition/founding (aka effective or start date) datetime. */
  get recognitionDateTime (): string {
    if (this.isCorrectionFiling) {
      if (this.getOriginalEffectiveDateTime) {
        return (this.apiToPacificDateLong(this.getOriginalEffectiveDateTime))
      }
    }
    if (this.isAlterationFiling || this.isChangeFiling || this.isConversionFiling) {
      if (this.getBusinessFoundingDate) {
        return (this.apiToPacificDateLong(this.getBusinessFoundingDate))
      }
    }
    return 'Unknown'
  }

  /** Compare names. */
  get isNewName () {
    const correctedName = this.getApprovedName
    const currentName = this.isCorrectionFiling
      ? this.getOriginalIA.incorporationApplication.nameRequest.legalName
      : this.getEntitySnapshot.businessInfo.legalName

    return correctedName !== currentName
  }

  /** The current options for change of name correction or edit. */
  get nameChangeOptions (): Array<CorrectionTypes> {
    let nameChangeOptions = cloneDeep(this.getResource.changeData.nameChangeOptions)

    // Remove name-to-numbered company option when already a numbered company
    if (!this.getApprovedName) nameChangeOptions.splice(1, 1)
    return nameChangeOptions
  }

  /** Reset company name values to original. */
  private resetName () {
    this.setBusinessInformation(this.isCorrectionFiling
      ? this.getOriginalIA.business
      : this.getEntitySnapshot.businessInfo
    )
    this.setNameRequest(this.isCorrectionFiling
      ? this.getOriginalIA.incorporationApplication.nameRequest
      : this.getEntitySnapshot.businessInfo
    )
    this.companyNameChanges = false
  }

  /** Compare current to corrected data and update UI.  */
  @Watch('getApprovedName')
  private nameChangeHandler (isSaved: boolean): void {
    this.companyNameChanges = this.isNewName
    if (isSaved) this.isEditingNames = false
  }

  // Watchers for component change flags (only used by corrections)
  @Watch('companyNameChanges') private onCompanyNameChanges (): void { this.setDataChanges() }
  @Watch('companyTypeChanges') private onCompanyTypeChanges (): void { this.setDataChanges() }
  @Watch('nameTranslationChanges') private onNameTranslationChanges (): void { this.setDataChanges() }
  @Watch('officeAddressChanges') private onOfficeAddressChanges (): void { this.setDataChanges() }

  private setDataChanges (): void {
    const haveChanges = (
      this.companyNameChanges ||
      this.companyTypeChanges ||
      this.nameTranslationChanges ||
      this.officeAddressChanges
    )
    this.setDefineCompanyStepChanged(haveChanges)
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
</style>
