import { ShareClassIF } from '@bcrs-shared-components/interfaces'
/******************
 * Orders ShareClassIF objects by id.
 * Recursive if any share series are found, which need to be checked separately
 * @param shareOrSeries an Array or Array-Like Object
 * @Return a sorted ShareClass object
 */
export function OrderShares (shareOrSeries: any): ShareClassIF[] {
  // Convert "array-like" object to array so we can sort
  if (!Array.isArray(shareOrSeries)) {
    const keys = Object.keys(shareOrSeries)
    const isArrayLike = keys.length > 0 && keys.every(k => !isNaN(Number(k)))

    if (isArrayLike) {
      shareOrSeries = keys.map(k => shareOrSeries[k])
    } else {
      // No array or array-like object found. Nothing to sort.
      return []
    }
  }

  // Sort the top-level shareClasses by ID
  const sorted = [...shareOrSeries].sort((a, b) => Number(a.id) - Number(b.id))

  // Recursive call if we have series shares
  sorted.forEach(share => {
    if (share.series) {
      share.series = OrderShares(share.series)
    }
  })

  return sorted
}
