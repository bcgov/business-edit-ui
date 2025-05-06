/******************
 * @param obj an Array or Array-Like Object
 * @Return a object with no null action properties
 */

export function RemoveNullProps (obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? RemoveNullProps(v) : v])
  )
}
