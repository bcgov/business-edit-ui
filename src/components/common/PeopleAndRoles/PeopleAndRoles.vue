<template>
  <section id="people-and-roles">
    <ConfirmDialogShared
      ref="changeCpDialog"
      attach="#people-and-roles"
    />

    <v-card flat>
      <!-- Header -->
      <div class="section-container header-container">
        <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
        <label class="font-weight-bold pl-2">{{ orgPersonLabel }}</label>
      </div>

      <!-- Instructional people and roles Text -->
      <article v-if="isCorrectionFiling" class="section-container">
        This application must include the following:
        <ul>
          <li>
            <v-icon v-if="cpValid" color="green darken-2" class="cp-valid">mdi-check</v-icon>
            <v-icon v-else color="red" class="cp-invalid">mdi-close</v-icon>
            <span class="ml-2">The Completing Party</span>
          </li>
          <li>
            <v-icon v-if="incorpValid" color="green darken-2" class="incorp-valid">mdi-check</v-icon>
            <v-icon v-else color="red" class="incorp-invalid">mdi-close</v-icon>
            <span class="ml-2">At least one Incorporator</span>
          </li>
          <li>
            <v-icon v-if="dirValid" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else color="red" class="dir-invalid">mdi-close</v-icon>
            <span class="ml-2">At least one Director</span>
          </li>
        </ul>
      </article>

      <!-- Instructional partner or proprietor Text -->
      <article v-if="isChangeFiling" class="section-container">
        <span class="info-text">{{ orgPersonSubtitle }}</span>

        <!-- Sole Prop Help -->
        <HelpSection
          v-if="getResource.entityType === CorpTypeCd.SOLE_PROP"
          class="mt-5"
          :helpSection="orgPersonHelp"
        />

        <!-- Partnership Help and Add Buttons -->
        <div v-if="getResource.entityType === CorpTypeCd.PARTNERSHIP" class="mt-8">
          <v-btn
            id="gp-btn-add-person"
            outlined
            color="primary"
            :disabled="isAddingEditingOrgPerson"
            @click="initAdd(
              [{ roleType: RoleTypes.PARTNER, appointmentDate: newAppointmentDate}], PartyTypes.PERSON
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
              [{ roleType: RoleTypes.PARTNER, appointmentDate: newAppointmentDate }], PartyTypes.ORGANIZATION
              )"
          >
            <v-icon>mdi-domain-plus</v-icon>
            <span>Add a {{ orgTypesLabel }}</span>
          </v-btn>
          <p v-if="!hasMinimumPartners" class="error-text small-text mt-5 mb-0">
            You must have at least two partners
          </p>
        </div>
      </article>

      <!-- Correction Add Buttons -->
      <article v-if="isCorrectionFiling" class="section-container">
        <v-btn
          id="btn-add-person"
          outlined
          color="primary"
          :disabled="isAddingEditingOrgPerson"
          @click="initAdd([], PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>
        <v-btn
          id="btn-add-corp"
          outlined
          color="primary"
          class="ml-2"
          :disabled="isAddingEditingOrgPerson"
          @click="initAdd([{ roleType: RoleTypes.INCORPORATOR }], PartyTypes.ORGANIZATION)"
        >
          <v-icon>mdi-domain-plus</v-icon>
          <span>Add a {{ orgTypesLabel }}</span>
        </v-btn>
        <v-btn
          v-if="!cpValid"
          id="btn-add-cp"
          outlined
          color="primary"
          class="ml-2"
          :disabled="isAddingEditingOrgPerson"
          @click="initAdd([{ roleType: RoleTypes.COMPLETING_PARTY }], PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus-outline</v-icon>
          <span>Add the Completing Party</span>
        </v-btn>
      </article>

      <article class="list-container mt-n2">
        <ListPeopleAndRoles
          :peopleAndRoles="getPeopleAndRoles"
          :renderOrgPersonForm="isAddingEditingOrgPerson"
          :currentOrgPerson="currentOrgPerson"
          :activeIndex="activeIndex"
          :currentCompletingParty="currentCompletingParty"
          :validate="getComponentValidate"
          @initEdit="initEdit($event)"
          @addEdit="addEdit($event)"
          @remove="remove($event)"
          @undo="undo($event)"
          @reset="reset()"
          @removeCpRole="removeCpRole()"
        />
      </article>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { isSame } from '@/utils/'
import { ActionBindingIF, ConfirmDialogType, EntitySnapshotIF, HelpSectionIF, IncorporationFilingIF,
  OrgPersonIF, ResourceIF, RoleIF } from '@/interfaces/'
import { ActionTypes, CompareModes, CorpTypeCd, PartyTypes, RoleTypes } from '@/enums/'
import { ConfirmDialogShared } from '@/dialogs/'
import HelpSection from '@/components/common/HelpSection.vue'
import { ListPeopleAndRoles } from './'
import { CommonMixin, DateMixin } from '@/mixins/'

@Component({
  components: {
    ConfirmDialogShared,
    HelpSection,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(CommonMixin, DateMixin) {
  // Refs
  $refs!: {
    changeCpDialog: ConfirmDialogType
  }

  // Declarations for template
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes

  // Global getters
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getUserEmail!: string
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter isRoleStaff!: boolean
  @Getter getResource!: ResourceIF
  @Getter getComponentValidate!: boolean
  @Getter hasMinimumPartners!: boolean

  // Global actions
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setPeopleAndRolesChanged!: ActionBindingIF
  @Action setPeopleAndRolesValidity!: ActionBindingIF
  @Action setEditingPeopleAndRoles!: ActionBindingIF
  @Action setValidComponent!: ActionBindingIF

  /** Empty OrgPerson for adding a new one. */
  private emptyOrgPerson: OrgPersonIF = {
    officer: {
      id: null,
      firstName: '',
      lastName: '',
      middleName: '',
      organizationName: '',
      partyType: null,
      email: null
    },
    roles: [],
    mailingAddress: {
      streetAddress: '',
      streetAddressAdditional: '',
      addressCity: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: '',
      deliveryInstructions: ''
    },
    actions: []
  }

  // Local properties
  private isAddingEditingOrgPerson = false
  private activeIndex = NaN
  private currentOrgPerson: OrgPersonIF = null
  private currentCompletingParty: OrgPersonIF = null
  private originalCompletingParty: OrgPersonIF = null
  private helpToggle: boolean = false

  readonly CorpTypeCd = CorpTypeCd

  /** The list of original parties. */
  private get originalParties (): OrgPersonIF[] {
    const parties = this.isCorrectionFiling
      ? this.getOriginalIA?.incorporationApplication?.parties
      : this.getEntitySnapshot?.orgPersons

    return (parties)
  }

  /** True if we have a Completing Party. */
  private get cpValid (): boolean {
    return this.hasRole(RoleTypes.COMPLETING_PARTY, 1, CompareModes.EXACT)
  }

  /** True if we have at least 1 Incorporator. */
  private get incorpValid (): boolean {
    return this.hasRole(RoleTypes.INCORPORATOR, 1, CompareModes.AT_LEAST)
  }

  /** True if we have at least 1 Director. */
  private get dirValid (): boolean {
    return this.hasRole(RoleTypes.DIRECTOR, 1, CompareModes.AT_LEAST)
  }

  /** True if we have all valid roles. */
  private get hasValidRoles (): boolean {
    return (this.cpValid && this.incorpValid && this.dirValid)
  }

  /** True if there are no orgs/persons with missing roles. */
  private get noMissingRoles (): boolean {
    return this.getPeopleAndRoles.every(p => p.roles.length > 0)
  }

  /** True if we have any changes (from original IA). */
  private get hasChanges (): boolean {
    return this.getPeopleAndRoles.some(x => x.actions)
  }

  /** The user email to use for the Completing Party. */
  private get userEmail (): string {
    // if we are staff, return the original CP's email
    // otherwise return the current user's email
    return this.isRoleStaff
      ? this.originalCompletingParty?.officer.email
      : this.getUserEmail
  }

  /** The Completing Party change message. */
  private get changeCpMessage (): string {
    const currentCpName = this.formatFullName(this.currentCompletingParty?.officer)
    return `The Completing Party role was re-assigned to ${currentCpName}.\n` +
      'This undo will restore the original Completing Party.'
  }

  /** Resource getters. */
  private get orgPersonLabel (): string {
    return this.getResource.changeData?.orgPersonInfo.orgPersonLabel
  }

  private get orgPersonSubtitle (): string {
    return this.getResource.changeData?.orgPersonInfo.subtitle
  }

  private get orgPersonHelp (): HelpSectionIF {
    return this.getResource.changeData?.orgPersonInfo.helpSection
  }

  private get orgTypesLabel (): string {
    return this.getResource.changeData?.orgPersonInfo?.orgTypesLabel
  }

  /** New server date in api expected format for Role Appointment dates. */
  private get newAppointmentDate (): string {
    return this.dateToYyyyMmDd(this.getCurrentJsDate)
  }

  /**
   * Called when component is mounted.
   */
  mounted (): void {
    // initialize this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.hasValidRoles && this.noMissingRoles)
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
    const orgPersonWithSpecifiedRole = this.getPeopleAndRoles
      .filter(people => !people.actions?.includes(ActionTypes.REMOVED))
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
  private initAdd (roles: RoleIF[] | RoleTypes[], type: PartyTypes): void {
    // make a copy so we don't change the original object
    this.currentOrgPerson = cloneDeep(this.emptyOrgPerson)
    this.currentOrgPerson.roles = roles
    this.currentOrgPerson.officer.partyType = type
    this.activeIndex = NaN
    this.isAddingEditingOrgPerson = true
  }

  /**
   * Sets state properties to edit an org/person.
   * @param index The index of the org/person to edit.
   */
  private initEdit (index: number): void {
    // make a copy so we don't change the original object
    this.currentOrgPerson = cloneDeep(this.getPeopleAndRoles[index])
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
    const tempList = cloneDeep(this.getPeopleAndRoles)

    // get org/person to undo
    const person = tempList[index]

    if (person.actions.includes(ActionTypes.ADDED)) {
      // splice out the person
      tempList.splice(index, 1)
    } else {
      // get ID of person to undo
      const id = person?.officer?.id

      // get a copy of original person from original IA
      const thisPerson = (id !== undefined) && cloneDeep(this.originalParties.find(x => x.officer.id === id))

      // safety check
      if (!thisPerson) {
        // eslint-disable-next-line no-console
        console.error('Failed to find original person with id =', id)
        return
      }

      // check if original person had CP role
      const hadCp = thisPerson.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)

      // check if an other person has CP role right now
      // NB: we will update this record right in the temp list - no need to splice
      const otherPerson = this.getCompletingParty(tempList)

      // check if we would restore the original CP
      if (hadCp && otherPerson && (thisPerson.officer.id !== otherPerson.officer.id)) {
        // prompt user for confirmation
        await this.confirmReassignCp().then(confirm => {
          if (confirm) {
            // remove the other person's CP role and their email
            otherPerson.roles = otherPerson.roles.filter(r => r.roleType !== RoleTypes.COMPLETING_PARTY)
            delete otherPerson.officer.email
            otherPerson.actions = [this.computeAction(otherPerson)]
          } else {
            // remove this person's CP role and their email
            thisPerson.roles = thisPerson.roles.filter(r => r.roleType !== RoleTypes.COMPLETING_PARTY)
            delete thisPerson.officer.email
            thisPerson.actions = [this.computeAction(thisPerson)]
          }
        })
      }

      // splice in the original person
      tempList.splice(index, 1, thisPerson)
    }

    // set updated list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.hasValidRoles && this.noMissingRoles)
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
    const tempList = cloneDeep(this.getPeopleAndRoles)

    // if this is the Completing Party, set email address from user profile
    if (orgPerson.roles.find(role => role.roleType === RoleTypes.COMPLETING_PARTY)) {
      orgPerson.officer.email = this.userEmail
    }

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
    this.setPeopleAndRolesValidity(this.hasValidRoles && this.noMissingRoles)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.reset()
  }

  /** Returns true if the orgPerson name has changed. */
  private hasNameChanged (orgPerson: OrgPersonIF): boolean {
    if (orgPerson.officer.firstName && orgPerson.officer.lastName) {
      const firstName = orgPerson.officer.firstName !== this.originalParties[this.activeIndex].officer.firstName
      // Provide fallback middle name as the api does not always provide it
      const middleName =
        (orgPerson.officer.middleName || '') !== (this.originalParties[this.activeIndex].officer.middleName || '')
      const lastName = orgPerson.officer.lastName !== this.originalParties[this.activeIndex].officer.lastName

      return firstName || middleName || lastName
    } else {
      return orgPerson.officer.organizationName !== this.originalParties[this.activeIndex].officer.organizationName
    }
  }

  /** Returns true if the orgPerson email has changed. */
  private hasEmailChanged (orgPerson: OrgPersonIF): boolean {
    return orgPerson.officer.email !== this.originalParties[this.activeIndex].officer.email
  }

  /** Returns true if the orgPerson address has changed. */
  private hasAddressChanged (orgPerson: OrgPersonIF): boolean {
    const mailingAddress =
      !isSame(orgPerson.mailingAddress, this.originalParties[this.activeIndex].mailingAddress, ['id'])
    const deliveryAddress =
      !isSame(orgPerson.deliveryAddress, this.originalParties[this.activeIndex].deliveryAddress, ['id'])

    return mailingAddress || deliveryAddress
  }

  /** Assign action(s) to the orgPerson identifying changes. */
  private assignAction (orgPerson: OrgPersonIF): OrgPersonIF {
    // Return if orgPerson is new(ADDED)
    if (orgPerson.actions?.includes(ActionTypes.ADDED)) return orgPerson

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

    if (this.hasEmailChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.EMAIL_CHANGED) && orgPerson.actions.push(ActionTypes.EMAIL_CHANGED)
    } else orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.EMAIL_CHANGED)

    if (this.hasAddressChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.ADDRESS_CHANGED) && orgPerson.actions.push(ActionTypes.ADDRESS_CHANGED)
    } else orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.ADDRESS_CHANGED)

    // Restore orgPerson when edits are undone manually through form entry
    if (!this.hasNameChanged(orgPerson) && !this.hasEmailChanged(orgPerson) && !this.hasAddressChanged(orgPerson)) {
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
    const tempList = cloneDeep(this.getPeopleAndRoles)

    // get org/person to remove
    // (we update this record right in the temp list)
    const person = tempList[index]

    // just set the action (ie, soft-delete)
    // person will be filtered out on file and pay
    person.actions = [ActionTypes.REMOVED]

    // set the new list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValidity(this.hasValidRoles && this.noMissingRoles)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.reset()
  }

  /**
   * Removes the Completing Party role from whichever person has it.
   * Also removes their email address.
   */
  private removeCpRole (): void {
    // make a copy so Vue reacts when we set the new list
    const tempList = cloneDeep(this.getPeopleAndRoles)

    // get the Completing Party
    // (we update this record right in the temp list)
    const person = this.getCompletingParty(tempList)

    if (person) {
      // remove the Completing Party role
      person.roles = person.roles.filter(role =>
        role.roleType !== RoleTypes.COMPLETING_PARTY
      )

      // identify that this person has been edited
      // (unless they were already added, edited or removed)
      if (!person.actions) {
        person.actions = [ActionTypes.EDITED]
      }

      // remove email address that we got from user profile
      person.officer.email = null

      // set the new list
      this.setPeopleAndRoles(tempList)

      // don't need to update component flags since calling method will do it
    }
  }

  /**
   * Displays dialog to prompt user whether to change the Completing Party.
   * @returns a promise that is resolved when the user responds
   */
  private async confirmReassignCp (): Promise<any> {
    // open confirmation dialog and wait for response
    return this.$refs.changeCpDialog.open(
      'Change Completing Party?',
      this.changeCpMessage,
      {
        width: '45rem',
        persistent: true,
        yes: 'Restore original Completing Party',
        no: 'Cancel',
        cancel: null
      }
    )
  }

  /**
   * Gets the Completing Party in a specified org/person list.
   * @param list The list to search.
   * @returns The Completing Party if found, otherwise undefined.
   */
  private getCompletingParty (list: OrgPersonIF[]): OrgPersonIF {
    const i = list?.findIndex(orgPerson =>
      (!orgPerson.actions?.includes(ActionTypes.REMOVED)) &&
        orgPerson.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)
    )
    return (i >= 0) ? list[i] : undefined
  }

  /**
   * On initial load, sets the Original Completing Party (if any).
   */
  @Watch('getOriginalIA', { deep: true })
  private onOriginalIAChanged (): void {
    this.originalCompletingParty = this.getCompletingParty(this.originalParties)
  }

  /**
   * On initial load and when user has made changes, sets the current
   * Completing Party (if any) and the component 'valid' flag.
   */
  @Watch('getPeopleAndRoles', { deep: true })
  private onPeopleAndRolesChanged (): void {
    this.currentCompletingParty = this.getCompletingParty(this.getPeopleAndRoles)
    this.setPeopleAndRolesValidity(this.hasValidRoles && this.noMissingRoles)
  }

  /** Updates store when local Editing property has changed. */
  @Watch('isAddingEditingOrgPerson', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingPeopleAndRoles(val)
    this.setValidComponent({ key: 'isValidOrgPersons', value: !val })
  }

  @Watch('hasMinimumPartners')
  private onMinimumPartnersChanged (val: boolean): void {
    this.setValidComponent({ key: 'isValidOrgPersons', value: val })
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
