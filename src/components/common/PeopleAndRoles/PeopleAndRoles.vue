<template>
  <section id="people-and-roles">
    <v-card flat>
      <!-- Header -->
      <div class="section-container header-container">
        <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
        <label class="font-weight-bold pl-2">{{ orgPersonLabel }}</label>
      </div>

      <!-- Instructional people and roles text (BEN corrections only)-->
      <article v-if="isBenIaCorrectionFiling" class="section-container">
        This application must include the following:
        <ul>
          <li>
            <v-icon v-if="dirValid" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else color="red" class="dir-invalid">mdi-close</v-icon>
            <span class="ml-2">At least one Director</span>
          </li>
        </ul>
      </article>

      <!-- Correction section (BEN corrections only) -->
      <article v-if="isBenIaCorrectionFiling" class="section-container">
        <v-btn
          id="btn-add-person"
          outlined
          color="primary"
          :disabled="isAddingEditingOrgPerson"
          @click="initAdd([{ roleType: RoleTypes.DIRECTOR }], PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>
      </article>

      <!-- Change or conversion or firm correction section -->
      <article v-if="isFirmChangeFiling || isFirmConversionFiling || isFirmCorrectionFiling"
        class="section-container"
      >
        <p v-if="orgPersonSubtitle" class="info-text mt-2">{{ orgPersonSubtitle }}</p>

        <HelpSection
          v-if="!isRoleStaff && helpSection"
          class="my-5"
          :helpSection="helpSection"
        />

        <!-- SP add buttons (conversion filing only) -->
        <div v-if="isEntityTypeSP && isFirmConversionFiling && !hasMinimumProprietor" class="mt-8">
          <v-btn
            id="sp-btn-add-person"
            outlined
            color="primary"
            :disabled="isAddingEditingOrgPerson"
            @click="initAdd(
              [{ roleType: RoleTypes.PROPRIETOR, appointmentDate: appointmentDate}],
              PartyTypes.PERSON
            )"
          >
            <v-icon>mdi-account-plus</v-icon>
            <span>Add a Person</span>
          </v-btn>
          <v-btn
            id="sp-btn-add-corp"
            outlined
            color="primary"
            class="ml-2"
            :disabled="isAddingEditingOrgPerson"
            @click="initAdd(
              [{ roleType: RoleTypes.PROPRIETOR, appointmentDate: appointmentDate }],
              PartyTypes.ORGANIZATION
            )"
          >
            <v-icon>mdi-domain-plus</v-icon>
            <span>Add a {{ orgTypesLabel }}</span>
          </v-btn>
          <p v-if="!hasMinimumProprietor" class="error-text small-text mt-5 mb-0">
            You must have one proprietor (an individual or a business)
          </p>
          <p v-if="!haveRequiredAddresses" class="error-text small-text mt-5 mb-0">
            A proprietor address is missing or incorrect
          </p>
        </div>

        <!-- GP add buttons (change or conversion filing only)-->
        <div v-if="isEntityTypeGP && (isFirmChangeFiling || isFirmConversionFiling)" class="mt-8">
          <v-btn
            id="gp-btn-add-person"
            outlined
            color="primary"
            :disabled="isAddingEditingOrgPerson"
            @click="initAdd(
              [{ roleType: RoleTypes.PARTNER, appointmentDate: appointmentDate}],
              PartyTypes.PERSON
            )"
          >
            <v-icon>mdi-account-plus</v-icon>
            <span>Add a Person</span>
          </v-btn>
          <v-btn
            id="gp-btn-add-corp"
            outlined
            color="primary"
            class="ml-2"
            :disabled="isAddingEditingOrgPerson"
            @click="initAdd(
              [{ roleType: RoleTypes.PARTNER, appointmentDate: appointmentDate }],
              PartyTypes.ORGANIZATION
            )"
          >
            <v-icon>mdi-domain-plus</v-icon>
            <span>Add a {{ orgTypesLabel }}</span>
          </v-btn>
          <p v-if="!hasMinimumPartners" class="error-text small-text mt-5 mb-0">
            You must have at least two partners
          </p>
          <p v-if="!haveRequiredAddresses" class="error-text small-text mt-5 mb-0">
            A partner address is missing or incorrect
          </p>
        </div>
      </article>

      <!-- People and roles list -->
      <article class="list-container mt-n2">
        <ListPeopleAndRoles
          :renderOrgPersonForm="isAddingEditingOrgPerson"
          :currentOrgPerson="currentOrgPerson"
          :activeIndex="activeIndex"
          :validate="getComponentValidate"
          :validOrgPersons="validOrgPersons"
          @initEdit="initEdit($event)"
          @addEdit="addEdit($event)"
          @remove="remove($event)"
          @undo="undo($event)"
          @reset="reset()"
        />
      </article>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep, isEmpty } from 'lodash'
import { isSame } from '@/utils/'
import { ActionBindingIF, EmptyOrgPerson, EntitySnapshotIF, HelpSectionIF, OrgPersonIF, ResourceIF,
  RoleIF } from '@/interfaces/'
import { ActionTypes, CompareModes, PartyTypes, RoleTypes } from '@/enums/'
import { HelpSection } from '@/components/common/'
import { ListPeopleAndRoles } from './'
import { CommonMixin, DateMixin, OrgPersonMixin } from '@/mixins/'

@Component({
  components: {
    HelpSection,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(CommonMixin, DateMixin, OrgPersonMixin) {
  // Declarations for template
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes

  // Global getters
  @Getter getCurrentJsDate!: Date
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter isRoleStaff!: boolean
  @Getter getResource!: ResourceIF
  @Getter getComponentValidate!: boolean
  @Getter hasMinimumProprietor!: boolean
  @Getter hasMinimumPartners!: boolean
  @Getter isBenIaCorrectionFiling!: boolean
  @Getter isFirmCorrectionFiling!: boolean
  @Getter isEntityTypeBEN!: boolean
  @Getter isEntityTypeSP!: boolean
  @Getter isEntityTypeGP!: boolean
  @Getter isEntityTypeFirm!: boolean

  // Global actions
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setPeopleAndRolesChanged!: ActionBindingIF
  @Action setPeopleAndRolesValidity!: ActionBindingIF
  @Action setEditingPeopleAndRoles!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  // Local properties
  protected isAddingEditingOrgPerson = false
  protected activeIndex = NaN
  protected currentOrgPerson: OrgPersonIF = null
  protected helpToggle: boolean = false

  /** The list of original parties. */
  get originalParties (): OrgPersonIF[] {
    return this.getEntitySnapshot?.orgPersons || []
  }

  /** True if we have at least 1 Director. */
  get dirValid (): boolean {
    return this.hasRole(RoleTypes.DIRECTOR, 1, CompareModes.AT_LEAST)
  }

  /** True if we have all required parties. */
  get haveRequiredParties (): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isFirmChangeFiling) {
      if (this.isEntityTypeSP) return this.hasMinimumProprietor
      if (this.isEntityTypeGP) return this.hasMinimumPartners
      return false
    }
    if (this.isFirmConversionFiling) {
      if (this.isEntityTypeSP) return this.hasMinimumProprietor
      if (this.isEntityTypeGP) return this.hasMinimumPartners
      return false
    }
    if (this.isCorrectionFiling) {
      if (this.isEntityTypeBEN) return this.dirValid
      if (this.isEntityTypeSP) return this.hasMinimumProprietor
      if (this.isEntityTypeGP) return this.hasMinimumPartners
      return false
    }
    return false // should never happen
  }

  /**
   * True if all parties have the required addresses.
   * See also OrgPerson.vue::mailingAddressSchema and deliveryAddressSchema.
   */
  get haveRequiredAddresses (): boolean {
    return this.getOrgPeople.every(party => {
      // NB: some parties have multiple roles, so order matters below
      //     (most restrictive to least restrictive)

      // proprietor/partner must have a mailing address and a delivery address
      // mailing address can be anywhere in the world
      // delivery address can be anywhere in the world
      if (this.hasRoleProprietor(party) || this.hasRolePartner(party)) {
        return (
          !isEmpty(party.mailingAddress) &&
          !isEmpty(party.deliveryAddress)
        )
      }

      // director must have a mailing address and a delivery address
      // mailing address can be anywhere in the world
      // delivery address can be anywhere in the world
      if (this.hasRoleDirector(party)) {
        return (
          !isEmpty(party.mailingAddress) &&
          !isEmpty(party.deliveryAddress)
        )
      }

      // completing party must have just a mailing address
      // mailing address can be anywhere in the world
      if (this.hasRoleCompletingParty(party)) {
        return !isEmpty(party.mailingAddress)
      }

      // incorporators must have just a mailing address
      // mailing address can be anywhere in the world
      if (this.hasRoleIncorporator(party)) {
        return !isEmpty(party.mailingAddress)
      }
    })
  }

  /** True if all orgs/persons have a role. */
  get noMissingRoles (): boolean {
    return this.getOrgPeople.every(p => p.roles.length > 0)
  }

  /** True if OrgPersons list is valid. */
  get validOrgPersons (): boolean {
    // not in editing mode and all requirements are met
    return (
      !this.isAddingEditingOrgPerson &&
      this.haveRequiredParties &&
      this.haveRequiredAddresses &&
      this.noMissingRoles
    )
  }

  /** True if we have any changes (from original IA). */
  get hasChanges (): boolean {
    return this.getOrgPeople.some(x => x.actions)
  }

  /** Resource getters. */
  get orgPersonLabel (): string {
    return this.getResource.changeData?.orgPersonInfo.orgPersonLabel
  }

  get orgPersonSubtitle (): string {
    return this.getResource.changeData?.orgPersonInfo.subtitle
  }

  get helpSection (): HelpSectionIF {
    return this.getResource.changeData?.orgPersonInfo.helpSection
  }

  get orgTypesLabel (): string {
    return this.getResource.changeData?.orgPersonInfo?.orgTypesLabel
  }

  /** Appointment date in YYYY-MM-DD format. */
  get appointmentDate (): string {
    return this.dateToYyyyMmDd(this.getCurrentJsDate)
  }

  /**
   * Called when component is mounted.
   */
  protected mounted (): void {
    // initialize this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.validOrgPersons)
    this.setPeopleAndRolesChanged(this.hasChanges)
  }

  /**
   * Determines whether we have the specified role by count and mode.
   * @param roleName the role we are interested in
   * @param count the minimum count of items with this role
   * @param mode the count comparison mode (eg, exact or at-least)
   * @returns True if the conditions are met, else False
   */
  private hasRole (roleName: RoleTypes, count: number, mode: CompareModes): boolean {
    // 1. filter out removed people
    // 2. filter in people with specified role
    const orgPersonWithSpecifiedRole = this.getOrgPeople
      .filter(people => !this.wasRemoved(people))
      .filter(people => people.roles.some(role => role.roleType === roleName))

    if (mode === CompareModes.EXACT) {
      return (orgPersonWithSpecifiedRole.length === count)
    }
    if (mode === CompareModes.AT_LEAST) {
      return (orgPersonWithSpecifiedRole.length >= count)
    }
  }

  /**
   * Sets state properties to add an org/person.
   * @param roles The roles of this item.
   * @param type The incorporator (party) type of this item.
   */
  private initAdd (roles: RoleIF[], type: PartyTypes): void {
    // make a copy so we don't change the original object
    this.currentOrgPerson = cloneDeep(EmptyOrgPerson)
    this.currentOrgPerson.roles = roles
    this.currentOrgPerson.officer.partyType = type

    if (this.isEntityTypeFirm) {
      this.currentOrgPerson.isLookupBusiness = true
    }

    this.activeIndex = NaN
    this.isAddingEditingOrgPerson = true
  }

  /**
   * Sets state properties to edit an org/person.
   * @param index The index of the org/person to edit.
   */
  private initEdit (index: number): void {
    // make a copy so we don't change the original object
    this.currentOrgPerson = cloneDeep(this.getOrgPeople[index])
    this.activeIndex = index
    this.isAddingEditingOrgPerson = true
  }

  /**
   * Resets state properties after a change is completed (or to cancel).
   */
  private async reset (): Promise<void> {
    this.currentOrgPerson = null
    this.activeIndex = NaN
    this.isAddingEditingOrgPerson = false

    // as Vue has updated the visible sections, scroll back to the top of this component
    await this.scrollToTop(this.$el)
  }

  /**
   * Undoes changes to the specified org/person.
   * @param index The index of the org/person to undo.
   */
  private async undo (index: number): Promise<void> {
    // make a copy so Vue reacts when we set the updated list
    const tempList = cloneDeep(this.getOrgPeople)

    // get org/person to undo
    const person = tempList[index]

    if (this.wasAdded(person)) {
      // splice out the person
      tempList.splice(index, 1)
    } else {
      // get ID of person to undo
      const id = person?.officer?.id

      // get a copy of original person from original IA
      const thisPerson = (id !== undefined) && cloneDeep(this.originalParties.find(x => +x.officer.id === +id))

      // safety check
      if (!thisPerson) throw new Error(`Failed to find original person with id = ${id}`)

      // splice in the original person
      tempList.splice(index, 1, thisPerson)
    }

    // set updated list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.validOrgPersons)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.reset()
  }

  /**
   * Returns the computed action for the specified org/person compared with their original state.
   * @param person the person to compare
   * @returns the action (or null if none)
   */
  private computeAction (person: OrgPersonIF): ActionTypes {
    if (!person) return ActionTypes.REMOVED
    const original = this.originalParties.find(x => x.officer.id === person.officer.id)
    if (!original) return ActionTypes.ADDED
    // ignore "action" when comparing
    if (!isSame(person, original, ['actions'])) return ActionTypes.EDITED
    return null // no actions
  }

  /**
   * Adds/changes the specified org/person.
   * @param orgPerson The data object of the org/person to change.
   */
  private addEdit (orgPerson: OrgPersonIF): void {
    // make a copy so Vue reacts when we set the new list
    const tempList = cloneDeep(this.getOrgPeople)

    if (isNaN(this.activeIndex)) {
      // add new person to list if not a current index
      orgPerson.actions = [ActionTypes.ADDED]
      tempList.push(orgPerson)
    } else {
      // Assign actions
      orgPerson = this.assignAction(orgPerson)

      // splice in the edited person
      tempList.splice(this.activeIndex, 1, orgPerson)
    }

    // set the new list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.validOrgPersons)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.reset()
  }

  /** Returns True if the orgPerson's name has changed. */
  private hasNameChanged (orgPerson: OrgPersonIF): boolean {
    if (orgPerson.officer.firstName && orgPerson.officer.lastName) {
      const firstName =
        orgPerson.officer.firstName !== this.originalParties[this.activeIndex].officer.firstName
      // use fallback middle name as the API does not always provide it
      const middleName =
        (orgPerson.officer.middleName || '') !== (this.originalParties[this.activeIndex].officer.middleName || '')
      const lastName =
        orgPerson.officer.lastName !== this.originalParties[this.activeIndex].officer.lastName

      return (firstName || middleName || lastName)
    } else {
      return (orgPerson.officer.organizationName !== this.originalParties[this.activeIndex].officer.organizationName)
    }
  }

  /** Returns True if the orgPerson's Business Number has changed. */
  private hasBnChanged (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer.taxId !== this.originalParties[this.activeIndex].officer.taxId)
  }

  /** Returns True if the orgPerson's email has changed. */
  private hasEmailChanged (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer.email !== this.originalParties[this.activeIndex].officer.email)
  }

  /** Returns True if the orgPerson's address has changed. */
  private hasAddressChanged (orgPerson: OrgPersonIF): boolean {
    const mailingAddress =
      !isSame(orgPerson.mailingAddress, this.originalParties[this.activeIndex].mailingAddress, ['id'])
    const deliveryAddress =
      !isSame(orgPerson.deliveryAddress, this.originalParties[this.activeIndex].deliveryAddress, ['id'])

    return (mailingAddress || deliveryAddress)
  }

  /** Assign action(s) to the orgPerson identifying changes. */
  private assignAction (orgPerson: OrgPersonIF): OrgPersonIF {
    // Return if orgPerson is new (added)
    if (this.wasAdded(orgPerson)) return orgPerson

    // If this is correction provide EDITED label and return
    if (this.isCorrectionFiling) {
      orgPerson.actions = [ActionTypes.CORRECTED]
      return orgPerson
    }

    // Assign empty array for pre-existing orgPersons if not defined (ie from API)
    if (!orgPerson.actions) orgPerson.actions = []

    if (this.hasNameChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.NAME_CHANGED) && orgPerson.actions.push(ActionTypes.NAME_CHANGED)
    } else orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.NAME_CHANGED)

    if (this.hasBnChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.BN_CHANGED) && orgPerson.actions.push(ActionTypes.BN_CHANGED)
    } else orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.BN_CHANGED)

    if (this.hasEmailChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.EMAIL_CHANGED) && orgPerson.actions.push(ActionTypes.EMAIL_CHANGED)
    } else orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.EMAIL_CHANGED)

    if (this.hasAddressChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.ADDRESS_CHANGED) && orgPerson.actions.push(ActionTypes.ADDRESS_CHANGED)
    } else orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.ADDRESS_CHANGED)

    // Restore orgPerson when edits are undone manually through form entry
    if (
      !this.hasNameChanged(orgPerson) &&
      !this.hasBnChanged(orgPerson) &&
      !this.hasEmailChanged(orgPerson) &&
      !this.hasAddressChanged(orgPerson)
    ) {
      orgPerson = this.originalParties[this.activeIndex]
    }

    return orgPerson
  }

  /**
   * Tags the specified org/person for removal.
   * @param index The index of the org/person to remove.
   */
  private remove (index: number): void {
    // make a copy so Vue reacts when we set the new list
    const tempList = cloneDeep(this.getOrgPeople)

    // get org/person to remove
    // (we update this record right in the temp list)
    const person = tempList[index]

    if (this.wasAdded(person)) {
      // splice out the person
      tempList.splice(index, 1)
    } else {
      // just set the action (ie, soft-delete)
      // person will be filtered out on file and pay
      person.actions = [ActionTypes.REMOVED]
    }

    // set the new list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.validOrgPersons)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.reset()
  }

  /** On initial load and when user has made changes, sets the component validity flag. */
  @Watch('getOrgPeople', { deep: true })
  private onPeopleAndRolesChanged (): void {
    // FUTURE: combine this component's two validity mechanisms
    //         see setValidComponent() below
    this.setPeopleAndRolesValidity(this.validOrgPersons)
  }

  /** Updates store when component editing state has changed. */
  @Watch('isAddingEditingOrgPerson', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingPeopleAndRoles(val)
  }

  /** Updates store when component validity has changed. */
  @Watch('validOrgPersons')
  private onValidOrgPersonsChanged (val: boolean): void {
    const isValid = (this.hasMinimumProprietor && this.hasMinimumPartners)
    // FUTURE: combine this component's two validity mechanisms
    //         see setPeopleAndRolesValidity() above
    this.setValidComponent({ key: 'isValidOrgPersons', value: this.validOrgPersons })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

ul {
  padding-top: 0.5rem;
  list-style: none;
  margin-left: 0;
  padding-left: 1rem
}

li {
  padding-top: 0.25rem;
}

::v-deep {
  .v-btn.v-btn--disabled:not(#btn-remove) {
    opacity: .4;
    color: $app-blue !important;
    .v-icon {
      color: $app-blue !important;
    }
  }
}
</style>
