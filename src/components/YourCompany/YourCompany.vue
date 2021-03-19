<template>
  <v-card flat id="your-company">
    <confirm-dialog
      ref="confirm"
      attach="#app"
    />

     <div class="define-company-header">
        <v-icon color="app-dk-blue">mdi-domain</v-icon>
        <label class="define-company-title">Your Company</label>
    </div>

    <div class="section-container">
      <v-layout row class="mx-0 mt-4">
        <v-flex xs3>
          <v-layout column>
            <label><strong>Company Name</strong></label>
            <v-flex md1 class="mt-1">
              <v-chip v-if="companyNameChanges || (isAlterationView && hasBusinessNameChanged)"
                      id="corrected-lbl"
                      x-small label
                      color="primary"
                      text-color="white"
              >
                 {{editedLabel}}
              </v-chip>
            </v-flex>
          </v-layout>
        </v-flex>

        <template v-if="!isEditingNames">
          <v-flex xs6 class="mt-n1">
            <div class="company-name font-weight-bold">{{ companyName }}</div>

            <!-- Business Type Info -->
            <template v-if="(isAlterationView && hasBusinessNameChanged) && !hasNewNr">
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span class="info-text">{{getCorpTypeDescription(getEntityType)}}</span>
              </div>
              <div class="info-text pt-3">
                <span>The name of this business will be the current Incorporation Number followed by "B.C. Ltd."</span>
              </div>
            </template>

            <!-- Name Request Info -->
            <template v-if="isAlterationView && hasNewNr">
              <div class="company-name">{{ getNameRequest.nrNumber }}</div>
              <div class="company-info mt-4">
                <span class="subtitle">Business Type: </span>
                <span :class="{ 'hasConflict': isConflictingLegalType}"
                      class="info-text">{{getCorpTypeDescription(getNameRequest.legalType)}}
                </span>
                <v-tooltip v-if="isConflictingLegalType"
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
                <span class="info-text">New Business</span>
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
          </v-flex>

          <!-- Actions -->
          <v-flex xs1 class="mt-n2">
            <div class="actions mr-4">
              <!-- TODO: only show buttons for named company -->
              <v-btn
                v-if="companyNameChanges || (isAlterationView && hasBusinessNameChanged)"
                text color="primary"
                id="btn-undo-company-name"
                class="undo-action"
                @click="resetName()"
              >
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
              <v-btn
                v-else
                text color="primary"
                id="btn-correct-company-name"
                @click="isEditingNames = true"
              >
                <v-icon small>mdi-pencil</v-icon>
                <span>{{editLabel}}</span>
              </v-btn>
              <span class="more-actions" v-if="companyNameChanges || (isAlterationView && hasBusinessNameChanged)">
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
                  <v-list>
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
          </v-flex>
        </template>

        <template v-else>
          <v-flex xs9>
            <correct-name-options
              :correction-name-choices="correctNameChoices"
              @done="nameChangeHandler"
              @cancel="isEditingNames = false"
            />
          </v-flex>
        </template>

        <!-- Name Request Applicant Info -->
        <template v-if="isAlterationView && hasNewNr">
          <v-flex xs3 class="sub-section">
            <v-layout column>
              <label><strong>Name Request Applicant</strong></label>
            </v-layout>
          </v-flex>
          <v-flex xs6 class="sub-section">
            <template>
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
            </template>
          </v-flex>
        </template>
      </v-layout>

      <!-- Edit Business Type -->
      <correct-business-type
        class="sub-section"
        @haveChanges="companyTypeChanges = $event"
      />

      <!-- Edit Name Translation -->
      <correct-name-translation
        class="sub-section"
        @haveChanges="nameTranslationChanges = $event"
      />
    </div>

    <v-divider class="mx-4" />

    <div class="section-container">
      <v-layout row class="mx-0">
        <v-flex xs3>
          <label><strong>Recognition Date and Time</strong></label>
        </v-flex>
        <v-flex xs9>
          <div class="info-text">{{ recognitionDateTime }}</div>
        </v-flex>
      </v-layout>
    </div>

    <v-divider class="mx-4" />

    <div class="section-container">
      <office-addresses
        @haveChanges="officeAddressChanges = $event"
      />
    </div>

    <v-divider class="mx-4" />

    <div class="section-container">
      <business-contact-info
        @haveChanges="contactInfoChanges = $event"
      />
    </div>

    <template v-if="isPremiumAccount">
      <v-divider class="mx-4" />

      <div class="section-container">
        <folio-number
          :initialValue="getFolioNumber"
          :isEditing="false"
          @haveChanges="folioNumberChanges = $event"
        />
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import {
  ActionBindingIF,
  BusinessSnapshotIF,
  ConfirmDialogType,
  GetterIF,
  IncorporationFilingIF,
  NameRequestApplicantIF,
  NameRequestIF
} from '@/interfaces'
// Shared Interfaces
import { ContactPointIF } from '@bcrs-shared-components/interfaces'
import {
  BusinessContactInfo,
  CorrectBusinessType,
  FolioNumber,
  CorrectNameTranslation,
  OfficeAddresses
} from '.'
import { CorrectNameOptions } from '@/components/YourCompany/CompanyName'
import { CommonMixin, EnumMixin, DateMixin, LegalApiMixin } from '@/mixins'
import { CorrectionTypes, CorpTypeCd } from '@/enums'
import { ConfirmDialog } from '@/components/dialogs'

@Component({
  components: {
    ConfirmDialog,
    BusinessContactInfo,
    CorrectBusinessType,
    CorrectNameOptions,
    CorrectNameTranslation,
    OfficeAddresses,
    FolioNumber
  }
})
export default class YourCompany extends Mixins(
  CommonMixin,
  DateMixin,
  EnumMixin,
  LegalApiMixin
) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // global getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequest!: NameRequestIF
  @Getter hasNewNr!: boolean
  @Getter getOriginalEffectiveDateTime!: string
  @Getter getBusinessFoundingDate!: string // actually date-time
  @Getter getFolioNumber!: string
  @Getter isConflictingLegalType!: boolean
  @Getter isNumberedCompany!: boolean
  @Getter isPremiumAccount!: GetterIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getOriginalSnapshot!: BusinessSnapshotIF
  @Getter getBusinessContact!: ContactPointIF

  // Alteration flag getters
  @Getter hasBusinessNameChanged!: boolean

  // Global actions
  @Action setDefineCompanyStepChanged!: ActionBindingIF
  @Action setEditingCompanyName!: ActionBindingIF

  // Declaration for template
  readonly CorpTypeCd = CorpTypeCd

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  // Whether components have changes
  private companyNameChanges = false
  private companyTypeChanges = false
  private contactInfoChanges = false
  private folioNumberChanges = false
  private nameTranslationChanges = false
  private officeAddressChanges = false
  private correctNameChoices: Array<string> = []
  private isEditingNames = false

  /**  Initialize the name choices for alterations */
  mounted () { this.onApprovedName() }

  /** The company name (from NR, or incorporation number). */
  private get companyName (): string {
    if (this.getApprovedName) return this.getApprovedName

    return `${this.getBusinessNumber || '[Incorporation Number]'} B.C. Ltd.`
  }

  /** Name Request applicant info */
  private get nrApplicant (): NameRequestApplicantIF {
    return this.getNameRequest?.applicant
  }

  /** Name Request expiry */
  private get expiryDate (): string {
    return this.formatDateString(this.getNameRequest.expiry)
  }

  /** Name Request phone number */
  private get phoneNumber (): string {
    return this.toDisplayPhone(this.nrApplicant.phoneNumber)
  }

  /** The recognition/founding (aka effective) datetime. */
  private get recognitionDateTime (): string {
    if (this.isCorrectionView) {
      if (this.getOriginalEffectiveDateTime) {
        return (this.apiToDateAndTimeString(this.getOriginalEffectiveDateTime) + ' Pacific time')
      }
    }
    if (this.isAlterationView) {
      if (this.getBusinessFoundingDate) {
        return (this.apiToDateAndTimeString(this.getBusinessFoundingDate) + ' Pacific time')
      }
    }
    return 'Unknown'
  }

  /** Compare names. */
  private get isNewName () {
    const correctedName = this.getApprovedName
    const currentName = this.isCorrectionView
      ? this.getOriginalIA.incorporationApplication.nameRequest.legalName
      : this.getOriginalSnapshot.businessInfo.legalName

    return correctedName !== currentName
  }

  /** Reset company name values to original. */
  private resetName () {
    this.setBusinessInformation(this.isCorrectionView
      ? this.getOriginalIA.business
      : this.getOriginalSnapshot.businessInfo
    )
    this.setNameRequest(this.isCorrectionView
      ? this.getOriginalIA.incorporationApplication.nameRequest
      : this.getOriginalSnapshot.businessInfo
    )
    this.companyNameChanges = false
  }

  /** Compare current to corrected data and update UI.  */
  @Watch('getApprovedName')
  private nameChangeHandler (): void {
    this.companyNameChanges = this.isNewName
    this.isEditingNames = false
  }

  @Watch('hasNewNr')
  private openConflictWarning (): void {
    if (this.isConflictingLegalType && !this.companyTypeChanges && this.isAlterationView) {
      // open confirmation dialog and wait for response
      this.$refs.confirm.open(
        'Name Request Type Does Not Match Business Type',
        `<p class="info-text">This ${this.getCorpTypeDescription(this.getNameRequest.legalType)} Name Request does ` +
        `not match the current business type <b>${this.getCorpTypeDescription(this.getEntityType)}</b>.\n\n` +
        `The Name Request type must match the business type before you can continue.</p>`,
        {
          width: '35rem',
          persistent: true,
          yes: 'OK',
          no: null,
          cancel: null
        }
      ).then(() => {
        // if we get here, Yes was clicked
        // nothing to do
      })
    }
  }

  // watchers for component change flags
  @Watch('companyNameChanges') private onCompanyNameChanges ():void { this.setDataChanges() }
  @Watch('companyTypeChanges') private onCompanyTypeChanges ():void { this.setDataChanges() }
  @Watch('contactInfoChanges') private onContactInfoChanges ():void { this.setDataChanges() }
  @Watch('folioNumberChanges') private onFolioNumberChanges ():void { this.setDataChanges() }
  @Watch('nameTranslationChanges') private onNameTranslationChanges ():void { this.setDataChanges() }
  @Watch('officeAddressChanges') private onOfficeAddressChanges ():void { this.setDataChanges() }

  @Watch('getApprovedName')
  private onApprovedName ():void {
    if (this.getApprovedName && !this.isNumberedCompany) {
      this.correctNameChoices = [
        CorrectionTypes.CORRECT_NEW_NR,
        CorrectionTypes.CORRECT_NAME_TO_NUMBER
      ]
      // Only allow editable name changes for Corrections
      this.isCorrectionView && this.correctNameChoices.push(CorrectionTypes.CORRECT_NAME)
    } else {
      this.correctNameChoices = [
        CorrectionTypes.CORRECT_NEW_NR
      ]
    }
  }

  private setDataChanges (): void {
    const haveChanges: boolean = this.companyNameChanges ||
      this.companyTypeChanges ||
      this.contactInfoChanges ||
      this.folioNumberChanges ||
      this.nameTranslationChanges ||
      this.officeAddressChanges
    this.setDefineCompanyStepChanged(haveChanges)
    this.emitHaveChanges(haveChanges)
  }

  /** Emits Have Changes event. */
  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}

  /** Updates store when local Editing property has changed. */
  @Watch('isEditingNames', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingCompanyName(val)
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
  padding: 1.25rem;
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
