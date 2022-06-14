import { CorrectionTypes, FilingCodes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

export const SoleProprietorshipResource: any = {
  addressLabel: 'Business Addresses',
  entityType: CorpTypeCd.SOLE_PROP,
  entityReference: 'Business',
  contactLabel: 'Business',
  filingData: {
    filingTypeCode: FilingCodes.FM_CORRECTION,
    entityType: CorpTypeCd.SOLE_PROP,
    priority: false
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR
    ],
    orgPersonInfo: {
      orgPersonLabel: 'Proprietor',
      orgTypesLabel: 'Business or Corporation',
      subtitle: 'You can change the legal name, mailing and delivery addresses and the email address of the ' +
        'individual proprietor. To change to a different proprietor, you must form a new business with that ' +
        'proprietor and dissolve this registration.'
    }
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under section 90.4 of the Partnership Act. A person who commits this offence is subject to a maximum ' +
    'fine of $5,000.'
}
