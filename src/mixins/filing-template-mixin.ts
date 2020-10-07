// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter, State } from 'vuex-class'
// Interfaces
import {
  ActionBindingIF,
  CorrectionFilingIF,
  IncorporationFilingIF,
  OrgPersonIF,
  ShareClassIF,
  StateModelIF,
  NameTranslationIF,
  NameTranslationDraftIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
// Constants
import { ActionTypes, EntityTypes, FilingTypes } from '@/enums'
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
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getDetailComment!: string | null
  @Getter getDefaultCorrectionDetailComment!: string

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslations!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setFilingDate!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setDetailComment!: ActionBindingIF

  /**
   * Builds an Incorporation Application Correction filing body from store data. Used when saving a filing.
   * @param isDraft boolean indicating whether this is a draft
   * @returns the IA Correction filing body to save
   */
  buildIaCorrectionFiling (isDraft: boolean): CorrectionFilingIF {
    // if filing and paying, filter out removed entities and omit the 'action' property
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.stateModel.nameTranslations
    if (!isDraft) {
      // Filter out parties actions
      parties = parties.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out class actions
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out series actions
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      // Filter out and modify name translation to match schema
      nameTranslations = this.prepareNameTranslations()
    }

    // Build filing.
    const filing: CorrectionFilingIF = {
      header: {
        name: FilingTypes.CORRECTION,
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
        correctedFilingType: FilingTypes.INCORPORATION_APPLICATION,
        correctedFilingDate: this.getCurrentDate,
        comment: `${this.getDefaultCorrectionDetailComment}\n${this.getDetailComment}`
      },
      incorporationApplication: {
        nameRequest: {
          legalType: this.getEntityType,
          legalName: this.getApprovedName,
          nrNumber: this.getNameRequestNumber
        },
        nameTranslations: nameTranslations,
        offices: this.stateModel.defineCompanyStep.officeAddresses,
        contactPoint: {
          email: this.stateModel.defineCompanyStep.businessContact.email,
          phone: this.stateModel.defineCompanyStep.businessContact.phone,
          extension: this.stateModel.defineCompanyStep.businessContact.extension
        },
        parties,
        shareStructure: {
          shareClasses
        },
        incorporationAgreement: {
          agreementType: this.stateModel.incorporationAgreementStep.agreementType
        }
      }
    }

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
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
        filing.header.priority = false
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }

    return filing
  }

  /**
   * Prepare name translations for non draft correction
   */
  prepareNameTranslations () : NameTranslationIF {
    const translations = this.stateModel.nameTranslations as NameTranslationDraftIF[]
    return {
      new: translations
        .filter(x => x.action === ActionTypes.ADDED)
        .map(x => x.value),
      modified: translations
        .filter(x => x.action === ActionTypes.EDITED)
        .map(x => {
          return {
            newValue: x.value,
            oldValue: x.oldValue
          }
        }),
      ceased: translations
        .filter(x => x.action === ActionTypes.REMOVED)
        .map(x => x.value)
    } as NameTranslationIF
  }

  /**
   * Parses a correction filing into the store.
   * @param filing the correction filing body to be parsed
   */
  parseCorrection (filing: CorrectionFilingIF): void {
    // Set Business Information
    this.setBusinessInformation(filing.business)

    // Set Name Request
    this.setNameRequest(filing.incorporationApplication.nameRequest)

    // Set Name Translations
    if (filing.incorporationApplication.nameTranslations instanceof Array) {
      // If it's an array that means it's a draft which is saved from edit-ui by staff.
      this.setNameTranslations(filing.incorporationApplication.nameTranslations)
    } else {
      // If it's an object that means it's an initial draft created from filing-ui and has a structure of an IA.
      this.setNameTranslations(
        filing.incorporationApplication.nameTranslations.new?.map(x => {
          return {
            value: x,
            oldValue: null,
            action: null
          }
        })
      )
    }

    // Set Office Addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Set Business Contact
    const contact = {
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set People and Roles
    this.setPeopleAndRoles(filing.incorporationApplication.parties || [])

    // Set Share Structure
    if (filing.incorporationApplication.shareStructure) {
      this.setShareClasses(filing.incorporationApplication.shareStructure.shareClasses)
    } else {
      // if it exists, load data from old schema
      const shareClasses = (filing.incorporationApplication as any).shareClasses
      if (shareClasses) {
        this.setShareClasses(shareClasses)
      } else {
        this.setShareClasses([])
      }
    }

    // Set Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: filing.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Set Certify Form
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // load Detail Comment, removing the first line (default comment)
    const comment: string = filing.correction.comment || ''
    const detailComment = comment.split('\n').slice(1).join('\n')
    this.setDetailComment(detailComment)

    // Set Folio Number
    this.setFolioNumber(filing.header.folioNumber)

    // Set Filing Date
    this.setFilingDate(filing.header.date)

    // Set Effective Time
    this.setEffectiveDate(filing.header.effectiveDate)

    // Set Staff Payment
    if (filing.header.routingSlipNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.FAS,
        routingSlipNumber: filing.header.routingSlipNumber,
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: filing.header.priority
      })
    } else if (filing.header.bcolAccountNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.BCOL,
        routingSlipNumber: '',
        bcolAccountNumber: filing.header.bcolAccountNumber,
        datNumber: filing.header.datNumber,
        folioNumber: filing.header.folioNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.waiveFees) {
      this.setStaffPayment({
        option: StaffPaymentOptions.NO_FEE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    } else {
      this.setStaffPayment({
        option: StaffPaymentOptions.NONE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
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
