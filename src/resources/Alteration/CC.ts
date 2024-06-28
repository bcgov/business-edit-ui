import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const AlterationResourceCc: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BC_CCC),
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.ALTERATION,
    entityType: CorpTypeCd.BC_CCC,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ],
    articleTitle: 'Community Contribution Company Articles',
    articleInfo: `The company has completed a set of Community Contribution Company Articles
      containing a community provision, and a copy of these articles has been added to company's record book.`
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}
