import { CorrectNameOptions } from '@/enums/'

export interface CorrectNameOptionIF {
  id: CorrectNameOptions
  title: string
  description?: string
  component: any
}
