import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const CorrectionResourceC: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: null, // not used
  entityType: CorpTypeCd.CONTINUE_IN,
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.CORRECTION,
    entityType: CorpTypeCd.CONTINUE_IN,
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
    'See section 427 of the Business Corporations Act.',
  certifyText: 'business'
}
