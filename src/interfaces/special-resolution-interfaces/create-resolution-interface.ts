import { PersonIF } from '@/interfaces'

export interface CreateResolutionIF {
  // validationDetail: ValidationDetailIF
  resolutionConfirmed: boolean
  resolutionDate?: string
  resolutionText?: string
  signingPerson?: PersonIF
  signingDate?: string
}
