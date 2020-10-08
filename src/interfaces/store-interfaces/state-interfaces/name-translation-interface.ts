import { ActionTypes } from '@/enums'

// Name translation interface
export interface NameTranslationIF {
  new?: Array<string>
  modified?: Array<NameTranslationModifiedIF>
  ceased?: Array<string>
}

export interface NameTranslationModifiedIF {
  oldValue: string
  newValue: string
}

export interface NameTranslationDraftIF {
  value: string
  oldValue?: string
  action?: ActionTypes
}
