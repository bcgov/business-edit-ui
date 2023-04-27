<template>
  <div
    id="office-addresses"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <!-- Addresses Summary -->
    <template v-if="!isEditing">
      <v-row
        id="summary-registered-address"
        class="mx-0"
        no-gutters
      >
        <v-col
          cols="3"
          class="pr-2"
        >
          <label :class="{'error-text': invalidSection}">{{ getResource.addressLabel }}</label>
          <v-chip
            v-if="(isFirmChangeFiling || isFirmConversionFiling) && !isSummaryView
              && (hasMailingChanged || hasDeliveryChanged)"
            x-small
            label
            color="primary"
            text-color="white"
            class="mt-0"
          >
            {{ getEditedLabel }}
          </v-chip>
        </v-col>

        <!-- Mailing address -->
        <v-col
          cols="4"
          class="pr-2"
        >
          <label>
            <span class="subtitle text-body-3 mr-2">Mailing Address</span>
            <v-chip
              v-if="hasMailingChanged && (isCorrectionFiling || isRestorationFiling)"
              x-small
              label
              color="primary"
              text-color="white"
              class="mt-0"
            >{{ getEditedLabel }}</v-chip>
          </label>
          <MailingAddress
            v-if="!isEmpty(mailingAddress)"
            :address="mailingAddress"
            :editing="false"
          />
          <div
            v-else
            class="info-text"
          >
            (Not entered)
          </div>
        </v-col>

        <!-- Delivery address -->
        <v-col
          cols="4"
          class="pr-2"
        >
          <label>
            <span class="subtitle text-body-3 mr-2">Delivery Address</span>
            <v-chip
              v-if="hasDeliveryChanged && (isCorrectionFiling || isRestorationFiling)"
              x-small
              label
              color="primary"
              text-color="white"
              class="mt-0"
            >{{ getEditedLabel }}</v-chip>
          </label>
          <DeliveryAddress
            v-if="!isEmpty(deliveryAddress) && !inheritMailingAddress"
            :address="deliveryAddress"
            :editing="false"
          />
          <div
            v-else-if="isEmpty(deliveryAddress)"
            class="info-text"
          >
            (Not entered)
          </div>
          <div
            v-else
            class="info-text"
          >
            Same as Mailing Address
          </div>
        </v-col>

        <template v-if="!isSummaryView">
          <v-col
            v-if="haveOfficeAddressesChanged &&
              (isCorrectionFiling || isFirmChangeFiling || isFirmConversionFiling || isRestorationFiling)"
            cols="1"
          >
            <div class="actions mr-4">
              <span class="edit-action">
                <v-btn
                  id="btn-undo-office-addresses"
                  variant="text"
                  color="primary"
                  @click="resetOfficeAddresses(); dropdown = false"
                >
                  <v-icon size="small">mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>
              <span class="more-actions">
                <v-menu
                  v-model="dropdown"
                  offset-y
                  location="left"
                  nudge-bottom="4"
                  attach="#office-addresses .more-actions"
                >
                  <template #activator="{ on }">
                    <v-btn
                      id="btn-more-actions"
                      variant="text"
                      size="small"
                      color="primary"
                      v-on="on"
                    >
                      <v-icon>{{ dropdown ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      id="btn-more-actions-edit"
                      class="v-list-item"
                      @click="isEditing = true; dropdown = false"
                    >
                      <v-list-item-subtitle>
                        <v-icon size="small">mdi-pencil</v-icon>
                        <span class="ml-1">Change</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </v-col>

          <v-col
            v-else-if="(isCorrectionFiling || isFirmChangeFiling || isFirmConversionFiling ||
              isRestorationFiling)"
            cols="1"
          >
            <div class="actions mr-4">
              <v-btn
                id="btn-correct-office-addresses"
                variant="text"
                color="primary"
                @click="isEditing = true"
              >
                <v-icon size="small">
                  mdi-pencil
                </v-icon>
                <span>{{ getEditLabel }}</span>
              </v-btn>
            </div>
          </v-col>
          <v-col
            v-else-if="isSpecialResolutionFiling"
            cols="1"
          >
            <div class="d-flex justify-end align-end align-sm-start">
              <v-tooltip
                location="top"
                content-class="top-tooltip"
                transition="fade-transition"
                nudge-right="3"
              >
                <template #activator="{ on }">
                  <v-icon
                    class="info-icon"
                    v-on="on"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>{{ addressChangeInfo }}</span>
              </v-tooltip>
            </div>
          </v-col>
        </template>
      </v-row>

      <!-- Records office (BC/BEN/CCC/ULC only) -->
      <v-row
        v-if="isBenBcCccUlc"
        id="summary-records-address"
        class="mt-4 mx-0"
        no-gutters
      >
        <v-col
          cols="3"
          class="pr-2"
        >
          <label :class="{'error-text': invalidSection}">Records Office</label>
        </v-col>

        <!-- Records mailing address -->
        <v-col
          cols="4"
          class="pr-2"
        >
          <label>
            <span class="subtitle text-body-3 mr-2">Mailing Address</span>
            <v-chip
              v-if="hasRecMailingChanged && (isCorrectionFiling || isRestorationFiling)"
              x-small
              label
              color="primary"
              text-color="white"
              class="mt-0"
            >{{ getEditedLabel }}</v-chip>
          </label>
          <RecMailingAddress
            v-if="!inheritRegisteredAddress && !isEmpty(recMailingAddress)"
            :address="recMailingAddress"
            :editing="false"
          />
          <div
            v-else-if="isEmpty(recMailingAddress)"
            class="info-text"
          >
            (Not entered)
          </div>
          <div
            v-else
            class="info-text"
          >
            Same as Registered Office
          </div>
        </v-col>

        <!-- Records delivery address -->
        <v-col
          cols="4"
          class="pr-2"
        >
          <label>
            <span class="subtitle text-body-3 mr-2">Delivery Address</span>
            <v-chip
              v-if="hasRecDeliveryChanged && (isCorrectionFiling || isRestorationFiling)"
              x-small
              label
              color="primary"
              text-color="white"
              class="mt-0"
            >{{ getEditedLabel }}</v-chip>
          </label>
          <RecDeliveryAddress
            v-if="!inheritRecMailingAddress && !inheritRegisteredAddress && !isEmpty(recDeliveryAddress)"
            :address="recDeliveryAddress"
            :editing="false"
          />
          <div
            v-else-if="isEmpty(recDeliveryAddress)"
            class="info-text"
          >
            (Not entered)
          </div>
          <div
            v-else-if="inheritRegisteredAddress"
            class="info-text"
          >
            Same as Registered Office
          </div>
          <div
            v-else
            class="info-text"
          >
            Same as Mailing Address
          </div>
        </v-col>

        <!-- empty column to force alignment with Registered Office section -->
        <v-col cols="1">
&nbsp;
        </v-col>
      </v-row>
    </template>

    <!-- Editing a change of registration filing or conversion filing -->
    <v-card
      v-else-if="isFirmChangeFiling || isFirmConversionFiling"
      flat
    >
      <v-row no-gutters>
        <v-col cols="3">
          <label :class="{'error-text': invalidSection}">{{ getResource.addressLabel }}</label>
        </v-col>
        <v-col cols="9">
          <p class="info-text">
            Enter the business mailing and delivery addresses. The Delivery Address must be located in British Columbia.
          </p>
          <label>Mailing Address</label>
        </v-col>
      </v-row>

      <!-- Mailing address -->
      <v-row
        no-gutters
        class="pr-1"
      >
        <v-col cols="3" />
        <v-col
          cols="9"
          class="pt-4"
        >
          <MailingAddress
            id="address-mailing"
            ref="mailingAddress"
            :address="mailingAddress"
            :editing="true"
            :schema="DefaultAddressSchema"
            @update:address="updateAddress(AddressTypes.MAILING_ADDRESS, $event)"
            @valid="onAddressValid(AddressTypes.MAILING_ADDRESS, $event)"
          />
        </v-col>
      </v-row>

      <!-- "Same as" checkbox -->
      <v-row no-gutters>
        <v-col cols="3" />
        <v-col cols="9">
          <v-checkbox
            id="delivery-address-same-chkbx"
            v-model="inheritMailingAddress"
            class="inherit-checkbox"
            label="Delivery Address same as Mailing Address"
            hide-details
            :disabled="disableSameDeliveryAddress"
            @update:model-value="setDeliveryAddressToMailingAddress()"
          />
        </v-col>
      </v-row>

      <!-- Delivery address -->
      <template v-if="!inheritMailingAddress || disableSameDeliveryAddress">
        <v-row
          no-gutters
          class="pt-4"
        >
          <v-col cols="3" />
          <v-col cols="9">
            <label>Delivery Address</label>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="3" />
          <v-col
            cols="9"
            class="pt-4"
          >
            <DeliveryAddress
              id="address-delivery"
              ref="deliveryAddress"
              :address="deliveryAddress"
              :editing="true"
              :schema="InBcCanadaAddressSchema"
              :noPoBox="true"
              @update:address="updateAddress(AddressTypes.DELIVERY_ADDRESS, $event)"
              @valid="onAddressValid(AddressTypes.DELIVERY_ADDRESS, $event)"
            />
          </v-col>
        </v-row>
      </template>

      <!-- Actions -->
      <v-row class="pt-4 pr-1">
        <v-col cols="12">
          <div class="action-btns">
            <v-btn
              id="address-done-btn"
              size="large"
              color="primary"
              @click="acceptChanges()"
            >
              <span>Done</span>
            </v-btn>
            <v-btn
              id="address-cancel-btn"
              size="large"
              variant="outlined"
              color="primary"
              @click="discardChanges()"
            >
              <span>Cancel</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Editing a correction or restoration filing -->
    <v-card
      v-else-if="isCorrectionFiling || isRestorationFiling"
      flat
    >
      <ul class="list address-list">
        <div id="edit-registered-address">
          <div class="address-edit-header">
            <label class="address-edit-title">Registered Office</label>
          </div>

          <!-- Registered mailing address -->
          <li class="ma-5">
            <div class="meta-container">
              <label>Mailing Address</label>
              <div class="meta-container__inner">
                <div class="address-wrapper">
                  <RegMailingAddress
                    id="registered-mailing-address"
                    :address="mailingAddress"
                    :editing="true"
                    :schema="InBcCanadaAddressSchema"
                    @update:address="updateAddress(AddressTypes.MAILING_ADDRESS, $event)"
                    @valid="onAddressValid(AddressTypes.MAILING_ADDRESS, $event)"
                  />
                </div>
              </div>
            </div>
          </li>

          <!-- Registered delivery address -->
          <li class="ma-5">
            <div class="meta-container">
              <label>Delivery Address</label>
              <div class="meta-container__inner">
                <div class="form-row">
                  <v-checkbox
                    id="registered-mailing-same-chkbx"
                    v-model="inheritMailingAddress"
                    class="inherit-checkbox"
                    label="Same as Mailing Address"
                    hide-details
                    @update:model-value="setDeliveryAddressToMailingAddress()"
                  />
                </div>
                <div
                  v-if="!IsSame(mailingAddress, deliveryAddress, ['actions', 'addressType', 'id']) ||
                    !inheritMailingAddress"
                  class="address-wrapper pt-6"
                >
                  <RegDeliveryAddress
                    v-if="!inheritMailingAddress"
                    id="registered-delivery-address"
                    :address="deliveryAddress"
                    :editing="true"
                    :schema="InBcCanadaAddressSchema"
                    @update:address="updateAddress(AddressTypes.DELIVERY_ADDRESS, $event)"
                    @valid="onAddressValid(AddressTypes.DELIVERY_ADDRESS, $event)"
                  />
                </div>
              </div>
            </div>
          </li>
        </div>

        <!-- "Same as" checkbox -->
        <div
          v-if="isBenBcCccUlc"
          id="edit-records-address"
        >
          <div
            class="address-edit-header"
            :class="{'mt-8': inheritMailingAddress}"
          >
            <label class="address-edit-title">Records Office</label>
            <v-checkbox
              id="records-mailing-same-chkbx"
              v-model="inheritRegisteredAddress"
              class="records-inherit-checkbox"
              label="Same as Registered Office"
              hide-details
              @update:model-value="setRecordOfficeToRegisteredOffice()"
            />
          </div>

          <!-- Records mailing address -->
          <template v-if="!inheritRegisteredAddress">
            <li class="ma-5">
              <div class="meta-container">
                <label>Mailing Address</label>
                <div class="meta-container__inner">
                  <div class="address-wrapper">
                    <RecMailingAddress
                      id="records-mailing-address"
                      :address="recMailingAddress"
                      :editing="true"
                      :schema="InBcCanadaAddressSchema"
                      @update:address="updateAddress(AddressTypes.REC_MAILING_ADDRESS, $event)"
                      @valid="onAddressValid(AddressTypes.REC_MAILING_ADDRESS, $event)"
                    />
                  </div>
                </div>
              </div>
            </li>

            <!-- Records delivery address -->
            <li class="ma-5">
              <div class="meta-container">
                <label>Delivery Address</label>
                <div class="meta-container__inner">
                  <div class="form-row">
                    <v-checkbox
                      id="records-delivery-same-chkbx"
                      v-model="inheritRecMailingAddress"
                      class="inherit-checkbox"
                      label="Same as Mailing Address"
                      hide-details
                      @update:model-value="setRecordDeliveryAddressToMailingAddress()"
                    />
                  </div>
                  <div
                    v-if="!IsSame(recMailingAddress, recDeliveryAddress, ['actions', 'addressType', 'id']) ||
                      !inheritRecMailingAddress"
                    class="address-wrapper pt-6"
                  >
                    <RecDeliveryAddress
                      id="records-delivery-address"
                      :address="recDeliveryAddress"
                      :editing="true"
                      :schema="InBcCanadaAddressSchema"
                      @update:address="updateAddress(AddressTypes.REC_DELIVERY_ADDRESS, $event)"
                      @valid="onAddressValid(AddressTypes.REC_DELIVERY_ADDRESS, $event)"
                    />
                  </div>
                </div>
              </div>
            </li>
          </template>
        </div>
      </ul>

      <div
        class="action-btns"
        :class="{'mt-6': inheritRegisteredAddress}"
      >
        <v-btn
          id="done-btn"
          size="large"
          color="primary"
          :disabled="!formValid"
          @click="acceptChanges()"
        >
          <span>Done</span>
        </v-btn>
        <v-btn
          id="cancel-btn"
          size="large"
          variant="outlined"
          color="primary"
          @click="discardChanges()"
        >
          <span>Cancel</span>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { IsSame } from '@/utils/'
import { isEmpty, isEqual } from 'lodash'
import { DefaultAddressSchema, InBcCanadaAddressSchema } from '@/schemas/'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ActionBindingIF, AddressIF, AddressesIF, FlagsCompanyInfoIF, ResourceIF } from '@/interfaces/'
import { AddressTypes } from '@/enums/'
import { CommonMixin } from '@/mixins/'
import { useStore } from '@/store/store'

const REGION_BC = 'BC'
const COUNTRY_CA = 'CA'

@Component({
  components: {
    MailingAddress: BaseAddress,
    DeliveryAddress: BaseAddress,
    RecMailingAddress: BaseAddress,
    RecDeliveryAddress: BaseAddress,
    RegMailingAddress: BaseAddress,
    RegDeliveryAddress: BaseAddress
  },
  mixins: [CommonMixin]
})
export default class OfficeAddresses extends Vue {
  // Refs for BaseAddress components so we can access form validation
  declare $refs: Vue['$refs'] & {
    mailingAddress: any
    deliveryAddress: any
  }

  /** Prop to set readonly state (ie disable form actions). */
  @Prop({ default: false }) readonly isSummaryView!: boolean

  // Global getters
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getFlagsCompanyInfo!: FlagsCompanyInfoIF
  @Getter(useStore) getOfficeAddresses!: AddressesIF // NB: may be {}
  @Getter(useStore) getOriginalOfficeAddresses!: AddressesIF
  @Getter(useStore) getResource!: ResourceIF
  @Getter(useStore) hasDeliveryChanged!: boolean
  @Getter(useStore) hasMailingChanged!: boolean
  @Getter(useStore) hasRecDeliveryChanged!: boolean
  @Getter(useStore) hasRecMailingChanged!: boolean
  @Getter(useStore) haveOfficeAddressesChanged!: boolean
  @Getter(useStore) isAlterationFiling!: boolean
  @Getter(useStore) isBenBcCccUlc!: boolean
  @Getter(useStore) isBenBcCccUlcCorrectionFiling!: boolean
  @Getter(useStore) isCorrectionFiling!: boolean
  @Getter(useStore) isFirmChangeFiling!: boolean
  @Getter(useStore) isFirmConversionFiling!: boolean
  @Getter(useStore) isFirmCorrectionFiling!: boolean
  @Getter(useStore) isRestorationFiling!: boolean
  @Getter(useStore) isSpecialResolutionFiling!: boolean

  // Global actions
  @Action(useStore) setEditingOfficeAddresses!: ActionBindingIF
  @Action(useStore) setOfficeAddresses!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF

  // Declarations for template
  readonly isEmpty = isEmpty
  readonly IsSame = IsSame
  readonly AddressTypes = AddressTypes
  readonly DefaultAddressSchema = DefaultAddressSchema
  readonly InBcCanadaAddressSchema = InBcCanadaAddressSchema

  readonly defaultAddress: AddressIF = {
    addressCity: '',
    addressCountry: COUNTRY_CA,
    addressRegion: REGION_BC,
    deliveryInstructions: '',
    postalCode: '',
    streetAddress: '',
    streetAddressAdditional: ''
  }

  /** Whether to show the editable forms for the addresses (true) or the static display addresses (false). */
  protected isEditing = false

  protected dropdown = false // v-model for dropdown menu

  // The 4 addresses that are the current state of the BaseAddress sub-components:
  protected mailingAddress = {} as AddressIF
  protected deliveryAddress = {} as AddressIF
  protected recMailingAddress = {} as AddressIF
  protected recDeliveryAddress = {} as AddressIF

  // The 4 validation events from each BaseAddress sub-component:
  private mailingAddressValid = true
  private deliveryAddressValid = true
  private recMailingAddressValid = true
  private recDeliveryAddressValid = true

  /** Model value for "same as (registered) mailing address" checkbox. */
  protected inheritMailingAddress = true

  /** Model value for "same as registered address" checkbox. */
  protected inheritRegisteredAddress = true

  /** Model value for "same as (records) mailing address" checkbox. */
  protected inheritRecMailingAddress = true

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && !this.getFlagsCompanyInfo.isValidAddress)
  }

  /** Whether to disable "same as" checkbox. */
  get disableSameDeliveryAddress (): boolean {
    // cannot make delivery address same as mailing address
    // if mailing address is not in BC, Canada
    return (
      this.mailingAddress.addressRegion !== REGION_BC ||
      this.mailingAddress.addressCountry !== COUNTRY_CA
    )
  }

  /** True if the address form is valid. */
  get formValid (): boolean {
    const registeredOfficeValid = this.mailingAddressValid &&
      (this.deliveryAddressValid || this.inheritMailingAddress)

    const recordsOfficeValid = this.inheritRegisteredAddress ||
      (this.recMailingAddressValid && (this.inheritRecMailingAddress || this.recDeliveryAddressValid))

    return (registeredOfficeValid && recordsOfficeValid)
  }

  /** Type change helper information */
  get addressChangeInfo (): string {
    return this.getResource.changeData?.addressChangeInfo
  }

  /**
   * Sets local address data and "inherit" flags from store.
   */
  private setLocalProperties (): void {
    if (this.isBenBcCccUlcCorrectionFiling || this.isAlterationFiling || this.isRestorationFiling) {
      // assign registered office addresses (may be {})
      this.mailingAddress = { ...this.getOfficeAddresses?.registeredOffice?.mailingAddress }
      this.deliveryAddress = { ...this.getOfficeAddresses?.registeredOffice?.deliveryAddress }

      this.initializeNonRecordsAddressValidation()

      // assign records office addresses (may be {})
      this.recMailingAddress = { ...this.getOfficeAddresses?.recordsOffice?.mailingAddress }
      this.recDeliveryAddress = { ...this.getOfficeAddresses?.recordsOffice?.deliveryAddress }

      // set initial validity states
      // these will be updated by the BaseAddress sub-components
      this.recMailingAddressValid = !isEmpty(this.recMailingAddress)
      this.recDeliveryAddressValid = !isEmpty(this.recDeliveryAddress)

      // compare valid addresses to set the "inherit registered" flag
      // ignore Address Country Description since it's not always present
      this.inheritRegisteredAddress = (
        this.mailingAddressValid &&
        this.deliveryAddressValid &&
        this.recMailingAddressValid &&
        this.recDeliveryAddressValid &&
        IsSame(this.mailingAddress, this.recMailingAddress, ['addressCountryDescription', 'id']) &&
        IsSame(this.deliveryAddress, this.recDeliveryAddress, ['addressCountryDescription', 'id'])
      )

      // compare addresses to set the "inherit records mailing" flag
      // ignore Address Type since it's different
      // ignore Address Country Description since it's not always present
      this.inheritRecMailingAddress = (
        this.recMailingAddressValid &&
        this.recDeliveryAddressValid &&
        IsSame(this.recMailingAddress, this.recDeliveryAddress, ['addressType', 'addressCountryDescription', 'id'])
      )
    }

    if (this.isFirmChangeFiling || this.isFirmConversionFiling || this.isFirmCorrectionFiling) {
      // assign business office addresses (may be {})
      this.mailingAddress = { ...this.getOfficeAddresses?.businessOffice?.mailingAddress }
      this.deliveryAddress = { ...this.getOfficeAddresses?.businessOffice?.deliveryAddress }
      this.initializeNonRecordsAddressValidation()
    }

    if (this.isSpecialResolutionFiling) {
      // assign registered office addresses (may be {})
      this.mailingAddress = { ...this.getOfficeAddresses?.registeredOffice?.mailingAddress }
      this.deliveryAddress = { ...this.getOfficeAddresses?.registeredOffice?.deliveryAddress }
      this.initializeNonRecordsAddressValidation()
    }

    this.updateValidity()
  }

  /**
   *  Initializes mailing and delivery address validation and initializes inherit mailing address (checkbox).
   */
  private initializeNonRecordsAddressValidation (): void {
    // set initial validity states
    // these will be updated by the BaseAddress sub-components
    this.mailingAddressValid = !isEmpty(this.mailingAddress)
    this.deliveryAddressValid = !isEmpty(this.deliveryAddress)

    // compare valid addresses to set the "inherit mailing" flag
    // ignore Address Type since it's different
    // ignore Address Country Description since it's not always present
    // ignore ID since it's different
    this.inheritMailingAddress = (
      this.mailingAddressValid &&
      this.deliveryAddressValid &&
      IsSame(this.mailingAddress, this.deliveryAddress, ['addressType', 'addressCountryDescription', 'id'])
    )
  }

  /**
   * When "same as (registry) mailing address" checkbox is changed,
   * sets the Registered Delivery Address to the Registered Mailing Address.
   * NB: retain original address IDs
   */
  protected setDeliveryAddressToMailingAddress (): void {
    if (this.inheritMailingAddress) {
      this.deliveryAddress = { ...this.mailingAddress, addressType: 'delivery', id: this.deliveryAddress.id }
    } else {
      // clear to default
      this.deliveryAddress = { ...this.defaultAddress, addressType: 'delivery', id: this.deliveryAddress.id }
    }

    // Records delivery address also needs to be updated if inherited
    if (this.inheritRegisteredAddress) {
      this.recDeliveryAddress = { ...this.deliveryAddress, id: this.recDeliveryAddress.id }
    }
  }

  /**
   * When "same as registered address" checkbox is changed,
   * sets the Records office addresses to the Registered office addresses.
   * NB: retain original address IDs
   */
  protected setRecordOfficeToRegisteredOffice (): void {
    if (this.inheritRegisteredAddress) {
      this.recMailingAddress = { ...this.mailingAddress, id: this.recMailingAddress.id }
      this.recDeliveryAddress = { ...this.deliveryAddress, id: this.recDeliveryAddress.id }
    } else {
      this.inheritRecMailingAddress = this.inheritMailingAddress
      // clear to default
      this.recMailingAddress = { ...this.defaultAddress, addressType: 'mailing', id: this.recMailingAddress.id }
      this.recDeliveryAddress = { ...this.defaultAddress, addressType: 'delivery', id: this.recDeliveryAddress.id }
    }
  }

  /**
   * When "same as (records) mailing address" checkbox is changed,
   * sets the Records Delivery Address to Records Mailing Address.
   * NB: retain original address IDs
   */
  protected setRecordDeliveryAddressToMailingAddress (): void {
    if (this.inheritRecMailingAddress) {
      this.recDeliveryAddress = { ...this.recMailingAddress, addressType: 'delivery', id: this.recDeliveryAddress.id }
    } else {
      // clear to default
      this.recDeliveryAddress = { ...this.defaultAddress, addressType: 'delivery', id: this.recDeliveryAddress.id }
    }
  }

  /**
   * Handles update events from address sub-components.
   * NB: addresses must keep their original IDs
   * NB: retain original address IDs
   */
  protected updateAddress (addressToUpdate: AddressTypes, newAddress: AddressIF): void {
    // BaseAddress component returns empty Delivery Instructions as ''
    // but Legal API returns empty Delivery Instructions as null
    // so nullify empty Delivery Instructions for future comparisons.
    if (!newAddress.deliveryInstructions) newAddress.deliveryInstructions = null

    switch (addressToUpdate) {
      case AddressTypes.MAILING_ADDRESS:
        // only update if not equal
        if (!isEqual(this.mailingAddress, newAddress)) {
          this.mailingAddress = { ...newAddress, id: this.mailingAddress.id }
          if (this.inheritMailingAddress) {
            this.deliveryAddress = { ...newAddress, addressType: 'delivery', id: this.deliveryAddress.id }
          }
          if (this.inheritRegisteredAddress) {
            this.recMailingAddress = { ...newAddress, addressType: 'mailing', id: this.recMailingAddress.id }
            this.recDeliveryAddress =
              { ...this.deliveryAddress, addressType: 'delivery', id: this.recDeliveryAddress.id }
          }
        }
        break

      case AddressTypes.DELIVERY_ADDRESS:
        // only update if not equal
        if (!isEqual(this.deliveryAddress, newAddress)) {
          this.deliveryAddress = { ...newAddress, id: this.deliveryAddress.id }
          if (this.inheritRegisteredAddress) {
            this.recDeliveryAddress = { ...newAddress, addressType: 'delivery', id: this.recDeliveryAddress.id }
          }
        }
        break

      case AddressTypes.REC_MAILING_ADDRESS:
        // only update if not equal
        if (!isEqual(this.recMailingAddress, newAddress)) {
          this.recMailingAddress = { ...newAddress, id: this.recMailingAddress.id }
          if (this.inheritRecMailingAddress) {
            this.recDeliveryAddress = { ...newAddress, addressType: 'delivery', id: this.recDeliveryAddress.id }
          }
        }
        break

      case AddressTypes.REC_DELIVERY_ADDRESS:
        // only update if not equal
        if (!isEqual(this.recDeliveryAddress, newAddress)) {
          this.recDeliveryAddress = { ...newAddress, id: this.recDeliveryAddress.id }
        }
        break

      default:
        // should never happen
        // eslint-disable-next-line no-console
        console.log(`Error: Address "${addressToUpdate}" not found`)
    }
  }

  /**
   * Handles valid events from the BaseAddress sub-components.
   * @param addressToValidate the address to set the validity of
   * @param isValid whether the address is valid
   */
  protected onAddressValid (addressToValidate: AddressTypes, isValid: boolean): void {
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
    if (this.isBenBcCccUlcCorrectionFiling || this.isRestorationFiling) {
      // at the moment, only corp corrections and restorations are supported
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
    }

    if (this.isFirmChangeFiling || this.isFirmConversionFiling || this.isFirmCorrectionFiling) {
      // at the moment, only firm changes, conversions and corrections are supported
      this.setOfficeAddresses({
        businessOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        }
      })
    }
  }

  /**
   * When Done is clicked, stores updated addresses.
   */
  protected async acceptChanges (): Promise<void> {
    if (this.formValid) {
      // set store value
      // NB: this will cause setLocalProperties() to be called to reset local properties
      // NB: this will cause updateAddresses() to be called to update state
      this.storeAddresses()
      this.isEditing = false
    }
    // as Vue has updated the visible sections, scroll back to the top of this component
    await this.scrollToTop(this.$el)
  }

  /**
   * When Cancel is clicked, discards changes.
   */
  protected async discardChanges (): Promise<void> {
    // reset local properties from store
    this.setLocalProperties()

    this.isEditing = false

    // as Vue has updated the visible sections, scroll back to the top of this component
    await this.scrollToTop(this.$el)
  }

  /**
   * When Undo is clicked, resets original addresses from original IA filing.
   */
  protected resetOfficeAddresses (): void {
    // reset store value
    // NB: this will cause setLocalProperties() to be called to reset local properties
    // NB: this will cause updateAddresses() to be called to update state
    this.setOfficeAddresses(this.getOriginalOfficeAddresses)
  }

  /**
   * Disables Same As checkbox when the delivery address is not in BC, Canada,
   * and validates Delivery address for Change and Conversion filings.
   */
  @Watch('disableSameDeliveryAddress')
  private async updateDeliveryAddress (): Promise<void> {
    if ((this.isFirmChangeFiling || this.isFirmConversionFiling) && this.disableSameDeliveryAddress) {
      this.inheritMailingAddress = false
      // allow form to open before validating
      await this.$nextTick()

      // validate delivery address
      this.$refs.deliveryAddress && this.$refs.deliveryAddress.$refs.addressForm.validate()
    }
  }

  /**
   * When the component is mounted or stored office addresses change (ie, when data is loaded/updated/reset),
   * sets local properties and emits state events.
   *
   * Called immediately to init data when office addresses are not editable.
   *
   * Also called when we know what kind of correction this is.
   */
  @Watch('getOfficeAddresses', { deep: true, immediate: true })
  @Watch('isBenBcCccUlcCorrectionFiling')
  @Watch('isFirmCorrectionFiling')
  @Watch('isRestorationFiling')
  private updateAddresses (): void {
    // set local properties from store
    this.setLocalProperties()
  }

  /** Updates store when local Editing property has changed. */
  @Watch('isEditing', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingOfficeAddresses(val) // used for Correction Flags
    this.updateValidity()
  }

  /** Sets validity in store initially and when validity conditions have changed. */
  @Watch('mailingAddressValid')
  @Watch('deliveryAddressValid')
  @Watch('recMailingAddressValid')
  @Watch('recDeliveryAddressValid')
  private updateValidity (): void {
    const isValid = (
      !this.isEditing &&
      this.mailingAddressValid &&
      this.deliveryAddressValid &&
      this.recMailingAddressValid &&
      this.recDeliveryAddressValid
    )
    this.setValidComponent({ key: 'isValidAddress', value: isValid })
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
</style>
