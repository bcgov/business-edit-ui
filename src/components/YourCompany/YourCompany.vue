<template>
  <v-card flat id="your-company">
    <confirm-dialog
      ref="confirm"
      attach="#app"
    />

     <div class="define-company-header">
        <v-icon color="#38598A">mdi-domain</v-icon>
        <label class="define-company-title font-weight-bold">Your Company</label>
    </div>

    <div class="section-container">
      <!--TODO: Replace container content with Name Request Summary when it is ready -->
      <v-layout row class="mx-0">
        <v-flex xs3>
          <v-layout column>
            <label><strong>Company Name</strong></label>
            <v-flex md1>
              <v-chip v-if="companyNameChanges" x-small label color="#1669BB" text-color="white" id="corrected-lbl">
                 {{editedLabel}}
              </v-chip>
            </v-flex>
          </v-layout>
        </v-flex>

        <template v-if="!isEditingNames">
          <v-flex xs6>
            <div class="company-name">{{ companyName }}</div>
            <template v-if="companyNameChanges && !hasNewNr">
              <div class="company-info mt-4">
                <span class="font-weight-bold">Business Type: </span>
                <span>{{getEntityDesc(getEntityType)}}</span>
              </div>
              <div class="company-info">
                <span>The name of this business will be the current Incorporation Number followed by "B.C. Ltd."</span>
              </div>
            </template>
            <template v-if="isAlteration() && hasNewNr">
              <div class="company-info mt-4">
                <span class="font-weight-bold">Business Type: </span>
                <span>{{getEntityDesc(getNameRequest.legalType)}}</span>
                <v-tooltip top content-class="top-tooltip" transition="fade-transition">
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="isConflictingLegalType" v-on="on" class="ml-2" color="red darken-3" small>
                      mdi-alert
                    </v-icon>
                  </template>
                  <span>Business Types do not match</span>
                </v-tooltip>
              </div>
              <div class="company-info">
                <span class="font-weight-bold">Request Type: </span>
                <span>New Business</span>
              </div>
              <div class="company-info">
                <span class="font-weight-bold">Expiry Date: </span>
                <span>{{expiryDate}}</span>
              </div>
              <div class="company-info">
                <span class="font-weight-bold">Status: </span>
                <span>{{getNameRequest.status}}</span>
              </div>
            </template>
          </v-flex>

          <v-flex xs1 class="mt-n2">
            <div class="actions mr-4">
              <!-- TODO: only show buttons for named company -->
              <v-btn
                v-if="companyNameChanges"
                text color="primary"
                id="btn-undo-company-name"
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
              <span class="more-actions" v-if="companyNameChanges">
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

        <template v-if="isAlteration() && hasNewNr">
          <v-flex xs3 class="mt-6">
            <v-layout column>
              <label><strong>Name Request Applicant</strong></label>
            </v-layout>
          </v-flex>
          <v-flex xs6 class="mt-6">
            <template>
              <div class="name-request-applicant-info">
                <span class="font-weight-bold">Name: </span>
                <span>{{nrApplicant.fullName}}</span>
              </div>
              <div class="name-request-applicant-info">
                <span class="font-weight-bold">Address: </span>
                <span>{{nrApplicant.fullAddress}}</span>
              </div>
              <div class="name-request-applicant-info">
                <span class="font-weight-bold">Email: </span>
                <span>{{nrApplicant.emailAddress || 'N/A'}}</span>
              </div>
              <div class="name-request-applicant-info">
                <span class="font-weight-bold">Phone: </span>
                <span>{{nrApplicant.phoneNumber || 'N/A'}}</span>
              </div>
            </template>
          </v-flex>
        </template>
      </v-layout>
      <correct-name-translation class="mt-5"
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
          <div>{{ recognitionDateTime }}</div>
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
      <correct-business-contact-info
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
  BusinessContactIF,
  BusinessSnapshotIF,
  ConfirmDialogType,
  GetterIF,
  IncorporationFilingIF,
  NameRequestApplicantIF,
  NameRequestIF
} from '@/interfaces'
import { CorrectBusinessContactInfo, FolioNumber, CorrectNameTranslation, OfficeAddresses } from '.'
import { CorrectNameOptions } from '@/components/YourCompany/CompanyName'
import { CommonMixin, DateMixin, LegalApiMixin } from '@/mixins'
import { CorrectionTypes, EntityTypes } from '@/enums'
import { ConfirmDialog } from '@/components/dialogs'

@Component({
  components: {
    ConfirmDialog,
    CorrectNameOptions,
    CorrectBusinessContactInfo,
    OfficeAddresses,
    FolioNumber,
    CorrectNameTranslation
  }
})
export default class YourCompany extends Mixins(CommonMixin, DateMixin, LegalApiMixin) {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
  }

  // Getters
  @Getter getApprovedName!: string
  @Getter getBusinessNumber!: string
  @Getter getEntityType!: EntityTypes
  @Getter getNameRequest!: NameRequestIF
  @Getter hasNewNr!: boolean
  @Getter getOriginalEffectiveDate!: Date
  @Getter getFolioNumber!: string
  @Getter isConflictingLegalType!: boolean
  @Getter isNumberedCompany!: boolean
  @Getter isPremiumAccount!: GetterIF
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter getOriginalSnapshot!: BusinessSnapshotIF[]
  @Getter getBusinessContact!: BusinessContactIF

  // Actions
  @Action setDefineCompanyStepChanged!: ActionBindingIF
  @Action setEditingCompanyName!: ActionBindingIF

  // Declaration for template
  readonly EntityTypes = EntityTypes

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  // whether components have changes
  private companyNameChanges = false
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

  private get nrApplicant (): NameRequestApplicantIF {
    return this.getNameRequest?.applicant
  }

  private get expiryDate (): string {
    return new Date(this.getNameRequest.expiry).toDateString()
  }

  /** The recognition (aka effective) datetime. */
  private get recognitionDateTime (): string {
    return this.getOriginalEffectiveDate
      ? (this.convertUtcTimeToLocalTime(this.getOriginalEffectiveDate.toString()) + ' Pacific Time')
      : 'Unknown'
  }

  /** Compare names. */
  private get isNewName () {
    const correctedName = this.getApprovedName
    const currentName = this.isCorrection()
      ? this.getOriginalIA.incorporationApplication.nameRequest.legalName
      : this.getOriginalSnapshot[0].business.legalName

    return correctedName !== currentName
  }

  /** Reset company name values to original. */
  private resetName () {
    this.setBusinessInformation(this.isCorrection()
      ? this.getOriginalIA.business
      : this.getOriginalSnapshot[0].business
    )
    this.setNameRequest(this.isCorrection()
      ? this.getOriginalIA.incorporationApplication.nameRequest
      : this.getOriginalSnapshot[0].business
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
    if (this.isConflictingLegalType && this.isAlteration()) {
      // open confirmation dialog and wait for response
      this.$refs.confirm.open(
        'Name Request Type Does Not Match Business Type',
        `This ${this.getEntityDesc(this.getNameRequest.legalType)} Name Request does not match the current ` +
        `business ${this.getEntityDesc(this.getEntityType)}.\n\n` +
        `The Name Request type must match the business type before you can continue.`,
        {
          width: '35rem',
          persistent: true,
          yes: 'Ok',
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
      this.isCorrection() && this.correctNameChoices.push(CorrectionTypes.CORRECT_NAME)
    } else {
      this.correctNameChoices = [
        CorrectionTypes.CORRECT_NEW_NR
      ]
    }
  }

  private setDataChanges (): void {
    const haveChanges: boolean = this.companyNameChanges ||
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

.section-container {
  padding: 1.25rem 1rem;
  font-size: 0.875rem;
}

.define-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
}

.define-company-title {
 padding-left: 0.5rem;
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold
}

.company-info {
  padding-top: 0.5rem
}

.name-request-applicant-info:not(:first-child) {
  padding-top: 0.5rem
}

.actions {
  position: absolute;
  right: 0;

  .v-btn {
    min-width: 0.5rem;
  }
}

.drop-down-action{
  color: $primary-blue;
}
</style>
