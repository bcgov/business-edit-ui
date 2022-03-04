import { CorpTypeCd } from '@/enums'

export const BenefitCompanyStatementResource = {
  addressLabel: 'Registered Office',
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  title: 'Benefit Company Statement',
  description: 'This company is a benefit company and, as such, has purposes that include conducting its business in' +
               ' a responsible and sustainable manner and promoting one or more public benefits.',
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}
