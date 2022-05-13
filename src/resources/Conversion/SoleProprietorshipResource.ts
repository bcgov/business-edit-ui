import { CorrectionTypes, FilingCodes, NameRequestEntityTypes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const SoleProprietorshipResource: ResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
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
      subtitle: null,
      helpSection: null
    }
  },
  certifyClause: null
}
