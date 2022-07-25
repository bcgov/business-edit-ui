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
export * from './special-resolution-interfaces'

// this export is needed for some of the shared components
export interface ActionableItemIF {
  action: ActionTypes
}

// External interfaces
export {
  BusinessLookupIF,
  BusinessLookupResultIF,
  EmptyBusinessLookup
} from '@bcrs-shared-components/interfaces'
