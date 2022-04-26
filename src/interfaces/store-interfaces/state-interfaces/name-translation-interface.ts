import { ActionTypes } from '@/enums/'

// Name translation interface
export interface NameTranslationIF {
  id?: string
  name: string

  oldName?: string
  action?: ActionTypes
}
