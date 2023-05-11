import { isEqual } from 'lodash'
import omit from 'lodash.omit'

/**
 * Compares two objects while omitting specified properties from the comparison.
 * @param objA the first object to compare
 * @param objB the second object to compare
 * @param props an optional array of properties to omit during the comparison
 * @return a boolean indicating a match of objects
 */
export function IsSame (objA: object, objB: object, props: string[] = []): boolean {
  return isEqual({ ...omit(objA, props) }, { ...omit(objB, props) })
}
