import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const RestorationResourceCben: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BEN_CONTINUE_IN),
  addressLabel: 'Registered Office',
  showEmailUnderName: false,
  userEmailOptional: false,
  userEmailLabel: 'Applicant',
  filingData: {
    entityType: CorpTypeCd.BEN_CONTINUE_IN,
    filingTypeCode: FilingCodes.RESTORATION_LTD_TO_FULL,
    priority: false
  },
  changeData: {
    correctNameOptions: [
      CorrectNameOptions.CORRECT_NEW_NR,
      CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    ],
    orgPersonInfo: {
      orgPersonLabel: 'Applicant',
      orgTypesLabel: 'Business or Corporation',
      subtitle: null // not used
    },
    nameRequestTypes: [
      NrRequestActionCodes.RESTORE
    ]
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under the BC Corporations Act. ' +
    'A person who commits this offence is subject to a maximum fine of $5000.',
  certifyText: 'business'
}
