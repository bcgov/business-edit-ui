import { OrgPerson } from '@/components/AddPeopleAndRoles'
import { initialize, LDClient, LDFlagSet, LDOptions, LDUser } from 'launchdarkly-js-client-sdk'

/** Default feature flags in case LD key is not defined (eg, local development). */
const defaultFlagSet: LDFlagSet = {
  'correction-ui-enabled': true,
  'alteration-ui-enabled': true
}

/** The feature flags class. */
class FeatureFlags {
    private static instance: FeatureFlags
    private flags: LDFlagSet

    private constructor () {
      this.flags = defaultFlagSet
    }

    /**
     * Gets the singleton instance of the class.
     */
    public static get Instance (): FeatureFlags {
      return this.instance || (this.instance = new this())
    }

    /**
     * Sets all flags available for the client id.
     * @param allFlags all Flags.
     */
    public setFlags (allFlags: LDFlagSet): void {
      this.flags = allFlags
    }

    /**
     * Gets the value of a specified feature flag.
     * @param flagName the name of the feature flag to get
     * @returns the flag value/variation, or undefined if the flag is not found
     */
    public getFlag (flagName: string): any {
      return this.flags[flagName]
    }
}

/** The Launch Darkly client instance. */
let ldClient: LDClient = null

/**
 * A method that initializes Launch Darkly.
 * @returns a promise to set the flags when done
 */
export function initLdClient (): Promise<void> {
  const envKey: string = window['ldClientId']

  if (envKey) {
    // since we have no user key yet, user must initially be anonymous
    const user: LDUser = { anonymous: false }
    // fetch flags using REPORT request to see user data as JSON
    const options: LDOptions = { useReport: true }

    ldClient = initialize(envKey, user, options)

    // subscribe to feature flag changes
    ldClient.on('change', () => {
      featureFlags.setFlags(ldClient.allFlags())
    })

    // wait for init success or failure
    return new Promise((resolve) => {
      ldClient.on('initialized', () => {
        featureFlags.setFlags(ldClient.allFlags())
        resolve()
      })
      ldClient.on('failed', () => {
        featureFlags.setFlags({}) // clear default flags
        resolve()
      })
    })
  }
}

/**
 * A method that updates the Launch Darkly user properties.
 * @param key a unique string identifying a user
 * @param email the user's email address
 * @param firstName the user's first name
 * @param lastName the user's last name
 * @param custom optional object of additional attributes associated with the user
 * @returns a promise to update the flags when done
 */
export async function updateLdUser (
  key: string, email: string, firstName: string, lastName: string, custom: any = null
): Promise<void> {
  if (ldClient) {
    const user: LDUser = { anonymous: false, key, email, firstName, lastName, custom }
    const newFlagSet: LDFlagSet = await ldClient.identify(user)
    if (newFlagSet) {
      featureFlags.setFlags(newFlagSet)
    }
  }
}

/** The singleton instance of the feature flags class. */
export const featureFlags = FeatureFlags.Instance
