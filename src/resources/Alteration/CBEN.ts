import { CorrectNameOptions, FilingCodes } from '@/enums/'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const AlterationResourceCben: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.BEN_CONTINUE_IN),
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.ALTERATION,
    entityType: CorpTypeCd.BEN_CONTINUE_IN,
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
        value: CorpTypeCd.BEN_CONTINUE_IN,
        shortDesc: 'BC Benefit Company',
        text: 'BC Benefit Company'
      },
      {
        value: CorpTypeCd.CONTINUE_IN,
        shortDesc: 'BC Limited Company',
        text: 'BC Limited Company'
      },
      {
        value: CorpTypeCd.CCC_CONTINUE_IN,
        shortDesc: 'BC Community Contribution Company',
        text: 'BC Community Contribution Company'
      }
    ]
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the <em>Business Corporations Act.</em>'
}
