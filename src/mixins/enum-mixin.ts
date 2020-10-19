import { Component, Vue } from 'vue-property-decorator'
import { EntityTypes } from '@/enums'

/**
 * Mixin that provides some useful enum-related utilities.
 */
@Component({})
export default class EnumMixin extends Vue {
  /**
   * Converts the entity type to a numbered corp description.
   * @param type the entity type to convert
   * @returns the numbered corp description
   */
  entityTypeToNumberedDescription (type: EntityTypes): string {
    switch (type) {
      case EntityTypes.BC_COMPANY: return 'Numbered Company'
      case EntityTypes.BC_CORPORATION: return 'Numbered Corporation'
      case EntityTypes.BC_ULC_COMPANY: return 'Numbered Unlimited Liability Company'
      case EntityTypes.BENEFIT_COMPANY: return 'Numbered Benefit Company'
      case EntityTypes.COOP: return 'Numbered Cooperative'
    }
    return 'Unknown' // should never happen
  }

  /**
   * Converts the entity type to a corp description.
   * @param type the entity type to convert
   * @returns the corp description
   */
  entityTypeToDescription (type: EntityTypes): string {
    switch (type) {
      case EntityTypes.BC_COMPANY: return 'BC Company'
      case EntityTypes.BC_CORPORATION: return 'BC Corporation'
      case EntityTypes.BC_ULC_COMPANY: return 'BC Unlimited Liability Company'
      case EntityTypes.BENEFIT_COMPANY: return 'BC Benefit Company'
      case EntityTypes.COOP: return 'BC Cooperative'
    }
    return 'Unknown' // should never happen
  }
}
