import { useStore } from '@/store/store'
import { AccountTypes, AuthorizationRoles, AuthorizedActions } from '@/enums'

/**
 * Whether the specified action is authorized for the current user.
 * Ultimately we'll just check if the auth roles includes the specified action.
 * @returns True or False
 */
export function IsAuthorized (action: AuthorizedActions): boolean {
  switch (true) {
    case isBusinessRegistryStaff(): return BusinessRegistryStaffRoles.includes(action)
    case isMaximusStaff(): return MaximusStaffRoles.includes(action)
    case isContactCentreStaff(): return ContactCentreStaffRoles.includes(action)
    case isSbcFieldOfficeStaff(): return SbcFieldOfficeStaffRoles.includes(action)
    default: return DefaultRoles.includes(action)
  }
}

/**
 * Whether the user is Business Registry Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isBusinessRegistryStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.STAFF)
}

/**
 * Whether the user is Maximus Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isMaximusStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.MAXIMUS_STAFF)
}

/**
 * Whether the user is Contact Centre Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isContactCentreStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.CONTACT_CENTRE_STAFF)
}

/**
 * Whether the user is SBC Field Office Staff.
 * Ultimately we won't need this function and we'll just check auth roles for everything.
 */
function isSbcFieldOfficeStaff (): boolean {
  const store = useStore()
  // return store.getAuthRoles.includes(AuthorizationRoles.SBC_STAFF) // *** TODO: uncomment this after #27536
  return (store.getAccountInformation.accountType === AccountTypes.SBC_STAFF) // *** TODO: delete this after #27536
}

/**
 * The roles if the user is Business Registry Staff.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const BusinessRegistryStaffRoles = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.BLANK_COMPLETING_PARTY,
  AuthorizedActions.CORRECTION_FILING,
  AuthorizedActions.COURT_ORDER_POA,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.EDITABLE_COMPLETING_PARTY,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.FIRM_CONVERSION_FILING,
  AuthorizedActions.FIRM_EDITABLE_DBA,
  AuthorizedActions.FIRM_NO_HELP_SECTION,
  AuthorizedActions.FIRM_NO_MIN_START_DATE,
  AuthorizedActions.FIRM_REPLACE_PERSON,
  AuthorizedActions.NO_CONTACT_INFO,
  AuthorizedActions.RESTORATION_REINSTATEMENT_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.SPECIAL_RESOLUTION_FILING,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.STAFF_PAYMENT,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT
]

/**
 * The roles if the user is Maximus Staff.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const MaximusStaffRoles = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT
]

/**
 * The roles if the user is Contact Centre Staff.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const ContactCentreStaffRoles = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT
]

/**
 * The roles if the user is SBC Field Office Staff (aka SBC Staff Tier 2).
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const SbcFieldOfficeStaffRoles = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.BLANK_COMPLETING_PARTY,
  AuthorizedActions.COURT_ORDER_POA,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.EDITABLE_COMPLETING_PARTY,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.STAFF_PAYMENT,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT
]

/**
 * The roles if the user is none of the other types.
 * Ultimately we won't need this list and we'll just check auth roles for everything.
 */
const DefaultRoles = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.SPECIAL_RESOLUTION_FILING
]
