import { CorrectionTypes, FilingCodes, NameRequestEntityTypes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const CooperativeResource: ResourceIF = {
  entityReference: 'Cooperative Association',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  nameRequestType: NameRequestEntityTypes.CP,
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.SPECIAL_RESOLUTION,
    entityType: CorpTypeCd.COOP,
    priority: false
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR
    ]
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 200 of the Cooperative Association Act.'
}
