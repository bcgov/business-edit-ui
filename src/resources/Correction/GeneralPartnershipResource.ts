import { CorrectionTypes, FilingCodes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

export const GeneralPartnershipResource: any = {
  addressLabel: 'Business Addresses',
  entityType: CorpTypeCd.PARTNERSHIP,
  entityReference: 'Business',
  contactLabel: 'Business',
  filingData: {
    filingTypeCode: FilingCodes.FM_CORRECTION,
    entityType: CorpTypeCd.PARTNERSHIP,
    priority: false
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR,
      CorrectionTypes.CORRECT_NAME
    ],
    typeChangeInfo: 'General Partnership cannot be changed into a Sole Proprietorship. If this is necessary, a new ' +
    'Name Request Number and Statement of Registration (along with associated fees) will be required.',
    orgPersonInfo: {
      orgPersonLabel: 'Partners',
      orgTypesLabel: 'Business or Corporation',
      subtitle: 'You must have a minimum of two partners. You can add or remove partners (individual person or ' +
        'business) as well as change the mailing and delivery addresses and email address of individual people and ' +
        'business partners.',
      helpSection: null
    }
  },
  certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record ' +
    'filed under section 90.4 of the Partnership Act. A person who commits this offence is subject to a maximum ' +
    'fine of $5,000.'
}
