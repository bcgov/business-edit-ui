// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'

// Interfaces
import {
  ActionBindingIF,
  AlterationFilingIF,
  BusinessSnapshotIF,
  CertifyIF,
  CorrectionFilingIF,
  EffectiveDateTimeIF,
  IncorporationAddressIf,
  IncorporationFilingIF,
  OrgPersonIF,
  ShareClassIF,
  NameTranslationIF,
  NameRequestIF,
  ShareStructureIF
} from '@/interfaces'

// Shared Interfaces
import { ContactPointIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces'

// Constants
import { ActionTypes, EntityTypes, FilingTypes, RoleTypes } from '@/enums'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Vue {
  // Global getters
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getBusinessId!: string
  @Getter getCurrentDate!: string
  @Getter getEntityType!: EntityTypes
  @Getter getCorrectedFilingId!: number
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getDocumentOptionalEmail: string
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getDetailComment!: string
  @Getter getDefaultCorrectionDetailComment!: string
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getNameRequest!: NameRequestIF
  @Getter getCertifyState!: CertifyIF
  @Getter getOfficeAddresses!: IncorporationAddressIf | {}
  @Getter getBusinessContact!: ContactPointIF
  @Getter getAgreementType!: string
  @Getter getOriginalSnapshot: BusinessSnapshotIF
  @Getter getNewResolutionDates!: string[]
  @Getter getSnapshotShareStructure!: ShareStructureIF
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasNewNr!: boolean
  @Getter getNewAlteration!: any // FUTURE AlterationFilingIF
  @Getter getProvisionsRemoved!: boolean

  // Global actions
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslations!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDateTimeString!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setFilingDateTime!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setDetailComment!: ActionBindingIF
  @Action setOriginalSnapshot!: ActionBindingIF
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setOriginalResolutionDates!: ActionBindingIF
  @Action setResolutionDates!: ActionBindingIF

  /**
   * Builds an Incorporation Application correction filing from store data. Used when saving a filing.
   * @param isDraft whether this is a draft
   * @returns the incorporation application filing body
   */
  buildIaCorrectionFiling (isDraft: boolean): CorrectionFilingIF {
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    // if filing and paying, filter out removed entities and omit the 'action' properties
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

      nameTranslations = this.prepareNameTranslations()
    }

    // Build filing
    const filing: CorrectionFilingIF = {
      header: {
        name: FilingTypes.CORRECTION,
        certifiedBy: this.getCertifyState.certifiedBy,
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
        offices: this.getOfficeAddresses,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          extension: this.getBusinessContact.extension
        },
        parties,
        shareStructure: {
          shareClasses
        },
        incorporationAgreement: {
          agreementType: this.getAgreementType
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
   * Builds an alteration filing from store data. Used when saving a filing.
   * @param isDraft whether this is a draft
   * @returns the alteration filing body
   */
  buildAlterationFiling (isDraft: boolean): AlterationFilingIF {
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    // if filing and paying, filter out removed entities and omit the 'action' properties
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

      nameTranslations = this.prepareNameTranslations()
    }

    // Build filing
    const filing: AlterationFilingIF = {
      header: {
        name: FilingTypes.ALTERATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber
      },
      business: {
        foundingDate: this.getOriginalSnapshot.businessInfo.foundingDateTime,
        legalType: this.getOriginalSnapshot.businessInfo.legalType,
        identifier: this.getOriginalSnapshot.businessInfo.identifier,
        legalName: this.getOriginalSnapshot.businessInfo.legalName
      },
      alteration: {
        provisionsRemoved: this.getProvisionsRemoved,
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        nameRequest: { ...this.getNameRequest },
        nameTranslations: nameTranslations,
        shareStructure: {
          resolutionDates: this.getNewResolutionDates,
          shareClasses
        },
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          extension: this.getBusinessContact.extension
        }
      }
    }

    // If FED then set header fields
    if (this.getEffectiveDateTime.isFutureEffective) {
      filing.header.isFutureEffective = true
      const effectiveDate = new Date(this.getEffectiveDateTime.dateTimeString)
      filing.header.effectiveDate = effectiveDate.toISOString() // in UTC
    }

    if (this.getDocumentOptionalEmail) {
      filing.header.documentOptionalEmail = this.getDocumentOptionalEmail
    }

    // Include name request info when applicable
    if (this.hasNewNr || this.hasBusinessNameChanged) filing.alteration.nameRequest = { ...this.getNameRequest }

    return filing
  }

  /**
   * Prepares name translations for non-draft save.
   * @returns the updated name translations array
   */
  prepareNameTranslations () : NameTranslationIF[] {
    // Filter out and modify name translation to match schema
    return this.getNameTranslations?.filter(x => x.action !== ActionTypes.REMOVED)
      .map(x => {
        let nameTranslation = {
          name: x.name
        }
        if (x.action !== ActionTypes.ADDED) {
          nameTranslation['id'] = x.id
        }
        return nameTranslation
      })
  }

  /**
   * Parses a correction filing into the store.
   * @param filing the correction filing
   */
  parseCorrection (filing: CorrectionFilingIF): void {
    // Store business information
    this.setBusinessInformation(filing.business)

    // Store name request
    this.setNameRequest(filing.incorporationApplication.nameRequest)

    // Store name translations
    // NB: The first time (when we initiate a correction), the `oldName` and `action` props are not
    //     available in the api response, which creates an issue of not having these props in store.
    //     Due to missing props, change event was not triggering if the action value is changed (at
    //     the time of Delete there is no other prop change except action). To handle this scenario,
    //     this structure needs to be kept.
    this.setNameTranslations(
      filing.incorporationApplication.nameTranslations?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: x.oldName || null,
          action: x.action || null
        }
      }) || []
    )

    // Store office addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Store business contact
    this.setBusinessContact({
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    })

    // Store people and roles
    this.setPeopleAndRoles(filing.incorporationApplication.parties || [])

    // Store share classes
    if (filing.incorporationApplication.shareStructure) {
      this.setShareClasses(filing.incorporationApplication.shareStructure.shareClasses)
    } else {
      // if it exists, load data from old schema
      const incorporationApplication = filing.incorporationApplication as any
      const shareClasses = incorporationApplication.shareClasses as ShareClassIF[]
      if (shareClasses) {
        this.setShareClasses(shareClasses)
      } else {
        this.setShareClasses([])
      }
    }

    // Store incorporation agreement type
    this.setIncorporationAgreementStepData({
      agreementType: filing.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Store certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Store detail comment
    // NB: remove the first line (default comment)
    const comment: string = filing.correction.comment || ''
    const detailComment = comment.split('\n').slice(1).join('\n')
    this.setDetailComment(detailComment)

    // Store folio number
    this.setFolioNumber(filing.header.folioNumber)

    // Store filing date-time
    this.setFilingDateTime(filing.header.date)

    // Store effective date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // Store staff payment
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
   * @param filing the alteration filing
   * @param businessSnapshot the latest business snapshot
   */
  parseAlteration (filing: AlterationFilingIF, businessSnapshot: BusinessSnapshotIF): void {
    // Store original snapshot
    this.setOriginalSnapshot(businessSnapshot)

    // Store current entity type
    this.setEntityType(filing.alteration.business.legalType)

    // Store business information
    this.setBusinessInformation({
      ...filing.business,
      ...filing.alteration.business
    })

    // Store name request
    this.setNameRequest(filing.alteration.nameRequest)

    // Store name translations
    this.setNameTranslations(
      filing.alteration.nameTranslations?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: x.oldName || null,
          action: x.action || null
        }
      }) || []
    )

    this.setProvisionsRemoved(filing.alteration.provisionsRemoved)

    // Store office addresses
    // *** TODO: should restore office addresses from alteration, not snapshot???
    this.setOfficeAddresses(businessSnapshot.incorporationAddress)

    // Store people and roles
    // *** TODO: should restore people and roles from alteration, not snapshot???
    this.setPeopleAndRoles(
      businessSnapshot.orgPersons?.map(director => {
        return {
          officer: {
            firstName: director.officer.firstName,
            lastName: director.officer.lastName
          },
          mailingAddress: director.deliveryAddress,
          deliveryAddress: director.mailingAddress,
          roles: [
            {
              roleType: director.role in RoleTypes ? director.role
                : Object.values(RoleTypes).find(role => {
                  if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                    return role
                  }
                }),
              appointmentDate: director.appointmentDate,
              cessationDate: null
            }
          ]
        }
      }) || []
    )

    // Store share classes and resolution dates
    const shareStructure = filing.alteration.shareStructure
    this.setShareClasses(shareStructure.shareClasses)
    this.setResolutionDates(shareStructure.resolutionDates)
    this.setOriginalResolutionDates(this.getSnapshotShareStructure.resolutionDates)

    // Store business contact
    this.setBusinessContact({
      ...filing.alteration.contactPoint,
      confirmEmail: filing.alteration.contactPoint.email
    })

    // Store certify state
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Store folio number
    this.setFolioNumber(filing.header.folioNumber)

    // Store filing date
    this.setFilingDateTime(filing.header.date)

    // Set document optional email
    this.setDocumentOptionalEmail(filing.header.documentOptionalEmail)

    // Store effective date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)
  }

  /**
   * Parses a business snapshot into the store.
   * @param businessSnapshot the latest business snapshot
   */
  parseBusinessSnapshot (businessSnapshot: BusinessSnapshotIF = this.getOriginalSnapshot): void {
    // Store original snapshot
    this.setOriginalSnapshot(businessSnapshot)

    // Store current entity type
    this.setEntityType(businessSnapshot.businessInfo.legalType)

    // Store business information
    this.setBusinessInformation(businessSnapshot.businessInfo)

    // Store name request
    this.setNameRequest({
      legalType: businessSnapshot.businessInfo.legalType,
      legalName: businessSnapshot.businessInfo.legalName,
      foundingDate: businessSnapshot.businessInfo.foundingDateTime
    })

    // Store name translations
    this.setNameTranslations(
      businessSnapshot.nameTranslations?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: null,
          action: null
        }
      }) || []
    )

    // Store office addresses
    this.setOfficeAddresses(businessSnapshot.incorporationAddress)

    // Store people and roles
    this.setPeopleAndRoles(
      businessSnapshot.orgPersons?.map(director => {
        return {
          officer: {
            firstName: director.officer.firstName,
            lastName: director.officer.lastName
          },
          mailingAddress: director.deliveryAddress,
          deliveryAddress: director.mailingAddress,
          roles: [
            {
              roleType: director.role in RoleTypes ? director.role
                : Object.values(RoleTypes).find(role => {
                  if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                    return role
                  }
                }),
              appointmentDate: director.appointmentDate,
              cessationDate: null
            }
          ]
        }
      }) || []
    )

    const shareStructure = businessSnapshot.shareStructure
    const shareClasses = cloneDeep(shareStructure.shareClasses)

    // Apply a type to share classes and series
    shareClasses.forEach(shareClass => {
      shareClass.type = 'Class'
      shareClass.series.forEach(shareSeries => { shareSeries.type = 'Series' })
    })

    // Store share classes and original resolution dates
    this.setShareClasses(shareClasses)
    this.setOriginalResolutionDates(shareStructure.resolutionDates)

    // Store business contact
    this.setBusinessContact(businessSnapshot.contactPoint)
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
