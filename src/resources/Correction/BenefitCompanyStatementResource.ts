import { CorpTypeCd, CorrectionTypes } from '@/enums'

export const BenefitCompanyStatementResource = {
  addressLabel: 'Registered Office',
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  title: 'Benefit Company Statement',
  description: 'This company is a benefit company and, as such, has purposes that include conducting its business in' +
               ' a responsible and sustainable manner and promoting one or more public benefits.',
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR,
      CorrectionTypes.CORRECT_NAME_TO_NUMBER,
      CorrectionTypes.CORRECT_NAME
    ],
    orgPersonInfo: {
      orgPersonLabel: 'People and Roles',
      subtitle: 'You must have a minimum of two partners. You can add or remove partners (individual person or ' +
        'business) as well as change the mailing and delivery addresses and email address of individual people and ' +
        'business partners that were added manually during registration.'
    }
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}
