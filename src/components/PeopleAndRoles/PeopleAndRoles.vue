<template>
  <v-card class="mt-4">
    <div class="font-weight-bold">THIS SECTION IS IN PROGRESS...</div>
    This application must include the following:
    <ul>
      <li>
        <v-icon v-if="hasRole(Roles.COMPLETING_PARTY, 1, 'EXACT')" color="blue" class="cp-valid">mdi-check</v-icon>
        <v-icon v-else-if="showErrors" color="red" class="cp-invalid">mdi-close</v-icon>
        <span class='chk-list-item-txt'>The Completing Party</span>
      </li>
      <li>
        <v-icon v-if="hasRole(Roles.INCORPORATOR, 1, 'ATLEAST')" color="blue" class="incorp-valid">mdi-check</v-icon>
        <v-icon v-else-if="showErrors" color="red" class="incorp-invalid">mdi-close</v-icon>
        <span class='chk-list-item-txt'>At least one Incorporator</span>
      </li>
      <li>
        <v-icon v-if="hasRole(Roles.DIRECTOR, 1, 'ATLEAST')" color="blue" class="dir-valid">mdi-check</v-icon>
        <v-icon v-else-if="showErrors" color="red" class="dir-invalid">mdi-close</v-icon>
        <span class='chk-list-item-txt'>At least one Director</span>
      </li>
    </ul>

    <div class="btn-panel" v-if="getPeopleAndRoles.length === 0">
      <v-btn
        id="btn-start-add-cp"
        outlined
        color="primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: Roles.COMPLETING_PARTY }], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>

    <div class="btn-panel" v-if="getPeopleAndRoles.length > 0">
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
        class="spacedButton"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: Roles.INCORPORATOR }], IncorporatorTypes.CORPORATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span v-if="entityFilter(EntityTypes.BCOMP)">Add a Corporation or Firm</span>
        <span v-if="entityFilter(EntityTypes.COOP)">Add Organization</span>
      </v-btn>
      <v-btn
        v-if="!hasRole(Roles.COMPLETING_PARTY, 1, 'ATLEAST')"
        id="btn-add-cp"
        outlined
        color="primary"
        class="spacedButton"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: Roles.COMPLETING_PARTY }], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>

    <v-card v-if="showOrgPersonForm" flat class="people-roles-container">
      <OrgPerson
        v-show="showOrgPersonForm"
        :initialValue="currentOrgPerson"
        :activeIndex="activeIndex"
        :nextId="nextId"
        :existingCompletingParty="completingParty"
        @addEditPerson="onAddEditOrgPerson($event)"
        @removePersonEvent="onRemoveOrgPerson($event)"
        @resetEvent="resetData()"
        @removeCompletingPartyRole="removeCompletingPartyAssignment()"
      />
    </v-card>

    <v-card v-if="getPeopleAndRoles.length > 0" flat :disabled="showOrgPersonForm">
      <ListPeopleAndRoles
        :personList="getPeopleAndRoles"
        :isSummary="false"
        @editPerson="editOrgPerson($event)"
        @removePerson="onRemoveOrgPerson($event)"
      />
    </v-card>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, OrgPersonIF, RolesIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { EntityTypes, IncorporatorTypes, Modes, Roles } from '@/enums'

// Components
import { OrgPerson, ListPeopleAndRoles } from '.'

@Component({
  components: {
    OrgPerson,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(EntityFilterMixin) {
  // Global getters
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getUserEmail!: string

  // Global setters
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setPeopleAndRoleStepChanged!: ActionBindingIF
  @Action setPeopleAndRoleStepValidity!: ActionBindingIF

  /** Empty OrgPerson for adding a new one. */
  private newOrgPerson: OrgPersonIF = {
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
    }
  }

  // Local properties
  private showOrgPersonForm: boolean = false
  private activeIndex: number = -1
  private addEditInProgress: boolean = false
  private currentOrgPerson: OrgPersonIF | null = null
  private nextId: number = -1

  // Enums for the template
  readonly EntityTypes = EntityTypes
  readonly Roles = Roles
  readonly IncorporatorTypes = IncorporatorTypes

  /** Whether to show errors. */
  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors)
  }

  /** The completing party if found, otherwise undefined. */
  private get completingParty () : OrgPersonIF {
    return this.getPeopleAndRoles.find(people =>
      people.roles.some(party => party.roleType === Roles.COMPLETING_PARTY)
    )
  }

  /** Updates validity when component is mounted. */
  private mounted (): void {
    this.setPeopleAndRoleStepValidity(this.hasValidRoles())
    this.setPeopleAndRoleStepChanged(false)
  }

  // Methods
  private addOrgPerson (rolesToInitialize: RolesIF[], type: IncorporatorTypes): void {
    this.currentOrgPerson = { ...this.newOrgPerson }
    this.currentOrgPerson.roles = rolesToInitialize
    this.currentOrgPerson.officer.partyType = type
    this.activeIndex = -1
    this.nextId = (this.getPeopleAndRoles.length === 0)
      ? 0 : this.getPeopleAndRoles[this.getPeopleAndRoles.length - 1].officer.id + 1
    this.addEditInProgress = true
    this.showOrgPersonForm = true
  }

  private editOrgPerson (index: number): void {
    this.currentOrgPerson = { ...this.getPeopleAndRoles[index] }
    this.activeIndex = index
    this.addEditInProgress = true
    this.showOrgPersonForm = true
  }

  private onAddEditOrgPerson (person: OrgPersonIF): void {
    // if this is the completing party, assign email address from user profile
    if (person.roles.some(role => role.roleType === Roles.COMPLETING_PARTY)) {
      person.officer.email = this.getUserEmail
    }

    const newList: OrgPersonIF[] = Object.assign([], this.getPeopleAndRoles)
    if (this.activeIndex === -1) {
      // add person
      newList.push(person)
    } else {
      // edit person
      newList.splice(this.activeIndex, 1, person)
    }
    // set updated list
    this.setPeopleAndRoles(newList)
    this.setPeopleAndRoleStepValidity(this.hasValidRoles())
    this.setPeopleAndRoleStepChanged(true)
    this.resetData()
  }

  private onRemoveOrgPerson (index: number): void {
    const newList: OrgPersonIF[] = Object.assign([], this.getPeopleAndRoles)
    newList.splice(index, 1)
    this.setPeopleAndRoles(newList)
    this.setPeopleAndRoleStepValidity(this.hasValidRoles())
    this.setPeopleAndRoleStepChanged(true)
    this.resetData()
  }

  private removeCompletingPartyAssignment () {
    const newList: OrgPersonIF[] = Object.assign([], this.getPeopleAndRoles)
    const completingParty =
      newList.find(people => people.roles.some(role => role.roleType === Roles.COMPLETING_PARTY))
    if (completingParty) {
      // remove the Completing Party role
      completingParty.roles = completingParty.roles.filter(role => role.roleType !== Roles.COMPLETING_PARTY)
      // remove email address that we got from user profile
      completingParty.officer.email = null
      // set updated list
      this.setPeopleAndRoles(newList)
    }
  }

  private resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showOrgPersonForm = false
  }

  private hasValidRoles (): boolean {
    const numOfDirector: number = this.getPeopleAndRoles
      .filter(people => people.roles.some(party => party.roleType === Roles.DIRECTOR)).length
    const numOfIncorporator: number = this.getPeopleAndRoles
      .filter(people => people.roles.some(party => party.roleType === Roles.INCORPORATOR)).length
    const numOfCompletingParty: number = this.getPeopleAndRoles
      .filter(people => people.roles.some(party => party.roleType === Roles.COMPLETING_PARTY)).length
    const numOfPeopleWithNoRoles: number = this.getPeopleAndRoles
      .filter(people => people.roles.length === 0).length

    if (this.entityFilter(EntityTypes.BCOMP)) {
      return (
        numOfCompletingParty === 1 && numOfIncorporator >= 1 && numOfDirector >= 1 && numOfPeopleWithNoRoles === 0
      )
    } else if (this.entityFilter(EntityTypes.COOP)) {
      return (
        numOfCompletingParty === 1 && numOfIncorporator >= 3 && numOfDirector >= 3 && numOfPeopleWithNoRoles === 0
      )
    }
  }

  private hasRole (roleName: Roles, count: number, mode: string): boolean {
    const orgPersonWithSpecifiedRole: OrgPersonIF[] =
      this.getPeopleAndRoles.filter(people => people.roles.some(party => party.roleType === roleName))

    if (mode === Modes.EXACT) {
      return orgPersonWithSpecifiedRole.length === count
    } else if (mode === Modes.AT_LEAST) {
      return orgPersonWithSpecifiedRole.length >= count
    }
  }
}
</script>

<style lang="scss" scoped>
[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}
.people-roles-container {
  margin-top: 1rem;
}
ul {
  padding-top: 0.5rem;
  list-style: none;
  margin-left: 0;
  padding-left: 1rem
}
li {
  padding-top:0.25rem
}
p{
  padding-top: 0.5rem;
}
.btn-panel {
  padding: 2rem 0 2rem 0;
}
.sub-header {
  padding-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
}
.spacedButton {
  margin-left: 0.5rem
}
.chk-list-item-txt {
  margin-left: 0.5rem;
}
</style>
