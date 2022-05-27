import { CorrectionTypes, FilingCodes, NameRequestEntityTypes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const SoleProprietorshipResource: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  nameRequestType: NameRequestEntityTypes.FR,
  addressLabel: 'Business Addresses',
  filingData: {
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.CONVERSION
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'You cannot change the business type of a Sole Proprietorship / DBA. You must form a new ' +
      'business and dissolve this business once the new business is registered.',
    orgPersonInfo: {
      orgPersonLabel: 'Proprietor',
      orgTypesLabel: 'Business or Corporation',
      subtitle: 'You can change the legal name, mailing and delivery addresses and the email address of the ' +
        'proprietor. To change to a different proprietor, you must form a new business with that proprietor ' +
        'and dissolve this registration.',
      helpSection: {
        header: 'Need Help? Contact Us',
        helpText: [
          'If your require assistance with changes to the business proprietor please contact us.'
        ]
      }
    }
  },
  certifyClause: null
}
