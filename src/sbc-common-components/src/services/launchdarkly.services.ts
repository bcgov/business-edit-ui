import { initialize, LDFlagSet } from 'launchdarkly-js-client-sdk'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'

const defaultFlagSet = { 'sbc-auth': true }

class LaunchDarklyService {
  private ldClient
  private flags: LDFlagSet
  private static ldInstance: LaunchDarklyService

  public static getInstance (): LaunchDarklyService {
    return this.ldInstance || (this.ldInstance = new this())
  }

  public get isFlagsAvailable (): boolean {
    const ldFlags = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.LaunchDarklyFlags) || '{}')
    let ldFlagsExists = false
    for (const key in ldFlags) {
      if (ldFlags.hasOwnProperty(key)) {
        ldFlagsExists = true
        break
      }
    }
    return ldFlagsExists
  }

  init (ldEnvKey: string) {
    var user = { key: 'anonymous' }

    this.ldClient = initialize(ldEnvKey, user)

    return new Promise<void>((resolve) => {
      this.ldClient.on('initialized', () => {
        this.setFlags(this.ldClient.allFlags())
        resolve()
      })
      this.ldClient.on('failed', () => {
        this.setFlags(defaultFlagSet)
        resolve()
      })
    })
  }

  public setFlags (allFlags: LDFlagSet): void {
    this.flags = allFlags
    ConfigHelper.addToSession(SessionStorageKeys.LaunchDarklyFlags, JSON.stringify(this.ldClient.allFlags()))
  }

  public getFlag (flagName: string): any {
    const ldFlags = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.LaunchDarklyFlags) || '{}')
    return (this.flags && this.flags[flagName]) || (ldFlags && ldFlags[flagName])
  }
}

export default LaunchDarklyService.getInstance()
