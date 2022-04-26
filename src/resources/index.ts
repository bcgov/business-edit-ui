import { ResourceIF } from '@/interfaces/'
import { BenefitCompanyResource, CooperativeResource } from './Alteration/'
import { SoleProprietorshipResource, GeneralPartnershipResource } from './Change/'
import { BenefitCompanyStatementResource } from './Correction/'

export * from './Correction/'
export * from './BreadCrumbResource'

export const AlterationResources: Array<ResourceIF> = [
  BenefitCompanyResource,
  CooperativeResource
]

export const ChangeFirmResources: Array<ResourceIF> = [
  SoleProprietorshipResource,
  GeneralPartnershipResource
]

export const CorrectionResources: Array<any> = [
  BenefitCompanyStatementResource
]
