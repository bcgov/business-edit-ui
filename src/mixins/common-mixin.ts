import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { RouteNames } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ConfirmDialogType } from '@/interfaces/'

/**
 * Mixin that provides some useful common utilities.
 */
@Component({})
export default class CommonMixin extends Vue {
  @Getter getEntityType!: CorpTypeCd
  @Getter isAlterationFiling!: boolean
  @Getter isChangeFiling!: boolean
  @Getter isConversionFiling!: boolean
  @Getter isCorrectionFiling!: boolean

  /** Is True if Jest is running the code. */
  get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /**
   * Scrolls the window to the top of the specified element.
   * @param element the element to scroll to the top of
   */
  async scrollToTop (element: any): Promise<void> {
    // don't call window.scrollTo during Jest tests because jsdom doesn't implement it
    if (!this.isJestRunning) await element.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Identifies the first invalid flag and scrolls to the component.
   * @param validFlags list of current component validity flags
   * @param components list of current component IDs
   * @return whether all components are valid
   */
  async validateAndScroll (validFlags: object, components: object): Promise<boolean> {
    // Create an array of the _ordered_ validity flags
    const validFlagArray = Object.keys(validFlags).map(key => validFlags[key])

    // Find the _first_ corresponding component that is invalid
    const component = document.getElementById(components[validFlagArray.indexOf(false)])

    // If there is an invalid component, scroll to it
    if (component) {
      await this.scrollToTop(component)
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
    let fullName: string = ''
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
    let fullAddress: string = ''
    if (addressData?.addrLine1) fullAddress += addressData.addrLine1 + ', '
    if (addressData?.city) fullAddress += addressData.city + ', '
    if (addressData?.stateProvinceCd) fullAddress += addressData.stateProvinceCd + ', '
    if (addressData?.postalCd) fullAddress += addressData.postalCd + ', '
    if (addressData?.countryTypeCd) fullAddress += addressData.countryTypeCd

    return fullAddress.trimEnd()
  }

  /** Changes the specified prop to uppercase. */
  uppercase (prop: string): void {
    this[prop] = this[prop]?.toUpperCase()
  }

  /** The appropriate edit label for corrections, alterations, change or conversion filings. */
  get editLabel (): string {
    if (this.isCorrectionFiling) return 'Correct'
    if (this.isAlterationFiling || this.isChangeFiling || this.isConversionFiling) return 'Change'
    return 'Edit'
  }

  /** The appropriate edited label for corrections, alterations, change or conversion filings. */
  get editedLabel (): string {
    if (this.isCorrectionFiling) return 'Corrected'
    if (this.isAlterationFiling || this.isChangeFiling || this.isConversionFiling) return 'Changed'
    return 'Edited'
  }

  /** The appropriate edits saved label for corrections, alterations, change or conversion filings. */
  get editSavedLabel (): string {
    if (this.isCorrectionFiling) return 'Corrections Saved'
    if (this.isAlterationFiling || this.isChangeFiling || this.isConversionFiling) return 'Changes Saved'
    return 'Edits Saved'
  }

  /** The entity title. */
  get entityTitle (): string {
    switch (this.$route.name) {
      case RouteNames.ALTERATION:
        return 'Company Information'
      case RouteNames.CHANGE:
        return 'Business Information'
      case RouteNames.CONVERSION:
        return 'Record Conversion'
      case RouteNames.CORRECTION:
        return 'Correction - Incorporation Application'
      default:
        return ''
    }
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
