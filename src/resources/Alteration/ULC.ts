import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const UlcAlterationResource: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BC_ULC_COMPANY),
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.ALTERATION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ],
    entityTypeOptions: [
      {
        value: 'ULC',
        shortDesc: 'BC Unlimited Liability Company',
        text: 'BC Unlimited Liability Company'
      },
      {
        value: 'BEN',
        shortDesc: 'BC Benefit Company',
        text: 'BC Benefit Company'
      },
      {
        value: 'BC',
        shortDesc: 'BC Limited Company',
        text: 'BC Limited Company'
      }
    ],
    articleTitle: 'Unlimited Liability Company Articles',
    articleInfo: `The company has completed a set of Unlimited Liability Company Articles containing a liability
      provision, and a copy of these articles has been added to company's record book.`
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}
