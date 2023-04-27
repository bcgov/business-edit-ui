<template>
  <div id="add-edit-org-person">
    <ul class="list add-person mt-4">
      <li class="add-person-container">
        <section class="meta-container">
          <!-- Add/edit person -->
          <label
            v-if="isPerson"
            class="add-person-header"
          >
            <span v-if="isNew">Add Person</span>
            <span v-else>Edit Person</span>
          </label>

          <!-- Add/edit org -->
          <label
            v-if="isOrg"
            class="add-org-header"
          >
            <span v-if="isNew">Add {{ orgTypesLabel }}</span>
            <span v-else>Edit {{ orgTypesLabel }}</span>
          </label>

          <!-- Form container -->
          <div class="d-flex">
            <v-form
              id="org-person-form"
              ref="orgPersonForm"
              v-model="orgPersonFormValid"
              @submit.prevent
            >
              <!-- Person info -->
              <template v-if="isPerson">
                <!-- Name -->
                <article class="person-name">
                  <label class="sub-header">Person's Name</label>

                  <p
                    v-if="(isExisting && isProprietor)"
                    class="info-text mb-0"
                  >
                    If the proprietor has changed their legal name, enter their new legal name.
                  </p>
                  <p
                    v-if="(isExisting && isPartner)"
                    class="info-text mb-0"
                  >
                    If the partner has changed their legal name, enter their new legal name.
                  </p>

                  <!-- First/middle/last -->
                  <div class="d-flex mx-n2 pt-4">
                    <v-text-field
                      id="person__first-name"
                      v-model="orgPerson.officer.firstName"
                      variant="filled"
                      class="item mx-2 mb-n6"
                      label="First Name"
                      :rules="firstNameRules"
                    />
                    <v-text-field
                      id="person__middle-name"
                      v-model="orgPerson.officer.middleName"
                      variant="filled"
                      class="item mx-2 mb-n6"
                      label="Middle Name (Optional)"
                      :rules="middleNameRules"
                    />
                    <v-text-field
                      id="person__last-name"
                      v-model="orgPerson.officer.lastName"
                      variant="filled"
                      class="item mx-2 mb-n6"
                      label="Last Name"
                      :rules="lastNameRules"
                    />
                  </div>
                </article>

                <!-- Confirm name change -->
                <v-expand-transition>
                  <article
                    v-if="hasNameChanged(orgPerson)"
                    class="confirm-name-change mt-6"
                  >
                    <v-checkbox
                      id="confirm-name-change-checkbox"
                      v-model="orgPerson.confirmNameChange"
                      class="mt-0 pt-0"
                      hide-details
                      :rules="confirmNameChangeRules"
                    >
                      <template #label>
                        I confirm {{ isProprietor ? 'the proprietor' : isPartner ? 'this partner' :
                          'this person' }} has legally changed their name and that they remain the same
                        person.
                      </template>
                    </v-checkbox>
                  </article>
                </v-expand-transition>
              </template>

              <!-- Business or corporation info -->
              <template v-if="isOrg">
                <v-checkbox
                  v-if="wasReplaced(orgPerson)"
                  v-model="orgPerson.confirmDocuments"
                  class="confirm-documents-checkbox mt-0 pt-0 mb-6"
                  hide-details
                  label="I confirm that the supporting documents have been received by the BC Registries."
                  :rules="confirmDocumentsRules"
                />

                <!-- Add firm org using look-up -->
                <template v-if="showAddFirmOrgComponents && orgPerson.isLookupBusiness">
                  <article class="org-look-up">
                    <label class="sub-header">Business or Corporation Look Up</label>

                    <a
                      class="lookup-toggle float-right"
                      @click="toggleLookup()"
                    >
                      Business or Corporation is Unregistered in B.C.
                    </a>

                    <template v-if="wasBusinessSelectedFromLookup">
                      <v-card
                        variant="outlined"
                        class="message-box rounded-0 mt-6"
                      >
                        <p>
                          <strong>Important:</strong> If the addresses shown below are out of date, you may
                          update them here. The updates are applicable only to this registration.
                        </p>
                      </v-card>
                    </template>
                    <template v-else>
                      <div v-if="isProprietor">
                        <p class="info-text mt-6 pt-0 mb-0">
                          To add a registered B.C. business or corporation as the Proprietor, enter the name
                          or incorporation number.
                        </p>

                        <p class="info-text mt-6 pt-0 mb-0">
                          If you are adding a company that is not legally required to register in B.C.
                          such as a bank or a railway, use the manual entry form. All other types of
                          businesses cannot be the Proprietor.
                        </p>
                      </div>
                      <div v-else-if="isPartner">
                        <p class="info-text mt-6 pt-0 mb-0">
                          To add a registered B.C. business or corporation as a Partner, enter the name
                          or incorporation number.
                        </p>

                        <p class="info-text mt-6 pt-0 mb-0">
                          If you are adding a company that is not legally required to register in B.C.
                          such as a bank or a railway, use the manual entry form. All other types of
                          businesses cannot be a partner.
                        </p>
                      </div>
                      <div v-else>
                        <p class="info-text mt-6 pt-0 mb-0">
                          To add a registered B.C. business or corporation as a Partner, enter the name
                          or incorporation number.
                        </p>

                        <p class="info-text mt-6 pt-0 mb-0">
                          If you are adding a company that is not legally required to register in B.C.
                          such as a bank or a railway, use the manual entry form.
                        </p>
                      </div>
                      <HelpSection
                        v-if="!isRoleStaff"
                        class="mt-6"
                        :helpSection="getResource.changeData.orgPersonInfo.helpSection"
                      />
                    </template>

                    <BusinessLookupShared
                      class="mt-6"
                      :class="wasBusinessSelectedFromLookup ? null : 'mb-n6'"
                      :showErrors="showErrors"
                      :businessLookup="inProgressBusinessLookup"
                      :BusinessLookupServices="BusinessLookupServices"
                      :editableBusinessName="wasReplaced(currentOrgPerson)"
                      :searchStatus="searchStatus"
                      @setBusiness="updateBusinessDetails($event)"
                      @undoBusiness="resetBusinessDetails($event)"
                    />
                  </article>
                </template>

                <!-- Add firm org manually (ie, unregistered in BC) -->
                <template v-else-if="showAddFirmOrgComponents && !orgPerson.isLookupBusiness">
                  <article class="org-manual-entry">
                    <label class="sub-header">Business or Corporation Unregistered in B.C.</label>

                    <a
                      class="lookup-toggle float-right"
                      @click="toggleLookup()"
                    >
                      Business or Corporation Look Up
                    </a>

                    <p class="info-text mt-6 pt-0 mb-0">
                      Use this form to add a company that is not legally required to register in B.C. such as
                      a bank or railway as {{ isProprietor ? 'the Proprietor' : 'a partner' }}. All other
                      types of businesses not registered in B.C. cannot be {{ isProprietor ? 'the Proprietor'
                        : 'a partner' }}.
                    </p>

                    <HelpSection
                      v-if="!isRoleStaff"
                      class="mt-6"
                      :helpSection="getResource.changeData.orgPersonInfo.helpSection"
                    />

                    <!-- Confirm business -->
                    <v-checkbox
                      v-model="orgPerson.confirmBusiness"
                      class="confirm-business-checkbox mt-6 pt-0"
                      hide-details
                      :rules="confirmBusinessRules"
                    >
                      <template
                        v-if="isProprietor"
                        #label
                      >
                        I confirm that the business proprietor being added is not legally required to register in B.C.
                      </template>
                      <template
                        v-else-if="isPartner"
                        #label
                      >
                        I confirm that the business partner being added is not legally required to register in B.C.
                      </template>
                      <template
                        v-else-if="isApplicant"
                        #label
                      >
                        I confirm that the business or corporation being added is not legally required to register in
                        B.C.
                      </template>
                    </v-checkbox>

                    <!-- Organization Name -->
                    <v-text-field
                      id="organization-name"
                      v-model.trim="orgPerson.officer.organizationName"
                      variant="filled"
                      class="mt-6 mb-n6"
                      label="Business or Corporation Name"
                      :rules="orgNameRules"
                    />
                  </article>
                </template>

                <!-- Add non-firms + edit org -->
                <template v-else>
                  <article class="other-edit-org">
                    <label class="sub-header">{{ orgTypesLabel }} Name</label>
                    <v-text-field
                      id="organization-name"
                      v-model="orgPerson.officer.organizationName"
                      variant="filled"
                      class="mt-4 mb-n6"
                      :label="`${ orgTypesLabel } Name`"
                      :rules="orgNameRules"
                      :disabled="orgPerson.isLookupBusiness"
                    />

                    <!-- Confirm name change -->
                    <v-expand-transition>
                      <v-checkbox
                        v-if="hasNameChanged(orgPerson)"
                        id="confirm-name-change-checkbox"
                        v-model="orgPerson.confirmNameChange"
                        class="mt-6 pt-0"
                        hide-details
                        :rules="confirmNameChangeRules"
                      >
                        <template #label>
                          I confirm {{ isProprietor ? 'the proprietor' : isPartner ? 'this partner' :
                            'this corporation or firm' }} has legally changed their name and that they remain
                          the same business.
                        </template>
                      </v-checkbox>
                    </v-expand-transition>
                  </article>

                  <!-- Show incorporation number -->
                  <article
                    v-if="orgPerson.officer.identifier"
                    class="incorporation-number mt-6"
                  >
                    <label class="sub-header">Incorporation/Registration Number:</label>
                    <span class="sub-header-text">{{ orgPerson.officer.identifier || 'Not entered' }}</span>
                  </article>
                </template>
              </template>

              <!-- Email Address (proprietor/partner only) -->
              <article
                v-if="(isApplicant || isProprietor || isPartner)"
                class="email-address mt-6"
              >
                <label class="sub-header">Email Address</label>
                <p class="info-text">
                  Copies of the registration documents will be sent to this email address.
                </p>
                <v-text-field
                  id="proprietor-partner-email"
                  v-model="orgPerson.officer.email"
                  :label="isEmailOptional ? 'Email Address (Optional)' : 'Email Address' "
                  variant="filled"
                  class="mb-n6"
                  persistent-hint
                  validate-on="blur"
                  :rules="proprietorEmailRules"
                />
              </article>

              <!-- Roles (base corrections only) -->
              <article
                v-if="isBenBcCccUlcCorrectionFiling"
                class="roles mt-6"
              >
                <label class="sub-header">Roles</label>
                <v-row class="roles-row mt-4">
                  <v-col
                    v-if="isPerson"
                    cols="4"
                    class="mt-0"
                  >
                    <div class="pa-1">
                      <v-checkbox
                        id="dir-checkbox"
                        v-model="selectedRoles"
                        class="mt-1"
                        :value="RoleTypes.DIRECTOR"
                        :label="RoleTypes.DIRECTOR"
                        :disabled="true"
                        @update:model-value="assignDirectorRole()"
                      />
                    </div>
                  </v-col>
                </v-row>
              </article>

              <!-- Mailing address -->
              <article class="mailing-address mt-6 mb-n6">
                <label class="sub-header">Mailing Address</label>
                <div class="address-wrapper pt-4">
                  <!-- NB: prevent edit when business was looked up -->
                  <MailingAddress
                    ref="mailingAddress"
                    :editing="true"
                    :schema="mailingAddressSchema"
                    :address="inProgressMailingAddress"
                    @update:address="updateAddress(inProgressMailingAddress, $event)"
                    @valid="mailingAddressValid = $event"
                  />
                </div>
              </article>

              <!-- Delivery address (director/proprietor/partner only) -->
              <article
                v-if="isDirector || isProprietor || isPartner"
                class="delivery-address mt-6"
              >
                <v-checkbox
                  v-model="inheritMailingAddress"
                  class="mt-0 pt-0"
                  label="Delivery Address same as Mailing Address"
                  hide-details
                  :disabled="disableSameDeliveryAddress"
                />
                <v-expand-transition>
                  <div
                    v-if="!inheritMailingAddress || disableSameDeliveryAddress"
                    class="mt-6 mb-n6"
                  >
                    <label class="sub-header">Delivery Address</label>
                    <div class="address-wrapper pt-4">
                      <!-- NB: prevent edit when business was looked up -->
                      <DeliveryAddress
                        ref="deliveryAddress"
                        :editing="true"
                        :schema="deliveryAddressSchema"
                        :address="inProgressDeliveryAddress"
                        :noPoBox="noPoBoxDelivery"
                        @update:address="updateAddress(inProgressDeliveryAddress, $event)"
                        @valid="deliveryAddressValid = $event"
                      />
                    </div>
                  </div>
                </v-expand-transition>
              </article>

              <!-- Action buttons -->
              <div class="action-btns mt-10 mb-6">
                <v-btn
                  v-if="showRemoveBtn"
                  id="btn-remove"
                  size="large"
                  variant="outlined"
                  color="error"
                  :disabled="isNew"
                  @click="emitRemove(activeIndex)"
                >
                  Remove
                </v-btn>
                <v-btn
                  id="btn-done"
                  size="large"
                  color="primary"
                  class="ml-auto"
                  @click="validateOrgPersonForm()"
                >
                  Done
                </v-btn>
                <v-btn
                  id="btn-cancel"
                  size="large"
                  variant="outlined"
                  color="primary"
                  @click="resetAddPersonData(true)"
                >
                  Cancel
                </v-btn>
              </div>
            </v-form>
          </div>
        </section>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { cloneDeep, isEqual } from 'lodash'
import { mask } from 'vue-the-mask'
import { v4 as uuidv4 } from 'uuid'
import { Getter } from '@/store/PiniaClass'
import { IsSame } from '@/utils/'
import {
  OrgPersonIF, FormIF, AddressIF, AddressSchemaIF, RoleIF, ResourceIF, EmptyBusinessLookup,
  BusinessLookupIF
} from '@/interfaces/'
import BaseAddress from '@/sbc-common-components/components/BaseAddress.vue'
import { HelpSection } from '@/components/common/'
import { BusinessLookup as BusinessLookupShared } from '@/bcrs-shared-components/business-lookup'
import { CommonMixin, OrgPersonMixin } from '@/mixins/'
import { RoleTypes } from '@/enums/'
import { DefaultAddressSchema, InBcCanadaAddressSchema } from '@/schemas/'
import { BusinessLookupServices, LegalServices } from '@/services/'
import { VuetifyRuleFunction } from '@/types'

import { useStore } from '@/store/store'

const REGION_BC = 'BC'
const COUNTRY_CA = 'CA'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    BusinessLookupShared,
    HelpSection
  },
  directives: { mask },
  mixins: [CommonMixin, OrgPersonMixin]
})
export default class OrgPerson extends Vue {
  // Refs
  declare $refs: Vue['$refs'] & {
    orgPersonForm: FormIF,
    mailingAddress: FormIF,
    deliveryAddress: FormIF
  }

  // Declarations for template
  readonly RoleTypes = RoleTypes
  readonly BusinessLookupServices = BusinessLookupServices
  readonly EmptyBusinessLookup = EmptyBusinessLookup

  /** The current org/person to edit or add. */
  @Prop() readonly currentOrgPerson!: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() readonly activeIndex!: number

  // Global getters
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isBenBcCccUlcCorrectionFiling!: boolean
  @Getter(useStore) isFirmCorrectionFiling!: boolean
  @Getter(useStore) isFirm!: boolean
  @Getter(useStore) isFirmChangeFiling!: boolean
  @Getter(useStore) isFirmConversionFiling!: boolean
  @Getter(useStore) isLimitedRestorationExtension!: boolean
  @Getter(useStore) isLimitedRestorationToFull!: boolean
  @Getter(useStore) isRestorationFiling!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  // Local variables
  protected orgPerson: OrgPersonIF = null // current org/person being added/edited
  protected orgPersonFormValid = true // model value for org/person form validity
  protected inProgressMailingAddress: AddressIF = {}
  protected inProgressDeliveryAddress: AddressIF = {}
  protected inheritMailingAddress = true
  protected mailingAddressValid = false
  protected deliveryAddressValid = false
  protected selectedRoles: Array<RoleTypes> = [] // model value for roles checkboxes
  protected firstNameRules: Array<VuetifyRuleFunction> = []
  protected middleNameRules: Array<VuetifyRuleFunction> = []
  protected lastNameRules: Array<VuetifyRuleFunction> = []
  protected orgNameRules: Array<VuetifyRuleFunction> = []
  protected proprietorEmailRules: Array<VuetifyRuleFunction> = []
  protected confirmBusinessRules: Array<VuetifyRuleFunction> = []
  protected confirmDocumentsRules: Array<VuetifyRuleFunction> = []
  protected confirmNameChangeRules: Array<VuetifyRuleFunction> = []
  protected inProgressBusinessLookup: BusinessLookupIF = EmptyBusinessLookup
  protected showErrors = false

  /** True if org-person has Applicant role. */
  get isApplicant (): boolean {
    return this.hasRoleApplicant(this.orgPerson)
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
    return this.isPartyTypePerson(this.orgPerson)
  }

  /** True if org-person is an organization. */
  get isOrg (): boolean {
    return this.isPartyTypeOrg(this.orgPerson)
  }

  /** Whether the org-person is new (ie, being created). */
  get isNew (): boolean {
    return isNaN(this.activeIndex)
  }

  /** Whether the org-person is existing (ie, exists). */
  get isExisting (): boolean {
    return !isNaN(this.activeIndex)
  }

  /** Whether the org-person is pre-existing (ie, not added in this filing). */
  get isPreExisting (): boolean {
    return (this.isExisting && !this.wasAdded(this.orgPerson))
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
    // all orgs/persons mailing address can be anywhere in the world
    return DefaultAddressSchema
  }

  /**
   * The delivery address schema for the current org-person.
   * See also PeopleAndRoles.vue::haveRequiredAddresses.
   */
  get deliveryAddressSchema (): AddressSchemaIF {
    // proprietor/partner delivery address can be anywhere in the world
    if (this.isProprietor || this.isPartner) return DefaultAddressSchema

    // directors delivery address can be anywhere in the world
    if (this.isDirector) return DefaultAddressSchema

    // other persons delivery address can be anywhere in the world
    if (this.isPerson) return DefaultAddressSchema

    // other orgs delivery address must be in BC, Canada
    return InBcCanadaAddressSchema
  }

  /** Whether to show the "Address cannot be a PO Box" hint. */
  get noPoBoxDelivery (): boolean {
    if (this.isDirector) return true
    if (this.isProprietor && this.isPerson) return true
    if (this.isPartner && this.isPerson) return true
    return false
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

  /** Whether to show the Remove button. */
  get showRemoveBtn (): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isFirmChangeFiling) {
      // can only remove partner
      return this.isPartner
    }
    if (this.isFirmConversionFiling) {
      return true
    }
    if (this.isBenBcCccUlcCorrectionFiling) {
      return true
    }
    if (this.isFirmCorrectionFiling) {
      // cannot remove proprietor/partner
      return false
    }
    if (this.isLimitedRestorationToFull || this.isLimitedRestorationExtension) {
      return true
    }
    return false // should never happen
  }

  /** Whether the org-person email is optional. */
  get isEmailOptional (): boolean {
    return (this.isFirmChangeFiling || this.isFirmConversionFiling)
  }

  /** Whether to show the Add Firm Org components. */
  get showAddFirmOrgComponents (): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isFirmChangeFiling) {
      // show for replaced-added item
      // (we shouldn't see the replaced-removed item in this component)
      if (this.wasReplaced(this.orgPerson)) return true

      // can only add partner (cannot add proprietor)
      return (this.isNew && this.isPartner)
    }
    if (this.isFirmConversionFiling) {
      // can add proprietor or partner
      return (this.isNew && (this.isProprietor || this.isPartner))
    }
    if (this.isBenBcCccUlcCorrectionFiling) {
      // base corrections don't use this component
      return false
    }
    if (this.isFirmCorrectionFiling) {
      // can only add partner (cannot add proprietor)
      return (this.isNew && this.isPartner)
    }
    if (this.isRestorationFiling) {
      // show for replaced-added item
      // (we shouldn't see the replaced-removed item in this component)
      if (this.isNew) return true
    }
    return false // should never happen
  }

  /** Whether the org was selected using lookup (aka business search). */
  get wasBusinessSelectedFromLookup (): boolean {
    return (this.orgPerson?.isLookupBusiness && !!this.inProgressBusinessLookup.identifier)
  }

  /** Business status to search for. */
  get searchStatus (): string {
    // if this is a DBA replacement then search for all statuses
    // otherwise search for only ACTIVE statuses
    return this.wasReplaced(this.currentOrgPerson) ? '' : 'ACTIVE'
  }

  /**
   * Called when component is created.
   * Sets local properties.
   */
  created (): void {
    // safety check
    if (this.currentOrgPerson) {
      this.orgPerson = cloneDeep(this.currentOrgPerson)

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      // populate mailing address
      // NB: add optional fields for later comparison
      this.inProgressMailingAddress = {
        deliveryInstructions: null,
        streetAddressAdditional: '',
        ...this.orgPerson.mailingAddress
      }

      // optionally populate delivery address
      // NB: add optional fields for later comparison
      if (this.isDirector || this.isProprietor || this.isPartner) {
        this.inProgressDeliveryAddress = {
          deliveryInstructions: null,
          streetAddressAdditional: '',
          ...this.orgPerson.deliveryAddress
        }
        this.inheritMailingAddress = IsSame(
          this.inProgressMailingAddress, this.inProgressDeliveryAddress, ['id']
        )
      }
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

  /** Called when user clicks Done button. */
  protected async validateOrgPersonForm (): Promise<void> {
    await this.applyRules()

    // validate the main form and address form(s)
    // NB: forms might not be rendered
    if (this.$refs.orgPersonForm) {
      this.$refs.orgPersonForm.validate()
    }
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
        this.emitAddEdit(person)
        this.resetAddPersonData(false) // don't emit event
      } else {
        this.resetAddPersonData(true)
      }
    } else {
      // scroll to top of form to present validations
      this.scrollToTop(document.getElementById('add-edit-org-person'))
    }
  }

  /** Returns True if person has changed from its original properties. */
  private hasPersonChanged (person: OrgPersonIF): boolean {
    const officer = !isEqual(person.officer, this.currentOrgPerson?.officer)
    const mailing = !IsSame(person.mailingAddress, this.currentOrgPerson?.mailingAddress, ['id'])
    const delivery = !IsSame(person.deliveryAddress, this.currentOrgPerson?.deliveryAddress, ['id'])
    // just look at role type (ignore role.appointmentDate and role.cessationDate,
    // which will have changed if the user toggled the checkboxes)
    const roleTypes = !isEqual(person.roles.map(r => r.roleType), this.currentOrgPerson?.roles.map(r => r.roleType))
    // NB: ignore actions
    return (officer || mailing || delivery || roleTypes)
  }

  /** Returns True if person name or org name has changed from its original properties. */
  protected hasNameChanged (orgPerson: OrgPersonIF): boolean {
    /** This check is only for firm corrections, change, conversion, Corp extension and Corp conversion filings.
    Does not apply to corps corrections */
    const showConfirmNameChange = this.isFirmCorrectionFiling || this.isFirmChangeFiling ||
      this.isFirmConversionFiling || this.isLimitedRestorationExtension || this.isLimitedRestorationToFull

    // check showConfirmNameChange and is this a pre-existing person?
    if (showConfirmNameChange && this.isPreExisting && this.isPerson) {
      const firstName = !isEqual(orgPerson.officer.firstName, this.currentOrgPerson?.officer.firstName)
      const lastName = !isEqual(orgPerson.officer.lastName, this.currentOrgPerson?.officer.lastName)
      const middleName =
        !isEqual((orgPerson.officer.middleName || ''), (this.currentOrgPerson?.officer.middleName || ''))

      return (firstName || lastName || middleName)
    }
    // is this a pre-existing org?
    if (this.isPreExisting && this.isOrg) {
      return !isEqual(orgPerson.officer.organizationName, this.currentOrgPerson?.officer.organizationName)
    }
    return false // should never happen
  }

  /** Returns a new data object from current local properties. */
  private addPerson (): OrgPersonIF {
    const person = cloneDeep(this.orgPerson)
    if (this.isNew) {
      // assign a new (random) ID
      person.officer.id = uuidv4()
    }
    person.mailingAddress = { ...this.inProgressMailingAddress }
    if (this.isDirector || this.isProprietor || this.isPartner || this.isNew) {
      if (this.inheritMailingAddress) {
        this.inProgressDeliveryAddress = { ...this.inProgressMailingAddress, id: this.inProgressDeliveryAddress?.id }
      }
      person.deliveryAddress = { ...this.inProgressDeliveryAddress }
    }
    if (this.isBenBcCccUlcCorrectionFiling) {
      person.roles = this.setPersonRoles(this.orgPerson)
    } else {
      person.roles = this.orgPerson.roles
    }
    return person
  }

  private setPersonRoles (orgPerson: OrgPersonIF): RoleIF[] {
    // NB: if roles previously existed, retain old appointment dates
    const roles: Array<RoleIF> = []
    if (this.isDirector) {
      const role = orgPerson.roles.find(r => r.roleType === RoleTypes.DIRECTOR)
      roles.push({
        roleType: RoleTypes.DIRECTOR,
        appointmentDate: role?.appointmentDate || this.getCurrentDate
      })
    }
    return roles
  }

  /** Cancels an edit or resets the data after adding a person. */
  protected resetAddPersonData (emitEvent: boolean): void {
    if (this.orgPerson.isLookupBusiness && emitEvent) {
      this.emitReset()
      // in lookup mode, don't reset the forms // FUTURE: explain why not
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

  /** Toggles the org-person's lookup flag and resets the business details. */
  protected toggleLookup (): void {
    this.orgPerson.isLookupBusiness = !this.orgPerson.isLookupBusiness
    this.resetBusinessDetails()
  }

  /** Updates the business details when the user has selected a business (or by reset, below). */
  protected async updateBusinessDetails (businessLookup: BusinessLookupIF): Promise<void> {
    // convert BN15 to BN9 or null
    businessLookup.bn = (businessLookup.bn?.length === 9)
      ? businessLookup.bn
      : (businessLookup.bn?.length > 9) ? businessLookup.bn.slice(0, 9) : null

    // save working data
    this.inProgressBusinessLookup = { ...businessLookup }

    // update officer details
    this.orgPerson.officer.organizationName = businessLookup.name
    this.orgPerson.officer.identifier = businessLookup.identifier

    // fetch and update the business addresses
    if (businessLookup.identifier) {
      const addresses = await LegalServices.fetchAddresses(businessLookup.identifier)
        .catch(() => ({ registeredOffice: undefined }))
      const registeredOffice = addresses?.registeredOffice
      if (registeredOffice) {
        this.inProgressMailingAddress = { ...registeredOffice.mailingAddress }
        this.inProgressDeliveryAddress = { ...registeredOffice.deliveryAddress }
        this.inheritMailingAddress = IsSame(
          this.inProgressMailingAddress, this.inProgressDeliveryAddress, ['addressType', 'id']
        )
      }
    }
  }

  /** Resets the business details when the user has clicked the Undo button. */
  protected resetBusinessDetails (): void {
    // clear the data
    this.updateBusinessDetails(EmptyBusinessLookup)
    this.inProgressMailingAddress = {} as AddressIF
    this.inProgressDeliveryAddress = {} as AddressIF
    this.orgPerson.officer.email = null

    // reset the form validations
    if (!this.showErrors) {
      this.$refs.mailingAddress.$refs.addressForm.reset()
      if (this.$refs.deliveryAddress) {
        this.$refs.deliveryAddress.$refs.addressForm.reset()
      }
    }
  }

  /** Applies input field rules. */
  private async applyRules (): Promise<void> {
    this.showErrors = true

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

    if (this.isFirm) {
      this.orgNameRules = [
        (v: string) => !!v?.trim() || 'Business or corporation name is required',
        (v: string) => (v?.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
      ]
    } else {
      this.orgNameRules = [
        (v: string) => !!v || 'A firm name is required',
        (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
        (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
        (v: string) => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
      ]
    }

    this.proprietorEmailRules = [
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => (this.isEmailOptional && !v) || this.validateEmailFormat(v) || 'Enter valid email address'
    ]

    this.confirmBusinessRules = [(v: string) => !!v]
    this.confirmDocumentsRules = [(v: string) => !!v]
    this.confirmNameChangeRules = [(v: string) => !!v]

    // wait for component rules to be applied
    await this.$nextTick()
  }

  /** Returns True if email is valid. */
  private validateEmailFormat (email: string): boolean {
    const VALID_FORMAT = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return VALID_FORMAT.test(email)
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitAddEdit (person: OrgPersonIF): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index The index of the org/person to remove.
   */
  @Emit('remove')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitRemove (index: number): void {}

  /** Emits an event to the parent to reset the state. */
  @Emit('reset')
  private emitReset (): void {}
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

.lookup-toggle {
  font-size: $px-14;
  text-decoration: underline;
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

.highlighted-role {
  opacity: 0.5;
  mix-blend-mode: normal;
  border-radius: 2px;
  border-color: rgb(140, 140, 140);
  background-color: rgb(55, 164, 71);
  color: rgb(255, 255, 255) !important;
  font-weight: bold;

  // make label visible on background color
  :deep(.theme--light.v-label--is-disabled) {
    color: white !important;
  }
}

.roles-row {
  padding-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  background-color: rgba(0, 0, 0, 0.06);
}

// Overrides for Vuetify components
:deep() {
  #btn-remove.v-btn.v-btn--disabled {
    color: $app-red !important;
    opacity: .4;
  }

  // un-bold all input labels
  .v-label.theme--light {
    font-weight: normal;
  }

  // set input and textarea text color
  .v-input.theme--light input,
  .v-input.theme--light textarea {
    color: $gray9;
  }

  // set checkbox label color
  .v-input--checkbox.theme--light label {
    color: $gray9;
  }
}

.sub-header-text {
  color: $gray7;
  margin-left: 0.5rem;
}

.action-btns {
  display: flex;

  .v-btn {
    margin: 0;

    + .v-btn {
      margin-left: 0.5rem;
    }

    &.form-primary-btn {
      margin-left: auto;
    }
  }
}
</style>
