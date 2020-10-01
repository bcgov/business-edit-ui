<template>
  <div id="office-addresses">

    <!-- Addresses Summary -->
    <template v-if="!isEditing">
      <v-layout row id="summary-registered-address" class="mx-0">
        <v-flex xs3>
          <label>Registered Office</label>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="mr-2">Mailing Address</span>
            <v-chip v-if="mailingChanged"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!isEmpty(mailingAddress)"
            :address="mailingAddress"
            :editing="false"
          />
          <div v-else>(Not entered)</div>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="mr-2">Delivery Address</span>
            <v-chip v-if="deliveryChanged"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!isEmpty(deliveryAddress) && !inheritMailingAddress"
            :address="deliveryAddress"
            :editing="false"
          />
          <div v-else-if="isEmpty(deliveryAddress)">(Not entered)</div>
          <div v-else>Same as Mailing Address</div>
        </v-flex>

        <v-flex xs1 class="mt-n2" v-if="officeAddressesChanged">
          <div class="actions mr-4">
            <span class="edit-action">
              <v-btn
                text color="primary"
                id="btn-undo-office-addresses"
                @click="resetOfficeAddresses()"
              >
                <v-icon small>mdi-undo</v-icon>
                <span>Undo</span>
              </v-btn>
            </span>
            <span class="more-actions">
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text small color="primary"
                    id="btn-more-actions"
                    v-on="on"
                  >
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    class="v-list-item"
                    id="btn-more-actions-edit"
                    @click="isEditing = true"
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

        <v-flex xs1 class="mt-n2" v-else>
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

      <v-layout v-if="entityFilter(EntityTypes.BCOMP)"
        row id="summary-records-address" class="mt-4 mx-0"
      >
        <v-flex xs3>
          <label class>Records Office</label>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="mr-2">Mailing Address</span>
            <v-chip v-if="recMailingChanged"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!inheritRegisteredAddress && !isEmpty(recMailingAddress)"
            :address="recMailingAddress"
            :editing="false"
          />
          <div v-else-if="isEmpty(recMailingAddress)">(Not entered)</div>
          <div v-else>Same as Registered Office</div>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="mr-2">Delivery Address</span>
            <v-chip v-if="recDeliveryChanged"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <base-address
            v-if="!inheritRecMailingAddress && !inheritRegisteredAddress && !isEmpty(recDeliveryAddress)"
            :address="recDeliveryAddress"
            :editing="false"
          />
          <div v-else-if="isEmpty(recDeliveryAddress)">(Not entered)</div>
          <div v-else-if="inheritRegisteredAddress">Same as Registered Office</div>
          <div v-else>Same as Mailing Address</div>
        </v-flex>

        <!-- empty column to force alignment with Registered Office section -->
        <v-flex xs1>&nbsp;</v-flex>
      </v-layout>
    </template>

    <!-- Addresses Edit -->
    <v-card flat v-else>
      <ul class="list address-list">
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
                  @update:address="updateAddress('mailingAddress', mailingAddress, $event)"
                  @valid="updateValidity('mailingAddress', $event)"
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
                v-if="!isSame(mailingAddress, deliveryAddress, 'actions') || !inheritMailingAddress"
              >
                <base-address ref="regDeliveryAddress"
                  id="address-registered-delivery"
                  v-if="!inheritMailingAddress"
                  :address="deliveryAddress"
                  :editing="true"
                  :schema="addressSchema"
                  @update:address="updateAddress('deliveryAddress', deliveryAddress, $event)"
                  @valid="updateValidity('deliveryAddress', $event)"
                />
              </div>
            </div>
          </div>
        </li>

        <template v-if="entityFilter(EntityTypes.BCOMP)">
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
                      @update:address="updateAddress('recMailingAddress', recMailingAddress, $event)"
                      @valid="updateValidity('recMailingAddress', $event)"
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
                      class="inherit-checkbox"
                      label="Same as Mailing Address"
                      hide-details
                      v-model="inheritRecMailingAddress"
                      v-on:change="setRecordDeliveryAddressToMailingAddress()"
                    />
                  </div>
                  <div
                    class="address-wrapper pt-6"
                    v-if="!isSame(recMailingAddress, recDeliveryAddress, 'actions') || !inheritRecMailingAddress">
                    <base-address ref="recDeliveryAddress"
                      id="address-records-delivery"
                      :address="recDeliveryAddress"
                      :editing="true"
                      :schema="addressSchema"
                      @update:address="updateAddress('recDeliveryAddress', recDeliveryAddress, $event)"
                      @valid="updateValidity('recDeliveryAddress', $event)"
                    />
                  </div>
                </div>
              </div>
            </li>
          </template>
        </template>
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
import { EntityTypes } from '@/enums'
import { CommonMixin, EntityFilterMixin } from '@/mixins'

@Component({
  components: { BaseAddress }
})
export default class OfficeAddresses extends Mixins(CommonMixin, EntityFilterMixin) {
  // Global getters
  @Getter getOfficeAddresses!: IncorporationAddressIf // NB: may be {}
  @Getter getOriginalIA!: IncorporationFilingIF

  // Global setters
  @Action setOfficeAddresses!: ActionBindingIF

  // Declarations for template
  readonly isEmpty = isEmpty
  readonly EntityTypes = EntityTypes
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
      this.originalOfficeAddresses.registeredOffice?.mailingAddress)
  }

  /** True if (registered) delivery address has changed. */
  private get deliveryChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.registeredOffice?.deliveryAddress,
      this.originalOfficeAddresses.registeredOffice?.deliveryAddress)
  }

  /** True if records mailing address has changed. */
  private get recMailingChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.recordsOffice?.mailingAddress,
      this.originalOfficeAddresses.recordsOffice?.mailingAddress)
  }

  /** True if records delivery address has changed. */
  private get recDeliveryChanged (): boolean {
    return !this.isSame(this.getOfficeAddresses.recordsOffice?.deliveryAddress,
      this.originalOfficeAddresses.recordsOffice?.deliveryAddress)
  }

  /** True if any office address has changed. */
  private get officeAddressesChanged (): boolean {
    return (this.mailingChanged || this.deliveryChanged || this.recMailingChanged || this.recDeliveryChanged)
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
   * Sets local address data and "inherited" flags from store.
   */
  private setLocalProperties (): void {
    if (this.getOfficeAddresses.registeredOffice) {
      this.mailingAddress = { ...this.getOfficeAddresses.registeredOffice.mailingAddress }
      this.deliveryAddress = { ...this.getOfficeAddresses.registeredOffice.deliveryAddress }

      // compare addresses to set the "inherited mailing" flag
      this.inheritMailingAddress = this.isSame(
        this.getOfficeAddresses.registeredOffice.mailingAddress,
        this.getOfficeAddresses.registeredOffice.deliveryAddress
      )

      // for BCOMPS, also set the Records Address
      if (this.entityFilter(EntityTypes.BCOMP)) {
        this.recMailingAddress = { ...this.getOfficeAddresses.recordsOffice?.mailingAddress }
        this.recDeliveryAddress = { ...this.getOfficeAddresses.recordsOffice?.deliveryAddress }

        // compare addresses to set the "inherit registered" flag
        this.inheritRegisteredAddress = (
          this.isSame(
            this.getOfficeAddresses.registeredOffice.deliveryAddress,
            this.getOfficeAddresses.recordsOffice?.deliveryAddress
          ) && this.isSame(
            this.getOfficeAddresses.registeredOffice.mailingAddress,
            this.getOfficeAddresses.recordsOffice?.mailingAddress
          )
        )

        // compare addresses to set the "inherited records mailing" flag
        this.inheritRecMailingAddress = this.isSame(
          this.getOfficeAddresses.recordsOffice?.mailingAddress,
          this.getOfficeAddresses.recordsOffice?.deliveryAddress
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
      this.deliveryAddress = { ...this.mailingAddress }
    } else {
      // clear to default
      this.deliveryAddress = { ...this.defaultAddress }
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
      this.recMailingAddress = { ...this.defaultAddress }
      this.recDeliveryAddress = { ...this.defaultAddress }
    }
  }

  /**
   * When "same as (records) mailing address" checkbox is changed,
   * sets the Records Delivery Address to Records Mailing Address.
   */
  private setRecordDeliveryAddressToMailingAddress (): void {
    if (this.inheritRecMailingAddress) {
      this.recDeliveryAddress = { ...this.recMailingAddress }
    } else {
      // clear to default
      this.recDeliveryAddress = { ...this.defaultAddress }
    }
  }

  /**
   * Handles update events from address sub-components.
   */
  private updateAddress (addressToUpdate: string, baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
    switch (addressToUpdate) {
      case 'mailingAddress':
        if (this.inheritMailingAddress) {
          this.deliveryAddress = { ...newAddress }
        }
        if (this.inheritRegisteredAddress) {
          this.recMailingAddress = { ...newAddress }
          this.recDeliveryAddress = { ...this.deliveryAddress }
        }
        break
      case 'deliveryAddress':
        if (this.inheritRegisteredAddress) {
          this.recDeliveryAddress = { ...newAddress }
        }
        break
      case 'recMailingAddress':
        if (this.inheritRecMailingAddress) {
          this.recDeliveryAddress = { ...newAddress }
        }
        break
      case 'recDeliveryAddress':
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
  private updateValidity (addressToValidate: string, isValid: boolean): void {
    switch (addressToValidate) {
      case 'mailingAddress':
        this.mailingAddressValid = isValid
        break
      case 'deliveryAddress':
        this.deliveryAddressValid = isValid
        break
      case 'recMailingAddress':
        this.recMailingAddressValid = isValid
        break
      case 'recDeliveryAddress':
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
    if (this.entityFilter(EntityTypes.BCOMP)) {
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
  private acceptChanges (): void {
    // set store value
    // NB: this will cause setLocalProperties() to be called to reset local properties
    // NB: this will cause updateAddresses() to be called to update state
    this.storeAddresses()

    this.isEditing = false
  }

  /**
   * When Cancel is clicked, discards changes.
   */
  private discardChanges (): void {
    // reset local properties from store
    this.setLocalProperties()

    this.isEditing = false
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
   * When stored office addresses change (ie, when data is loaded/updated/reset),
   * sets local properties and emits state events.
   */
  @Watch('getOfficeAddresses', { deep: true })
  private updateAddresses (addresses: IncorporationAddressIf): void {
    // set local properties from store
    this.setLocalProperties()

    // update external state
    this.emitValid()
    this.emitHaveChanges()
  }

  /** Emits the validity state of this component. */
  @Emit('valid')
  private emitValid (): boolean {
    return this.formValid
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
  font-weight: 700;
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

  .edit-action {
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.v-list-item {
  min-height: 0;
  padding: 0 1rem 0 0.5rem;
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
  font-style: italic;
}
</style>
