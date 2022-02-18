<template>
  <div id="office-addresses">

    <!-- Addresses Summary -->
    <template v-if="!isEditing">
      <v-layout row id="summary-registered-address" class="mx-0">
        <v-flex xs3>
          <label v-if="isChangeFiling">Business Addresses</label>
          <label v-else>Registered Office</label>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="subtitle text-body-3 mr-2">Mailing Address</span>
            <v-chip v-if="isCorrectionFiling && mailingChanged"
              x-small label color="primary" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!isEmpty(mailingAddress)"
            :address="mailingAddress"
            :editing="false"
          />
          <div v-else class="info-text">(Not entered)</div>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="subtitle text-body-3 mr-2">Delivery Address</span>
            <v-chip v-if="isCorrectionFiling && deliveryChanged"
              x-small label color="primary" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!isEmpty(deliveryAddress) && !inheritMailingAddress"
            :address="deliveryAddress"
            :editing="false"
          />
          <div v-else-if="isEmpty(deliveryAddress)" class="info-text">(Not entered)</div>
          <div v-else class="info-text">Same as Mailing Address</div>
        </v-flex>

        <v-flex xs1 v-if="isCorrectionFiling && officeAddressesChanged">
          <div class="actions mr-4">
            <span class="edit-action">
              <v-btn
                text color="primary"
                id="btn-undo-office-addresses"
                @click="resetOfficeAddresses(); dropdown = false"
              >
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
            </span>
            <span class="more-actions">
              <v-menu
                offset-y left nudge-bottom="4"
                v-model="dropdown"
                attach="#office-addresses .more-actions"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    text small color="primary"
                    id="btn-more-actions"
                    v-on="on"
                  >
                    <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    class="v-list-item"
                    id="btn-more-actions-edit"
                    @click="isEditing = true; dropdown = false"
                  >
                    <v-list-item-subtitle>
                      <v-icon small>mdi-pencil</v-icon>
                      <span class="ml-1">Correct</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
          </div>
        </v-flex>

        <v-flex xs1 v-else-if="isCorrectionFiling">
          <div class="actions mr-4">
            <v-btn
              text color="primary"
              id="btn-correct-office-addresses"
              @click="isEditing = true"
            >
              <v-icon small>mdi-pencil</v-icon>
              <span>Correct</span>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>

      <v-layout row id="summary-records-address" class="mt-4 mx-0" v-if="entityFilter(CorpTypeCd.BENEFIT_COMPANY)">
        <v-flex xs3>
          <label class>Records Office</label>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="subtitle text-body-3 mr-2">Mailing Address</span>
            <v-chip v-if="isCorrectionFiling && recMailingChanged"
              x-small label color="primary" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!inheritRegisteredAddress && !isEmpty(recMailingAddress)"
            :address="recMailingAddress"
            :editing="false"
          />
          <div v-else-if="isEmpty(recMailingAddress)" class="info-text">(Not entered)</div>
          <div v-else class="info-text">Same as Registered Office</div>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="subtitle text-body-3 mr-2">Delivery Address</span>
            <v-chip v-if="isCorrectionFiling && recDeliveryChanged"
              x-small label color="primary" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!inheritRecMailingAddress && !inheritRegisteredAddress && !isEmpty(recDeliveryAddress)"
            :address="recDeliveryAddress"
            :editing="false"
          />
          <div v-else-if="isEmpty(recDeliveryAddress)" class="info-text">(Not entered)</div>
          <div v-else-if="inheritRegisteredAddress" class="info-text">Same as Registered Office</div>
          <div v-else class="info-text">Same as Mailing Address</div>
        </v-flex>

        <!-- empty column to force alignment with Registered Office section -->
        <v-flex xs1>&nbsp;</v-flex>
      </v-layout>
    </template>

    <!-- Addresses Edit -->
    <v-card flat v-else>
      <ul class="list address-list">
        <div id="edit-registered-address">
          <div class="address-edit-header">
            <label class="address-edit-title">Registered Office</label>
          </div>

          <!-- Registered Mailing Address -->
          <li class="ma-5">
            <div class="meta-container">
              <label>Mailing Address</label>
              <div class="meta-container__inner">
                <div class="address-wrapper">
                  <base-address ref="regMailingAddress"
                    id="address-registered-mailing"
                    :address="mailingAddress"
                    :editing="true"
                    :schema="addressSchema"
                    @update:address="updateAddress(AddressTypes.MAILING_ADDRESS, mailingAddress, $event)"
                    @valid="updateValidity(AddressTypes.MAILING_ADDRESS, $event)"
                  />
                </div>
              </div>
            </div>
          </li>

          <!-- Registered Delivery Address -->
          <li class="ma-5">
            <div class="meta-container">
              <label>Delivery Address</label>
              <div class="meta-container__inner">
                <div class="form__row">
                  <v-checkbox
                    id="registered-mailing-same-chkbx"
                    class="inherit-checkbox"
                    label="Same as Mailing Address"
                    hide-details
                    v-model="inheritMailingAddress"
                    @change="setDeliveryAddressToMailingAddress()"
                  />
                </div>
                <div
                  class="address-wrapper pt-6"
                  v-if="!isSame(mailingAddress, deliveryAddress, ['actions', 'addressType']) ||
                  !inheritMailingAddress"
                >
                  <base-address ref="regDeliveryAddress"
                    id="address-registered-delivery"
                    v-if="!inheritMailingAddress"
                    :address="deliveryAddress"
                    :editing="true"
                    :schema="addressSchema"
                    @update:address="updateAddress(AddressTypes.DELIVERY_ADDRESS, deliveryAddress, $event)"
                    @valid="updateValidity(AddressTypes.DELIVERY_ADDRESS, $event)"
                  />
                </div>
              </div>
            </div>
          </li>
        </div>

        <div id="edit-records-address" v-if="entityFilter(CorpTypeCd.BENEFIT_COMPANY)">
          <div class="address-edit-header" :class="{'mt-8': inheritMailingAddress}">
            <label class="address-edit-title">Records Office</label>
            <v-checkbox
              id="records-mailing-same-chkbx"
              class="records-inherit-checkbox"
              label="Same as Registered Office"
              hide-details
              v-model="inheritRegisteredAddress"
              @change="setRecordOfficeToRegisteredOffice()"
            />
          </div>

          <template v-if="!inheritRegisteredAddress">
            <!-- Records Mailing Address -->
            <li class="ma-5">
              <div class="meta-container">
                <label>Mailing Address</label>
                <div class="meta-container__inner">
                  <div class="address-wrapper">
                    <base-address ref="recMailingAddress"
                      id="address-records-mailing"
                      :address="recMailingAddress"
                      :editing="true"
                      :schema="addressSchema"
                      @update:address="updateAddress(AddressTypes.REC_MAILING_ADDRESS, recMailingAddress, $event)"
                      @valid="updateValidity(AddressTypes.REC_MAILING_ADDRESS, $event)"
                    />
                  </div>
                </div>
              </div>
            </li>

            <!-- Records Delivery Address -->
            <li class="ma-5">
              <div class="meta-container">
                <label>Delivery Address</label>
                <div class="meta-container__inner">
                  <div class="form__row">
                    <v-checkbox
                      id="records-delivery-same-chkbx"
                      class="inherit-checkbox"
                      label="Same as Mailing Address"
                      hide-details
                      v-model="inheritRecMailingAddress"
                      v-on:change="setRecordDeliveryAddressToMailingAddress()"
                    />
                  </div>
                  <div
                    class="address-wrapper pt-6"
                    v-if="!isSame(recMailingAddress, recDeliveryAddress, ['actions', 'addressType']) ||
                    !inheritRecMailingAddress"
                  >
                    <base-address ref="recDeliveryAddress"
                      id="address-records-delivery"
                      :address="recDeliveryAddress"
                      :editing="true"
                      :schema="addressSchema"
                      @update:address="updateAddress(AddressTypes.REC_DELIVERY_ADDRESS, recDeliveryAddress, $event)"
                      @valid="updateValidity(AddressTypes.REC_DELIVERY_ADDRESS, $event)"
                    />
                  </div>
                </div>
              </div>
            </li>
          </template>
        </div>
      </ul>

      <div class="action-btns" :class="{'mt-6': inheritRegisteredAddress}">
        <v-btn
          id="done-btn"
          large color="primary"
          :disabled="!formValid"
          @click="acceptChanges()"
        >
          <span>Done</span>
        </v-btn>
        <v-btn
          id="cancel-btn"
          large outlined color="primary"
          @click="discardChanges()"
        >
          <span>Cancel</span>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { isEmpty } from 'lodash'
import { OfficeAddressSchema } from '@/schemas'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ActionBindingIF, AddressIF, IncorporationAddressIf, IncorporationFilingIF } from '@/interfaces'
import { AddressTypes, CorpTypeCd } from '@/enums'
import { CommonMixin } from '@/mixins'

@Component({
  components: { BaseAddress }
})
export default class OfficeAddresses extends Mixins(CommonMixin) {
  // Global getters
  @Getter getOfficeAddresses!: IncorporationAddressIf // NB: may be {}
  @Getter getOriginalIA!: IncorporationFilingIF
  @Getter isCorrectionFiling!: boolean
  @Getter isChangeFiling!: boolean

  // Global actions
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setEditingOfficeAddresses!: ActionBindingIF

  // Declarations for template
  readonly isEmpty = isEmpty
  readonly AddressTypes = AddressTypes
  readonly CorpTypeCd = CorpTypeCd
  readonly addressSchema = OfficeAddressSchema

  readonly defaultAddress: AddressIF = {
    addressCity: '',
    addressCountry: 'CA',
    addressRegion: 'BC',
    deliveryInstructions: '',
    postalCode: '',
    streetAddress: '',
    streetAddressAdditional: ''
  }

  /** Whether to show the editable forms for the addresses (true) or the static display addresses (false). */
  private isEditing: boolean = false

  /** V-model for dropdown menu. */
  private dropdown: boolean = null

  // The 4 addresses that are the current state of the BaseAddress sub-components:
  private mailingAddress = {} as AddressIF
  private deliveryAddress = {} as AddressIF
  private recMailingAddress = {} as AddressIF
  private recDeliveryAddress = {} as AddressIF

  // The 4 validation events from each BaseAddress sub-component:
  private mailingAddressValid: boolean = true
  private deliveryAddressValid: boolean = true
  private recMailingAddressValid: boolean = true
  private recDeliveryAddressValid: boolean = true

  /** Model value for "same as (registered) mailing address" checkbox. */
  private inheritMailingAddress: boolean = true

  /** Model value for "same as registered address" checkbox. */
  private inheritRegisteredAddress: boolean = true

  /** Model value for "same as (records) mailing address" checkbox. */
  private inheritRecMailingAddress: boolean = true

  /** The office addresses from the original IA. NB: may be {} */
  private get originalOfficeAddresses (): IncorporationAddressIf {
    return (this.getOriginalIA.incorporationApplication.offices as IncorporationAddressIf)
  }

  /** True if (registered) mailing address has changed. */
  private get mailingChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.registeredOffice?.mailingAddress,
      this.originalOfficeAddresses.registeredOffice?.mailingAddress, ['addressCountryDescription'])
  }

  /** True if (registered) delivery address has changed. */
  private get deliveryChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.registeredOffice?.deliveryAddress,
      this.originalOfficeAddresses.registeredOffice?.deliveryAddress, ['addressCountryDescription'])
  }

  /** True if records mailing address has changed. */
  private get recMailingChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.recordsOffice?.mailingAddress,
      this.originalOfficeAddresses.recordsOffice?.mailingAddress, ['addressCountryDescription'])
  }

  /** True if records delivery address has changed. */
  private get recDeliveryChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.recordsOffice?.deliveryAddress,
      this.originalOfficeAddresses.recordsOffice?.deliveryAddress, ['addressCountryDescription'])
  }

  /** True if any office address has changed. Applies to corrections only. */
  private get officeAddressesChanged (): boolean {
    return this.isCorrectionFiling &&
      (this.mailingChanged || this.deliveryChanged || this.recMailingChanged || this.recDeliveryChanged)
  }

  /** True if the address form is valid. */
  private get formValid (): boolean {
    const registeredOfficeValid = this.mailingAddressValid &&
      (this.deliveryAddressValid || this.inheritMailingAddress)

    const recordsOfficeValid = this.inheritRegisteredAddress ||
      (this.recMailingAddressValid && (this.inheritRecMailingAddress || this.recDeliveryAddressValid))

    return (registeredOfficeValid && recordsOfficeValid)
  }

  /**
   * Sets local address data and "inherit" flags from store.
   */
  private setLocalProperties (): void {
    if (this.getOfficeAddresses?.registeredOffice) {
      this.mailingAddress = { ...this.getOfficeAddresses.registeredOffice.mailingAddress }
      this.deliveryAddress = { ...this.getOfficeAddresses.registeredOffice.deliveryAddress }

      // compare addresses to set the "inherit mailing" flag
      // ignore Address Type since it's different
      // ignore Address Country Description since it's not always present
      this.inheritMailingAddress = this.isSame(
        this.getOfficeAddresses.registeredOffice.mailingAddress,
        this.getOfficeAddresses.registeredOffice.deliveryAddress,
        ['addressType', 'addressCountryDescription']
      )

      // for BCOMPS, also set the Records Address
      if (this.entityFilter(CorpTypeCd.BENEFIT_COMPANY)) {
        this.recMailingAddress = { ...this.getOfficeAddresses.recordsOffice?.mailingAddress }
        this.recDeliveryAddress = { ...this.getOfficeAddresses.recordsOffice?.deliveryAddress }

        // compare addresses to set the "inherit registered" flag
        // ignore Address Country Description since it's not always present
        this.inheritRegisteredAddress = (
          this.isSame(
            this.getOfficeAddresses.registeredOffice.deliveryAddress,
            this.getOfficeAddresses.recordsOffice?.deliveryAddress,
            ['addressCountryDescription']
          ) && this.isSame(
            this.getOfficeAddresses.registeredOffice.mailingAddress,
            this.getOfficeAddresses.recordsOffice?.mailingAddress,
            ['addressCountryDescription']
          )
        )

        // compare addresses to set the "inherit records mailing" flag
        // ignore Address Type since it's different
        // ignore Address Country Description since it's not always present
        this.inheritRecMailingAddress = this.isSame(
          this.getOfficeAddresses.recordsOffice?.mailingAddress,
          this.getOfficeAddresses.recordsOffice?.deliveryAddress,
          ['addressType', 'addressCountryDescription']
        )
      }
    }
  }

  /**
   * When "same as (registry) mailing address" checkbox is changed,
   * sets the Registered Delivery Address to the Registered Mailing Address.
   */
  private setDeliveryAddressToMailingAddress (): void {
    if (this.inheritMailingAddress) {
      this.deliveryAddress = { ...this.mailingAddress, addressType: 'delivery' }
    } else {
      // clear to default
      this.deliveryAddress = { ...this.defaultAddress, addressType: 'delivery' }
    }

    // Records delivery address also needs to be updated if inherited
    if (this.inheritRegisteredAddress) {
      this.recDeliveryAddress = { ...this.deliveryAddress }
    }
  }

  /**
   * When "same as registered address" checkbox is changed,
   * sets the Records office addresses to the Registered office addresses.
   */
  private setRecordOfficeToRegisteredOffice (): void {
    if (this.inheritRegisteredAddress) {
      this.recMailingAddress = { ...this.mailingAddress }
      this.recDeliveryAddress = { ...this.deliveryAddress }
    } else {
      this.inheritRecMailingAddress = this.inheritMailingAddress
      // clear to default
      this.recMailingAddress = { ...this.defaultAddress, addressType: 'mailing' }
      this.recDeliveryAddress = { ...this.defaultAddress, addressType: 'delivery' }
    }
  }

  /**
   * When "same as (records) mailing address" checkbox is changed,
   * sets the Records Delivery Address to Records Mailing Address.
   */
  private setRecordDeliveryAddressToMailingAddress (): void {
    if (this.inheritRecMailingAddress) {
      this.recDeliveryAddress = { ...this.recMailingAddress, addressType: 'delivery' }
    } else {
      // clear to default
      this.recDeliveryAddress = { ...this.defaultAddress, addressType: 'delivery' }
    }
  }

  /**
   * Handles update events from address sub-components.
   */
  private updateAddress (addressToUpdate: AddressTypes, baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
    switch (addressToUpdate) {
      case AddressTypes.MAILING_ADDRESS:
        if (this.inheritMailingAddress) {
          this.deliveryAddress = { ...newAddress, addressType: 'delivery' }
        }
        if (this.inheritRegisteredAddress) {
          this.recMailingAddress = { ...newAddress, addressType: 'mailing' }
          this.recDeliveryAddress = { ...this.deliveryAddress, addressType: 'delivery' }
        }
        break
      case AddressTypes.DELIVERY_ADDRESS:
        if (this.inheritRegisteredAddress) {
          this.recDeliveryAddress = { ...newAddress, addressType: 'delivery' }
        }
        break
      case AddressTypes.REC_MAILING_ADDRESS:
        if (this.inheritRecMailingAddress) {
          this.recDeliveryAddress = { ...newAddress, addressType: 'delivery' }
        }
        break
      case AddressTypes.REC_DELIVERY_ADDRESS:
        // nothing to do
        break
      default:
        // should never happen
        // eslint-disable-next-line no-console
        console.log(`Error: Address "${addressToUpdate}" not found`)
    }
  }

  /**
   * Handles validity events from address sub-components.
   * @param addressToValidate the address to set the validity of
   * @param isValid whether the address is valid
   */
  private updateValidity (addressToValidate: AddressTypes, isValid: boolean): void {
    switch (addressToValidate) {
      case AddressTypes.MAILING_ADDRESS:
        this.mailingAddressValid = isValid
        break
      case AddressTypes.DELIVERY_ADDRESS:
        this.deliveryAddressValid = isValid
        break
      case AddressTypes.REC_MAILING_ADDRESS:
        this.recMailingAddressValid = isValid
        break
      case AddressTypes.REC_DELIVERY_ADDRESS:
        this.recDeliveryAddressValid = isValid
        break
      default:
        // should never happen
        // eslint-disable-next-line no-console
        console.log(`Error: Address "${addressToValidate}" not found`)
    }
  }

  /**
   * Sets updated office addresses in store.
   */
  private storeAddresses (): void {
    if (this.entityFilter(CorpTypeCd.BENEFIT_COMPANY)) {
      this.setOfficeAddresses({
        registeredOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        },
        recordsOffice: {
          deliveryAddress: this.recDeliveryAddress,
          mailingAddress: this.recMailingAddress
        }
      })
    } else {
      this.setOfficeAddresses({
        registeredOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        }
      })
    }
  }

  /**
   * When Done is clicked, stores updated addresses.
   */
  private async acceptChanges (): Promise<void> {
    // set store value
    // NB: this will cause setLocalProperties() to be called to reset local properties
    // NB: this will cause updateAddresses() to be called to update state
    this.storeAddresses()

    this.isEditing = false

    // as Vue has updated the visible sections, scroll back to the top of this component
    await this.scrollToTop(this.$el)
  }

  /**
   * When Cancel is clicked, discards changes.
   */
  private async discardChanges (): Promise<void> {
    // reset local properties from store
    this.setLocalProperties()

    this.isEditing = false

    // as Vue has updated the visible sections, scroll back to the top of this component
    await this.scrollToTop(this.$el)
  }

  /**
   * When Undo is clicked, resets original addresses from original IA filing.
   */
  private resetOfficeAddresses (): void {
    // reset store value
    // NB: this will cause setLocalProperties() to be called to reset local properties
    // NB: this will cause updateAddresses() to be called to update state
    this.setOfficeAddresses(this.originalOfficeAddresses)
  }

  /**
   * When the component is mounted or stored office addresses change (ie, when data is loaded/updated/reset),
   * sets local properties and emits state events.
   *
   * Called on mount to init data in the event the component is destroyed and there is no changes to trigger the Watcher
   * This happens in Alterations when navigating between views and where office addresses are not editable.
   */
  @Watch('getOfficeAddresses', { deep: true, immediate: true })
  private updateAddresses (): void {
    // set local properties from store
    this.setLocalProperties()

    // update external state
    // Will emit on component mount and subsequent changes
    this.emitHaveChanges()
  }

  /** Updates store when local Editing property has changed. */
  @Watch('isEditing', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingOfficeAddresses(val)
  }

  /** Emits the changed state of this component. */
  @Emit('haveChanges')
  private emitHaveChanges (): boolean {
    return this.officeAddressesChanged
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}

.meta-container__inner {
  margin-top: 1rem;
}

label:first-child {
  font-weight: bold;
  &__inner {
    flex: 1 1 auto;
  }
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    label:first-child {
      flex: 0 0 auto;
      width: 12rem;
    }
  }

  .meta-container__inner {
    flex: 1 1 auto;
    margin-top: 0;
  }
}

.address-list .form {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .address-list .form {
    margin-top: 0;
  }
}

.inherit-checkbox {
  margin-top: -3px;
  margin-left: -3px;
  padding: 0;
}

.records-inherit-checkbox {
  margin-top: 0rem;
  margin-left: 4.5rem;
  margin-bottom: -1.5rem;
  padding: 0;

  .v-messages {
    display: none !important;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.address-edit-header {
  display: flex;
  background-color: rgba(1, 51, 102, 0.15);
  padding: 1.25rem;

  address-edit-title {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.375rem;
  }
}

.actions {
  position: absolute;
  right: 0;
  margin-top: -0.5rem;

  .edit-action {
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.v-list-item {
  min-height: 0;
  padding: 0.5rem 1rem;
}

.v-list-item__subtitle {
  color: var(--v-primary-base) !important;

  .v-icon {
    color: var(--v-primary-base) !important;
  }
}

.action-btns {
  display: flex;
  justify-content: flex-end;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }
}

// italicize the delivery instructions in the base address component
::v-deep .address-block__info-row:last-of-type {
  padding-top: 0.75rem;
  font-style: italic;
}

::v-deep .address-block__info-row {
  color: $gray7;
  font-weight: normal;
}
</style>
