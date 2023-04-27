import { NameChangeOptions, FilingCodes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@/bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const SpConversionResource: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  addressLabel: 'Business Addresses',
  filingData: {
    filingTypeCode: FilingCodes.FM_CONVERSION,
    entityType: CorpTypeCd.SOLE_PROP,
    priority: false,
    waiveFees: true
  },
  changeData: {
    nameChangeOptions: [
      NameChangeOptions.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'You cannot change the business type of a Sole Proprietorship / DBA. You must form a new ' +
      'business and dissolve this business once the new business is registered.',
    orgPersonInfo: {
      orgPersonLabel: 'Proprietor',
      orgTypesLabel: 'Business or Corporation',
      subtitle: 'You can change the legal name, mailing and delivery addresses and the email address of the ' +
        'individual proprietor. To change to a different proprietor, you must form a new business with that ' +
        'proprietor and dissolve this registration.'
    }
  },
  certifyClause: null // not used
}
