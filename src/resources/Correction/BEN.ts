import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const BenCorrectionResource: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: null, // not used
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  addressLabel: 'Registered Office',
  title: 'Benefit Company Statement',
  description: 'This company is a benefit company and, as such, has purposes that include conducting its business in' +
               ' a responsible and sustainable manner and promoting one or more public benefits.',
  filingData: {
    filingTypeCode: FilingCodes.CORRECTION,
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER,
      CorrectNameOptions.CORRECT_NAME
    ],
    orgPersonInfo: {
      orgPersonLabel: 'Directors',
      subtitle: null // not used
    },
    nameRequestTypes: [
      NrRequestActionCodes.CHANGE_NAME,
      NrRequestActionCodes.CONVERSION
    ]
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}
