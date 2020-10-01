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
            <v-chip v-if="hasRegisteredMailingChange"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <mailing-address
            v-if="!isEmpty(mailingAddress)"
            :address="mailingAddress"
            :editing="false"/>
          <div v-else>(Not entered)</div>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="mr-2">Delivery Address</span>
            <v-chip v-if="hasRegisteredDeliveryChange"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <delivery-address
            v-if="!isEmpty(deliveryAddress) && !inheritMailingAddress"
            :address="deliveryAddress"
            :editing="false"/>
          <div v-else-if="isEmpty(deliveryAddress)">(Not entered)</div>
          <div v-else>Same as Mailing Address</div>
        </v-flex>

        <v-flex xs1 class="ml-n5 mt-n2">
          <v-btn
            v-if="hasOfficeAddressesChange"
            text color="primary"
            id="btn-undo-office-addresses"
            @click="resetContactInfo"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>
          <v-btn
            v-else
            text color="primary"
            id="btn-correct-office-addresses"
            @click="isEditing = true"
          >
            <v-icon small>mdi-pencil</v-icon>
            <span>Correct</span>
          </v-btn>
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
            <v-chip v-if="hasRecordsMailingChange"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <mailing-address
            v-if="!inheritRegisteredAddress && !isEmpty(recMailingAddress)"
            :address="recMailingAddress"
            :editing="false"/>
          <div v-else-if="isEmpty(recMailingAddress)">(Not entered)</div>
          <div v-else>Same as Registered Office</div>
        </v-flex>

        <v-flex xs4>
          <label class="d-flex flex-wrap">
            <span class="mr-2">Delivery Address</span>
            <v-chip v-if="hasRecordsDeliveryChange"
              x-small label color="#1669BB" text-color="white" class="mt-0">CORRECTED</v-chip>
          </label>
          <delivery-address
            v-if="!inheritRecMailingAddress && !inheritRegisteredAddress && !isEmpty(recDeliveryAddress)"
            :address="recDeliveryAddress"
            :editing="false"/>
          <div v-else-if="isEmpty(recDeliveryAddress)">(Not entered)</div>
          <div v-else-if="inheritRegisteredAddress">Same as Registered Office</div>
          <div v-else>Same as Mailing Address</div>
        </v-flex>

        <!-- empty column to force alignment with Registered Office section -->
        <v-flex xs1>&nbsp;</v-flex>
      </v-layout>
    </template>

    <!-- Addresses Edit -->
    <!-- TODO: add Done/Cancel buttons and actions -->
    <v-card flat v-else>
      <ul class="list address-list">
        <!-- Registered Office -->
        <div class="address-edit-header">
          <label class="address-edit-title">Registered Office</label>
        </div>

        <!-- Registered Mailing Address -->
        <li class="ma-5">
          <div class="meta-container">
            <label>Mailing Address</label>
            <div class="meta-container__inner">
              <div class="address-wrapper">
                <mailing-address ref="regMailingAddress"
                  id="address-registered-mailing"
                  :address="mailingAddress"
                  :editing="true"
                  :schema="addressSchema"
                  @update:address="updateAddress('mailingAddress', mailingAddress, $event)"
                  @valid="updateAddressValid('mailingAddress', $event)"
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
                  v-on:change="setDeliveryAddressToMailingAddress()"
                />
              </div>
              <div
                class="address-wrapper"
                v-if="!isSame(mailingAddress, deliveryAddress, 'actions') || !inheritMailingAddress"
              >
                <delivery-address ref="regDeliveryAddress"
                  id="address-registered-delivery"
                  v-if="!inheritMailingAddress"
                  :address="deliveryAddress"
                  :editing="true"
                  :schema="addressSchema"
                  @update:address="updateAddress('deliveryAddress', deliveryAddress, $event)"
                  @valid="updateAddressValid('deliveryAddress', $event)"
                />
              </div>
            </div>
          </div>
        </li>

        <!--Records Office Address -->
        <template v-if="entityFilter(EntityTypes.BCOMP)">
          <div class="address-edit-header">
            <label class="address-edit-title">Records Office</label>
            <v-checkbox
              id="records-mailing-same-chkbx"
              class="records-inherit-checkbox"
              label="Same as Registered Office"
              hide-details
              v-model="inheritRegisteredAddress"
              v-on:change="setRecordOfficeToRegisteredOffice()"
            />
          </div>

          <template v-if="!inheritRegisteredAddress">
            <!-- Records Mailing Address -->
            <li class="ma-5">
              <div class="meta-container">
                <label>Mailing Address</label>
                <div class="meta-container__inner">
                  <div class="address-wrapper">
                    <mailing-address ref="recMailingAddress"
                      id="address-records-mailing"
                      :address="recMailingAddress"
                      :editing="true"
                      :schema="addressSchema"
                      @update:address="updateAddress('recMailingAddress', recMailingAddress, $event)"
                      @valid="updateAddressValid('recMailingAddress', $event)"
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
                    class="address-wrapper"
                    v-if="!isSame(recMailingAddress, recDeliveryAddress, 'actions') || !inheritRecMailingAddress">
                    <delivery-address ref="recDeliveryAddress"
                      id="address-records-delivery"
                      :address="recDeliveryAddress"
                      :editing="true"
                      :schema="addressSchema"
                      @update:address="updateAddress('recDeliveryAddress', recDeliveryAddress, $event)"
                      @valid="updateAddressValid('recDeliveryAddress', $event)"
                    />
                  </div>
                </div>
              </div>
            </li>
          </template>
        </template>
      </ul>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Watch, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { isEmpty } from 'lodash'
import { OfficeAddressSchema } from '@/schemas'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { AddressIF, FormType, IncorporationAddressIf, StateModelIF } from '@/interfaces'
import { EntityTypes } from '@/enums'
import { CommonMixin, EntityFilterMixin } from '@/mixins'

@Component({
  components: {
    'delivery-address': BaseAddress,
    'mailing-address': BaseAddress
  }
})
export default class OfficeAddresses extends Mixins(CommonMixin, EntityFilterMixin) {
  // Refs for sbc common base address components so we can access form validation
  $refs!: {
    regMailingAddress: any,
    regDeliveryAddress: any,
    recMailingAddress: any,
    recDeliveryAddress: any
  }

  // Global getters
  @Getter getOfficeAddresses!: any

  // Declaration for template
  readonly isEmpty = isEmpty

  private hasOfficeAddressesChange = false

  // Local Properties
  private hasRegisteredMailingChange = true
  private hasRegisteredDeliveryChange = true
  private hasRecordsMailingChange = true
  private hasRecordsDeliveryChange = true

  private addresses: IncorporationAddressIf
  private defaultAddress: AddressIF = {
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

  // The 4 addresses that are the current state of the BaseAddress components:
  private mailingAddress = {} as AddressIF
  private deliveryAddress = {} as AddressIF
  private recMailingAddress = {} as AddressIF
  private recDeliveryAddress = {} as AddressIF

  // Validation events from BaseAddress:
  private mailingAddressValid: boolean = true
  private deliveryAddressValid: boolean = true
  private recMailingAddressValid: boolean = true
  private recDeliveryAddressValid: boolean = true

  private inheritMailingAddress: boolean = true

  // State of the checkbox for determining whether or not the mailing address is the same as the delivery address
  // For Records Office
  private inheritRecMailingAddress: boolean = true

  // State of the checkbox for determining whether the Record address is the same as the Registered address
  private inheritRegisteredAddress: boolean = true

  // The Address schema containing Vuelidate rules.
  private addressSchema = OfficeAddressSchema

  // Entity Enum
  readonly EntityTypes = EntityTypes

  /** Called when component is created. */
  private created (): void {
    // on first load, determine inherited flags based on address values and update parent
    this.initializeAddresses(true)
    this.emitValid()
  }

  private mounted (): void {
    /**
     * Check if addresses are the default values, if not re-validate so resumed applications show errors on start up
     */

    // Registered Mailing Address
    if (this.$refs.regMailingAddress?.$refs?.addressForm && !this.isSame(this.mailingAddress, this.defaultAddress)) {
      this.$refs.regMailingAddress.$refs.addressForm.validate()
    }
    // Registered Delivery Address
    if (this.$refs.regDeliveryAddress?.$refs?.addressForm && !this.inheritMailingAddress &&
        !this.isSame(this.deliveryAddress, this.defaultAddress)) {
      this.$refs.regDeliveryAddress.$refs.addressForm.validate()
    }
    // If records address is not inherited - check if we need to re-validate these
    if (!this.inheritRegisteredAddress) {
      // Records Mailing Address
      if (this.$refs.recMailingAddress?.$refs?.addressForm &&
        !this.isSame(this.recMailingAddress, this.defaultAddress)) {
        this.$refs.recMailingAddress.$refs.addressForm.validate()
      }

      // Records Delivery Address
      if (this.$refs.recMailingAddress?.$refs?.addressForm && !this.inheritRecMailingAddress &&
          !this.isSame(this.recDeliveryAddress, this.defaultAddress)) {
        this.$refs.recDeliveryAddress.$refs.addressForm.validate()
      }
    }
  }

  /**
   * Sets address data.
   * @param loadInheritedFlags used to update inherited flags based on isSame checks if true
   */
  private initializeAddresses (loadInheritedFlags: boolean): void {
    if (this.addresses.registeredOffice) {
      this.mailingAddress = this.addresses.registeredOffice.mailingAddress
      this.deliveryAddress = this.addresses.registeredOffice.deliveryAddress

      if (loadInheritedFlags) {
        this.inheritMailingAddress = this.isSame(
          this.addresses.registeredOffice.mailingAddress,
          this.addresses.registeredOffice.deliveryAddress
        )
      }
      if (this.entityFilter(EntityTypes.BCOMP)) {
        this.recMailingAddress = this.addresses.recordsOffice?.mailingAddress
        this.recDeliveryAddress = this.addresses.recordsOffice?.deliveryAddress

        if (loadInheritedFlags) {
          this.inheritRegisteredAddress = (
            this.isSame(
              this.addresses.registeredOffice.deliveryAddress,
              this.addresses.recordsOffice?.deliveryAddress
            ) && this.isSame(
              this.addresses.registeredOffice.mailingAddress,
              this.addresses.recordsOffice?.mailingAddress
            )
          )

          this.inheritRecMailingAddress = this.isSame(
            this.addresses.recordsOffice?.mailingAddress,
            this.addresses.recordsOffice?.deliveryAddress
          )
        }
      }
    }
  }

  //
  // Getters (Computed Values)
  //
  /** Whether the address form is valid. */
  private get formValid (): boolean {
    const registeredOfficeValid = this.mailingAddressValid &&
      (this.deliveryAddressValid || this.inheritMailingAddress)

    const recordsOfficeValid = this.inheritRegisteredAddress ||
      (this.recMailingAddressValid && (this.inheritRecMailingAddress || this.recDeliveryAddressValid))

    return registeredOfficeValid && recordsOfficeValid
  }

  //
  // Event Handlers
  //
  /** Sets the Registered Delivery Address to the Registered Mailing Address. */
  private setDeliveryAddressToMailingAddress (): void {
    if (this.inheritMailingAddress) {
      this.deliveryAddress = { ...this.mailingAddress }
    } else {
      // Clear to default
      this.deliveryAddress = { ...this.defaultAddress }
    }

    // Records delivery address also needs to be updated if inherited
    if (this.inheritRegisteredAddress) {
      this.recDeliveryAddress = { ...this.deliveryAddress }
    }

    this.emitAddresses()
  }

  /** Sets the Records office addresses to the Registered office addresses. */
  private setRecordOfficeToRegisteredOffice (): void {
    if (this.inheritRegisteredAddress) {
      this.recDeliveryAddress = { ...this.deliveryAddress }
      this.recMailingAddress = { ...this.mailingAddress }
    } else {
      this.inheritRecMailingAddress = this.inheritMailingAddress
      // Clear to defaults
      this.recMailingAddress = { ...this.defaultAddress }
      this.recDeliveryAddress = { ...this.defaultAddress }
    }
    this.emitAddresses()
  }

  /** Sets the Records Delivery Address to Records Mailing Address. */
  private setRecordDeliveryAddressToMailingAddress (): void {
    if (this.inheritRecMailingAddress) {
      this.recDeliveryAddress = { ...this.recMailingAddress }
    } else {
      // Clear to default
      this.recDeliveryAddress = { ...this.defaultAddress }
    }
    this.emitAddresses()
  }

  private updateAddress (addressChangedEntity: string, baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
    switch (addressChangedEntity) {
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
        // eslint-disable-next-line no-console
        console.log(`Error: Address- ${addressChangedEntity} not found`)
    }
    this.emitAddresses()
  }

  /**
   * Keeps track of the validity of the specified address.
   * @param addressToValidate the address to set the validity of
   * @param isValid a boolean indicating the validity of the address
   */
  private updateAddressValid (addressToValidate: string, isValid: boolean): void {
    switch (addressToValidate) {
      case 'deliveryAddress':
        this.deliveryAddressValid = isValid
        break
      case 'mailingAddress':
        this.mailingAddressValid = isValid
        break
      case 'recDeliveryAddress':
        this.recDeliveryAddressValid = isValid
        break
      case 'recMailingAddress':
        this.recMailingAddressValid = isValid
        break
      default:
        // eslint-disable-next-line no-console
        console.log(`Error: Address- ${addressToValidate} not found`)
    }
    this.emitValid()
  }

  //
  // Watchers
  //
  @Watch('formValid')
  private onFormValidityChange (val: boolean): void {
    this.emitValid()
  }

  @Watch('getOfficeAddresses', { deep: true, immediate: true })
  private updateAddresses (addresses: IncorporationAddressIf): void {
    this.addresses = addresses
    this.initializeAddresses(false)
    this.emitValid()
  }

  /** Emits the valid state of this address form. */
  @Emit('valid')
  private emitValid (): boolean {
    return this.formValid
  }

  /** Emits updated addresses object to the parent page. */
  // TODO: update in global state instead
  @Emit('update:addresses')
  private emitAddresses (): object {
    if (this.entityFilter(EntityTypes.BCOMP)) {
      return {
        registeredOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        },
        recordsOffice: {
          deliveryAddress: this.recDeliveryAddress,
          mailingAddress: this.recMailingAddress
        }
      }
    } else {
      return {
        registeredOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

// Form Row Elements
.form__row + .form__row {
  margin-top: 0.25rem;
}

.form__row.three-column {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
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

// Editing Address Form
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
</style>
