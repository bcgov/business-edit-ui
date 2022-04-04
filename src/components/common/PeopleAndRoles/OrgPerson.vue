<template>
  <div id="add-edit-org-person">

    <confirm-dialog
      ref="reassignCpDialog"
      attach="#add-edit-org-person"
    />

    <ul class="list add-person mt-2">
      <li class="add-person-container">
        <div class="meta-container">

          <label class="add-org-header" v-if="isPerson">
            <span v-if="isNaN(activeIndex)">Add Person</span>
            <span v-else>Edit Person</span>
          </label>

          <label class="add-org-header" v-if="isOrg">
            <span v-if="isNaN(activeIndex)">Add Corporation or Firm</span>
            <span v-else>Edit Corporation or Firm</span>
          </label>

          <div class="meta-container__inner">
            <v-form
              id="org-person-form"
              ref="orgPersonForm"
              v-model="orgPersonFormValid"
              v-on:submit.prevent
            >
              <!-- Person's Name -->
              <template v-if="isPerson">
                <label class="sub-header">Person's Name</label>
                <p v-if="isProprietor" class="info-text mb-0">
                  If the proprietor has changed their legal name, enter their new legal name.
                </p>
                <div class="form__row three-column pt-6">
                  <v-text-field
                    filled
                    class="item"
                    label="First Name"
                    id="person__first-name"
                    v-model="orgPerson.officer.firstName"
                    :rules="firstNameRules"
                  />
                  <v-text-field
                    filled
                    class="item"
                    label="Middle Name"
                    id="person__middle-name"
                    v-model="orgPerson.officer.middleName"
                    :rules="middleNameRules"
                  />
                  <v-text-field
                    filled
                    class="item"
                    label="Last Name"
                    id="person__last-name"
                    v-model="orgPerson.officer.lastName"
                    :rules="lastNameRules"
                  />
                </div>
                <div v-if="isProprietor" class="mt-0">
                  <v-checkbox
                    id="confirm-name-change-chkbx"
                    class="mb-6"
                    label="I confirm the proprietor has legally changed their name and that the proprietor remains the
                   same person."
                    :hide-details="true"
                    :rules="confirmNameChangeRules"
                    v-model="orgPerson.confirmNameChange"
                  />

                  <label class="sub-header">Email Address</label>
                  <p class="info-text">
                    Copies of the registration documents will be sent to this email address.
                  </p>
                  <v-text-field
                    id="proprietor-email"
                    label="Email Address"
                    filled
                    persistent-hint
                    validate-on-blur
                    v-model="orgPerson.officer.email"
                    :rules="proprietorEmailRules"
                  />
                </div>
              </template>

              <!-- Org's Name -->
              <template v-if="isOrg">
                <label class="sub-header">Corporation or Firm Name</label>
                <div class="org-name-container pt-6">
                  <v-text-field
                    filled
                    class="item"
                    label="Full Legal Corporation or Firm Name"
                    id="firm-name"
                    v-model="orgPerson.officer.organizationName"
                    :rules="orgNameRules"
                  />
                </div>
              </template>

              <!-- Roles -->
              <template v-if="isCorrectionFiling">
                <label class="sub-header">Roles</label>
                <v-row class="roles-row my-6">
                  <v-col cols="4" class="mt-0" v-if="isPerson">
                    <div class="pa-1">
                      <v-checkbox
                        id="cp-checkbox"
                        class="mt-1"
                        v-model="selectedRoles"
                        :value="RoleTypes.COMPLETING_PARTY"
                        :label="RoleTypes.COMPLETING_PARTY"
                        :rules="roleRules"
                        @change="assignCompletingPartyRole()"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4" class="mt-0">
                    <div class="pa-1" :class="{ 'highlightedRole': isOrg }">
                      <v-checkbox
                        id="incorp-checkbox"
                        class="mt-1"
                        v-model="selectedRoles"
                        :value="RoleTypes.INCORPORATOR"
                        :label="RoleTypes.INCORPORATOR"
                        :disabled="isOrg"
                        :rules="roleRules"
                    />
                    </div>
                  </v-col>
                  <v-col cols="4" class="mt-0" v-if="isPerson">
                    <div class="pa-1">
                      <v-checkbox
                        id="dir-checkbox"
                        class="mt-1"
                        v-model="selectedRoles"
                        :value="RoleTypes.DIRECTOR"
                        :label="RoleTypes.DIRECTOR"
                        :rules="roleRules"
                        @change="assignDirectorRole()"
                      />
                    </div>
                  </v-col>
                </v-row>
              </template>

              <!-- Mailing Address -->
              <div class="mt-2">
                <label class="sub-header">Mailing Address</label>
                <div class="address-wrapper pt-6">
                  <base-address
                    ref="mailingAddressNew"
                    :editing="true"
                    :schema="PersonAddressSchema"
                    :address="inProgressMailingAddress"
                    @update:address="inProgressMailingAddress = $event"
                    @valid="mailingAddressValid = $event"
                  />
                </div>
              </div>

              <!-- Delivery Address (for directors only) -->
              <div class="form__row" v-if="isDirector || isProprietor || isPartner">
                <v-checkbox
                  label="Delivery Address same as Mailing Address"
                  v-model="inheritMailingAddress"
                />
                <div v-if="!inheritMailingAddress">
                  <label class="sub-header">Delivery Address</label>
                  <div class="address-wrapper pt-6">
                    <base-address
                      ref="deliveryAddressNew"
                      :editing="true"
                      :schema="PersonAddressSchema"
                      :address="inProgressDeliveryAddress"
                      @update:address="inProgressDeliveryAddress = $event"
                      @valid="deliveryAddressValid = $event"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="form__row form__btns">
                <v-btn v-if="!isProprietor" id="btn-remove" large outlined color="error"
                  :disabled="isNaN(activeIndex)"
                  @click="emitRemove(activeIndex)">Remove</v-btn>
                <v-btn id="btn-done" large color="primary" class="ml-auto"
                  @click="validateOrgPersonForm()">Done</v-btn>
                <v-btn id="btn-cancel" large outlined color="primary"
                  @click="resetAddPersonData(true)">Cancel</v-btn>
              </div>
            </v-form>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins, Vue } from 'vue-property-decorator'
import { cloneDeep, isEqual } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { OrgPersonIF, BaseAddressType, FormIF, AddressIF, ConfirmDialogType, RoleIF } from '@/interfaces'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@/components/common/dialogs'
import { CommonMixin } from '@/mixins'
import { CorpTypeCd, RoleTypes, PartyTypes } from '@/enums'
import { PersonAddressSchema } from '@/schemas'
import { Getter } from 'vuex-class'

@Component({
  components: {
    BaseAddress,
    ConfirmDialog
  }
})
export default class OrgPerson extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    orgPersonForm: FormIF,
    mailingAddressNew: BaseAddressType,
    deliveryAddressNew: BaseAddressType,
    reassignCpDialog: ConfirmDialogType
  }

  // Declarations for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  private PersonAddressSchema = {}

  /** The current org/person to edit or add. */
  @Prop() private currentOrgPerson!: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() private activeIndex: number

  /** The current Completing Party (or undefined). */
  @Prop() private currentCompletingParty: OrgPersonIF

  // Global getter
  @Getter getCurrentDate!: string
  @Getter isCorrectionFiling!: boolean

  /** The current org/person being added/edited. */
  private orgPerson: OrgPersonIF = null

  /** Model value for org/person form validity. */
  private orgPersonFormValid = true

  // Address related properties
  private inProgressMailingAddress: AddressIF = undefined
  private inProgressDeliveryAddress: AddressIF = undefined
  private inheritMailingAddress = true
  private mailingAddressValid = false
  private deliveryAddressValid = false
  private reassignCompletingParty = false

  /** Model value for roles checkboxes. */
  private selectedRoles: Array<RoleTypes> = []

  /** True if Completing Party is checked. */
  private get isCompletingParty (): boolean {
    return this.selectedRoles.includes(RoleTypes.COMPLETING_PARTY)
  }

  /** True if Incorporator is checked. */
  private get isIncorporator (): boolean {
    return this.selectedRoles.includes(RoleTypes.INCORPORATOR)
  }

  /** True if Director is checked. */
  private get isDirector (): boolean {
    return this.selectedRoles.includes(RoleTypes.DIRECTOR)
  }

  /** True if orgPerson has proprietor role. */
  private get isProprietor (): boolean {
    return this.currentOrgPerson.roles.includes(RoleTypes.PROPRIETOR)
  }

  /** True if orgPerson has partner role. */
  private get isPartner (): boolean {
    return this.currentOrgPerson.roles.includes(RoleTypes.PARTNER)
  }

  /** The validation rules for the roles. */
  private get roleRules (): Array<Function> {
    return [ () => this.selectedRoles.length > 0 || 'A role is required' ]
  }

  /** The local validation rules. */
  private firstNameRules: Array<Function> = []
  private middleNameRules: Array<Function> = []
  private lastNameRules: Array<Function> = []
  private orgNameRules: Array<Function> = []
  private proprietorEmailRules = []
  private confirmNameChangeRules = []

  /** True if the form is valid. */
  private get isFormValid (): boolean {
    let isFormValid = (this.orgPersonFormValid && this.mailingAddressValid)
    if ((this.isDirector || this.isProprietor || this.isPartner) && !this.inheritMailingAddress) {
      isFormValid = (isFormValid && this.deliveryAddressValid)
    }
    if (this.isProprietor) {
      isFormValid = (isFormValid && !!this.orgPerson.officer.email)
      if (this.hasProprietorNameChanged(this.orgPerson)) {
        isFormValid = isFormValid && this.orgPerson.confirmNameChange
      }
    }

    return isFormValid
  }

  /** True if current data object is a person. */
  private get isPerson (): boolean {
    return (this.orgPerson?.officer.partyType === PartyTypes.PERSON)
  }

  /** True if current data object is an organization (corporation/firm). */
  private get isOrg (): boolean {
    return (this.orgPerson?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  /**
   * Called when component is created, to set local properties.
   */
  private created (): void {
    // safety check
    if (this.currentOrgPerson) {
      this.orgPerson = cloneDeep(this.currentOrgPerson)

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      // populate addresses as needed
      this.inProgressMailingAddress = { ...this.orgPerson.mailingAddress }
      if (this.isDirector || this.isProprietor || this.isPartner) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.deliveryAddress }
        this.inheritMailingAddress = this.isSame(
          this.inProgressMailingAddress, this.inProgressDeliveryAddress, ['id']
        )
      }
    }
  }

  /**
   * Called when Completing Party checkbox is changed.
   */
  private assignCompletingPartyRole (): void {
    if (this.orgPerson && this.isCompletingParty && this.currentCompletingParty &&
      (this.orgPerson.officer.id !== this.currentCompletingParty.officer.id)
    ) {
      this.confirmReassignPerson()
    }
  }

  /**
   * Called when Director checkbox is changed.
   */
  private assignDirectorRole (): void {
    // if this person becomes a director and has no delivery address
    // then initialize it to prevent a template error
    if (this.isDirector && !this.inProgressDeliveryAddress) {
      this.inProgressDeliveryAddress = { ...this.inProgressMailingAddress }
    }
  }

  /**
   * Called when user clicks Done button.
   */
  private async validateOrgPersonForm (): Promise<void> {
    this.applyValidation()
    await Vue.nextTick()

    // validate the main form and address form(s)
    this.$refs.orgPersonForm.validate()
    this.$refs.mailingAddressNew.$refs.addressForm.validate()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.validate()
    }

    // only proceed if form is valid
    if (this.isFormValid) {
      const person = this.addPerson()
      // only process if org/person has actually changed
      if (this.hasPersonChanged(person)) {
        if (this.reassignCompletingParty) {
          this.emitRemoveCpRole()
        }
        this.emitAddEdit(person)
        this.resetAddPersonData(false) // don't emit event
      } else {
        this.resetAddPersonData(true)
      }
    } else {
      // Scroll to top of form to present validations
      await this.scrollToTop(document.getElementById('add-edit-org-person'))
    }
  }

  /**
   * Returns True if person has changed from its original properties.
   */
  private hasPersonChanged (person: OrgPersonIF): boolean {
    const officer = !isEqual(person.officer, this.currentOrgPerson?.officer)
    const mailing = !this.isSame(person.mailingAddress, this.currentOrgPerson?.mailingAddress, ['id'])
    const delivery = !this.isSame(person.deliveryAddress, this.currentOrgPerson?.deliveryAddress, ['id'])
    // just look at role type (ignore role.appointmentDate and role.cessationDate,
    // which will have changed if the user toggled the checkboxes)
    const roleTypes = !isEqual(person.roles.map(r => r.roleType), this.currentOrgPerson?.roles.map(r => r.roleType))
    // NB: ignore actions
    return (officer || mailing || delivery || roleTypes)
  }

  /**
   * Returns True if proprietor name has changed from its original properties.
   */
  private hasProprietorNameChanged (person: OrgPersonIF): boolean {
    const firstName = !isEqual(person.officer.firstName, this.currentOrgPerson?.officer.firstName)
    const lastName = !isEqual(person.officer.lastName, this.currentOrgPerson?.officer.lastName)
    const middleName = !isEqual(person.officer.middleName, this.currentOrgPerson?.officer.middleName)

    return (firstName || lastName || middleName)
  }

  /**
   * Displays dialog to prompt user whether to change the Completing Party.
   */
  private confirmReassignPerson () {
    // open confirmation dialog and wait for response
    this.$refs.reassignCpDialog.open(
      'Change Completing Party?',
      this.changeCpMessage,
      {
        width: '45rem',
        persistent: true,
        yes: 'Change Completing Party',
        no: 'Cancel',
        cancel: null
      }
    ).then(confirm => {
      if (confirm) {
        // set flag to reassign CP when Done is clicked
        this.reassignCompletingParty = true
      } else {
        // remove the role
        this.selectedRoles = this.selectedRoles.filter(r => r !== RoleTypes.COMPLETING_PARTY)
      }
    })
  }

  /**
   * Returns a new data object from current local properties.
   */
  private addPerson (): OrgPersonIF {
    let person: OrgPersonIF = cloneDeep(this.orgPerson)
    person.officer = { ...this.orgPerson.officer }
    if (isNaN(this.activeIndex)) {
      // assign a new (random) ID
      person.officer.id = uuidv4()
    }
    person.mailingAddress = { ...this.inProgressMailingAddress }
    if (this.isDirector || this.isProprietor || this.isPartner) {
      person.deliveryAddress = this.setPersonDeliveryAddress()
    }
    person.roles = this.isCorrectionFiling ? this.setPersonRoles(this.orgPerson) : this.orgPerson.roles
    return person
  }

  private setPersonDeliveryAddress (): AddressIF {
    if (this.inheritMailingAddress) {
      this.inProgressDeliveryAddress = this.inProgressMailingAddress
    }
    return { ...this.inProgressDeliveryAddress }
  }

  private setPersonRoles (orgPerson: OrgPersonIF): RoleIF[] {
    // NB: if roles previously existed, retain old appointment dates
    let roles: Array<RoleIF> = []
    if (this.isCompletingParty) {
      const role = orgPerson.roles.find(r => r.roleType === RoleTypes.COMPLETING_PARTY)
      roles.push({
        roleType: RoleTypes.COMPLETING_PARTY,
        appointmentDate: role?.appointmentDate || this.getCurrentDate
      })
    }
    if (this.isIncorporator) {
      const role = orgPerson.roles.find(r => r.roleType === RoleTypes.INCORPORATOR)
      roles.push({
        roleType: RoleTypes.INCORPORATOR,
        appointmentDate: role?.appointmentDate || this.getCurrentDate
      })
    }
    if (this.isDirector) {
      const role = orgPerson.roles.find(r => r.roleType === RoleTypes.DIRECTOR)
      roles.push({
        roleType: RoleTypes.DIRECTOR,
        appointmentDate: role?.appointmentDate || this.getCurrentDate
      })
    }
    return roles
  }

  /**
   * Cancels an edit or resets the data after adding a person.
   */
  private resetAddPersonData (emitEvent: boolean): void {
    this.$refs.orgPersonForm.reset()
    this.$refs.mailingAddressNew.$refs.addressForm.reset()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.reset()
    }
    if (emitEvent) {
      this.emitReset()
    }
  }

  /** Apply input field validations. */
  private applyValidation (): void {
    this.firstNameRules = [
      (v: string) => !!v || 'A first name is required',
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
    ]

    this.middleNameRules = [
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
    ]

    this.lastNameRules = [
      (v: string) => !!v || 'A last name is required',
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
    ]

    this.orgNameRules = [
      (v: string) => !!v || 'A firm name is required',
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
    ]

    this.proprietorEmailRules = [
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => this.validateEmailFormat(v) || 'Enter valid email address'
    ]

    this.confirmNameChangeRules = this.hasProprietorNameChanged(this.orgPerson)
      ? [(v: string) => !!v]
      : []

    this.PersonAddressSchema = PersonAddressSchema
  }

  /** Email validation method */
  validateEmailFormat (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  /** The Completing Party change message. */
  private get changeCpMessage (): string {
    const currentCpName = this.formatFullName(this.currentCompletingParty?.officer)
    return `The Completing Party role is already assigned to ${currentCpName}.\n` +
      'Selecting "Completing Party" here will change the Completing Party.'
  }

  /**
   * Emits an event and person object to the parent to add or edit.
   * @param person The data object of the org/person to add or edit.
   */
  @Emit('addEdit')
  private emitAddEdit (person: OrgPersonIF): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index The index of the org/person to remove.
   */
  @Emit('remove')
  private emitRemove (index: number): void {}

  /**
   * Emits an event to the parent to reset the state.
   */
  @Emit('reset')
  private emitReset (): void {}

  /**
   * Emits an event to the parent to remove the Completing Party role.
   */
  @Emit('removeCpRole')
  private emitRemoveCpRole (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.people-roles-container {
  margin-top: 1rem;
  padding: 1.25rem;
}

ul, p {
  padding-top: 0.5rem;
}

li {
  list-style: None;
  padding-top: 0.25rem;
}

.btn-panel {
  padding-top: 0.5rem;
}

.form__row.three-column {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin-right: -0.5rem;
  margin-left: -0.5rem;

  .item {
    flex: 1 1 auto;
    flex-basis: 0;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }
}

// Address Block Layout
.address {
  display: flex;
  width: 12rem;
  padding-left: 0.5rem;
  margin-right: 1.35rem;
}

.same-address {
  width: 11.65rem;
}

.address__row {
  flex: 1 1 auto;
}

.add-person {
  .add-person-container {
    .meta-container {
      > label:first-child {
        margin-bottom: 1.5rem;
      }
    }
  }
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: bold;
  }

  &__inner {
    flex: 1 1 auto;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;

    .v-btn {
      min-width: 4rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.add-org-header {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.sub-header {
  padding-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.org-name-container {
  padding-top: 1rem;
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 10rem;
    }
  }
}

.highlightedRole {
  opacity: 0.5;
  mix-blend-mode: normal;
  border-radius: 2px;
  border-color: rgb(140, 140, 140);
  background-color: rgb(55, 164, 71);
  color: rgb(255, 255, 255) !important;
  font-weight: bold;
}

::v-deep .theme--light.v-label--is-disabled {
  color: white !important;
}

.roles-row {
  padding-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  background-color: rgba(0, 0, 0, 0.06);
}

// conditionally hide the v-messages (as we normally don't want their height)
::v-deep .v-input--checkbox .v-messages:not(.error--text) {
  display: none;
}

::v-deep {
  .v-input--selection-controls .v-input__slot, .v-input--selection-controls .v-radio {
    align-items: flex-start;
  }

  .theme--light.v-label {
    font-size: 1rem;
    color: $gray7;
    font-weight: normal;
  }

  .theme--light.v-input input, .theme--light.v-input textarea {
    color: $gray9;
  }
}
</style>
