import { ActionTypes } from '@/enums/'

export * from './alteration-interfaces'
export * from './correction-interfaces'
export * from './filing-interfaces'
export * from './payment-interfaces'
export * from './resource-interfaces'
export * from './stepper-interfaces'
export * from './store-interfaces'
export * from './utils-interfaces'
export * from './state-interface'

// this export is needed for some of the shared components
export interface ActionableItemIF {
  action: ActionTypes
}
