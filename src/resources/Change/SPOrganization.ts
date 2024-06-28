import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const ChangeResourceSpOrganization: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  addressLabel: 'Business Addresses',
  filingData: {
    filingTypeCode: FilingCodes.FM_CHANGE,
    entityType: CorpTypeCd.SOLE_PROP,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'You cannot change the business type of a Sole Proprietorship / DBA. You must form a new ' +
      'business and dissolve this business once the new business is registered.',
    orgPersonInfo: {
      orgPersonLabel: 'Proprietor',
      orgTypesLabel: 'Business or Corporation',
      subtitle: 'If you need to make changes to the business proprietor information, please ' +
        'contact BC Registries Staff.',
      helpSection: {
        header: 'Need Help? Contact Us',
        helpText: [
          'If you require assistance with changes to the business proprietor please contact us.'
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
