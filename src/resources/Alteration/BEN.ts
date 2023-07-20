import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const BenAlterationResource: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.ALTERATION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ],
    entityTypeOptions: [
      {
        value: 'BEN',
        SHORT_DESC: 'BC Benefit Company',
        text: 'BC Benefit Company'
      },
      {
        value: 'BC',
        SHORT_DESC: 'BC Limited Company',
        text: 'BC Limited Company'
      },
      {
        value: 'CC',
        SHORT_DESC: 'BC Community Contribution Company',
        text: 'BC Community Contribution Company'
      }
    ],
    articleTitle: 'Benefit Company Articles',
    articleInfo: `The company has completed a set Benefit Company Articles containing a benefit provision, 
      and a copy of these articles has been added to the company's record book.`
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}
