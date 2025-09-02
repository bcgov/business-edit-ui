<template>
  <section id="people-and-roles">
    <!-- Restoration conversion and extension add buttons -->
    <div v-if="(isLimitedRestorationToFull || isLimitedRestorationExtension)">
      <article>
        <section>
          <h3 :class="{ 'invalid': !hasApplicant }">
            Your application must include one of the following:
          </h3>
        </section>
        <ul>
          <li>
            <v-icon
              v-if="isApplicantPerson && hasApplicant"
              color="green darken-2"
              class="dir-valid"
            >
              mdi-check
            </v-icon>
            <v-icon
              v-else-if="!isApplicantOrg || !hasApplicant"
              color="red"
            >
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-circle-small
            </v-icon>
            <span>An individual</span>
          </li>
          <li>
            <v-icon
              v-if="isApplicantOrg && hasApplicant"
              color="green darken-2"
              class="dir-valid"
            >
              mdi-check
            </v-icon>
            <v-icon
              v-else-if="!isApplicantPerson || !hasApplicant"
              color="red"
            >
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-circle-small
            </v-icon>
            <span>A business or a corporation</span>
          </li>
        </ul>
        <div class="mt-8">
          <v-btn
            id="resto-btn-add-person"
            outlined
            color="primary"
            :disabled="hasApplicant"
            @click="initAdd(
              [{ roleType: RoleTypes.APPLICANT, appointmentDate: appointmentDate}],
              PartyTypes.PERSON
            )"
          >
            <v-icon>mdi-account-plus</v-icon>
            <span>Add a Person</span>
          </v-btn>
          <v-btn
            id="resto-btn-add-corp"
            outlined
            color="primary"
            class="ml-2"
            :disabled="hasApplicant"
            @click="initAdd(
              [{ roleType: RoleTypes.APPLICANT, appointmentDate: appointmentDate }],
              PartyTypes.ORGANIZATION
            )"
          >
            <v-icon>mdi-domain-plus</v-icon>
            <span>Add a Business or Corporation</span>
          </v-btn>
          <p
            v-if="!haveRequiredAddresses"
            class="error-text small-text mt-5 mb-0"
          >
            An applicant's address is missing or incorrect
          </p>
        </div>
      </article>
      <v-spacer class="spacer" />
    </div>

    <div v-else>
      <v-card flat>
        <!-- Header -->
        <div class="section-container header-container">
          <v-icon color="appDkBlue">
            mdi-account-multiple-plus
          </v-icon>
          <label
            id="role-header-lbl"
            class="font-weight-bold pl-2"
          >{{ orgPersonLabel }}</label>
        </div>

        <!-- Correction section (corp/coop corrections only) -->
        <article
          v-if="isCorpCorrectionFiling || isCoopCorrectionFiling"
          class="section-container"
        >
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
        <article
          v-if="isFirmChangeFiling || isFirmConversionFiling || isFirmCorrectionFiling"
          class="section-container"
        >
          <p
            v-if="orgPersonSubtitle"
            class="info-text mt-2"
          >
            {{ orgPersonSubtitle }}
          </p>

          <HelpSection
            v-if="!IsAuthorized(AuthorizedActions.FIRM_NO_HELP_SECTION) && helpSection"
            class="my-5"
            :helpSection="helpSection"
          />

          <!-- SP add buttons (conversion filing only) -->
          <div
            v-if="isEntitySoleProp && isFirmConversionFiling && !haveRequiredProprietor"
            class="mt-8"
          >
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
            <p
              v-if="!haveRequiredProprietor"
              class="error-text small-text mt-5 mb-0"
            >
              You must have one proprietor (an individual or a business)
            </p>
            <p
              v-if="!haveRequiredAddresses"
              class="error-text small-text mt-5 mb-0"
            >
              A proprietor address is missing or incorrect
            </p>
          </div>

          <!-- GP add buttons (change or conversion filings only)-->
          <div
            v-if="isEntityPartnership && (isFirmChangeFiling || isFirmConversionFiling)"
            class="mt-8"
          >
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
            <p
              v-if="!haveMinimumPartners"
              class="error-text small-text mt-5 mb-0"
            >
              You must have at least two partners on a general partnership. Optionally, you may dissolve
              the partnership and register a sole proprietorship to continue the business.
            </p>
            <p
              v-if="!haveRequiredAddresses"
              class="error-text small-text mt-5 mb-0"
            >
              A partner address is missing or incorrect
            </p>
          </div>
        </article>
      </v-card>
    </div>

    <v-card flat>
      <!-- People and roles list -->
      <article class="list-container">
        <ListPeopleAndRoles
          :renderOrgPersonForm="isAddingEditingOrgPerson"
          :currentOrgPerson="currentOrgPerson"
          :activeIndex="activeIndex"
          :validate="getComponentValidate"
          :validOrgPersons="validOrgPersons"
          :showDeliveryAddressColumn="!(isLimitedRestorationExtension || isLimitedRestorationToFull)"
          :showRolesColumn="isCorpCorrectionFiling || isCoopCorrectionFiling"
          :showEmailColumn="isLimitedRestorationExtension || isLimitedRestorationToFull"
          :showEmailUnderName="showEmailUnderName"
          @initEdit="initEdit($event)"
          @addEdit="addEdit($event)"
          @remove="remove($event)"
          @replace="replace($event)"
          @undo="undo($event)"
          @reset="reset(true)"
        />
      </article>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { cloneDeep, isEmpty } from 'lodash'
import { IsSame } from '@/utils/'
import { ActionKvIF, EmptyOrgPerson, EntitySnapshotIF, HelpSectionIF, OrgPersonIF, ResourceIF,
  RoleIF } from '@/interfaces/'
import { ActionTypes, CompareModes, PartyTypes, RoleTypes } from '@/enums/'
import { HelpSection } from '@/components/common/'
import { ListPeopleAndRoles } from './'
import { CommonMixin, DateMixin, OrgPersonMixin } from '@/mixins/'
import { useStore } from '@/store/store'

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

  // Store getters
  @Getter(useStore) getCurrentJsDate!: Date
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) getOrgPeople!: OrgPersonIF[]
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isEntityBcCcc!: boolean
  @Getter(useStore) isEntityBcCompany!: boolean
  @Getter(useStore) isEntityBcUlcCompany!: boolean
  @Getter(useStore) isEntityBenefitCompany!: boolean
  @Getter(useStore) isEntityBenContinueIn!: boolean
  @Getter(useStore) isEntityCccContinueIn!: boolean
  @Getter(useStore) isEntityContinueIn!: boolean
  @Getter(useStore) isEntityUlcContinueIn!: boolean
  @Getter(useStore) isCoopCorrectionFiling!: boolean
  @Getter(useStore) isCorpCorrectionFiling!: boolean
  @Getter(useStore) isCorrectionFiling!: boolean
  @Getter(useStore) isFirmChangeFiling!: boolean
  @Getter(useStore) isFirmConversionFiling!: boolean
  @Getter(useStore) isFirmCorrectionFiling!: boolean
  @Getter(useStore) isLimitedRestorationExtension!: boolean
  @Getter(useStore) isLimitedRestorationToFull!: boolean
  @Getter(useStore) isEntityPartnership!: boolean
  @Getter(useStore) isRestorationFiling!: boolean
  @Getter(useStore) isEntitySoleProp!: boolean

  // Store actions
  @Action(useStore) setEditingPeopleAndRoles!: (x: boolean) => void
  @Action(useStore) setPeopleAndRoles!: (x: OrgPersonIF[]) => void
  @Action(useStore) setPeopleAndRolesChanged!: (x: boolean) => void
  @Action(useStore) setPeopleAndRolesValidity!: (x: boolean) => void
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  // Local properties
  isAddingEditingOrgPerson = false
  activeIndex = NaN
  currentOrgPerson: OrgPersonIF = null

  /** The list of original parties. */
  get originalParties (): OrgPersonIF[] {
    return this.getEntitySnapshot?.orgPersons || []
  }

  /** True when the required proprietor count is met. */
  get haveRequiredProprietor (): boolean {
    return this.hasRole(RoleTypes.PROPRIETOR, 1, CompareModes.EXACT)
  }

  /** True when the minimum partner count is met. */
  get haveMinimumPartners (): boolean {
    return this.hasRole(RoleTypes.PARTNER, 2, CompareModes.AT_LEAST)
  }

  /** True when majority of Directors reside in Canada. CP only for now. */
  get haveMajorityDirectorsInCanada (): boolean {
    const existingDirectors = this.getOrgPeople
      .filter(people => !this.wasRemoved(people))
      .filter(people => people.roles.some(role => role.roleType === RoleTypes.DIRECTOR))

    if (existingDirectors.length === 0) return true

    const numberOfDirectorsResidingInCanada = existingDirectors
      .filter(people => people.mailingAddress.addressCountry === 'CA')
      .length

    const numberOfDirectorsResidingOutsideCanada = existingDirectors
      .filter(people => people.mailingAddress.addressCountry !== 'CA')
      .length

    return numberOfDirectorsResidingInCanada > numberOfDirectorsResidingOutsideCanada
  }

  /** True when the required applicant count is met. */
  get hasApplicant (): boolean {
    return this.hasRole(RoleTypes.APPLICANT, 1, CompareModes.EXACT)
  }

  /** True when orgPerson applicant role. */
  public isApplicant (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.APPLICANT)
  }

  get applicantPersons (): OrgPersonIF[] {
    return this.getOrgPeople.filter(person =>
      this.isApplicant(person) && this.isPartyTypePerson(person) && !this.wasRemoved(person)
    )
  }

  get applicantOrgs (): OrgPersonIF[] {
    return this.getOrgPeople.filter(person =>
      this.isApplicant(person) && this.isPartyTypeOrg(person) && !this.wasRemoved(person)
    )
  }

  /** True when applicant party type is org. */
  get isApplicantOrg () : boolean {
    return this.applicantOrgs.length > 0
  }

  /** True when applicant party type is person. */
  get isApplicantPerson () : boolean {
    return this.applicantPersons.length > 0
  }

  /** True if we have all required parties. */
  get haveRequiredParties (): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isFirmChangeFiling) {
      if (this.isEntityPartnership) return this.haveMinimumPartners
      if (this.isEntitySoleProp) return this.haveRequiredProprietor
      return false
    }
    if (this.isFirmConversionFiling) {
      if (this.isEntityPartnership) return this.haveMinimumPartners
      if (this.isEntitySoleProp) return this.haveRequiredProprietor
      return false
    }
    if (this.isCorrectionFiling) {
      if (this.isEntityPartnership) return this.haveMinimumPartners
      if (this.isEntitySoleProp) return this.haveRequiredProprietor
      if (
        this.isEntityBcCompany || this.isEntityBenefitCompany || this.isEntityBcCcc ||
        this.isEntityBcUlcCompany || this.isEntityContinueIn || this.isEntityBenContinueIn ||
        this.isEntityUlcContinueIn || this.isEntityCccContinueIn
      ) {
        return true
      }
      if (this.isCoopCorrectionFiling) {
        return this.haveMajorityDirectorsInCanada
      }
      return false
    }
    if (this.isRestorationFiling) {
      return this.hasApplicant
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

      if (this.hasRoleApplicant(party)) {
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

  /** flag to show email under name. */
  get showEmailUnderName (): boolean {
    return this.getResource.showEmailUnderName
  }

  /** Called when component is mounted. */
  mounted (): void {
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
   * Sets state properties to add a new org/person.
   * @param roles The roles of this item.
   * @param type The incorporator (party) type of this item.
   * @param actions The actions of this item.
   */
  initAdd (roles: RoleIF[], type: PartyTypes, actions = [ActionTypes.ADDED]): void {
    // make a copy so we don't change the original object
    this.currentOrgPerson = cloneDeep(EmptyOrgPerson)
    this.currentOrgPerson.roles = roles
    this.currentOrgPerson.officer.partyType = type
    this.currentOrgPerson.actions = actions

    // for firms and restoration (extension and conversion) applciations, use business lookup initially
    if (this.isEntityPartnership || this.isEntitySoleProp || this.isLimitedRestorationExtension ||
       this.isLimitedRestorationToFull) {
      this.currentOrgPerson.isLookupBusiness = true
    }

    // enable the add component
    this.activeIndex = NaN // means "new"
    this.isAddingEditingOrgPerson = true
  }

  /**
   * Sets state properties to edit an existing org/person.
   * @param index The index of the org/person to edit.
   */
  initEdit (index: number): void {
    // make a copy so we don't change the original object
    this.currentOrgPerson = cloneDeep(this.getOrgPeople[index])

    // enable the edit component
    this.activeIndex = index
    this.isAddingEditingOrgPerson = true
  }

  /**
   * Resets state properties after a change is completed (or to cancel).
   * @param restore whether to restore the replaced-removed item (if any)
   */
  reset (restore = false): void {
    if (restore) {
      // make a copy so Vue reacts when we set the new list
      const tempList = cloneDeep(this.getOrgPeople)

      // find the removed-replaced item and restore it
      const deleted = tempList.find(x => this.wasReplaced(x) && this.wasRemoved(x))
      if (deleted) {
        delete deleted.actions

        // set the new list
        this.setPeopleAndRoles(tempList)
      }
    }

    this.currentOrgPerson = null
    this.activeIndex = NaN
    this.isAddingEditingOrgPerson = false

    // as Vue has updated the visible sections, scroll back to the top of this component
    this.scrollToTop(this.$el)
  }

  /**
   * Undoes changes to the specified org/person.
   * @param index The index of the org/person to undo.
   */
  undo (index: number): void {
    // make a copy so Vue reacts when we set the updated list
    const tempList = cloneDeep(this.getOrgPeople)

    // get org/person to undo
    const person = tempList[index]

    if (this.wasAdded(person)) {
      // splice out the new person
      tempList.splice(index, 1)

      // check if we are undoing the added-replaced item
      if (this.wasReplaced(person)) {
        // find the removed-replaced item and restore it
        const deleted = tempList.find(x => this.wasReplaced(x) && this.wasRemoved(x))
        if (deleted) delete deleted.actions
      }
    } else {
      // get ID of edited person to undo
      const id = person?.officer?.id

      let thisPerson
      if (isNaN(+id)) {
        // to check assigned UUID
        thisPerson = cloneDeep(this.originalParties.find(x => x.officer.id === id))
      } else {
        // get a copy of original person from original IA
        thisPerson = cloneDeep(this.originalParties.find(x => +x.officer.id === +id))
      }

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
   * Adds/changes the specified org/person.
   * @param orgPerson The data object of the org/person to change.
   */
  addEdit (orgPerson: OrgPersonIF): void {
    // make a copy so Vue reacts when we set the new list
    const tempList = cloneDeep(this.getOrgPeople)

    if (isNaN(this.activeIndex)) {
      // add new person to list
      tempList.push(orgPerson)
    } else {
      // assign actions
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

  /** Returns True if the orgPerson's email has changed. */
  private hasEmailChanged (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer.email !== this.originalParties[this.activeIndex].officer.email)
  }

  /** Returns True if the orgPerson's address has changed. */
  private hasAddressChanged (orgPerson: OrgPersonIF): boolean {
    const mailingAddress =
      !IsSame(orgPerson.mailingAddress, this.originalParties[this.activeIndex].mailingAddress, ['id'])
    const deliveryAddress =
      !IsSame(orgPerson.deliveryAddress, this.originalParties[this.activeIndex].deliveryAddress, ['id'])

    return (mailingAddress || deliveryAddress)
  }

  /** Assign action(s) to the orgPerson identifying changes. */
  private assignAction (orgPerson: OrgPersonIF): OrgPersonIF {
    // Don't change actions if orgPerson is new
    if (this.wasAdded(orgPerson)) return orgPerson

    // If this is a correction then provide EDITED label and return
    if (this.isCorrectionFiling) {
      orgPerson.actions = [ActionTypes.CORRECTED]
      return orgPerson
    }

    // Create array if it doesn't already exist
    if (!orgPerson.actions) orgPerson.actions = []

    if (this.hasNameChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.NAME_CHANGED) && orgPerson.actions.push(ActionTypes.NAME_CHANGED)
    } else {
      orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.NAME_CHANGED)
    }

    if (this.hasEmailChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.EMAIL_CHANGED) && orgPerson.actions.push(ActionTypes.EMAIL_CHANGED)
    } else {
      orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.EMAIL_CHANGED)
    }

    if (this.hasAddressChanged(orgPerson)) {
      !orgPerson.actions.includes(ActionTypes.ADDRESS_CHANGED) && orgPerson.actions.push(ActionTypes.ADDRESS_CHANGED)
    } else {
      orgPerson.actions = orgPerson.actions.filter(action => action !== ActionTypes.ADDRESS_CHANGED)
    }

    // Restore orgPerson when edits are undone manually through form entry
    if (
      !this.hasNameChanged(orgPerson) &&
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
  remove (index: number): void {
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
      // (person will be filtered out on file and pay)
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

  /**
   * Processes the specified org/person for replacement.
   * @param index The index of the org/person to replace.
   */
  replace (index: number): void {
    // make a copy so Vue reacts when we set the new list
    const tempList = cloneDeep(this.getOrgPeople)

    // get org/person to replace
    // (we update this record right in the temp list)
    const person = tempList[index]

    // first, mark the existing item as REPLACED-REMOVED
    // (item will be filtered out on file and pay)
    person.actions = [ActionTypes.REPLACED, ActionTypes.REMOVED]

    // set the new list
    this.setPeopleAndRoles(tempList)

    // then, add a new proprietor-org
    // mark the new item as REPLACED-ADDED
    this.initAdd(
      [{ roleType: RoleTypes.PROPRIETOR, appointmentDate: this.appointmentDate }],
      PartyTypes.ORGANIZATION,
      [ActionTypes.REPLACED, ActionTypes.ADDED]
    )
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
  private onValidOrgPersonsChanged (): void {
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

.subhead {
  font-weight: bold;
  color: $gray9;
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

:deep() {
  .v-btn.v-btn--disabled:not(#btn-remove) {
    opacity: .4;
    color: $app-blue !important;

    .v-icon {
      color: $app-blue !important;
    }
  }
}
.spacer {
  padding-top: 1.25rem;
}

.invalid {
  color: $app-red;
}
</style>
