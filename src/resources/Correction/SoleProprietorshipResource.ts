import { CorrectionTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

export const SoleProprietorshipResource: any = {
  addressLabel: 'Business Office',
  entityType: CorpTypeCd.SOLE_PROP,
  entityReference: 'Company',
  contactLabel: 'Business Office',
  title: 'Sole Proprietorship Statement',
  description: 'See designs.',
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR,
      CorrectionTypes.CORRECT_NAME
    ],
    orgPersonInfo: {
      orgPersonLabel: 'Proprietor',
      orgTypesLabel: 'Corporation or Firm'
    }
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under section 90.4 of the Partnership Act. A person who commits this offence is subject to a maximum ' +
    'fine of $5,000.'
}
