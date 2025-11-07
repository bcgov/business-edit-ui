import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { isEmpty } from 'lodash'
import { AddressIF, ConfirmDialogType } from '@/interfaces/'
import { RoleTypes } from '@/enums'

/**
 * Mixin that provides some useful common utilities.
 */
@Component({})
export default class CommonMixin extends Vue {
  /** Is True if Vitest is running the code. */
  get isVitestRunning (): boolean {
    return (import.meta.env.VITEST !== undefined)
  }

  /**
   * Scrolls the window to the top of the specified element.
   * @param element the element to scroll to the top of
   */
  scrollToTop (element: Element): void {
    // don't call window.scrollTo during Vitest tests because jsdom doesn't implement it
    if (!this.isVitestRunning) element.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Identifies the first invalid flag and scrolls to the respective component.
   * @param flags list of current component validity flags
   * @param components list of current component IDs
   * @return whether all components are valid
   */
  validateAndScroll (flags: object, components: object): boolean {
    // Create an array of the _ordered_ validity flags
    const validFlagArray = Object.keys(flags).map(key => flags[key])

    // Find the _first_ corresponding component that is invalid
    const component = components[validFlagArray.indexOf(false)]

    // If there is an invalid component, scroll to it
    if (component) {
      const element = document.getElementById(component)
      this.scrollToTop(element)
      return false
    }
    return true
  }

  /**
   * Returns the full (first-middle-last) name of the subject officer.
   * @param officer the object to get the names from
   * @returns the formatted full name string
   */
  formatFullName (officer: any): string {
    let fullName = ''
    if (officer?.firstName) fullName += officer.firstName + ' '
    if (officer?.middleName) fullName += officer.middleName + ' '
    if (officer?.lastName) fullName += officer.lastName
    return fullName.trimEnd()
  }

  /**
   * Returns the full address of the subject.
   * @param addressData the object to get the address from
   * @returns the formatted full address string
   */
  formatFullAddress (addressData: any): string {
    let fullAddress = ''
    if (addressData?.addrLine1) fullAddress += addressData.addrLine1 + ', '
    if (addressData?.city) fullAddress += addressData.city + ', '
    if (addressData?.stateProvinceCd) fullAddress += addressData.stateProvinceCd + ', '
    if (addressData?.postalCd) fullAddress += addressData.postalCd + ', '
    if (addressData?.countryTypeCd) fullAddress += addressData.countryTypeCd

    return fullAddress.trimEnd()
  }

  /** Formats roles for officers */
  formatRoleType (roleType: string): string {
    if (roleType.toLocaleLowerCase() === RoleTypes.CEO.toLocaleLowerCase()) return 'Chief Executive Officer'
    if (roleType.toLocaleLowerCase() === RoleTypes.CFO.toLocaleLowerCase()) return 'Chief Financial Officer'
    return roleType
  }

  /** Changes the specified prop to uppercase. */
  uppercase (prop: string): void {
    this[prop] = this[prop]?.toUpperCase()
  }

  /**
   * Whether the address object is empty or with only with default input values.
   * See also EmptyAddress.
   */
  isEmptyAddress (address: AddressIF): boolean {
    return isEmpty(address) || (
      !address.addressCity &&
      (!address.addressCountry || address.addressCountry === 'CA') &&
      (!address.addressRegion || address.addressRegion === 'BC') &&
      !address.deliveryInstructions &&
      !address.postalCode &&
      !address.streetAddress &&
      !address.streetAddressAdditional
    )
  }

  /**
   * Helper to show the confirm dialogs.
   * @param ref The dialog reference
   * @param title The title content in dialog header
   * @param message The content body
   * @param yes The YES action label
   * @param no The NO cancel label
   * */
  async showConfirmDialog (ref: ConfirmDialogType, title: string, message: string, yes: string, no: string = null):
    Promise<boolean> {
    return ref.open(title, message, {
      width: '45rem',
      persistent: true,
      yes: yes,
      no: no,
      cancel: null
    }).catch(() => false)
  }
}
