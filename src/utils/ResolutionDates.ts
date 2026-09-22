import { ResolutionDateIF, ResolutionsIF } from '@/interfaces/'

/**
 * Converts locally-added resolution dates (YYYY-MM-DD strings) to the Legal API format.
 * Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/share_structure.json
 * @param dates the new resolution dates
 * @returns the resolution dates in API format (ie, no ids)
 */
export function ToApiResolutionDates (dates: string[]): ResolutionDateIF[] {
  return (dates || []).map(date => ({ date }))
}

/**
 * Converts existing business resolutions to the Legal API format, keeping their ids
 * so the API can tell them apart from newly-added dates (corrections only).
 * @param resolutions the existing resolutions of the business
 * @returns the resolution dates in API format (ie, with ids)
 */
export function ExistingToApiResolutionDates (resolutions: ResolutionsIF[]): ResolutionDateIF[] {
  return (resolutions || []).map(resolution => ({ id: resolution.id, date: resolution.date }))
}

/**
 * Converts resolution dates from a filing (eg, a draft) to locally-added dates (YYYY-MM-DD strings).
 * Existing resolutions (ie, with ids) are excluded since they are not "new" dates.
 * Supports both the old format (strings) and the new format (objects).
 * @param dates the resolution dates from the filing
 * @returns the new resolution dates
 */
export function FromApiResolutionDates (dates: Array<string | ResolutionDateIF>): string[] {
  return (dates || [])
    .filter(date => (typeof date === 'string') || !date.id)
    .map(date => (typeof date === 'string') ? date : date.date)
}
