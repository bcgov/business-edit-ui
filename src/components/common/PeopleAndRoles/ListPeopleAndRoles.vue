<template>
  <div id="list-people-roles">

    <!-- conditionally render add component -->
    <v-expand-transition>
      <div id="people-roles-add" v-if="renderOrgPersonForm && isNaN(activeIndex)" class="section-container">
        <org-person
          :currentOrgPerson="currentOrgPerson"
          :activeIndex="activeIndex"
          :currentCompletingParty="currentCompletingParty"
          @addEdit="emitAddEdit($event)"
          @remove="emitRemove($event)"
          @reset="emitReset()"
          @removeCpRole="emitRemoveCpRole()"
        />
      </div>
    </v-expand-transition>

    <!-- List Display Section -->
    <div
      v-if="currentPeopleAndRoles.length > 0"
      id="people-roles-list"
      :class="{'section-container': !isSummaryView}"
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
        :class="{'invalid-section': invalidOrgPersons, 'summary-view': isSummaryView}"
        v-for="(orgPerson, index) in currentPeopleAndRoles"
        :key="index"
        no-gutters
      >
        <!-- conditionally render edit component instead of table row -->
        <div id="people-roles-edit" v-if="renderOrgPersonForm && (index === activeIndex)">
          <org-person
            :currentOrgPerson="currentOrgPerson"
            :activeIndex="activeIndex"
            :currentCompletingParty="currentCompletingParty"
            @addEdit="emitAddEdit($event)"
            @remove="emitRemove($event)"
            @reset="emitReset()"
            @removeCpRole="emitRemoveCpRole()"
          />
        </div>

        <template v-else>
          <!-- Name + Badge -->
          <v-col class="pr-2" cols="12" sm="3">
            <v-row no-gutters>
              <v-col cols="1" class="mt-n1 ml-n1 mr-3" :class="{ 'removed': wasRemoved(orgPerson)}">
                <v-icon color="gray9" v-if="isPerson(orgPerson)">mdi-account</v-icon>
                <v-icon color="gray9" v-if="isOrg(orgPerson)">mdi-domain</v-icon>
              </v-col>
              <v-col class="overflow-hidden">
                <p class="people-roles-title mb-1" :class="{ 'removed': wasRemoved(orgPerson)}">
                  {{ formatName(orgPerson) }}
                </p>
                <p class="info-text mb-1" :class="{ 'removed': wasRemoved(orgPerson)}">
                  {{ orgPerson.officer.email }}
                </p>
                <p
                  v-if="orgPerson.officer.identifier"
                  class="info-text mb-1"
                  :class="{ 'removed': wasRemoved(orgPerson)}">
                  Incorporation Number: {{orgPerson.officer.identifier}}
                </p>
                <p v-if="orgPerson.officer.taxId" class="info-text mb-1" :class="{ 'removed': wasRemoved(orgPerson)}">
                  Business Number: {{orgPerson.officer.taxId}}
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
            <base-address class="peoples-roles-mailing-address" :address="orgPerson.mailingAddress" />
          </v-col>

          <!-- Delivery Address (for persons only) -->
          <v-col cols="12" sm="3" :class="{ 'removed': wasRemoved(orgPerson)}">
            <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress, ['id'])"
              class="peoples-roles-delivery-address info-text">Same as Mailing Address
            </p>
            <base-address v-else class="peoples-roles-delivery-address" :address="orgPerson.deliveryAddress"/>
          </v-col>

          <!-- Roles -->
          <v-col cols="12" sm="2" :class="{ 'removed': wasRemoved(orgPerson)}">
            <template v-if="isCorrectionFiling">
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
            <div
              v-if="orgPerson.actions &&  orgPerson.actions.length > 0"
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

              <!-- More Actions Menu -->
              <span v-if="!wasRemoved(orgPerson)" :class="`more-actions-${index}`" class="dropdown-action mr-4">
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
                      v-if="!isProprietor(orgPerson.roles)"
                      class="actions-dropdown_item"
                      :id="`officer-${index}-remove-btn`"
                      @click="emitUndo(index); dropdown[index]=false"
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

            <div v-else class="actions">
              <span class="edit-action" :class="{'pr-4': isProprietor(orgPerson.roles)}">
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

              <!-- More Actions Menu -->
              <span
                v-if="!isProprietor(orgPerson.roles)"
                :class="`more-actions-${index}`"
                class="dropdown-action mr-4"
              >
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
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { isSame } from '@/utils/'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { OrgPerson } from './'
import { CommonMixin } from '@/mixins/'
import { OrgPersonIF, RoleIF } from '@/interfaces/'
import { ActionTypes, PartyTypes, RoleTypes } from '@/enums/'

@Component({
  components: {
    BaseAddress,
    OrgPerson
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin) {
  // Declaration for template
  readonly ActionTypes = ActionTypes
  readonly RoleTypes = RoleTypes
  readonly isSame = isSame

  /** The current orgs/people list. */
  @Prop({ default: () => { return [] as [] } })
  readonly peopleAndRoles!: Array<OrgPersonIF>

  /** Whether to render the OrgPersonForm (for edit or add). */
  @Prop() readonly renderOrgPersonForm: boolean

  /** The current org/person to edit or add. */
  @Prop() readonly currentOrgPerson: OrgPersonIF

  /** The index of the org/person to edit, or NaN to add. */
  @Prop() readonly activeIndex: number

  /** The current completing party (or undefined). */
  @Prop() readonly currentCompletingParty: OrgPersonIF

  @Prop({ default: false })
  readonly isSummaryView!: boolean

  @Prop({ default: false })
  readonly validate!: boolean

  /** The name section validity state (when prompted by app). */
  private get invalidOrgPersons (): boolean {
    return this.validate && this.renderOrgPersonForm
  }

  /** The current orgPersons list. */
  private get currentPeopleAndRoles (): Array<OrgPersonIF> {
    return this.isSummaryView ? this.filterRemovedOrgPersons(this.peopleAndRoles) : this.peopleAndRoles
  }

  /** Helper method to filter REMOVED orgPersons from PeopleAndRoles list. */
  private filterRemovedOrgPersons (peopleAndRoles: Array<OrgPersonIF>): Array<OrgPersonIF> {
    return peopleAndRoles.filter(orgPerson => !orgPerson.actions?.includes(ActionTypes.REMOVED))
  }

  /** Headers for the person table. */
  readonly tableHeaders = ['Name', 'Mailing Address', 'Delivery Address', '']

  /** V-model for dropdown menus. */
  private dropdown: Array<boolean> = []

  /**
   * Checks if specified org/person was added.
   * @param person The org/person to check.
   * @returns True if the org/person was added.
   */
  private wasAdded (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.ADDED))
  }

  /**
   * Checks if specified org/person was edited.
   * @param person The org/person to check.
   * @returns True if the org/person was edited.
   */
  private wasEdited (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.EDITED))
  }

  /**
   * Checks if specified org/person was removed.
   * @param person The org/person to check.
   * @returns True if the org/person was removed.
   */
  private wasRemoved (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.REMOVED))
  }

  /**
   * Returns the org or person full name for display.
   * @param orgPerson the org/person object
   * @returns the formatted name
   */
  private formatName (orgPerson: OrgPersonIF): string {
    if (orgPerson?.officer?.organizationName) {
      return orgPerson.officer.organizationName
    }
    if (orgPerson?.officer) {
      return this.formatFullName(orgPerson.officer)
    }
    return ''
  }

  /** Returns true if the current orgPerson has the proprietor role. */
  private isProprietor (roles: RoleIF[]): boolean {
    return roles.some(role => role.roleType === RoleTypes.PROPRIETOR)
  }

  /** True if current data object is a person. */
  private isPerson (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.PERSON)
  }

  /** True if current data object is an organization (corporation/firm). */
  private isOrg (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  /**
   * Emits an event and index to the parent to handle undoing.
   * @param index the index of the org/person to undo
   */
  @Emit('undo')
  private emitUndo (index: number): void {}

  /**
   * Emits an event and index to the parent to start editing.
   * @param index the index of the org/person to edit
   */
  @Emit('initEdit')
  private emitInitEdit (index: number): void {}

  /**
   * Emits an event and index to the parent to handle removal.
   * @param index the index of the org/person to remove
   */
  @Emit('remove')
  private emitRemove (index: number): void {}

  /**
   * Emits an event and org/person object to the parent handle adding or editing.
   * @param person the data object of the org/person to add or edit
   */
  @Emit('addEdit')
  private emitAddEdit (person: OrgPersonIF): void {}

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

  @Watch('peopleAndRoles', { deep: true, immediate: true })
  private assignTableHeaders (): void {
    this.tableHeaders[3] = this.isCorrectionFiling ? 'Roles' : ''
  }
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
  padding: 1.25rem 0rem !important;
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

// Override base Address font style/colour
::v-deep {
  .address-block {
    font-size: $px-14;
    color: $gray7;
  }
  .v-chip {
    opacity: 1 !important;
  }
}
</style>
