<template>
  <div id="list-people-roles">
    <!-- conditionally render add component -->
    <v-expand-transition>
      <div
        v-if="renderOrgPersonForm && isNaN(activeIndex)"
        id="people-roles-add"
        class="section-container"
        :class="{
          'section-container': !isSummaryView,
          'invalid-section': isComponentInvalid
        }"
      >
        <OrgPerson
          :currentOrgPerson="currentOrgPerson"
          :activeIndex="activeIndex"
          @addEdit="emitAddEdit($event)"
          @remove="emitRemove($event)"
          @reset="emitReset()"
        />
      </div>
    </v-expand-transition>

    <!-- List Display Section -->
    <div
      v-if="currentPeopleAndRoles.length > 0"
      id="people-roles-list"
      :class="{
        'section-container': !isSummaryView,
        'invalid-section': isComponentInvalid
      }"
    >
      <!-- List Headers -->
      <v-row class="people-roles-list-header list-item__subtitle pb-3" no-gutters>
        <v-col
          v-for="(title, index) in tableHeaders"
          :key="index"
          cols="12" sm="3"
          :class="{'summary-cols': isSummaryView}"
        >
          <span>{{ title }}</span>
        </v-col>
        <!-- Spacer Column for Actions -->
        <v-col lg="1"></v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="people-roles-content section-container"
        :class="{ 'summary-view': isSummaryView, }"
        v-for="(orgPerson, index) in currentPeopleAndRoles"
        :key="index"
        no-gutters
      >
        <!-- conditionally render edit component instead of table row -->
        <v-expand-transition>
          <div id="people-roles-edit" v-if="renderOrgPersonForm && (index === activeIndex)">
            <OrgPerson
              :currentOrgPerson="currentOrgPerson"
              :activeIndex="activeIndex"
              @addEdit="emitAddEdit($event)"
              @remove="emitRemove($event)"
              @reset="emitReset()"
            />
          </div>
        </v-expand-transition>

        <!-- normal table row -->
        <template v-if="!renderOrgPersonForm || (index != activeIndex)">
          <!-- Name + Badge -->
          <v-col class="pr-2" cols="12" sm="3">
            <v-row no-gutters>
              <v-col cols="1" class="mt-n1 ml-n1 mr-3 badges" :class="{ 'removed': wasRemoved(orgPerson)}">
                <v-icon color="gray9" v-if="isPartyTypePerson(orgPerson)">mdi-account</v-icon>
                <v-icon color="gray9" v-if="isPartyTypeOrg(orgPerson)">mdi-domain</v-icon>
              </v-col>
              <v-col class="overflow-hidden">
                <p class="people-roles-title mb-1" :class="{ 'removed': wasRemoved(orgPerson)}">
                  {{ formatName(orgPerson) }}
                </p>
                <p class="info-text mb-1 people-roles-email" :class="{ 'removed': wasRemoved(orgPerson)}">
                  {{ orgPerson.officer.email }}
                </p>
                <p
                  v-if="orgPerson.officer.identifier"
                  class="info-text mb-1 people-roles-inc-number"
                  :class="{ 'removed': wasRemoved(orgPerson)}">
                  Incorporation Number: {{orgPerson.officer.identifier}}
                </p>

                <div v-if="!isSummaryView && orgPerson.actions">
                  <v-chip v-if="wasRemoved(orgPerson)" x-small label color="#grey lighten-2">
                    {{ orgPerson.actions[0] }}
                  </v-chip>
                  <v-chip
                    v-else
                    v-for="(action, i) in orgPerson.actions"
                    :key="`action-chip-${i}`"
                    x-small label color="primary" text-color="white">
                    {{ action }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <!-- Mailing Address -->
          <v-col cols="12" :sm="isSummaryView ? 4 : 3" :class="{ 'removed': wasRemoved(orgPerson)}">
            <MailingAddress class="peoples-roles-mailing-address" :address="orgPerson.mailingAddress" />
          </v-col>

          <!-- Delivery Address -->
          <v-col cols="12" sm="3" :class="{ 'removed': wasRemoved(orgPerson)}">
            <template
              v-if="hasRoleDirector(orgPerson) || hasRoleProprietor(orgPerson) || hasRolePartner(orgPerson)"
            >
              <p
                v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress, ['id'])"
                class="peoples-roles-delivery-address info-text"
              >
                Same as Mailing Address
              </p>
              <DeliveryAddress v-else class="peoples-roles-delivery-address" :address="orgPerson.deliveryAddress"/>
            </template>
          </v-col>

          <!-- Roles -->
          <v-col cols="12" sm="2" :class="{ 'removed': wasRemoved(orgPerson)}">
            <template v-if="isBenIaCorrectionFiling">
              <!-- Warning if orgPerson has no roles -->
              <div v-if="orgPerson.roles.length > 0">
                <v-col v-for="(role, index) in orgPerson.roles" :key="index" class="col-roles">
                  <span class="info-text small-text break-spaces pr-2">{{ role.roleType }}</span>
                </v-col>
              </div>
              <div v-else>
                <v-icon color="red darken-3">mdi-alert</v-icon>
                <span class="warning-text small-text">Missing Role</span>
              </div>
            </template>
          </v-col>

          <!-- Actions Buttons -->
          <v-col v-if="!isSummaryView" class="pr-0">
            <!-- orgPerson we have added/edited/removed: -->
            <div
              v-if="orgPerson.actions && orgPerson.actions.length > 0"
              class="actions" :class="{'pr-5': wasRemoved(orgPerson)}"
            >
              <span v-if="wasAdded(orgPerson)" class="edit-action">
                <v-btn
                  text color="primary"
                  :id="`officer-${index}-edit-btn`"
                  :disabled="renderOrgPersonForm"
                  @click="emitInitEdit(index)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>
              <span v-else class="undo-action">
                <v-btn
                  text color="primary"
                  :id="`officer-${index}-undo-btn`"
                  :disabled="renderOrgPersonForm"
                  @click="emitUndo(index); dropdown[index]=false"
                >
                  <v-icon>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>
              </span>

              <!-- More Actions Menu (Edit/Change + Remove actions) -->
              <span v-if="!wasRemoved(orgPerson)" class="dropdown-action mr-4" :class="`more-actions-${index}`">
                <v-menu
                  offset-y left nudge-bottom="4"
                  v-model="dropdown[index]"
                  :attach="`#list-people-roles .more-actions-${index}`"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text small color="primary"
                      class="more-actions-btn"
                      v-on="on"
                      :disabled="renderOrgPersonForm"
                    >
                      <v-icon>{{dropdown[index] ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-if="!wasAdded(orgPerson)"
                      class="actions-dropdown_item"
                      :id="`officer-${index}-edit-btn`"
                      @click="emitInitEdit(index); dropdown[index]=false"
                    >
                      <v-list-item-subtitle>
                        <v-icon small>mdi-pencil</v-icon>
                        <span class="ml-1">{{ editLabel }}</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      v-if="canRemove(orgPerson)"
                      class="actions-dropdown_item"
                      :id="`officer-${index}-remove-btn`"
                      @click="emitRemove(index); dropdown[index]=false"
                    >
                      <v-list-item-subtitle>
                        <v-icon small>mdi-delete</v-icon>
                        <span class="ml-1">Remove</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>

            <!-- orgPerson we haven't touched: -->
            <div v-else class="actions mr-4">
              <span class="edit-action" :class="{'pr-4': canRemove(orgPerson)}">
                <v-btn
                  text color="primary"
                  :id="`officer-${index}-edit-btn`"
                  :disabled="renderOrgPersonForm"
                  @click="emitInitEdit(index)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>{{ editLabel }}</span>
                </v-btn>
              </span>

              <!-- More Actions Menu (Remove action) -->
              <span v-if="canRemove(orgPerson)" class="dropdown-action" :class="`more-actions-${index}`">
                <v-menu
                  offset-y left nudge-bottom="4"
                  v-model="dropdown[index]"
                  :attach="`#list-people-roles .more-actions-${index}`"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text small color="primary"
                      class="more-actions-btn"
                      v-on="on"
                      :disabled="renderOrgPersonForm"
                    >
                      <v-icon>{{dropdown[index] ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      class="actions-dropdown_item"
                      :id="`officer-${index}-remove-btn`"
                      @click="emitRemove(index)"
                    >
                      <v-list-item-subtitle>
                        <v-icon small>mdi-delete</v-icon>
                        <span class="ml-1">Remove</span>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </v-col>
          <v-col v-else cols="1"></v-col>
        </template>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import OrgPerson from './OrgPerson.vue'
import { CommonMixin, OrgPersonMixin } from '@/mixins/'
import { isSame } from '@/utils/'
import { OrgPersonIF } from '@/interfaces/'
import { ActionTypes } from '@/enums/'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    OrgPerson
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin, OrgPersonMixin) {
  // Declaration for template
  readonly isSame = isSame
  readonly ActionTypes = ActionTypes

  /** Whether to render the OrgPersonForm (for edit or add). */
  @Prop() readonly renderOrgPersonForm: boolean

  /** The current org/person to edit or add. */
  @Prop() readonly currentOrgPerson: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() readonly activeIndex: number

  @Prop({ default: false })
  readonly isSummaryView: boolean

  /** Whether to perform validation. */
  @Prop({ default: false })
  readonly validate: boolean

  /** Whether OrgPersons list is valid. */
  @Prop({ default: true })
  readonly validOrgPersons: boolean

  // Store getter
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter isBenIaCorrectionFiling!: boolean
  @Getter isFirmCorrectionFiling!: boolean

  /** V-model for dropdown menus. */
  protected dropdown: Array<boolean> = []

  /** Headers for the person table. */
  get tableHeaders () {
    return [
      'Name',
      'Mailing Address',
      'Delivery Address',
      this.isBenIaCorrectionFiling ? 'Roles' : ''
    ]
  }

  /** This component's validity state (for error styling). */
  get isComponentInvalid (): boolean {
    // if prompted by app or if this is a single-page correction filing
    // and
    // if form is open or if list is invalid
    return (this.validate || this.isCorrectionFiling) && (this.renderOrgPersonForm || !this.validOrgPersons)
  }

  /** The current orgPersons list. */
  get currentPeopleAndRoles (): Array<OrgPersonIF> {
    if (this.isSummaryView) {
      // return list without REMOVED org-persons
      return this.getOrgPeople.filter(orgPerson => !this.wasRemoved(orgPerson))
    }
    return this.getOrgPeople
  }

  /** Returns True if the specified org-person can be removed. */
  protected canRemove (orgPerson: OrgPersonIF): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isFirmChangeFiling) {
      // can only remove partner
      return this.hasRolePartner(orgPerson)
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

  /**
   * Returns the org or person full name for display.
   * @param orgPerson the org/person object
   * @returns the formatted name
   */
  protected formatName (orgPerson: OrgPersonIF): string {
    if (orgPerson?.officer?.organizationName) {
      return orgPerson.officer.organizationName
    }
    if (orgPerson?.officer) {
      return this.formatFullName(orgPerson.officer)
    }
    return ''
  }

  /**
   * Emits an event and index to the parent to handle undoing.
   * @param index the index of the org/person to undo
   */
  @Emit('undo')
  protected emitUndo (index: number): void {}

  /**
   * Emits an event and index to the parent to start editing.
   * @param index the index of the org/person to edit
   */
  @Emit('initEdit')
  protected emitInitEdit (index: number): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index the index of the org/person to remove
   */
  @Emit('remove')
  protected emitRemove (index: number): void {}

  /**
   * Emits an event and org/person object to the parent handle adding or editing.
   * @param person the data object of the org/person to add or edit
   */
  @Emit('addEdit')
  protected emitAddEdit (person: OrgPersonIF): void {}

  /**
   * Emits an event to the parent to reset the state.
   */
  @Emit('reset')
  protected emitReset (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.people-roles-invalid-message {
  padding: 1.25rem;
  font-weight: bold;
  color: $BCgovABlue2;
}

.people-roles-list-header {
  // NB: same styles as v-data-table header
  color: $gray9;
  font-size: $px-14;
  font-weight: bold;

  // Apply cols="4" styling on looped elements
  .summary-cols:not(:first-child) {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.3333333333%;
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }
}

.people-roles-content {
  margin: 0 -28px;
  border-top: 1px solid $gray3;

  p {
    font-size: $px-14;
  }

  .people-roles-title {
    color: $gray9;
    font-weight: bold;
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

  .dropdown-action {
    border-left: 1px solid $gray3;
  }
}

.summary-view {
  margin: 0 !important;
  padding: 0.75rem 0rem 0.75rem !important;
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

.col {
  .col-roles {
    padding: 0!important;
    max-width: 6rem;
  }
}

.warning-text {
  position: relative;
  top: 2px;
  left: 2px;
  color: $BCgovInputError;
}

.removed {
  opacity: .4;
}

// Override Base Address font style/colour
::v-deep {
  // italicize the delivery instructions in the base address component
  .address-block .delivery-instructions {
    font-style: italic;
  }

  .address-block {
    font-size: $px-14;
    color: $gray7;
  }

  .v-chip {
    opacity: 1 !important;
  }

  // align badge icon with text
  .badges .v-icon{
    margin-top: 4px
  }
}

// adjust error container padding for error bars
#people-roles-add.invalid-section,
#people-roles-list.invalid-section {
  padding: 1.25rem 1.875rem 0;
}
</style>
