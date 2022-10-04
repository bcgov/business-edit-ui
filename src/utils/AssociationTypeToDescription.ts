import { AssociationTypes } from '@/enums'

/**
 * Converts the association type to a description.
 * @param type the association type
 * @returns the description
 */
export function AssociationTypeToDescription (type: AssociationTypes): string {
  switch (type) {
    case AssociationTypes.COMMUNITY_SERVICE_COOPERATIVE: return 'Community Service Cooperative'
    case AssociationTypes.ORDINARY_COOPERATIVE: return 'Ordinary Cooperative'
    case AssociationTypes.HOUSING_COOPERATIVE: return 'Housing Cooperative'
    default: return type
  }
}
