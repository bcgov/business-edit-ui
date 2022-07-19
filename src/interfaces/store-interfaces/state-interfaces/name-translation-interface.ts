import { ActionTypes } from '@/enums/'

/** Interface for name translation object in store. */
export interface NameTranslationIF {
  id?: string
  name: string
  oldName?: string
  action?: ActionTypes
}
