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
              <!-- Person name -->
              <template v-if="isPerson">
                <label class="sub-header">Person's Name</label>
                <p v-if="isProprietor" class="info-text mb-0">
                  If the proprietor has changed their legal name, enter their new legal name.
                </p>
                <p v-if="isPartner" class="info-text mb-0">
                  If the partner has changed their legal name, enter their new legal name.
                </p>
                <article class="form__row three-column pt-4">
                  <v-text-field
                    filled
                    class="item mx-2 mb-n6"
                    label="First Name"
                    id="person__first-name"
                    v-model="orgPerson.officer.firstName"
                    :rules="firstNameRules"
                  />
                  <v-text-field
                    filled
                    class="item mx-2 mb-n6"
                    label="Middle Name (Optional)"
                    id="person__middle-name"
                    v-model="orgPerson.officer.middleName"
                    :rules="middleNameRules"
                  />
                  <v-text-field
                    filled
                    class="item mx-2 mb-n6"
                    label="Last Name"
                    id="person__last-name"
                    v-model="orgPerson.officer.lastName"
                    :rules="lastNameRules"
                  />
                </article>
              </template>

              <!-- Org name -->
              <template v-if="isOrg">
                <!-- Add/edit org from BC -->
                <article v-if="showFirmAddOrgComponents && orgPerson.isBusinessLookup">
                  <label class="sub-header">{{ orgTypesLabel }} Look Up</label>
                  <span class="toggle-business-lookup" @click="orgPerson.isBusinessLookup = false">
                    {{ orgTypesLabel }} is Unregistered in B.C.
                  </span>

                  <p class="info-text mt-6 pt-0">To add a registered B.C. business or corporation as the
                    {{ isProprietor ? 'Proprietor' : 'Partner' }}, enter the name or incorporation number.
                  </p>

                  <p class="info-text">If you want to add a company that is not legally required to register
                    in B.C. such as a bank or a railway, use the manual entry form. All other types of businesses
                    cannot be a {{ isProprietor ? 'proprietor' : 'partner' }}.
                  </p>

                  <!-- FUTURE: insert business lookup component here -->
                  <v-text-field
                    filled
                    persistent-hint
                    class="mt-4 mb-n2"
                    label="Business or Corporation Name or Incorporation Number"
                    hint="Enter at least the first 3 characters"
                    :rules="businessLookupRules"
                  />

                  <v-divider class="mt-6" />
                </article>

                <!-- Add/edit org from outside BC -->
                <article v-else-if="showFirmAddOrgComponents && !orgPerson.isBusinessLookup">
                  <label class="sub-header">{{ orgTypesLabel }} Unregistered in B.C.</label>

                  <span class="toggle-business-lookup" @click="orgPerson.isBusinessLookup = true">
                    {{ orgTypesLabel }} Look Up
                  </span>

                  <p class="info-text mt-6 pt-0">
                    Use this form only if want to add a company that is not legally required to register
                    in B.C. such as a bank, a railway, parishes, private acts, and credit unions. All
                    other types of businesses not registered in B.C. cannot be a partner.
                  </p>

                  <HelpSection v-if="!isRoleStaff" :helpSection="getResource.changeData.orgPersonInfo.helpSection" />

                  <v-text-field
                    filled
                    class="mt-4 mb-n6"
                    :label="`${ orgTypesLabel } Name`"
                    id="firm-name"
                    v-model="orgPerson.officer.organizationName"
                    :rules="orgNameRules"
                  />

                  <!-- Confirm business -->
                  <v-checkbox
                    class="confirm-business-checkbox mt-6 pt-0"
                    hide-details
                    :rules="confirmBusinessRules"
                    v-model="orgPerson.confirmBusiness"
                  >
                    <template v-if="isProprietor" slot="label">
                      I confirm that the business proprietor being added is not legally required to register in B.C.
                    </template>
                    <template v-if="isPartner" slot="label">
                      I confirm that the business partner being added is not legally required to register in B.C.
                    </template>
                  </v-checkbox>
                </article>

                <!-- Non-firms + edit org -->
                <template v-else>
                  <label class="sub-header">{{ orgTypesLabel }} Name</label>
                  <v-text-field
                    filled
                    class="mt-4 mb-n6"
                    :label="`${ orgTypesLabel } Name`"
                    id="firm-name"
                    v-model="orgPerson.officer.organizationName"
                    :rules="orgNameRules"
                  />
                </template>
              </template>

              <!-- Confirm name change (firm org/person only) -->
              <v-expand-transition>
                <article v-if="(isProprietor || isPartner) && hasOrgPersonNameChanged(orgPerson)">
                  <v-checkbox
                    class="confirm-name-change-checkbox mt-6 pt-0"
                    hide-details
                    :rules="confirmNameChangeRules"
                    v-model="orgPerson.confirmNameChange"
                  >
                    <template v-if="isProprietor" slot="label">
                      I confirm the proprietor has legally changed their name and that they remain the
                      same {{isPerson ? 'person' : 'business'}}.
                    </template>
                    <template v-if="isPartner" slot="label">
                      I confirm this partner has legally changed their name and that they remain the
                      same {{isPerson ? 'person' : 'business'}}.
                    </template>
                  </v-checkbox>
                </article>
              </v-expand-transition>

              <!-- Incorporation/registration number (edit firm org only) -->
              <template v-if="!isNaN(activeIndex) && (isProprietor || isPartner) && isOrg">
                <article class="mt-6">
                  <label class="sub-header">Incorporation/Registration Number:</label>
                  <span class="sub-header-text">{{ orgPerson.officer.incorporationNumber || 'Not entered' }}</span>
                </article>
              </template>

              <!-- Business number (edit firm org/person only) -->
              <template v-if="!isNaN(activeIndex) && (isProprietor || isPartner)">
                <article class="mt-6">
                  <label class="sub-header">Business Number:</label>
                  <span class="sub-header-text">{{ orgPerson.officer.taxId || 'Not entered' }}</span>
                </article>
              </template>

              <!-- Email address (firm org/person only) -->
              <template v-if="(isProprietor || isPartner)">
                <article class="mt-6">
                  <label class="sub-header">Email Address</label>
                  <p class="info-text">
                    Copies of the registration documents will be sent to this email address.
                  </p>
                  <v-text-field
                    id="proprietor-email"
                    :label="isEmailOptional ? 'Email Address (Optional)' : 'Email Address' "
                    filled
                    class="mb-n6"
                    persistent-hint
                    validate-on-blur
                    v-model="orgPerson.officer.email"
                    :rules="proprietorEmailRules"
                  />
                </article>
              </template>

              <!-- Roles -->
              <template v-if="isCorrectionFiling">
                <article class="mt-6">
                  <label class="sub-header">Roles</label>
                  <v-row class="roles-row mt-4">
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
                </article>
              </template>

              <!-- Addresses -->
              <template v-if="showAddresses">
                <!-- Mailing address -->
                <div class="mt-6">
                  <label class="sub-header">Mailing Address</label>
                  <div class="address-wrapper pt-4">
                    <!-- NB: prevent edit when business was looked up -->
                    <MailingAddress
                      ref="mailingAddress"
                      :editing="!orgPerson.isBusinessLookup"
                      :schema="mailingAddressSchema"
                      :address="inProgressMailingAddress"
                      :noPoBox="(isProprietor || isPartner) && isPerson"
                      @update:address="updateAddress(inProgressMailingAddress, $event)"
                      @valid="mailingAddressValid = $event"
                    />
                  </div>
                </div>

                <!-- Delivery address -->
                <div v-if="isDirector || isProprietor || isPartner" class="form__row">
                  <v-checkbox
                    class="mt-0"
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"
                    :disabled="disableSameDeliveryAddress"
                  />
                  <div v-if="!inheritMailingAddress || disableSameDeliveryAddress" class="mt-4">
                    <label class="sub-header">Delivery Address</label>
                    <div class="address-wrapper pt-4">
                      <!-- NB: prevent edit when business was looked up -->
                      <DeliveryAddress
                        ref="deliveryAddress"
                        :editing="!orgPerson.isBusinessLookup"
                        :schema="deliveryAddressSchema"
                        :address="inProgressDeliveryAddress"
                        :noPoBox="isDirector"
                        @update:address="updateAddress(inProgressDeliveryAddress, $event)"
                        @valid="deliveryAddressValid = $event"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Action buttons -->
              <div class="form__row form__btns my-6">
                <v-btn v-if="showRemoveBtn" id="btn-remove" large outlined color="error"
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
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep, isEqual } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { isSame } from '@/utils/'
import { OrgPersonIF, FormIF, AddressIF, ConfirmDialogType, AddressSchemaIF, RoleIF, ResourceIF }
  from '@/interfaces/'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { HelpSection } from '@/components/common/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { CommonMixin, OrgPersonMixin } from '@/mixins/'
import { RoleTypes } from '@/enums/'
import { DefaultAddressSchema, InBcCanadaAddressSchema, InCanadaAddressSchema } from '@/schemas/'
import { Getter } from 'vuex-class'

const REGION_BC = 'BC'
const COUNTRY_CA = 'CA'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    ConfirmDialogShared,
    HelpSection
  }
})
export default class OrgPerson extends Mixins(CommonMixin, OrgPersonMixin) {
  // Refs
  $refs!: {
    orgPersonForm: FormIF,
    mailingAddress: FormIF,
    deliveryAddress: FormIF,
    reassignCpDialog: ConfirmDialogType
  }

  // Declaration for template
  readonly RoleTypes = RoleTypes

  /** The current org/person to edit or add. */
  @Prop() readonly currentOrgPerson: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() readonly activeIndex: number

  /** The current Completing Party (or undefined). */
  @Prop() readonly currentCompletingParty: OrgPersonIF

  // Global getter
  @Getter getCurrentDate!: string
  @Getter getResource!: ResourceIF
  @Getter isTypeBcomp!: boolean
  @Getter isTypeSoleProp!: boolean
  @Getter isTypePartnership!: boolean
  @Getter isRoleStaff!: boolean

  /** The current org/person being added/edited. */
  private orgPerson: OrgPersonIF = null

  /** Model value for org/person form validity. */
  private orgPersonFormValid = true

  // Address related properties
  private inProgressMailingAddress = {} as AddressIF
  private inProgressDeliveryAddress = {} as AddressIF
  private inheritMailingAddress = true
  private mailingAddressValid = false
  private deliveryAddressValid = false
  private reassignCompletingParty = false

  /** Model value for roles checkboxes. */
  private selectedRoles: Array<RoleTypes> = []

  /** The local validation rules. */
  private firstNameRules: Array<Function> = []
  private middleNameRules: Array<Function> = []
  private lastNameRules: Array<Function> = []
  private businessLookupRules: Array<Function> = []
  private orgNameRules: Array<Function> = []
  private proprietorEmailRules = []
  private confirmBusinessRules = []
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

  /** True if org-person has Proprietor role. */
  get isProprietor (): boolean {
    return this.hasRoleProprietor(this.orgPerson)
  }

  /** True if org-person has Partner role. */
  get isPartner (): boolean {
    return this.hasRolePartner(this.orgPerson)
  }

  /** True if org-person is a person. */
  get isPerson (): boolean {
    return this.isTypePerson(this.orgPerson)
  }

  /** True if org-person is an organization. */
  get isOrg (): boolean {
    return this.isTypeOrg(this.orgPerson)
  }

  /** The validation rules for the roles. */
  get roleRules (): Array<Function> {
    return [ () => this.selectedRoles.length > 0 || 'A role is required' ]
  }

  /** Text label for org type. */
  get orgTypesLabel (): string {
    return this.getResource.changeData.orgPersonInfo?.orgTypesLabel
  }

  /**
   * The mailing address schema for the current org-person.
   * See also PeopleAndRoles.vue::haveRequiredAddresses.
   */
  get mailingAddressSchema (): AddressSchemaIF {
    // atm, all orgs/persons mailing address can be anywhere in the world
    return DefaultAddressSchema
  }

  /**
   * The delivery address schema for the current org-person.
   * See also PeopleAndRoles.vue::haveRequiredAddresses.
   */
  get deliveryAddressSchema (): AddressSchemaIF {
    // proprietor/partner delivery address must be in BC, Canada
    if (this.isProprietor || this.isPartner) return InBcCanadaAddressSchema

    // directors delivery address can be anywhere in the world
    if (this.isDirector) return DefaultAddressSchema

    // other persons delivery address can be anywhere in the world
    if (this.isPerson) return DefaultAddressSchema

    // other orgs delivery address must be in BC, Canada
    return InBcCanadaAddressSchema
  }

  /** Whether to disable the "same as" checkbox (to force entry of delivery address). */
  get disableSameDeliveryAddress (): boolean {
    // proprietor/partner delivery address must be in BC, Canada
    if (this.isProprietor || this.isPartner) {
      return (
        this.inProgressMailingAddress.addressRegion !== REGION_BC ||
        this.inProgressMailingAddress.addressCountry !== COUNTRY_CA
      )
    }

    // directors delivery address can be anywhere in the world
    if (this.isDirector) return false

    // other persons delivery address can be anywhere in the world
    if (this.isPerson) return false

    // other orgs delivery address must be in BC, Canada
    return (
      this.inProgressMailingAddress.addressRegion !== REGION_BC ||
      this.inProgressMailingAddress.addressCountry !== COUNTRY_CA
    )
  }

  /** Whether the Remove button should be rendered. */
  get showRemoveBtn (): boolean {
    switch (true) {
      case (this.isAlterationFiling): {
        // alterations don't use this component
        return false
      }
      case (this.isChangeRegFiling): {
        // can only remove partner in a change of registration filing
        return this.isPartner
      }
      case (this.isConversionFiling): {
        return true
      }
      case (this.isCorrectionFiling): {
        return true
      }
    }
    return false // should never happen
  }

  /** Whether the org-person email is optional. */
  get isEmailOptional (): boolean {
    return (this.isChangeRegFiling || this.isConversionFiling)
  }

  /** Whether the firm add org components should be rendered. */
  get showFirmAddOrgComponents (): boolean {
    switch (true) {
      case (this.isAlterationFiling): {
        // alterations don't use this component
        return false
      }
      case (this.isChangeRegFiling): {
        // can only add partner (cannot add proprietor)
        return (isNaN(this.activeIndex) && this.isPartner)
      }
      case (this.isConversionFiling): {
        // can add proprietor or partner
        return (isNaN(this.activeIndex) && (this.isProprietor || this.isPartner))
      }
      case (this.isCorrectionFiling): {
        return false
      }
    }
    return false // should never happen
  }

  /** Whether the addresses should be rendered. */
  get showAddresses (): boolean {
    // don't show for proprietor/partner org in BC -->
    // FUTURE: show addresses (not editable) when business lookup is complete
    if ((this.isProprietor || this.isPartner) && this.isOrg && this.orgPerson?.isBusinessLookup) {
      return false
    }
    return true
  }

  /**
   * Called when component is created, to set local properties.
   */
  protected created (): void {
    // safety check
    if (this.currentOrgPerson) {
      this.orgPerson = cloneDeep(this.currentOrgPerson)

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      // populate mailing address
      // NB: add optional fields for later comparison
      this.inProgressMailingAddress = {
        ...this.orgPerson.mailingAddress,
        deliveryInstructions: null,
        streetAddressAdditional: ''
      }

      // optionally populate delivery address
      // NB: add optional fields for later comparison
      if (this.isDirector || this.isProprietor || this.isPartner) {
        this.inProgressDeliveryAddress = {
          ...this.orgPerson.deliveryAddress,
          deliveryInstructions: null,
          streetAddressAdditional: ''
        }
        this.inheritMailingAddress = isSame(
          this.inProgressMailingAddress, this.inProgressDeliveryAddress, ['id']
        )
      }
    }
  }

  /**
   * Called when Completing Party checkbox is changed.
   */
  protected assignCompletingPartyRole (): void {
    if (this.orgPerson && this.isCompletingParty && this.currentCompletingParty &&
      (this.orgPerson.officer.id !== this.currentCompletingParty.officer.id)
    ) {
      this.confirmReassignPerson()
    }
  }

  /**
   * Called when Director checkbox is changed.
   */
  protected assignDirectorRole (): void {
    // if this person becomes a director and has no delivery address
    // then initialize it to prevent a template error
    if (this.isDirector && !this.inProgressDeliveryAddress) {
      this.inProgressDeliveryAddress = { ...this.inProgressMailingAddress }
    }
  }

  /**
   * Handles update events from address sub-components.
   * This is needed to stop address event-prop infinite looping.
   */
  protected updateAddress (baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
  }
  /**
   * Called when user clicks Done button.
   */
  protected async validateOrgPersonForm (): Promise<void> {
    await this.applyRules()

    // validate the main form and address form(s)
    // NB: address forms might not be rendered
    this.$refs.orgPersonForm.validate()
    if (this.$refs.mailingAddress?.$refs.addressForm) {
      this.$refs.mailingAddress.$refs.addressForm.validate()
    }
    if (this.$refs.deliveryAddress?.$refs.addressForm) {
      this.$refs.deliveryAddress.$refs.addressForm.validate()
    }

    // verify the main form + mailing address (all roles)
    let isFormValid = (this.orgPersonFormValid && this.mailingAddressValid)

    // verify the delivery address (specific roles only)
    if ((this.isDirector || this.isProprietor || this.isPartner) && !this.inheritMailingAddress) {
      isFormValid = (isFormValid && this.deliveryAddressValid)
    }

    // only proceed if form is valid
    if (isFormValid) {
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
   * Returns True if person name or org name has changed from its original properties.
   */
  private hasOrgPersonNameChanged (orgPerson: OrgPersonIF): boolean {
    // is this an existing person?
    if (!isNaN(this.activeIndex) && this.isPerson) {
      const firstName = !isEqual(orgPerson.officer.firstName, this.currentOrgPerson?.officer.firstName)
      const lastName = !isEqual(orgPerson.officer.lastName, this.currentOrgPerson?.officer.lastName)
      const middleName =
        !isEqual((orgPerson.officer.middleName || ''), (this.currentOrgPerson?.officer.middleName || ''))

      return (firstName || lastName || middleName)
    }
    // is this an existing org?
    if (!isNaN(this.activeIndex) && this.isOrg) {
      return !isEqual(orgPerson.officer.organizationName, this.currentOrgPerson?.officer.organizationName)
    }
    return false // should never happen
  }

  /**
   * Displays dialog to prompt user whether to change the Completing Party.
   */
  private confirmReassignPerson () {
    const currentCpName = this.formatFullName(this.currentCompletingParty?.officer)
    const changeCpMessage = `The Completing Party role is already assigned to ${currentCpName}.\n` +
      'Selecting "Completing Party" here will change the Completing Party.'

    // open confirmation dialog and wait for response
    this.$refs.reassignCpDialog.open(
      'Change Completing Party?',
      changeCpMessage,
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
  protected resetAddPersonData (emitEvent: boolean): void {
    if (this.orgPerson.isBusinessLookup && emitEvent) {
      // in lookup mode, don't reset the forms // FUTURE: explain why not
      this.emitReset()
      return
    }

    this.$refs.orgPersonForm.reset()
    this.$refs.mailingAddress.$refs.addressForm.reset()
    if (this.$refs.deliveryAddress) {
      this.$refs.deliveryAddress.$refs.addressForm.reset()
    }
    if (emitEvent) {
      this.emitReset()
    }
  }

  /** Apply input field rules. */
  private async applyRules (): Promise<void> {
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

    // FUTURE: replace this or implement something equivalent so component shows
    //         validation error if lookup isn't complete
    this.businessLookupRules = [
      (v: string) => 'Business must be looked up'
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
      (v: string) => (this.isEmailOptional && !v) || this.validateEmailFormat(v) || 'Enter valid email address'
    ]

    // NB: this only applies to firm orgs
    if ((this.isTypeSoleProp || this.isTypePartnership) && this.isOrg) {
      this.confirmBusinessRules = [(v: string) => !!v]
    } else {
      this.confirmBusinessRules = []
    }

    // NB: this only applies to firm orgs/persons
    if ((this.isTypeSoleProp || this.isTypePartnership) && this.hasOrgPersonNameChanged(this.orgPerson)) {
      this.confirmNameChangeRules = [(v: string) => !!v]
    } else {
      this.confirmNameChangeRules = []
    }

    // wait for component rules to be applied
    await this.$nextTick()
  }

  /** Email validation method */
  private validateEmailFormat (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  /**
   * Disables Same As checkbox when the delivery address is not in BC, Canada,
   * and validates Delivery address for Proprietor/Partner.
   */
  @Watch('disableSameDeliveryAddress')
  private async updateDeliveryAddress (): Promise<void> {
    if ((this.isProprietor || this.isPartner) && this.disableSameDeliveryAddress) {
      this.inheritMailingAddress = false
      // allow form to open before validating
      await this.$nextTick()

      // validate delivery address
      this.$refs.deliveryAddress && this.$refs.deliveryAddress.$refs.addressForm.validate()
    }
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
  }
}

.toggle-business-lookup {
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
    padding-top: 2px; // label align with checkbox
  }

  .theme--light.v-input input, .theme--light.v-input textarea {
    color: $gray9;
  }
}

.sub-header-text {
  color: $gray7;
  margin-left: 0.5rem;
}
</style>
