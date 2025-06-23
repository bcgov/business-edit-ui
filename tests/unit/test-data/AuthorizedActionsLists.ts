import { AuthorizedActions } from '@/enums'

/** The authorized actions if the user is Business Registry Staff. */
export const BusinessRegistryStaffActions = [
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

/** The authorized actions if the user is Maximus Staff. */
export const MaximusStaffActions = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT
]

/** The authorized actions if the user is Contact Centre Staff. */
export const ContactCentreStaffActions = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT
]

/** The authorized actions if the user is SBC Field Office Staff (aka SBC Staff Tier 2). */
export const SbcFieldOfficeStaffActions = [
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

/** The authorized actions if use is Public User. */
export const PublicUserActions = [
  AuthorizedActions.ALTERATION_FILING,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_CHANGE_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.SPECIAL_RESOLUTION_FILING
]
