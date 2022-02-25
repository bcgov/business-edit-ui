import { CorpTypeCd, FilingCodes, NameRequestEntityTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourceIF } from '@/interfaces'

export const GeneralPartnershipResource: ResourceIF = {
  entityType: CorpTypeCd.PARTNERSHIP,
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  nameRequestType: NameRequestEntityTypes.GP,
  addressLabel: 'Business Addresses',
  filingData: {
    entityType: CorpTypeCd.PARTNERSHIP,
    filingTypeCode: FilingCodes.CHANGE_FIRM
  },
  typeChangeInfo: 'General Partnership cannot be changed into a Sole Proprietorship. If this is necessary, a new ' +
    'Name Request Number and Statement of Registration (along with associated fees) will be required.',
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under the Partnership Act. A person who commits this offence is subject to a maximum fine of $5,000.'
}
