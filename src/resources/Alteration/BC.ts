import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const AlterationResourceBc: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BC_COMPANY),
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.ALTERATION,
    entityType: CorpTypeCd.BC_COMPANY,
    priority: false
  },
  // Conditionally used in place of filingData when switching from BC to ULC.
  additionalFilingData: {
    filingTypeCode: FilingCodes.ALTERATION_BC_TO_ULC,
    entityType: CorpTypeCd.BC_COMPANY,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ],
    nameRequestTypes: [
      NrRequestActionCodes.CHANGE_NAME,
      NrRequestActionCodes.CONVERSION
    ],
    entityTypeOptions: [
      {
        value: CorpTypeCd.BC_COMPANY,
        shortDesc: 'BC Limited Company',
        text: 'BC Limited Company'
      },
      {
        value: CorpTypeCd.BENEFIT_COMPANY,
        shortDesc: 'BC Benefit Company',
        text: 'BC Benefit Company'
      },
      {
        value: CorpTypeCd.BC_ULC_COMPANY,
        shortDesc: 'BC Unlimited Liability Company',
        text: 'BC Unlimited Liability Company'
      },
      {
        value: CorpTypeCd.BC_CCC,
        shortDesc: 'BC Community Contribution Company',
        text: 'BC Community Contribution Company'
      }
    ],
    articleTitle: 'Limited Company Articles',
    articleInfo: `The company has completed a set of BC LTD Company Articles, and a copy of these articles has been
      added to company's record book.`
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.',
  certifyText: 'business'
}
