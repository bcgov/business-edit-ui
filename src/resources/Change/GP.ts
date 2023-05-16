import { NameChangeOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const GpChangeResource: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  addressLabel: 'Business Addresses',
  filingData: {
    filingTypeCode: FilingCodes.FM_CHANGE,
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
        'business partners.',
      helpSection: {
        header: 'Need Help? Contact Us',
        helpText: [
          'If you require assistance with adding a business partner please contact us.'
        ]
      }
    },
    nameRequestTypes: [
      NrRequestActionCodes.CHANGE_NAME
    ]
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under section 90.4 of the Partnership Act. A person who commits this offence is subject to a maximum ' +
    'fine of $5,000.'
}
