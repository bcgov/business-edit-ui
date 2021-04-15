import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { omit, isEqual } from 'lodash'
import { CorpTypeCd, RouteNames } from '@/enums'

/**
 * Mixin that provides some useful common utilities.
 */
@Component({})
export default class CommonMixin extends Vue {
  @Getter getEntityType!: CorpTypeCd
  @Getter isCorrectionFiling!: boolean
  @Getter isAlterationFiling!: boolean

  /** Is True if Jest is running the code. */
  get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /**
   * Compares two objects while omitting specified properties from the comparison.
   * @param objA the first object to compare
   * @param objB the second object to compare
   * @param props an optional array of properties to omit during the comparison
   * @return a boolean indicating a match of objects
   */
  isSame (objA: {}, objB: {}, props: string[] = []): boolean {
    return isEqual({ ...omit(objA, props) }, { ...omit(objB, props) })
  }

  /**
   * Scrolls the window to the top of the specified element.
   * @param element the element to scroll to the top of
   */
  async scrollToTop (element: any): Promise<void> {
    // don't call window.scrollTo during Jest tests because jsdom doesn't implement it
    if (!this.isJestRunning) await window.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
  }

  /**
   * Identifies the first invalid flag and scrolls to the component.
   * @param validatorFlags The current validity state of the components.
   * @param elementFlags Static element Ids to identify the component to scroll too.
   */
  async validateAndScroll (validatorFlags: object, elementFlags: object): Promise<boolean> {
    // Create an array of the flag values
    const validFlagArray = Object.keys(validatorFlags).map(key => validatorFlags[key])

    // Find the first corresponding flag id that is invalid
    const component = document.getElementById(elementFlags[validFlagArray.indexOf(false)])

    // Scroll to the top of the first invalid component or return true
    if (component) {
      await this.scrollToTop(component)
      return false
    } else return true
  }

  /**
   * Returns the full (first-middle-last) name of the subject officer.
   * @param officer the object to get the names from
   * @returns the formatted full name string
   */
  formatFullName (officer: any): string {
    let fullName: string = ''
    if (officer?.firstName) fullName += officer.firstName + ' '
    if (officer?.middleName) fullName += officer.middleName + ' '
    if (officer?.lastName) fullName += officer.lastName
    return fullName.trimRight()
  }

  /**
   * Returns the full address of the subject.
   * @param addressData the object to get the address from
   * @returns the formatted full address string
   */
  formatFullAddress (addressData: any): string {
    let fullAddress: string = ''
    if (addressData?.addrLine1) fullAddress += addressData.addrLine1 + ', '
    if (addressData?.city) fullAddress += addressData.city + ', '
    if (addressData?.stateProvinceCd) fullAddress += addressData.stateProvinceCd + ', '
    if (addressData?.postalCd) fullAddress += addressData.postalCd + ', '
    if (addressData?.countryTypeCd) fullAddress += addressData.countryTypeCd

    return fullAddress.trimRight()
  }

  /** Changes the specified prop to uppercase. */
  uppercase (prop: string): void {
    this[prop] = this[prop]?.toUpperCase()
  }

  /** The appropriate edit label for corrections or alterations. */
  get editLabel (): string {
    return this.isCorrectionFiling ? 'Correct' : 'Change'
  }

  /** The appropriate edited label for corrections or alterations. */
  get editedLabel (): string {
    return this.isCorrectionFiling ? 'Corrected' : 'Changed'
  }

  /** The entity title. */
  get entityTitle (): string {
    switch (this.$route.name) {
      case RouteNames.CORRECTION:
        return 'Correction - Incorporation Application'
      case RouteNames.ALTERATION:
        return 'Company Information'
      default:
        return ''
    }
  }

  /**
   * Checks if the specified entity type matches the current entity's type.
   * @param entityType the entity type to check
   * @return True if the check passes, else False
   */
  entityFilter (entityType: CorpTypeCd): boolean {
    return (this.getEntityType === entityType)
  }

  /**
   * Formats a phone number for display.
   * @param phoneNumber the phone number to format
   * @returns a formatted phone number
   */
  toDisplayPhone (phoneNumber: string): string {
    // Filter only numbers from the input
    let cleaned = ('' + phoneNumber).replace(/\D/g, '')

    // Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }

    return null
  }
}
