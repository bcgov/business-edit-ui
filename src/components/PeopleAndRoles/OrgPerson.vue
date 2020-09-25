<template>
  <div id="add-edit-org-person">
    <confirm-dialog
      ref="reassignCpDialog"
      attach="#add-edit-org-person"
    />

    <v-expand-transition>
      <ul class="list add-person">
        <li class="add-person-container">
          <div class="meta-container">
            <label class="add-org-header" v-if="isOrg">
              <span v-if="isNaN(activeIndex)">Add Corporation or Firm</span>
              <span v-else>Edit Corporation or Firm</span>
            </label>

            <div class="meta-container__inner">
              <v-form
                id="org-person-form"
                ref="orgPersonForm"
                v-model="orgPersonFormValid"
                v-on:submit.prevent="addPerson"
              >
                <!-- Person's Name -->
                <template v-if="isPerson">
                  <label class="sub-header">Person's Name</label>
                  <div class="form__row three-column">
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
                </template>

                <!-- Org's Name -->
                <template v-if="isOrg">
                  <label class="sub-header">Corporation or Firm Name</label>
                  <div class="org-name-container">
                    <v-text-field
                      filled
                      class="item"
                      label="Full Legal Corporation or Firm Name"
                      id="firm-name"
                      v-model="orgPerson.officer.orgName"
                      :rules="orgNameRules"
                    />
                  </div>
                </template>

                <!-- Roles -->
                <template>
                  <label class="sub-header">Roles</label>
                  <v-row>
                    <v-col cols="4" v-if="isPerson">
                      <div :class="{'highlightedRole': isRoleLocked(Roles.COMPLETING_PARTY)}">
                        <v-checkbox
                          v-model="isCompletingParty"
                          id="cp-checkbox"
                          :label="Roles.COMPLETING_PARTY"
                          :disabled="isRoleLocked(Roles.COMPLETING_PARTY)"
                          @change="assignCompletingPartyRole()"
                        />
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div :class="{ 'highlightedRole':
                        isRoleLocked(Roles.INCORPORATOR) ||
                        orgPerson.officer.partyType === IncorporatorTypes.CORPORATION }"
                      >
                        <v-checkbox
                          v-model="isIncorporator"
                          id="incorp-checkbox"
                          :label="Roles.INCORPORATOR"
                          :disabled="isRoleLocked(Roles.INCORPORATOR) ||
                          orgPerson.officer.partyType === IncorporatorTypes.CORPORATION"
                        />
                      </div>
                    </v-col>
                    <v-col cols="4" v-if="isPerson">
                      <v-checkbox
                        v-model="isDirector"
                        id="dir-checkbox"
                        :label="Roles.DIRECTOR"
                        @change="assignDirectorRole()"
                      />
                    </v-col>
                  </v-row>
                </template>

                <!-- Mailing Address -->
                <template>
                  <label class="sub-header">Mailing Address</label>
                  <div class="address-wrapper">
                    <base-address
                      ref="mailingAddressNew"
                      :editing="true"
                      :schema="PersonAddressSchema"
                      :address="inProgressMailingAddress"
                      @update:address="inProgressMailingAddress = $event"
                      @valid="mailingAddressValid = $event"
                    />
                  </div>
                </template>

                <!-- Delivery Address (for directors only) -->
                <div class="form__row" v-if="isDirector">
                  <v-checkbox
                    class="inherit-checkbox"
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"
                  />
                  <div v-if="!inheritMailingAddress">
                    <label class="sub-header">Delivery Address</label>
                    <div class="address-wrapper">
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
                  <v-btn id="btn-remove" large color="error"
                    :disabled="isNaN(activeIndex)"
                    @click="emitRemove(activeIndex)">Remove</v-btn>
                  <v-btn id="btn-done" large color="primary" class="ml-auto"
                    @click="validateOrgPersonForm()"
                    :disabled="!isFormValid">Done</v-btn>
                  <v-btn id="btn-cancel" large outlined color="primary"
                    @click="resetAddPersonData(true)">Cancel</v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </li>
      </ul>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'
import { OrgPersonIF, BaseAddressType, FormType, AddressIF, ConfirmDialogType, RoleIF } from '@/interfaces'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@/components/dialogs'
import { CommonMixin } from '@/mixins'
import { EntityTypes, Roles, IncorporatorTypes } from '@/enums'
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
    orgPersonForm: FormType,
    mailingAddressNew: BaseAddressType,
    deliveryAddressNew: BaseAddressType,
    reassignCpDialog: ConfirmDialogType
  }

  // Enums for template
  readonly EntityTypes = EntityTypes
  readonly Roles = Roles
  readonly IncorporatorTypes = IncorporatorTypes

  // Schema object for template
  readonly PersonAddressSchema = PersonAddressSchema

  /** The current org/person to edit or add. */
  @Prop() private currentOrgPerson!: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() private activeIndex: number

  /** The next ID to assign to an officer being added. */
  @Prop() private nextId: number

  /**
   * The existing Completing Party (or undefined).
   * This is passed in because this component doesn't know about the list.
   */
  @Prop()
  private existingCompletingParty: OrgPersonIF

  // Global getter
  @Getter getCurrentDate!: string

  /** The current org/person being added/edited. */
  private orgPerson: OrgPersonIF = null

  /** Model value for org/person form validity. */
  private orgPersonFormValid: boolean = true

  // Address related properties
  private inProgressMailingAddress: AddressIF = undefined
  private inProgressDeliveryAddress: AddressIF = undefined
  private inheritMailingAddress: boolean = true
  private mailingAddressValid: boolean = false
  private deliveryAddressValid: boolean = false
  private reassignCompletingParty: boolean = false

  /** Model value for Completing Party checkbox. */
  private isCompletingParty: boolean = false

  /** Model value for Incorporator checkbox. */
  private isIncorporator: boolean = false

  /** Model value for Director checkbox. */
  private isDirector: boolean = false

  /** The validation rules for person first name. */
  private readonly firstNameRules: Array<Function> = [
    v => !!v || 'A first name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  /** The validation rules for person middle name. */
  private readonly middleNameRules: Array<Function> = [
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  /** The validation rules for person last name. */
  private readonly lastNameRules: Array<Function> = [
    v => !!v || 'A last name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  /** The validation rules for org name. */
  private readonly orgNameRules: Array<Function> = [
    v => !!v || 'A firm name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
  ]

  /* True if the form is valid. */
  private get isFormValid (): boolean {
    let isFormValid = (this.orgPersonFormValid && this.mailingAddressValid)
    if (this.isDirector && !this.inheritMailingAddress) {
      isFormValid = isFormValid && this.deliveryAddressValid
    }
    return isFormValid
  }

  /** The formatted, existing completing party's name. */
  private get existingCompletingPartyName (): string {
    let name = this.existingCompletingParty.officer.firstName
    if (this.existingCompletingParty.officer.middleName) {
      name += ` ${this.existingCompletingParty.officer.middleName}`
    }
    name += ` ${this.existingCompletingParty.officer.lastName}`
    return name
  }

  /** True if current data object is a person. */
  private get isPerson (): boolean {
    return (this.orgPerson?.officer.partyType === IncorporatorTypes.PERSON)
  }

  /** True if current data object is an organization (corporation/firm). */
  private get isOrg (): boolean {
    return (this.orgPerson?.officer.partyType === IncorporatorTypes.CORPORATION)
  }

  /**
   * Called when component is created.
   * Sets local properties if this an edit.
   */
  private created (): void {
    // safety check
    if (this.currentOrgPerson) {
      this.orgPerson = { ...this.currentOrgPerson }
      this.orgPerson.officer = { ...this.currentOrgPerson.officer }
      // set the Director checkbox
      this.isDirector = this.orgPerson.roles.some(party => party.roleType === Roles.DIRECTOR)
      // set the Incorporator checkbox
      this.isIncorporator = this.orgPerson.roles.some(party => party.roleType === Roles.INCORPORATOR)
      // set the Completing Party checkbox
      this.isCompletingParty = this.orgPerson.roles.some(party => party.roleType === Roles.COMPLETING_PARTY)
      this.inProgressMailingAddress = { ...this.orgPerson.mailingAddress }
      if (this.isDirector) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.deliveryAddress }
        this.inheritMailingAddress = this.isSame(this.inProgressMailingAddress, this.inProgressDeliveryAddress)
      }
    }
  }

  /**
   * Called when Completing Party checkbox is changed.
   */
  private assignCompletingPartyRole (): void {
    if (this.orgPerson && this.isCompletingParty && this.existingCompletingParty &&
      (this.orgPerson.officer.id !== this.existingCompletingParty.officer.id)
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
  private validateOrgPersonForm (): void {
    if (this.isFormValid) {
      if (this.reassignCompletingParty) {
        this.emitRemoveCompletingPartyRole()
      }
      const person = this.addPerson()
      this.emitAddEdit(person)
      this.resetAddPersonData(false)
    }
  }

  /**
   * Prompts user whether to change the Completing Party.
   * */
  private confirmReassignPerson () {
    // open confirmation dialog and wait for response
    this.$refs.reassignCpDialog.open(
      'Change Completing Party?',
      this.reassignPersonErrorMessage(),
      {
        width: '45rem',
        persistent: true,
        yes: 'Change Completing Party',
        no: null,
        cancel: 'Cancel'
      }
    ).then(async (confirm) => {
      if (confirm) {
        // set flag to reassign CP when Done is clicked
        this.reassignCompletingParty = true
      }
    }).catch(() => {
      // clear the checkbox
      this.isCompletingParty = false
    })
  }

  /**
   * Returns a new data object from current local properties.
   */
  private addPerson (): OrgPersonIF {
    let personToAdd: OrgPersonIF = { ...this.orgPerson }
    personToAdd.officer = { ...this.orgPerson.officer }
    if (isNaN(this.activeIndex)) {
      personToAdd.officer.id = this.nextId
    }
    personToAdd.mailingAddress = { ...this.inProgressMailingAddress }
    if (this.isDirector) {
      personToAdd.deliveryAddress = this.setPersonDeliveryAddress()
    }
    personToAdd.roles = this.setPersonRoles()
    return personToAdd
  }

  private setPersonDeliveryAddress (): AddressIF {
    if (this.inheritMailingAddress) {
      this.inProgressDeliveryAddress = this.inProgressMailingAddress
    }
    return { ...this.inProgressDeliveryAddress }
  }

  private setPersonRoles (): RoleIF[] {
    let roles: RoleIF[] = []
    if (this.isCompletingParty) {
      roles.push({ roleType: Roles.COMPLETING_PARTY, appointmentDate: this.getCurrentDate })
    }
    if (this.isIncorporator) {
      roles.push({ roleType: Roles.INCORPORATOR, appointmentDate: this.getCurrentDate })
    }
    if (this.isDirector) {
      roles.push({ roleType: Roles.DIRECTOR, appointmentDate: this.getCurrentDate })
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

  private isRoleLocked (role: Roles): boolean {
    return (this.orgPerson?.roles.some(party => party.roleType === role) && isNaN(this.activeIndex))
  }

  private reassignPersonErrorMessage (): string {
    return `The Completing Party role is already assigned to ${this.existingCompletingPartyName}.\n` +
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
   * Emits an event and index to the parent to reset the state.
   */
  @Emit('reset')
  private emitReset (): void {}

  /**
   * Emits an event and index to the parent to remove the Completing Party role.
   */
  @Emit('removeCompletingPartyRole')
  private emitRemoveCompletingPartyRole (): void {}
}
</script>

<style lang="scss" scoped>
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
    padding: 1.25rem;

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
    font-weight: 700;
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
  font-weight: 700;
  line-height: 1.5rem;
}

.address-wrapper {
  margin-top: 1.5rem;
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
  padding: 0.25rem;
}

::v-deep .theme--light.v-label--is-disabled {
  color: white !important;
 }
</style>
