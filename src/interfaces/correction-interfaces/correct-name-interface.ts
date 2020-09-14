import { NameRequestApplicantIF } from '@/interfaces'
import { CorrectionTypes } from '@/enums'

export interface CorrectNameOptionIF {
  id: CorrectionTypes,
  title: string,
  description?: string,
  component: any
}

export interface NrCorrectionIF {
  nrNumber: string,
  legalName: string,
  applicant: NameRequestApplicantIF | {}
}
