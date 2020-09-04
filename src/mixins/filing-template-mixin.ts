// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { ActionBindingIF, StateModelIF, IncorporationFilingIF, IncorporationFilingBodyIF, OrgPersonIF, ShareClassIF
} from '@/interfaces'

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

  /** Constructs an Incorp App filing body from store data. Used when saving a filing. */
  buildIaFiling (): IncorporationFilingIF {
    // Build filing.
    const filing: IncorporationFilingIF = {
      filing: {
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
          shareClasses: this.getShareClasses,
          incorporationAgreement: {
            agreementType: this.stateModel.incorporationAgreementStep.agreementType
          }
        }
      }
    }

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
    }

    // Pass the effective date only for a future effective filing.
    // TODO: verify that this is UTC time
    const effectiveDate: Date = this.getEffectiveDate
    if (effectiveDate) {
      const formattedDateTime = (effectiveDate.toISOString()).replace('Z', '+00:00')
      filing.filing.header.effectiveDate = formattedDateTime
    }
    return filing
  }

  /**
   * Parses an incorporation application filing into the store.
   * @param filing the IA filing body to be parsed
   */
  parseIncorpApp (filing: IncorporationFilingBodyIF): void {
    // Set Business Information
    this.setBusinessInformation(filing.business)

    // Set Name Request
    this.setNameRequest(filing.incorporationApplication.nameRequest)

    // Set Office Addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Set Name Translations
    this.setNameTranslations(filing.incorporationApplication.nameTranslations?.new)

    // Set Business Contact
    const contact = {
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set Persons and Organizations
    this.setOrgPersonList(filing.incorporationApplication.parties)

    // Set Share Structure
    this.setShareClasses(filing.incorporationApplication.shareStructure
      ? filing.incorporationApplication.shareStructure.shareClasses : [])

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
}
