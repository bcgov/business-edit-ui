// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  StateModelIF,
  IncorporationFilingIF,
  OrgPersonIF,
  ShareClassIF,
  CorrectionFilingIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'

// Constants
import { CORRECTION, INCORPORATION_APPLICATION } from '@/constants'
import { EntityTypes, FilingStatus } from '@/enums'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Vue {
  // Global state
  @State stateModel!: StateModelIF

  // Global getters
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getBusinessId!: string
  @Getter getCurrentDate!: string
  @Getter getEntityType!: EntityTypes
  @Getter getFilingDate!: string
  @Getter getCorrectedFilingId!: string
  @Getter getEffectiveDate!: Date
  @Getter isFutureEffective!: boolean
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string
  @Getter getStaffPayment!: StaffPaymentIF

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslations!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setOrgPersonList!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setFilingDate!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF

  /**
   * Builds an Incorporation Application Correction filing body from store data. Used when saving a filing.
   * @returns the IA Correction filing body to save
   */
  buildIaCorrectionFiling (): CorrectionFilingIF {
    // Build filing.
    const filing: CorrectionFilingIF = {
      header: {
        name: CORRECTION,
        certifiedBy: this.stateModel.certifyState.certifiedBy,
        date: this.getCurrentDate,
        folioNumber: this.getFolioNumber
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId,
        legalName: this.getApprovedName
      },
      correction: {
        correctedFilingId: this.getCorrectedFilingId,
        correctedFilingType: INCORPORATION_APPLICATION,
        correctedFilingDate: this.getCurrentDate,
        comment: '',
        incorporationApplication: {
          nameRequest: {
            legalType: this.getEntityType,
            legalName: this.getApprovedName,
            nrNumber: this.getNameRequestNumber
          },
          nameTranslations: {
            new: this.stateModel.nameTranslations
          },
          offices: this.stateModel.defineCompanyStep.officeAddresses,
          contactPoint: {
            email: this.stateModel.defineCompanyStep.businessContact.email,
            phone: this.stateModel.defineCompanyStep.businessContact.phone,
            extension: this.stateModel.defineCompanyStep.businessContact.extension
          },
          parties: this.getOrgPeople,
          shareStructure: {
            shareClasses: this.getShareClasses
          },
          incorporationAgreement: {
            agreementType: this.stateModel.incorporationAgreementStep.agreementType
          }
        }
      }
    }

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.correction.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.correction.incorporationApplication.nameRequest.legalName = this.getApprovedName
    }

    // Populate Staff Payment according to payment option
    switch (this.getStaffPayment.option) {
      case StaffPaymentOptions.FAS:
        filing.header.routingSlipNumber = this.getStaffPayment.routingSlipNumber
        filing.header.priority = this.getStaffPayment.isPriority
        break

      case StaffPaymentOptions.BCOL:
        filing.header.bcolAccountNumber = this.getStaffPayment.bcolAccountNumber
        filing.header.datNumber = this.getStaffPayment.datNumber
        filing.header.folioNumber = this.getStaffPayment.folioNumber
        filing.header.priority = this.getStaffPayment.isPriority
        break

      case StaffPaymentOptions.NO_FEE:
        filing.header.waiveFees = true
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }

    return filing
  }

  /**
   * Parses a correction filing into the store.
   * @param filing the correction filing body to be parsed
   */
  parseCorrection (filing: CorrectionFilingIF): void {
    // Set Business Information
    this.setBusinessInformation(filing.business)

    // Set Name Request
    this.setNameRequest(filing.correction.incorporationApplication.nameRequest)

    // Set Name Translations
    this.setNameTranslations(filing.correction.incorporationApplication.nameTranslations?.new)

    // Set Office Addresses
    this.setOfficeAddresses(filing.correction.incorporationApplication.offices)

    // Set Business Contact
    const contact = {
      ...filing.correction.incorporationApplication.contactPoint,
      confirmEmail: filing.correction.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set Persons and Organizations
    this.setOrgPersonList(filing.correction.incorporationApplication.parties || [])

    // Set Share Structure
    if (filing.correction.incorporationApplication.shareStructure) {
      this.setShareClasses(filing.correction.incorporationApplication.shareStructure.shareClasses)
    } else {
      // if it exists, load data from old schema
      const shareClasses = (filing.correction.incorporationApplication as any).shareClasses
      if (shareClasses) {
        this.setShareClasses(shareClasses)
      } else {
        this.setShareClasses([])
      }
    }

    // Set Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: filing.correction.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Set Certify Form
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Set Folio Number
    this.setFolioNumber(filing.header.folioNumber)

    // Set Filing Date
    this.setFilingDate(filing.header.date)

    // Set Staff Payment
    if (filing.header.routingSlipNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.FAS,
        routingSlipNumber: filing.header.routingSlipNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.bcolAccountNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.BCOL,
        bcolAccountNumber: filing.header.bcolAccountNumber,
        datNumber: filing.header.datNumber,
        folioNumber: filing.header.folioNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.waiveFees) {
      this.setStaffPayment({
        option: StaffPaymentOptions.NO_FEE
      })
    } else {
      this.setStaffPayment({
        option: StaffPaymentOptions.NONE
      })
    }
  }

  /**
   * Parses an alteration filing into the store.
   * @param filing the alteration filing body to be parsed
   */
  parseAlteration (filing: any): void {
    // Alteration body to parse TBD
    // Will refactor above parse function into 1 generic filing parse function when we know more
  }

  /**
    * Ensure consistent object structure for an incorporation application
    * whether it contains a Name Request or not, and whether it is an initial
    * draft or it has been previously saved. Object merging does not
    * work very well otherwise (due to nested properties).
    * @param filing the draft filing fetched from legal-api
    * @returns the filing in safe-empty state if applicable
  */
  formatEmptyFiling (filing: any): IncorporationFilingIF {
    let toReturn = filing
    if (toReturn.incorporationApplication) {
      // if there are no offices, populate empty array
      if (!toReturn.incorporationApplication.offices) {
        toReturn.incorporationApplication.offices = []
      }

      // if there is no contact point, populate empty object
      if (!toReturn.incorporationApplication.contactPoint) {
        toReturn.incorporationApplication.contactPoint = {
          email: '',
          phone: '',
          extension: ''
        }
      }

      // if there are no parties, populate empty array
      if (!toReturn.incorporationApplication.parties) {
        toReturn.incorporationApplication.parties = []
      }

      // if there is no share structure...
      if (!toReturn.incorporationApplication.shareStructure) {
        // if there are share classes (ie, old schema), assign them to the share structure (ie, new schema)
        if (toReturn.incorporationApplication.shareClasses) {
          toReturn.incorporationApplication.shareStructure = {
            shareClasses: toReturn.incorporationApplication.shareClasses
          }
        } else {
          // otherwise populate empty object
          toReturn.incorporationApplication.shareStructure = {
            shareClasses: []
          }
        }
      }
    }
    return toReturn
  }
}
