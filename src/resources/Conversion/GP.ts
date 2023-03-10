import { NameChangeOptions, FilingCodes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const GpConversionResource: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  addressLabel: 'Business Addresses',
  filingData: {
    filingTypeCode: FilingCodes.FM_CONVERSION,
    entityType: CorpTypeCd.PARTNERSHIP,
    priority: false,
    waiveFees: true
  },
  changeData: {
    nameChangeOptions: [
      NameChangeOptions.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'General Partnership cannot be changed into a Sole Proprietorship. If this is necessary, a new ' +
      'Name Request Number and Statement of Registration (along with associated fees) will be required.',
    orgPersonInfo: {
      orgPersonLabel: 'Partners',
      orgTypesLabel: 'Business or Corporation',
      subtitle: 'You must have a minimum of two partners. You can add or remove partners (individual person or ' +
        'business) as well as change the mailing and delivery addresses and email address of individual people and ' +
        'business partners.'
    }
  },
  certifyClause: null // not used
}
