import { Component, Vue } from 'vue-property-decorator'
import { AssociationTypes, FilingNames, FilingTypes } from '@/enums'

/**
 * Mixin that provides some useful enum-related utilities. */
@Component({})
export default class EnumMixin extends Vue {
  /**
   * Converts the association type to a description.
   * @param type the association type
   * @returns the description
   */
  associationTypeToDescription (type: AssociationTypes): string {
    switch (type) {
      case AssociationTypes.COMMUNITY_SERVICE_COOPERATIVE: return 'Community Service Cooperative'
      case AssociationTypes.ORDINARY_COOPERATIVE: return 'Ordinary Cooperative'
      case AssociationTypes.HOUSING_COOPERATIVE: return 'Housing Cooperative'
      default: return type
    }
  }
  /**
   * Converts the filing type to a filing name.
   * @param type the filing type to convert
   * @param agmYear the AGM Year to be appended to the filing name (optional)
   * @param alterationRequired A boolean indicating a required business type change
   * @returns the filing name
   */
  filingTypeToName (type: FilingTypes): string {
    // safety check
    if (!type) return 'Unknown Type'

    switch (type) {
      case FilingTypes.ALTERATION: return FilingNames.ALTERATION
      case FilingTypes.CHANGE_OF_REGISTRATION: return FilingNames.CHANGE_OF_REGISTRATION
      case FilingTypes.CONVERSION: return FilingNames.CONVERSION
      case FilingTypes.CORRECTION: return FilingNames.CORRECTION
      case FilingTypes.INCORPORATION_APPLICATION: return FilingNames.INCORPORATION_APPLICATION
      case FilingTypes.REGISTRATION: return FilingNames.REGISTRATION
    }

    // fallback for unknown filings
    return this.camelCaseToWords(type)
  }

  /**
   * Converts a string in "camelCase" (or "PascalCase") to separate, title-case words,
   * suitable for a title or proper name.
   * @param s the string to convert
   * @returns the converted string
   */
  camelCaseToWords (s: string): string {
    return s?.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase()) || ''
  }
}
