<template>
  <v-card flat id="people-and-roles" class="mt-4">
    <!-- Header -->
    <div class="header-container">
      <v-icon color="#38598A">mdi-account-multiple-plus</v-icon>
      <label class="font-weight-bold pl-2">People and Roles</label>
    </div>

    <!-- Instructional Text -->
    <div class="role-container pt-6 px-4">
      This application must include the following:
      <ul>
        <li>
          <v-icon v-if="cpValid" color="blue" class="cp-valid">mdi-check</v-icon>
          <v-icon v-else color="red" class="cp-invalid">mdi-close</v-icon>
          <span class="ml-2">The Completing Party</span>
        </li>
        <li>
          <v-icon v-if="incorpValid" color="blue" class="incorp-valid">mdi-check</v-icon>
          <v-icon v-else color="red" class="incorp-invalid">mdi-close</v-icon>
          <span class="ml-2">At least one Incorporator</span>
        </li>
        <li>
          <v-icon v-if="dirValid" color="blue" class="dir-valid">mdi-check</v-icon>
          <v-icon v-else color="red" class="dir-invalid">mdi-close</v-icon>
          <span class="ml-2">At least one Director</span>
        </li>
      </ul>
    </div>

    <!-- Add Buttons -->
    <div class="btn-container py-6 px-4">
      <v-btn
        id="btn-add-person"
        outlined
        color="primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>
      <v-btn
        id="btn-add-corp"
        outlined
        color="primary"
        class="ml-2"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: Roles.INCORPORATOR }], IncorporatorTypes.CORPORATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span>Add a Corporation or Firm</span>
      </v-btn>
      <v-btn
        v-if="!cpValid"
        id="btn-add-cp"
        outlined
        color="primary"
        class="ml-2"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: Roles.COMPLETING_PARTY }], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>

    <div class="list-container px-4">
      <!-- FUTURE: move OrgPerson inside ListPeopleAndRoles -->
      <org-person v-if="showOrgPersonForm"
        :initialValue="currentOrgPerson"
        :activeIndex="activeIndex"
        :nextId="nextId"
        :existingCompletingParty="completingParty"
        @changeOrgPerson="changeOrgPerson($event)"
        @removeOrgPerson="removeOrgPerson($event)"
        @resetData="resetData()"
        @removeCompletingPartyRole="removeCompletingPartyRole()"
      />
      <list-people-and-roles v-else
        @undoOrgPerson="undoOrgPerson($event)"
        @editOrgPerson="editOrgPerson($event)"
        @removeOrgPerson="removeOrgPerson($event)"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, IncorporationFilingIF, OrgPersonIF, RolesIF } from '@/interfaces'
import { ActionTypes, EntityTypes, IncorporatorTypes, Modes, Roles } from '@/enums'
import { OrgPerson, ListPeopleAndRoles } from '.'

@Component({
  components: {
    OrgPerson,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Vue {
  // Enums for template
  readonly EntityTypes = EntityTypes
  readonly Roles = Roles
  readonly IncorporatorTypes = IncorporatorTypes
  readonly Modes = Modes

  // Global getters
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getUserEmail!: string
  @Getter getOriginalIA!: IncorporationFilingIF

  // Global setters
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setPeopleAndRolesChanged!: ActionBindingIF
  @Action setPeopleAndRolesValid!: ActionBindingIF

  /** Empty OrgPerson for adding a new one. */
  private emptyOrgPerson: OrgPersonIF = {
    officer: {
      id: null,
      firstName: '',
      lastName: '',
      middleName: '',
      orgName: '',
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
    action: null
  }

  // Local properties
  private showOrgPersonForm: boolean = false
  private activeIndex: number = NaN
  private currentOrgPerson: OrgPersonIF = null
  private nextId: number = NaN

  /** The completing party if found, otherwise undefined. */
  private get completingParty () : OrgPersonIF {
    return this.getPeopleAndRoles.find(orgPerson =>
      orgPerson.roles.some(role =>
        role.roleType === Roles.COMPLETING_PARTY
      )
    )
  }

  /** True if we have a Completing Party. */
  private get cpValid (): boolean {
    return this.hasRole(Roles.COMPLETING_PARTY, 1, Modes.EXACT)
  }

  /** True if we have at least 1 Incorporator. */
  private get incorpValid (): boolean {
    return this.hasRole(Roles.INCORPORATOR, 1, Modes.AT_LEAST)
  }

  /** True if we have at least 1 Director. */
  private get dirValid (): boolean {
    return this.hasRole(Roles.DIRECTOR, 1, Modes.AT_LEAST)
  }

  /** True if we have all valid roles. */
  private get hasValidRoles (): boolean {
    return (this.cpValid && this.incorpValid && this.dirValid)
  }

  /** True if we have any changes. */
  private get hasChanges (): boolean {
    return this.getPeopleAndRoles.some(x => x.action)
  }

  /**
   * Called when component is mounted.
   */
  private async mounted (): Promise<void> {
    // initialize component 'changed' flag
    this.setPeopleAndRolesChanged(false)
  }

  /**
   * Sets properties to add an org/person.
   * @param roles The roles of this item.
   * @param type The incorporator (party) type of this item.
   */
  private addOrgPerson (roles: RolesIF[], type: IncorporatorTypes): void {
    this.currentOrgPerson = { ...this.emptyOrgPerson }
    this.currentOrgPerson.roles = roles
    this.currentOrgPerson.officer.partyType = type
    this.activeIndex = NaN
    this.nextId = (this.getPeopleAndRoles.length === 0)
      ? 0 : this.getPeopleAndRoles[this.getPeopleAndRoles.length - 1].officer.id + 1
    this.showOrgPersonForm = true
  }

  /**
   * Sets properties to edit an org/person.
   * @param index The index of the org/person to edit.
   */
  private editOrgPerson (index: number): void {
    this.currentOrgPerson = { ...this.getPeopleAndRoles[index] }
    this.activeIndex = index
    this.showOrgPersonForm = true
  }

  /**
   * Undoes changes to the specified org/person.
   * @param index The index of the org/person to undo.
   */
  private undoOrgPerson (index: number): void {
    // get org/person to undo
    const person = this.getPeopleAndRoles[index]

    // make a copy so Vue reacts when we set the updated list
    const tempList = [...this.getPeopleAndRoles]

    switch (person.action) {
      case ActionTypes.ADDED:
        // splice out the person
        tempList.splice(index, 1)
        break

      case ActionTypes.EDITED:
      case ActionTypes.REMOVED:
        // get ID of person to undo
        const id = person?.officer?.id

        // get original person from original IA
        const originalList = this.getOriginalIA.incorporationApplication?.parties || []
        const originalPerson = originalList.find(x => x.officer.id === id)

        // safety check
        if (!originalPerson) {
          console.log('Failed to find original person with id =', id) // eslint-disable-line no-console
          return
        }

        // splice in the original person
        tempList.splice(index, 1, originalPerson)
        break
    }

    // set updated list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValid(this.hasValidRoles)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.resetData()
  }

  /**
   * Changes the specified org/person.
   * @param person The data object of the org/person to change.
   */
  private changeOrgPerson (person: OrgPersonIF): void {
    // if this is the completing party, assign email address from user profile
    if (person.roles.some(role => role.roleType === Roles.COMPLETING_PARTY)) {
      person.officer.email = this.getUserEmail
    }

    // make a copy so Vue reacts when we set the new list
    const tempList = [...this.getPeopleAndRoles]

    if (isNaN(this.activeIndex)) {
      person.action = ActionTypes.ADDED
      // add new person to list
      tempList.push(person)
    } else {
      person.action = ActionTypes.EDITED
      // splice in the edited person
      tempList.splice(this.activeIndex, 1, person)
    }

    // set the new list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValid(this.hasValidRoles)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.resetData()
  }

  /**
   * Tags the specified org/person for removal.
   * @param index The index of the org/person to remove.
   */
  private removeOrgPerson (index: number): void {
    // get org/person to remove
    // make a copy so we don't change the item in the list
    const person = { ...this.getPeopleAndRoles[index] }

    // make a copy so Vue reacts when we set the new list
    const tempList = [...this.getPeopleAndRoles]

    // just set the action (ie, soft-delete)
    // person will be filtered out on file and pay
    person.action = ActionTypes.REMOVED

    // splice in the updated person
    tempList.splice(index, 1, person)

    // set the new list
    this.setPeopleAndRoles(tempList)

    // update this component's 'valid' and 'changed' flags
    this.setPeopleAndRolesValid(this.hasValidRoles)
    this.setPeopleAndRolesChanged(this.hasChanges)

    // reset state properties
    this.resetData()
  }

  /**
   * Removes the Completing Party role from the respective person.
   */
  private removeCompletingPartyRole () {
    // make a copy so Vue reacts when we set the new list
    const tempList = [...this.getPeopleAndRoles]

    // find the completing party in the temp list
    const completingParty = tempList.find(orgPerson =>
      orgPerson.roles.some(role =>
        role.roleType === Roles.COMPLETING_PARTY
      )
    )

    if (completingParty) {
      // remove the Completing Party role
      completingParty.roles = completingParty.roles.filter(role =>
        role.roleType !== Roles.COMPLETING_PARTY
      )

      // remove email address that we got from user profile
      completingParty.officer.email = null

      // set the new list
      this.setPeopleAndRoles(tempList)

      // don't need to update component flags since calling method will do it
    }
  }

  /**
   * Resets state properties after a change is completed (or to cancel).
   */
  private resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = NaN
    this.showOrgPersonForm = false
  }

  /**
   * Determines whether we have the specified role by count and mode.
   */
  private hasRole (roleName: Roles, count: number, mode: Modes): boolean {
    // 1. filter out removed people
    // 2. filter in people with specified role
    const orgPersonWithSpecifiedRole =
      this.getPeopleAndRoles.filter(people => people.action !== ActionTypes.REMOVED)
        .filter(people => people.roles.some(party => party.roleType === roleName))

    if (mode === Modes.EXACT) {
      return (orgPersonWithSpecifiedRole.length === count)
    }
    if (mode === Modes.AT_LEAST) {
      return (orgPersonWithSpecifiedRole.length >= count)
    }
  }

  /**
   * Sets component 'valid' flag on initial load and when user has made changes.
   */
  @Watch('getPeopleAndRoles')
  private onPeopleAndRoles (): void {
    this.setPeopleAndRolesValid(this.hasValidRoles)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
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

.sub-header {
  padding-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
}
</style>
