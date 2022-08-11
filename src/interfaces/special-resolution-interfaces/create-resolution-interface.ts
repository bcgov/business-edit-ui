import { SigningPersonIF } from '@/interfaces'

// specical resolution form inrterface
export interface CreateResolutionIF {
  resolutionConfirmed?: boolean
  resolutionDate?: string // YYYY-MM-DD
  resolution?: string
  signatory?: SigningPersonIF
  signingDate?: string // YYYY-MM-DD
}
