import { BenefitCompanyStatementResource } from '@/resources/Correction'
import { BenefitCompanyResource, CooperativeResource } from './Edit/Alteration'
import { SoleProprietorshipResource, GeneralPartnershipResource } from './Edit/ChangeFirm'
import { ResourceIF } from '@/interfaces'

export * from './Correction'
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
