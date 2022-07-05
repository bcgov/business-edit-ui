<template>
  <div id="add-edit-org-person">
    <ConfirmDialogShared
      ref="reassignCpDialog"
      attach="#add-edit-org-person"
    />

    <ul class="list add-person mt-4">
      <li class="add-person-container">
        <section class="meta-container">
          <!-- Add/edit person -->
          <label class="add-person-header" v-if="isPerson">
            <span v-if="isNew">Add Person</span>
            <span v-else>Edit Person</span>
          </label>

          <!-- Add/edit org -->
          <label class="add-org-header" v-if="isOrg">
            <span v-if="isNew">Add {{ orgTypesLabel }}</span>
            <span v-else>Edit {{ orgTypesLabel }}</span>
          </label>

          <!-- Form container -->
          <div class="d-flex">
            <v-form id="org-person-form" ref="orgPersonForm" v-model="orgPersonFormValid" v-on:submit.prevent>
              <!-- Person info -->
              <template v-if="isPerson">
                <!-- Name -->
                <article class="person-name">
                  <label class="sub-header">Person's Name</label>

                  <p v-if="(isExisting && isProprietor)" class="info-text mb-0">
                    If the proprietor has changed their legal name, enter their new legal name.
                  </p>
                  <p v-if="(isExisting && isPartner)" class="info-text mb-0">
                    If the partner has changed their legal name, enter their new legal name.
                  </p>

                  <!-- First/middle/last -->
                  <div class="d-flex mx-n2 pt-4">
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
                  </div>
                </article>

                <!-- Confirm name change -->
                <v-expand-transition>
                  <article v-if="hasNameChanged(orgPerson)" class="confirm-name-change mt-6">
                    <v-checkbox
                      class="mt-0 pt-0"
                      id="confirm-name-change-checkbox"
                      hide-details
                      :rules="confirmNameChangeRules"
                      v-model="orgPerson.confirmNameChange"
                    >
                      <template slot="label">
                        I confirm {{isProprietor ? 'the proprietor' : isPartner ? 'this partner' :
                        'this person'}} has legally changed their name and that they remain the same
                        person.
                      </template>
                    </v-checkbox>
                  </article>
                </v-expand-transition>

                <!-- Edit business number -->
                <article v-if="showPersonEditBusNum" class="edit-business-number mt-6">
                  <label class="sub-header">Business Number</label>
                  <p class="info-text">
                    If you have an existing business number, enter it below and we will contact the Canada
                    Revenue Agency and ask them to link it to this registration.
                  </p>
                  <v-text-field
                    filled persistent-hint
                    class="mt-4 mb-n2"
                    label="Business Number (Optional)"
                    hint="First 9 digits of the CRA Business Number"
                    v-model.trim="orgPerson.officer.taxId"
                    v-mask="['#########']"
                    :rules="businessNumberRules"
                  />
                </article>

                <!-- Show business number -->
                <article v-if="showPersonShowBusNum" class="show-business-number mt-6">
                  <label class="sub-header">Business Number:</label>
                  <span class="sub-header-text">{{ orgPerson.officer.taxId || 'Not entered' }}</span>
                </article>
              </template>

              <!-- Business or corporation info -->
              <template v-if="isOrg">
                <!-- Add firm org using look-up -->
                <article v-if="showAddFirmOrgComponents && orgPerson.isLookupBusiness" class="org-look-up">
                  <label class="sub-header">Business or Corporation Look Up</label>

                  <a class="lookup-toggle float-right" @click="toggleLookup()">
                    Business or Corporation is Unregistered in B.C.
                  </a>

                  <v-card v-if="wasBusinessSelectedFromLookup" outlined class="message-box rounded-0 mt-6">
                    <p>
                      <strong>Important:</strong> If the addresses shown below are out of date, you may
                      update them here. The updates are applicable only to this registration.
                    </p>
                  </v-card>

                  <template v-else>
                    <p class="info-text mt-6 pt-0 mb-0">
                      To add a registered B.C. business or corporation as
                      {{ isProprietor ? 'the Proprietor' : 'a Partner' }},
                      enter the name or incorporation number.
                    </p>

                    <p class="info-text mt-6 pt-0 mb-0">
                      If you are adding a company that is not legally required to register in B.C.
                      such as a bank or a railway, use the manual entry form. All other types of
                      businesses cannot be {{ isProprietor ? 'the Proprietor' : 'a partner' }}.
                    </p>

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
                    @setBusiness="updateBusinessDetails($event)"
                    @undoBusiness="resetBusinessDetails($event)"
                  />
                </article>

                <!-- Add firm org manually (ie, unregistered in BC) -->
                <template v-else-if="showAddFirmOrgComponents && !orgPerson.isLookupBusiness">
                  <article class="org-manual-entry">
                    <label class="sub-header">Business or Corporation Unregistered in B.C.</label>

                    <a class="lookup-toggle float-right" @click="toggleLookup()">
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
                      class="confirm-business-checkbox mt-6 pt-0"
                      hide-details
                      v-model="orgPerson.confirmBusiness"
                      :rules="confirmBusinessRules"
                    >
                      <template v-if="isProprietor" slot="label">
                        I confirm that the business proprietor being added is not legally required to register in B.C.
                      </template>
                      <template v-if="isPartner" slot="label">
                        I confirm that the business partner being added is not legally required to register in B.C.
                      </template>
                    </v-checkbox>

                    <!-- Organization Name -->
                    <v-text-field
                      filled
                      class="mt-6 mb-n6"
                      id="organization-name"
                      label="Business or Corporation Name"
                      v-model.trim="orgPerson.officer.organizationName"
                      :rules="orgNameRules"
                    />
                  </article>

                  <!-- Business Number -->
                  <article class="edit-business-number mt-6">
                    <label class="sub-header">Business Number</label>
                    <p class="info-text">
                      If you have an existing business number, enter it below and we will contact
                      the Canada Revenue Agency and ask them to link it to this registration.
                    </p>
                    <v-text-field
                      filled persistent-hint
                      class="mt-4 mb-n2"
                      label="Business Number (Optional)"
                      hint="First 9 digits of the CRA Business Number"
                      v-model.trim="orgPerson.officer.taxId"
                      v-mask="['#########']"
                      :rules="businessNumberRules"
                    />
                  </article>
                </template>

                <!-- Add non-firms + edit org -->
                <template v-else>
                  <article class="other-edit-org">
                    <label class="sub-header">{{ orgTypesLabel }} Name</label>
                    <v-text-field
                      filled
                      class="mt-4 mb-n6"
                      :label="`${ orgTypesLabel } Name`"
                      id="organization-name"
                      v-model="orgPerson.officer.organizationName"
                      :rules="orgNameRules"
                      :disabled="orgPerson.isLookupBusiness"
                    />

                    <!-- Confirm name change -->
                    <v-expand-transition>
                      <v-checkbox
                        v-if="hasNameChanged(orgPerson)"
                        class="mt-6 pt-0"
                        id="confirm-name-change-checkbox"
                        hide-details
                        :rules="confirmNameChangeRules"
                        v-model="orgPerson.confirmNameChange"
                      >
                        <template slot="label">
                          I confirm {{isProprietor ? 'the proprietor' : isPartner ? 'this partner' :
                          'this corporation or firm'}} has legally changed their name and that they remain
                          the same business.
                        </template>
                      </v-checkbox>
                    </v-expand-transition>
                  </article>

                  <!-- Show incorporation number -->
                  <article v-if="orgPerson.officer.identifier" class="incorporation-number mt-6">
                    <label class="sub-header">Incorporation/Registration Number:</label>
                    <span class="sub-header-text">{{ orgPerson.officer.identifier || 'Not entered' }}</span>
                  </article>

                  <!-- Edit business number -->
                  <article v-if="showOrgEditBusNum" class="edit-business-number mt-6">
                    <label class="sub-header">Business Number</label>
                    <p class="info-text">
                      If an existing business number for this business or corporation is available, enter it
                      below. We will contact the Canada Revenue Agency and ask them to link it to this
                      registration.
                    </p>
                    <v-text-field
                      filled persistent-hint
                      class="mt-4 mb-n2"
                      label="Business Number (Optional)"
                      hint="First 9 digits of the CRA Business Number"
                      v-model.trim="orgPerson.officer.taxId"
                      v-mask="['#########']"
                      :rules="businessNumberRules"
                    />
                  </article>

                  <!-- Show business number (edit proprietor only) -->
                  <article v-if="showOrgShowBusNum" class="show-business-number mt-6">
                    <label class="sub-header">Business Number:</label>
                    <span class="sub-header-text">{{ orgPerson.officer.taxId || 'Not entered' }}</span>
                  </article>
                </template>
              </template>

              <!-- Email Address (proprietor/partner only) -->
              <article v-if="(isProprietor || isPartner)" class="email-address mt-6">
                <label class="sub-header">Email Address</label>
                <p class="info-text">
                  Copies of the registration documents will be sent to this email address.
                </p>
                <v-text-field
                  id="proprietor-partner-email"
                  :label="isEmailOptional ? 'Email Address (Optional)' : 'Email Address' "
                  filled
                  class="mb-n6"
                  persistent-hint
                  validate-on-blur
                  v-model="orgPerson.officer.email"
                  :rules="proprietorEmailRules"
                />
              </article>

              <!-- Roles (BEN corrections only) -->
              <article v-if="isBenIaCorrectionFiling" class="roles mt-6">
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
              <article v-if="isDirector || isProprietor || isPartner" class="delivery-address mt-6">
                <v-checkbox
                  class="mt-0 pt-0 mb-n2"
                  label="Delivery Address same as Mailing Address"
                  v-model="inheritMailingAddress"
                  :disabled="disableSameDeliveryAddress"
                />
                <v-expand-transition>
                  <div v-if="!inheritMailingAddress || disableSameDeliveryAddress" class="mt-6 mb-n6">
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
                  large outlined color="error"
                  :disabled="isNew"
                  @click="emitRemove(activeIndex)">Remove</v-btn>
                <v-btn
                  id="btn-done"
                  large color="primary"
                  class="ml-auto"
                  @click="validateOrgPersonForm()">Done</v-btn>
                <v-btn
                  id="btn-cancel"
                  large outlined color="primary"
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
import { mask } from 'vue-the-mask'
import { v4 as uuidv4 } from 'uuid'
import { isSame } from '@/utils/'
import { OrgPersonIF, FormIF, AddressIF, ConfirmDialogType, AddressSchemaIF, RoleIF, ResourceIF,
  EmptyBusinessLookup, BusinessLookupIF } from '@/interfaces/'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { HelpSection } from '@/components/common/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { BusinessLookup as BusinessLookupShared } from '@bcrs-shared-components/business-lookup'
import { CommonMixin, OrgPersonMixin } from '@/mixins/'
import { RoleTypes } from '@/enums/'
import { DefaultAddressSchema, InBcCanadaAddressSchema } from '@/schemas/'
import { Getter } from 'vuex-class'
import { BusinessLookupServices, LegalServices } from '@/services/'

const REGION_BC = 'BC'
const COUNTRY_CA = 'CA'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    BusinessLookupShared,
    ConfirmDialogShared,
    HelpSection
  },
  directives: { mask }
})
export default class OrgPerson extends Mixins(CommonMixin, OrgPersonMixin) {
  // Refs
  $refs!: {
    orgPersonForm: FormIF,
    mailingAddress: FormIF,
    deliveryAddress: FormIF,
    reassignCpDialog: ConfirmDialogType
  }

  // Declarations for template
  readonly RoleTypes = RoleTypes
  readonly BusinessLookupServices = BusinessLookupServices
  readonly EmptyBusinessLookup = EmptyBusinessLookup

  /** The current org/person to edit or add. */
  @Prop() readonly currentOrgPerson: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() readonly activeIndex: number

  /** The current Completing Party (or undefined). */
  @Prop() readonly currentCompletingParty: OrgPersonIF

  // Global getter
  @Getter getCurrentDate!: string
  @Getter getResource!: ResourceIF
  @Getter isBenIaCorrectionFiling!: boolean
  @Getter isFirmCorrectionFiling!: boolean
  @Getter isEntityTypeFirm!: boolean
  @Getter isRoleStaff!: boolean

  // Local variables
  protected orgPerson: OrgPersonIF = null // current org/person being added/edited
  protected orgPersonFormValid = true // model value for org/person form validity
  protected inProgressMailingAddress = {} as AddressIF
  protected inProgressDeliveryAddress = {} as AddressIF
  protected inheritMailingAddress = true
  protected mailingAddressValid = false
  protected deliveryAddressValid = false
  protected reassignCompletingParty = false
  protected selectedRoles: Array<RoleTypes> = [] // model value for roles checkboxes
  protected firstNameRules: Array<Function> = []
  protected middleNameRules: Array<Function> = []
  protected lastNameRules: Array<Function> = []
  protected orgNameRules: Array<Function> = []
  protected businessNumberRules: Array<Function> = []
  protected proprietorEmailRules: Array<Function> = []
  protected confirmBusinessRules: Array<Function> = []
  protected confirmNameChangeRules: Array<Function> = []
  protected inProgressBusinessLookup: BusinessLookupIF = EmptyBusinessLookup
  protected showErrors = false

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

  /** Whether to render the "person edit business number" block. */
  get showPersonEditBusNum (): boolean {
    if (this.isChangeRegFiling) {
      // never show for change reg filing
      return false
    }
    if (this.isFirmCorrectionFiling) {
      // show only for person-proprietor correct
      return (this.isPreExisting && this.isProprietor)
    }
    if (this.isFirmConversionFiling) {
      // show only for person-proprietor change/add/edit
      return this.isProprietor
    }
    return false
  }

  /** Whether to render the "person show business number" block. */
  get showPersonShowBusNum (): boolean {
    if (this.isChangeRegFiling) {
      // show only for change person-proprietor
      return (this.isPreExisting && this.isProprietor)
    }
    if (this.isFirmCorrectionFiling) {
      // never show for firm correction filing
      return false
    }
    if (this.isFirmConversionFiling) {
      // never show for conversion filing
      return false
    }
    return false
  }

  /** Whether to render the "org edit business number" block. */
  get showOrgEditBusNum (): boolean {
    if (this.isChangeRegFiling) {
      // show only for add org-partner manual entry
      return (this.isNew && this.isPartner && !this.orgPerson.isLookupBusiness)
    }
    if (this.isFirmCorrectionFiling) {
      // show only for org-proprietor correct
      return (this.isPreExisting && this.isProprietor)
    }
    if (this.isFirmConversionFiling) {
      // show for org-proprietor/org-partner change
      if (this.isPreExisting) return true
      // show for org-proprietor/org-partner add
      if (this.isNew) return true
      return false
    }
    return false
  }

  /** Whether to render the "org show business number" block. */
  get showOrgShowBusNum (): boolean {
    if (this.isChangeRegFiling) {
      // show for all except where edit block is shown
      return !this.showOrgEditBusNum
    }
    if (this.isFirmCorrectionFiling) {
      // show only for org-partner correct
      return (this.isPreExisting && this.isPartner)
    }
    if (this.isFirmConversionFiling) {
      // show for all except where edit block is shown
      return !this.showOrgEditBusNum
    }
    return false
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

  /** Whether to render the Remove button. */
  get showRemoveBtn (): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isChangeRegFiling) {
      // can only remove partner
      return this.isPartner
    }
    if (this.isFirmConversionFiling) {
      return true
    }
    if (this.isBenIaCorrectionFiling) {
      return true
    }
    if (this.isFirmCorrectionFiling) {
      // cannot remove proprietor/partner
      return false
    }
    return false // should never happen
  }

  /** Whether the org-person email is optional. */
  get isEmailOptional (): boolean {
    return (this.isChangeRegFiling || this.isFirmConversionFiling)
  }

  /** Whether to render the add firm org components. */
  get showAddFirmOrgComponents (): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isChangeRegFiling) {
      // can only add partner (cannot add proprietor)
      return (this.isNew && this.isPartner)
    }
    if (this.isFirmConversionFiling) {
      // can add proprietor or partner
      return (this.isNew && (this.isProprietor || this.isPartner))
    }
    if (this.isBenIaCorrectionFiling) {
      // BEN IA corrections don't use this component
      return false
    }
    if (this.isFirmCorrectionFiling) {
      // can only add partner (cannot add proprietor)
      return (this.isNew && this.isPartner)
    }
    return false // should never happen
  }

  /** Whether the org was selected using lookup (aka business search). */
  get wasBusinessSelectedFromLookup (): boolean {
    return (this.orgPerson?.isLookupBusiness && !!this.inProgressBusinessLookup.identifier)
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
        if (this.reassignCompletingParty) {
          this.emitRemoveCpRole()
        }
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
    const mailing = !isSame(person.mailingAddress, this.currentOrgPerson?.mailingAddress, ['id'])
    const delivery = !isSame(person.deliveryAddress, this.currentOrgPerson?.deliveryAddress, ['id'])
    // just look at role type (ignore role.appointmentDate and role.cessationDate,
    // which will have changed if the user toggled the checkboxes)
    const roleTypes = !isEqual(person.roles.map(r => r.roleType), this.currentOrgPerson?.roles.map(r => r.roleType))
    // NB: ignore actions
    return (officer || mailing || delivery || roleTypes)
  }

  /** Returns True if person name or org name has changed from its original properties. */
  protected hasNameChanged (orgPerson: OrgPersonIF): boolean {
    // is this a pre-existing person?
    if (this.isPreExisting && this.isPerson) {
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

  /** Displays dialog to prompt user whether to change the Completing Party. */
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
    if (this.isBenIaCorrectionFiling) {
      person.roles = this.setPersonRoles(this.orgPerson)
    } else {
      person.roles = this.orgPerson.roles
    }
    return person
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
    businessLookup.bn = (businessLookup.bn?.length === 9) ? businessLookup.bn
      : (businessLookup.bn?.length > 9) ? businessLookup.bn.slice(0, 9) : null

    // save working data
    this.inProgressBusinessLookup = { ...businessLookup }

    // update officer details
    this.orgPerson.officer.organizationName = businessLookup.name
    this.orgPerson.officer.identifier = businessLookup.identifier
    this.orgPerson.officer.taxId = businessLookup.bn

    // fetch and update the business addresses
    if (businessLookup.identifier) {
      const addresses = await LegalServices.fetchAddresses(businessLookup.identifier)
        .catch(() => ({ registeredOffice: undefined }))
      const registeredOffice = addresses?.registeredOffice
      if (registeredOffice) {
        this.inProgressMailingAddress = { ...registeredOffice.mailingAddress }
        this.inProgressDeliveryAddress = { ...registeredOffice.deliveryAddress }
        this.inheritMailingAddress = isSame(
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

    if (this.isEntityTypeFirm) {
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

    this.businessNumberRules = [
      (v: string) => {
        const pattern = /^[0-9]{9}$/
        return (!v || pattern.test(v)) || 'Invalid business number'
      }
    ]

    this.proprietorEmailRules = [
      (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      (v: string) => (this.isEmailOptional && !v) || this.validateEmailFormat(v) || 'Enter valid email address'
    ]

    this.confirmBusinessRules = [(v: string) => !!v]

    this.confirmNameChangeRules = [(v: string) => !!v]

    // wait for component rules to be applied
    await this.$nextTick()
  }

  /** Returns True if email is valid. */
  private validateEmailFormat (email: string): boolean {
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
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
  private emitAddEdit (person: OrgPersonIF): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index The index of the org/person to remove.
   */
  @Emit('remove')
  private emitRemove (index: number): void {}

  /** Emits an event to the parent to reset the state. */
  @Emit('reset')
  private emitReset (): void {}

  /** Emits an event to the parent to remove the Completing Party role. */
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

.highlightedRole {
  opacity: 0.5;
  mix-blend-mode: normal;
  border-radius: 2px;
  border-color: rgb(140, 140, 140);
  background-color: rgb(55, 164, 71);
  color: rgb(255, 255, 255) !important;
  font-weight: bold;

  // make label visible on background color
  ::v-deep .theme--light.v-label--is-disabled {
    color: white !important;
  }
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
