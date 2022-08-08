import { SigningPersonIF } from '@/interfaces'

// specical resolution form inrterface
export interface CreateResolutionIF {
  resolutionConfirmed: boolean
  resolutionDate?: string // YYYY-MM-DD
  resolutionText?: string
  signingPerson?: SigningPersonIF
  signingDate?: string // YYYY-MM-DD
}
