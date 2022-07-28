import { Component, Vue } from 'vue-property-decorator'
import {
  GetCorpFullDescription,
  GetCorpInfoObject,
  GetCorpNumberedDescription
} from '@bcrs-shared-components/corp-type-module'
import { AssociationTypes } from '@/enums'

/**
 * Mixin that provides some useful enum utilities.
 */
@Component({})
export default class EnumMixin extends Vue {
  // from external module
  getCorpTypeInfo = GetCorpInfoObject
  getCorpTypeDescription = GetCorpFullDescription
  getCorpTypeNumberedDescription = GetCorpNumberedDescription

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
}
