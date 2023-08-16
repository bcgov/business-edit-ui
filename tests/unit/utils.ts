import * as util from '@/utils/'
import { vi } from 'vitest'

// Mock feature flags for unit tests.
export function mockFeatureFlagsForAlterationChangeBusinessTypes () {
  vi.spyOn(util, 'GetFeatureFlag').mockImplementation(
    (name) => {
      if (name === 'supported-alteration-change-business-types') {
        return ['BEN', 'BC', 'CC', 'ULC']
      } else {
        return util.defaultFlagSet[name]
      }
    })
}
