<template>
  <v-card flat id="completing-party">
    <!-- Add/Edit Block -->
    <template v-if="enableAddEdit">
      <v-row no-gutters>
        <v-col cols="12" sm="3">
          <label class="add-person-header">
            <span :class="{ 'error-text': invalidSection }">Add Person</span>
          </label>
        </v-col>

        <v-col>
          <v-form
            ref="completingPartyForm"
            v-model="completingPartyFormValid"
            v-on:submit.prevent
          >
            <!-- Person's Name -->
            <label class="sub-header">Person's Name</label>
            <v-row no-gutters class="pt-6">
              <v-col>
                <v-text-field
                  filled
                  class="item"
                  label="First Name"
                  id="person__first-name"
                  :rules="firstNameRules"
                  :value="completingParty.firstName"
                  @change="newCompletingParty.firstName = $event"
                />
              </v-col>
              <v-col class="px-4">
                <v-text-field
                  filled
                  class="item"
                  label="Middle Name"
                  id="person__middle-name"
                  :rules="middleNameRules"
                  :value="completingParty.middleName"
                  @change="newCompletingParty.middleName = $event"
                />
              </v-col>
              <v-col>
                <v-text-field
                  filled
                  class="item"
                  label="Last Name"
                  id="person__last-name"
                  :rules="lastNameRules"
                  :value="completingParty.lastName"
                  @change="newCompletingParty.lastName = $event"
                />
              </v-col>
            </v-row>

            <!-- Mailing Address -->
            <label class="sub-header mt-2">Mailing Address</label>
            <div class="address-wrapper pt-6 mb-n2">
              <BaseAddress
                ref="mailingAddress"
                :editing="true"
                :schema="addressSchema"
                :address="completingParty.mailingAddress"
                @update:address="onMailingAddressUpdate($event)"
                @valid="mailingAddressValid = $event"
              />
            </div>
          </v-form>
        </v-col>
      </v-row>
    </template>

    <!-- Summary Block -->
    <template v-else>
      <!-- Table Headers -->
      <v-row class="list-header pb-3" no-gutters>
        <v-col cols="12" sm="3">Name</v-col>
        <v-col cols="12" sm="3">Mailing Address</v-col>
      </v-row>

      <!-- Table Content -->
      <v-row class="list-content pt-3" no-gutters>
        <!-- Name -->
        <v-col class="pr-2" cols="12" sm="3">
          <v-row no-gutters>
            <v-col cols="1" class="mt-n1 ml-n1 mr-3">
              <v-icon color="gray9">mdi-account</v-icon>
            </v-col>
            <v-col>
              <p class="list-subtitle ma-0 mb-1">{{ completingPartyName }}</p>
            </v-col>
          </v-row>
        </v-col>

        <!-- Mailing Address -->
        <v-col cols="12" sm="8">
          <BaseAddress
            class="peoples-roles-mailing-address"
            :address="completingParty.mailingAddress"
          />
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { AddressIF, CompletingPartyIF, FormIF } from '@/bcrs-shared-components/interfaces/'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { isEqual } from 'lodash'

@Component({
  components: {
    BaseAddress
  }
})
export default class CompletingParty extends Vue {
  // Component references
  declare $refs: Vue['$refs'] & {
    completingPartyForm: FormIF
    mailingAddress: FormIF
  }

  /** The current completing party. */
  @Prop({ default: () => {} }) readonly completingParty!: CompletingPartyIF

  /** Enable Add / Edit mode. */
  @Prop({ default: false }) readonly enableAddEdit!: boolean

  @Prop({ default: () => {} }) readonly addressSchema!: any

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  /** Whether to show validation styling. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  // Local variables
  private completingPartyFormValid = false
  private mailingAddressValid = false
  private newCompletingParty: CompletingPartyIF = null

  readonly firstNameRules = [
    (v: string) => !!v || 'A first name is required',
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => (v?.length <= 20) || 'Cannot exceed 20 characters' // maximum character count
  ]

  readonly middleNameRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => (!v || v.length <= 20) || 'Cannot exceed 20 characters' // maximum character count
  ]

  readonly lastNameRules = [
    (v: string) => !!v || 'A last name is required',
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  /** The completing party's full name. */
  get completingPartyName (): string {
    return (`
      ${this.completingParty.firstName}
      ${this.completingParty.middleName || ''}
      ${this.completingParty.lastName}
    `) || 'Unknown'
  }

  protected onMailingAddressUpdate (val: AddressIF): void {
    // stop BaseAddress from infinitely looping on new data / updates
    if (!isEqual(this.newCompletingParty.mailingAddress, val)) {
      this.newCompletingParty.mailingAddress = val
    }
  }

  /** When prop changes, validate the components. */
  @Watch('validate')
  private onValidate (): void {
    this.$refs.completingPartyForm && this.$refs.completingPartyForm.validate()
    this.$refs.mailingAddress && this.$refs.mailingAddress.$refs.addressForm.validate()
  }

  /** When prop changes, update local object. */
  @Watch('completingParty', { immediate: true })
  private onCompletingParty (): void {
    this.newCompletingParty = this.completingParty
  }

  /** When completing party form validity changes, sync parent. */
  @Watch('completingPartyFormValid')
  @Emit('valid')
  private onCompletingPartyFormValid (): boolean {
    return (this.completingPartyFormValid && this.mailingAddressValid)
  }

  /** When mailing address validity changes, sync parent. */
  @Watch('mailingAddressValid')
  @Emit('valid')
  private onMailingAddressValid (): boolean {
    return (this.completingPartyFormValid && this.mailingAddressValid)
  }

  /** When local data object changes, sync parent. */
  @Watch('newCompletingParty', { deep: true })
  @Emit('update')
  private onNewCompletingParty (): CompletingPartyIF {
    return this.newCompletingParty
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.list-header {
  // NB: same styles as v-data-table header
  color: $gray9;
  font-size: $px-14;
  font-weight: bold;
}

.list-content {
  border-top: 1px solid $gray3;

  p {
    font-size: $px-14;
  }

  .list-subtitle {
    color: $gray9;
    font-weight: bold;
  }
}

.actions {
  position: absolute;
  right: 0;
  margin-top: -0.5rem;

  .v-btn {
    min-width: 0.5rem;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}

// Override Base Address font styling
:deep() {
  .address-block {
    font-size: $px-14;
    color: $gray7;
  }

  .v-chip {
    opacity: 1 !important;
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
