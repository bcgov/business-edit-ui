// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { ActionBindingIF, StateModelIF, IncorporationFilingIF, OrgPersonIF, ShareClassIF } from '@/interfaces'

// Constants
import { INCORPORATION_APPLICATION } from '@/constants'
import { EntityTypes, FilingStatus } from '@/enums'

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
  @Getter getEffectiveDate!: Date
  @Getter isFutureEffective!: boolean
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string

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

  /**
   * Builds an Incorporation Application filing body from store data. Used when saving a filing.
   * @returns the IA filing body to save
   */
  buildIaFiling (): IncorporationFilingIF {
    // Build filing.
    const filing: IncorporationFilingIF = {
      header: {
        name: INCORPORATION_APPLICATION,
        certifiedBy: this.stateModel.certifyState.certifiedBy,
        date: this.getFilingDate || this.getCurrentDate,
        folioNumber: this.getFolioNumber,
        isFutureEffective: this.isFutureEffective
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId
      },
      incorporationApplication: {
        nameRequest: {
          legalType: this.getEntityType
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

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
    }

    // Pass the effective date only for a future effective filing.
    // TODO: verify that this is UTC time
    const effectiveDate: Date = this.getEffectiveDate
    if (effectiveDate) {
      const formattedDateTime = (effectiveDate.toISOString()).replace('Z', '+00:00')
      filing.header.effectiveDate = formattedDateTime
    }
    return filing
  }

  /**
   * Parses an Incorporation Application filing into the store. Used when loading a filing.
   * @param filing the IA filing body to parse
   */
  parseIncorpApp (filing: IncorporationFilingIF): void {
    // Set Business Information
    this.setBusinessInformation(filing.business)

    // Set Name Request
    this.setNameRequest(filing.incorporationApplication.nameRequest)

    // Set Name Translations
    this.setNameTranslations(filing.incorporationApplication.nameTranslations?.new)

    // Set Office Addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Set Business Contact
    const contact = {
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set Persons and Organizations
    this.setOrgPersonList(filing.incorporationApplication.parties || [])

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

    // Set Effective Date
    if (filing.header.effectiveDate) {
      let effectiveDatetime: Date = filing.header.effectiveDate ? new Date(filing.header.effectiveDate) : null
      // Compare datetime to improve UX and work around default effective date set by back end
      if (filing.header.status !== FilingStatus.COMPLETED && effectiveDatetime < new Date()) {
        effectiveDatetime = null
      }
      this.setEffectiveDate(effectiveDatetime)
      this.setIsFutureEffective(!!effectiveDatetime)
    } else {
      this.setEffectiveDate(null)
      this.setIsFutureEffective(false)
    }

    // Set Folio Number
    this.setFolioNumber(filing.header.folioNumber)

    // Set Filing Date
    this.setFilingDate(filing.header.date)
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
   * Parses a correction filing into the store.
   * @param filing the correction filing body to be parsed
   */
  parseCorrection (filing: any): void {
    // See https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/correction.json
    // See https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/diff.json
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
