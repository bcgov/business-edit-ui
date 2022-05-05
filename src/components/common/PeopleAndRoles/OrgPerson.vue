<template>
  <div id="add-edit-org-person">
    <ConfirmDialogShared
      ref="reassignCpDialog"
      attach="#add-edit-org-person"
    />

    <ul class="list add-person mt-4">
      <li class="add-person-container">
        <section class="meta-container">

          <label class="add-person-header" v-if="isPerson">
            <span v-if="isNaN(activeIndex)">Add Person</span>
            <span v-else>Edit Person</span>
          </label>

          <label class="add-org-header" v-if="isOrg">
            <span v-if="isNaN(activeIndex)">Add {{ orgTypesLabel }}</span>
            <span v-else>Edit {{ orgTypesLabel }}</span>
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
                  If the {{ isProprietor ? 'proprietor' : 'partner' }} has changed their legal name,
                  enter their new legal name.
                </p>
                <article class="form__row three-column pt-6">
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
                    label="Middle Name (Optional)"
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
                </article>
              </template>

              <!-- Org's Name -->
              <template v-if="isOrg">

                <!-- Orgs from BC -->
                <article v-if="isChangeFiling && toggleBcLookUp && isNaN(activeIndex)">
                  <label class="sub-header">{{ orgTypesLabel }} Look Up</label>
                  <span class="toggle-business-entry" @click="toggleBcLookUp = !toggleBcLookUp">
                    {{ orgTypesLabel }} is Unregistered in B.C.
                  </span>
                  <p class="info-text mt-4">To add a registered B.C. business or corporation as the
                    {{ isProprietor ? 'Proprietor' : 'Partner' }}, enter the name or incorporation number.
                  </p>
                  <p class="info-text">If you want to add a company that is not legally required to register in B.C.
                    such as a bank or a railway, use the manual entry form. All other types of businesses cannot be
                    a {{ isProprietor ? 'proprietor' : 'partner' }}.
                  </p>
                  <!-- FUTURE: Inject subcomponent here for business Look Up -->
                </article>

                <!-- Orgs from outside BC -->
                <article v-else-if="isChangeFiling && !toggleBcLookUp && isNaN(activeIndex)">
                  <label class="sub-header">{{ orgTypesLabel }} Unregistered in B.C.</label>
                  <span class="toggle-business-entry" @click="toggleBcLookUp = !toggleBcLookUp">
                    {{ orgTypesLabel }} Look Up
                  </span>
                  <p class="info-text mt-4">Use this form only if want to add a company that is not legally required to
                    register in B.C. E.g. a bank, a railway, parishes, private acts, and credit unions. All other types
                    of businesses not registered in B.C. cannot be a partner.
                  </p>
                  <HelpSection :helpSection="getResource.changeData.orgPersonInfo.helpSection" />
                </article>

                <label v-else class="sub-header">{{ orgTypesLabel }} Name</label>
                <article class="org-name-container pt-6">
                  <v-checkbox
                    v-if="!toggleBcLookUp"
                    class="confirm-partner-name-change-chkbx mb-6"
                    label="I confirm that the business partner being added is not legally required to register in B.C."
                    :hide-details="true"
                    :rules="confirmNameChangeRules"
                    v-model="orgPerson.confirmNameChange"
                  />
                  <v-text-field
                    filled
                    class="item"
                    :label="`${ orgTypesLabel } Name`"
                    id="firm-name"
                    v-if="isCorrectionFiling || !toggleBcLookUp || !isNaN(activeIndex)"
                    v-model="orgPerson.officer.organizationName"
                    :rules="orgNameRules"
                  />
                </article>
              </template>

              <!-- Firm Name Change confirmation -->
              <template v-if="isProprietor || isPartner && !isNaN(activeIndex)">
                <article class="mt-n4">
                  <v-checkbox
                    class="confirm-proprietor-name-change-chkbx mb-8"
                    :label="`I confirm ${orgPersonLabel} has legally changed their name and that they remain the ` +
                      `same person.`"
                    :hide-details="true"
                    :rules="confirmNameChangeRules"
                    v-model="orgPerson.confirmNameChange"
                  />
                </article>
              </template>

              <!-- FUTURE: Firm incorporation number -->
              <!-- <template v-if="orgPerson.officer.?">
                <article class="mb-8">
                  <label class="sub-header">Incorporation Number:</label>
                  <span class="sp-number-text">{{ 'orgPerson.officer.?' }}</span>
                </article>
              </template> -->

              <template v-if="orgPerson.officer.taxId">
                <article class="mb-8">
                  <label class="sub-header">Business Number:</label>
                  <span class="ml-2 sp-number-text">{{ 'orgPerson.officer.taxId' }}</span>
                </article>
              </template>

              <!-- Firm email address (Alterations do not edit orgPersons) -->
              <template v-if="isChangeFiling">
                <article>
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
                </article>
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

              <!-- Addresses -->
              <template v-if="isCorrectionFiling || isPerson || !toggleBcLookUp || !isNaN(activeIndex)">
                <!-- Mailing Address -->
                <div class="mt-2">
                  <label class="sub-header">Mailing Address</label>
                  <div class="address-wrapper pt-6">
                    <base-address
                      ref="mailingAddressNew"
                      :editing="true"
                      :schema="isPerson ? PersonAddressSchema : OfficeAddressSchema"
                      :address="inProgressMailingAddress"
                      @update:address="inProgressMailingAddress = $event"
                      @valid="mailingAddressValid = $event"
                    />
                  </div>
                </div>

                <!-- Delivery Address -->
                <div
                  class="form__row"
                  v-if="isDirector || isProprietor || isPartner || (isChangeFiling && isNaN(activeIndex))"
                >
                  <v-checkbox
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"
                  />
                  <div v-if="!inheritMailingAddress" class="mt-6">
                    <label class="sub-header">Delivery Address</label>
                    <div class="address-wrapper pt-6">
                      <base-address
                        ref="deliveryAddressNew"
                        :editing="true"
                        :schema="isPerson ? PersonAddressSchema : OfficeAddressSchema"
                        :address="inProgressDeliveryAddress"
                        @update:address="inProgressDeliveryAddress = $event"
                        @valid="deliveryAddressValid = $event"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Action Buttons -->
              <div class="form__row form__btns my-6">
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
        </section>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'
import { cloneDeep, isEqual } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { isSame } from '@/utils/'
import { OrgPersonIF, BaseAddressType, FormIF, AddressIF, ConfirmDialogType, RoleIF, ResourceIF } from '@/interfaces/'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { HelpSection } from '@/components/common/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { CommonMixin } from '@/mixins/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { RoleTypes, PartyTypes } from '@/enums/'
import { PersonAddressSchema, OfficeAddressSchema } from '@/schemas/'
import { Getter } from 'vuex-class'

@Component({
  components: {
    BaseAddress,
    ConfirmDialogShared,
    HelpSection
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
  readonly PersonAddressSchema = PersonAddressSchema
  readonly OfficeAddressSchema = OfficeAddressSchema

  /** The current org/person to edit or add. */
  @Prop() readonly currentOrgPerson!: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() readonly activeIndex: number

  /** The current Completing Party (or undefined). */
  @Prop() readonly currentCompletingParty: OrgPersonIF

  // Global getter
  @Getter getCurrentDate!: string
  @Getter getResource!: ResourceIF

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

  /** Model for Organization look up. */
  private toggleBcLookUp = true

  /** The local validation rules. */
  private firstNameRules: Array<Function> = []
  private middleNameRules: Array<Function> = []
  private lastNameRules: Array<Function> = []
  private orgNameRules: Array<Function> = []
  private proprietorEmailRules = []
  private confirmNameChangeRules = []

  /** True if Completing Party is checked. */
  get isCompletingParty (): boolean {
    return this.selectedRoles.includes(RoleTypes.COMPLETING_PARTY)
  }

  /** True if Incorporator is checked. */
  get isIncorporator (): boolean {
    return this.selectedRoles.includes(RoleTypes.INCORPORATOR)
  }

  /** True if Director is checked. */
  get isDirector (): boolean {
    return this.selectedRoles.includes(RoleTypes.DIRECTOR)
  }

  /** True if orgPerson has proprietor role. */
  get isProprietor (): boolean {
    return this.currentOrgPerson.roles.some(role => role.roleType === RoleTypes.PROPRIETOR)
  }

  /** True if orgPerson has partner role. */
  get isPartner (): boolean {
    return this.currentOrgPerson.roles.some(role => role.roleType === RoleTypes.PARTNER)
  }

  /** The validation rules for the roles. */
  get roleRules (): Array<Function> {
    return [ () => this.selectedRoles.length > 0 || 'A role is required' ]
  }

  /** Text label for firm orgPerson. */
  get orgPersonLabel (): string {
    return this.isProprietor ? 'the proprietor' : 'this partner'
  }

  /** True if the form is valid. */
  get isFormValid (): boolean {
    let isFormValid = (this.orgPersonFormValid && this.mailingAddressValid)
    if ((this.isDirector || this.isProprietor || this.isPartner) && !this.inheritMailingAddress) {
      isFormValid = (isFormValid && this.deliveryAddressValid)
    }
    if (this.isProprietor) {
      isFormValid = (isFormValid && !!this.orgPerson.officer.email)
      if (this.hasOrgPersonNameChanged(this.orgPerson)) {
        isFormValid = isFormValid && this.orgPerson.confirmNameChange
      }
    }

    return isFormValid
  }

  /** True if current data object is a person. */
  get isPerson (): boolean {
    return (this.orgPerson?.officer.partyType === PartyTypes.PERSON)
  }

  /** True if current data object is an organization (corporation/firm). */
  get isOrg (): boolean {
    return (this.orgPerson?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  get orgTypesLabel (): string {
    return this.getResource.changeData.orgPersonInfo?.orgTypesLabel
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
        this.inheritMailingAddress = isSame(
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
    await this.applyValidation()

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
      this.scrollToTop(document.getElementById('add-edit-org-person'))
    }
  }

  /**
   * Returns True if person has changed from its original properties.
   */
  private hasPersonChanged (person: OrgPersonIF): boolean {
    const officer = !isEqual(person.officer, this.currentOrgPerson?.officer)
    const mailing = !isSame(person.mailingAddress, this.currentOrgPerson?.mailingAddress, ['id'])
    const delivery = !isSame(person.deliveryAddress, this.currentOrgPerson?.deliveryAddress, ['id'])
    // just look at role type (ignore role.appointmentDate and role.cessationDate,
    // which will have changed if the user toggled the checkboxes)
    const roleTypes = !isEqual(person.roles.map(r => r.roleType), this.currentOrgPerson?.roles.map(r => r.roleType))
    // NB: ignore actions
    return (officer || mailing || delivery || roleTypes)
  }

  /**
   * Returns True if proprietor name has changed from its original properties.
   */
  private hasOrgPersonNameChanged (orgPerson: OrgPersonIF): boolean {
    if (this.isPerson) {
      const firstName = !isEqual(orgPerson.officer.firstName, this.currentOrgPerson?.officer.firstName)
      const lastName = !isEqual(orgPerson.officer.lastName, this.currentOrgPerson?.officer.lastName)
      const middleName =
        !isEqual((orgPerson.officer.middleName || ''), (this.currentOrgPerson?.officer.middleName || ''))

      return (firstName || lastName || middleName)
    } else return !isEqual(orgPerson.officer.organizationName, this.currentOrgPerson?.officer.organizationName)
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
    if (this.isDirector || this.isProprietor || this.isPartner || isNaN(this.activeIndex)) {
      person.deliveryAddress = this.setPersonDeliveryAddress()
    }
    person.roles = this.isCorrectionFiling ? this.setPersonRoles(this.orgPerson) : this.orgPerson.roles
    return person
  }

  private setPersonDeliveryAddress (): AddressIF {
    if (this.inheritMailingAddress) {
      this.inProgressDeliveryAddress = { ...this.inProgressMailingAddress, id: this.inProgressDeliveryAddress?.id }
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
    if (this.toggleBcLookUp && emitEvent) return this.emitReset()

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
  applyValidation (): void {
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

    this.confirmNameChangeRules = this.hasOrgPersonNameChanged(this.orgPerson)
      ? [(v: string) => !!v]
      : []
  }

  /** Email validation method */
  validateEmailFormat (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  /** The Completing Party change message. */
  get changeCpMessage (): string {
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

ul, p {
  padding-top: 0.5rem;
}

li {
  list-style: None;
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

.toggle-business-entry {
  cursor: pointer;
  color: $app-blue;
  text-decoration: underline;
  float: right;
  font-size: $px-14;
  vertical-align: middle;
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

// Overrides for vuetify components (Checkbox alignment, inputField labels/text size/colour)
::v-deep {
  #btn-remove.v-btn.v-btn--disabled {
    color: $app-red !important;
    opacity: .4;
  }
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

  // align top of text with checkbox icons
  .v-input--checkbox .v-label {
    padding-top: 2px;
  }
}

.sp-number-text {
  color: $gray7;
}
</style>
