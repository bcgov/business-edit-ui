import { Component, Vue } from 'vue-facing-decorator'
import { OrgPersonIF } from '@/interfaces'
import { ActionTypes, PartyTypes, RoleTypes } from '@/enums/'

/**
 * Mixin that provides common OrgPerson methods.
 */
@Component({})
export default class OrgPersonMixin extends Vue {
  //
  // Role Type helpers
  //

  private hasRoleByType (orgPerson: OrgPersonIF, type: RoleTypes): boolean {
    return (orgPerson?.roles.some(role => role.roleType === type) || false)
  }

  /** Returns True if the specified orgPerson has the completing party role. */
  hasRoleCompletingParty (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.COMPLETING_PARTY)
  }

  /** Returns True if the specified orgPerson has the director role. */
  hasRoleDirector (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.DIRECTOR)
  }

  /** Returns True if the specified orgPerson has the incorporator role. */
  hasRoleIncorporator (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.INCORPORATOR)
  }

  /** Returns True if the specified orgPerson has the partner role. */
  hasRolePartner (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.PARTNER)
  }

  /** Returns True if the specified orgPerson has the proprietor role. */
  hasRoleProprietor (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.PROPRIETOR)
  }

  /** Returns True if the specified orgPerson has the subscriber role. */
  hasRoleSubscriber (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.SUBSCRIBER)
  }

  /** Returns True if the specified orgPerson has the applicant role. */
  hasRoleApplicant (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.APPLICANT)
  }

  //
  // Party Type helpers
  //

  /** True if the specified orgPerson is a person. */
  isPartyTypePerson (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.PERSON)
  }

  /** True if the specified orgPerson is an organization (corporations/firms only). */
  isPartyTypeOrg (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  //
  // Action Type helpers
  //

  /** Returns True if the specified orgPerson was added. */
  wasAdded (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.ADDED))
  }

  /** Returns True if the specified orgPerson was corrected. */
  wasCorrected (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.CORRECTED))
  }

  /** Returns True if the specified orgPerson was edited. */
  wasEdited (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.EDITED))
  }

  /** Returns True if the specified orgPerson was removed. */
  wasRemoved (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.REMOVED))
  }

  /** Returns True if the specified orgPerson was replaced. */
  wasReplaced (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.REPLACED))
  }

  /** Returns True if the specified orgPerson was changed. */
  wasChanged (person: OrgPersonIF): boolean {
    return (
      person.actions?.includes(ActionTypes.ADDRESS_CHANGED) ||
      person.actions?.includes(ActionTypes.EMAIL_CHANGED) ||
      person.actions?.includes(ActionTypes.NAME_CHANGED)
    )
  }
}
