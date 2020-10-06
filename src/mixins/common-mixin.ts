import { Component, Vue } from 'vue-property-decorator'
import { omit, isEqual } from 'lodash'

/**
 * Mixin that provides some useful common utilities.
 */
@Component({})
export default class CommonMixin extends Vue {
  /**
   * Compares two objects while omitting specified properties from the comparison.
   *
   * @param addressA The first object to compare
   * @param addressB The second object to compare
   * @param prop The property to omit during the comparison
   *
   * @return boolean A boolean indicating a match of objects
   */
  isSame (objA: {}, objB: {}, prop: string | null = null): boolean {
    return isEqual({ ...omit(objA, prop ? [prop] : []) }, { ...omit(objB, prop ? [prop] : []) })
  }
}
