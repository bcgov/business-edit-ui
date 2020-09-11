import { NameRequestApplicantIF } from '@/interfaces'

export interface CorrectNameOptionIF {
  id: string,
  title: string,
  description?: string,
  component: any
}

export interface NrCorrectionIF {
  nrNumber: string,
  legalName: string,
  applicant: NameRequestApplicantIF
}
