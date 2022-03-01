import { CorpTypeCd, FilingCodes, NameRequestEntityTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourceIF } from '@/interfaces'

export const SoleProprietorshipResource: ResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  nameRequestType: NameRequestEntityTypes.FR,
  addressLabel: 'Business Addresses',
  filingData: {
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.CHANGE_OF_REGISTRATION
  },
  changeData: {
    typeChangeInfo: 'You can not change the business type of a Sole Proprietorship / DBA. You must form a new ' +
      'business and dissolve this business once the new business is registered.'
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under the Partnership Act. A person who commits this offence is subject to a maximum fine of $5,000.'
}
