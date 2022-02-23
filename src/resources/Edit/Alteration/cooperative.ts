import { CorpTypeCd, FilingCodes, NameRequestEntityTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourceIF } from '@/interfaces'

export const CooperativeResource: ResourceIF = {
  entityType: CorpTypeCd.COOP,
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  nameRequestType: NameRequestEntityTypes.CP,
  addressLabel: 'Registered Office',
  filingData: {
    entityType: CorpTypeCd.COOP,
    filingTypeCode: FilingCodes.ALTERATION,
    priority: false
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.' // ToDo: Future - Update Section and Act for Cooperatives
}
