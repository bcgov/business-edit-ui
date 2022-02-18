import { CorpTypeCd, NameRequestEntityTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourceIF } from '@/interfaces'

export const SoleProprietorshipResource: ResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  nameRequestType: NameRequestEntityTypes.FR,
  filingData: {
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: null
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under the Partnership Act. A person who commits this offence is subject to a maximum fine of $5,000.'
}
