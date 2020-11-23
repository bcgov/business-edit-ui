import { ActionTypes } from '@/enums'

// Name translation interface
export interface NameTranslationIF {
  id?: string
  name: string
  oldName?: string
  action?: ActionTypes
}

export interface NameTranslationSnapshotIF {
  alias: string,
  id: number,
  type: string
}
