import { SigningPersonIF } from '@/interfaces'

export interface CreateResolutionIF {
  resolutionConfirmed: boolean
  resolutionDate?: string // YYYY-MM-DD
  resolutionText?: string
  signingPerson?: SigningPersonIF
  signingDate?: string // YYYY-MM-DD
}
