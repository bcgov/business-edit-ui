import { CorrectionTypes, FilingCodes, NameRequestEntityTypes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const GeneralPartnershipResource: ResourceIF = {
  entityType: CorpTypeCd.PARTNERSHIP,
  entityReference: 'Business',
  contactLabel: 'Business',
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  nameRequestType: NameRequestEntityTypes.GP,
  addressLabel: 'Business Addresses',
  filingData: {
    entityType: CorpTypeCd.PARTNERSHIP,
    filingTypeCode: FilingCodes.CONVERSION
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'General Partnership cannot be changed into a Sole Proprietorship. If this is necessary, a new ' +
      'Name Request Number and Statement of Registration (along with associated fees) will be required.',
    orgPersonInfo: {
      orgPersonLabel: 'Partners',
      orgTypesLabel: 'Business or Corporation',
      subtitle: null,
      helpSection: null
    }
  },
  certifyClause: null
}
