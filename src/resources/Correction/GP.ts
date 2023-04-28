import { NameChangeOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const GpCorrectionResource: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: null, // not used
  entityType: CorpTypeCd.PARTNERSHIP,
  addressLabel: 'Business Addresses',
  filingData: {
    filingTypeCode: FilingCodes.FM_CORRECTION,
    entityType: CorpTypeCd.PARTNERSHIP,
    priority: false
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
    },
    nameRequestTypes: [
      NrRequestActionCodes.CHANGE_NAME
    ]
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under section 90.4 of the Partnership Act. A person who commits this offence is subject to a maximum ' +
    'fine of $5,000.'
}
