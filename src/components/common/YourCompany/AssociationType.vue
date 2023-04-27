<template>
  <div
    id="association-type"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <v-row no-gutters>
      <!-- Row Title -->
      <v-col cols="3">
        <label :class="{'error-text': invalidSection}">
          <strong>Cooperative Association Type</strong>
        </label>
        <v-col md="1">
          <v-chip
            v-if="hasAssociationTypeChanged"
            x-small
            label
            color="primary"
            text-color="white"
          >
            {{ getEditedLabel }}
          </v-chip>
        </v-col>
      </v-col>

      <!-- Display Mode -->
      <v-col
        v-if="!isEditingAssociationType"
        cols="7"
      >
        <span class="info-text">{{ associationDescription }}</span>
      </v-col>

      <!-- Actions -->
      <v-col
        v-if="!isEditingAssociationType"
        cols="2"
        class="mt-n2"
      >
        <div class="actions mr-4">
          <v-btn
            v-if="hasAssociationTypeChanged"
            id="btn-undo-association-type"
            text
            color="primary"
            class="undo-action"
            @click="resetAssociationType()"
          >
            <v-icon small>
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>
          <v-tooltip
            v-else
            top
            content-class="top-tooltip"
            transition="fade-transition"
            nudge-right="3"
          >
            <template #activator="{ on }">
              <v-btn
                text
                color="primary"
                class="edit-button"
                v-on="on"
                @click="isEditingAssociationType = true"
              >
                <v-icon small>
                  mdi-pencil
                </v-icon>
                <span>{{ getEditLabel }}</span>
              </v-btn>
            </template>
            <span>
              We recommend you seek legal advice before changing your cooperative association type.
              Refer to section 68 "Amendment of memorandum and rules" in the Cooperative Associations Act.
            </span>
          </v-tooltip>

          <!-- Drop Down Actions -->
          <span
            v-if="hasAssociationTypeChanged"
            class="more-actions"
          >
            <v-menu
              v-model="dropdown"
              offset-y
              left
              nudge-bottom="4"
            >
              <template #activator="{ on }">
                <v-btn
                  id="btn-more-actions"
                  text
                  small
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
                  @click="isEditingAssociationType = true; dropdown = false"
                >
                  <v-list-item-subtitle>
                    <v-icon
                      small
                      color="primary"
                    >mdi-pencil</v-icon>
                    <span class="drop-down-action ml-1">Change</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
      </v-col>

      <!-- Editing Mode -->
      <v-col
        v-if="isEditingAssociationType"
        cols="9"
      >
        <v-select
          id="association-type-input"
          v-model="selectedAssociationType"
          filled
          :items="associationTypeOptions"
          :rules="AssociationTypeRules"
        />

        <!-- Done Actions -->
        <div class="action-btns">
          <v-btn
            id="done-btn"
            large
            color="primary"
            @click="submitAssociationTypeChange()"
          >
            <span>Done</span>
          </v-btn>
          <v-btn
            id="cancel-btn"
            large
            outlined
            color="primary"
            @click="isEditingAssociationType = false"
          >
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { CoopTypes } from '@/enums'
import { CommonMixin } from '@/mixins'
import { ActionBindingIF, BusinessInformationIF, EntitySnapshotIF } from '@/interfaces'
import { VuetifyRuleFunction } from '@/types'
import { CoopTypeToDescription } from '@/utils'
import { useStore } from '@/store/store'

@Component({
  mixins: [CommonMixin]
})
export default class AssociationType extends Vue {
  /** Global getters */
  @Getter(useStore) getAssociationType!: CoopTypes
  @Getter(useStore) getBusinessInformation!: BusinessInformationIF
  @Getter(useStore) getComponentValidate!: boolean
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getEntitySnapshot!: EntitySnapshotIF
  @Getter(useStore) hasAssociationTypeChanged!: boolean

  /** Global actions */
  @Action(useStore) setBusinessInformation!: ActionBindingIF
  @Action(useStore) setValidComponent!: ActionBindingIF

  /** Select options */
  readonly associationTypeOptions: Array<any> = [
    {
      value: CoopTypes.COMMUNITY_SERVICE_COOPERATIVE,
      text: CoopTypeToDescription(CoopTypes.COMMUNITY_SERVICE_COOPERATIVE)
    },
    {
      value: CoopTypes.ORDINARY_COOPERATIVE,
      text: CoopTypeToDescription(CoopTypes.ORDINARY_COOPERATIVE)
    },
    {
      value: CoopTypes.HOUSING_COOPERATIVE,
      text: CoopTypeToDescription(CoopTypes.HOUSING_COOPERATIVE)
    }
  ]

  protected selectedAssociationType = null as CoopTypes
  protected isEditingAssociationType = false
  protected dropdown = false // v-model for dropdown menu

  /** Validation rules. */
  readonly AssociationTypeRules: Array<VuetifyRuleFunction> = [
    v => !!v || 'This field is required' // is not empty
  ]

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && this.isEditingAssociationType)
  }

  get associationDescription (): string {
    return CoopTypeToDescription(this.getAssociationType)
  }

  /** Called when component is mounted. */
  mounted (): void {
    this.initializeAssociationType()
  }

  /** Define the association type locally once the value has been populated in the store */
  @Watch('getAssociationType')
  private initializeAssociationType () {
    this.selectedAssociationType = this.getAssociationType
  }

  /** Reset association type value to original */
  protected resetAssociationType () {
    this.setBusinessInformation(this.getEntitySnapshot.businessInfo)
    this.isEditingAssociationType = false
  }

  /** Submit association type value */
  protected submitAssociationTypeChange () {
    this.setBusinessInformation({ ...this.getBusinessInformation, associationType: this.selectedAssociationType })
    this.isEditingAssociationType = false
  }

  /** Updates store initially and when isEditingAssociationType property has changed. */
  @Watch('isEditingAssociationType', { immediate: true })
  private onEditingAssociationTypeChanged (): void {
    const isValid = !this.isEditingAssociationType
    this.setValidComponent({ key: 'isValidAssociationType', value: isValid })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.actions {
  position: absolute;
  right: 0;

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.action-btns {
  margin: 15px 0;
  display: flex;
  justify-content: flex-end;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  #done-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}

// allow selection to be full height so tail of "g" is visible
:deep(.v-select__selections) {
  line-height: unset;
}

// remove extra space taken by error message
:deep(.v-text-field__details) {
  margin-bottom: -8px !important;
}

// Vuetify Overrides
:deep() {
  .v-list-item .v-list-item__title {
    color: $gray7;
  }

  .v-list-item--link:hover:not(.v-list-item--active) {
    background-color: $gray1;
    color: $app-blue !important;
  }

  .v-list-item:hover .v-list-item__title,
  .v-list-item--active .v-list-item__title {
    color: $app-blue !important;
  }
}
</style>
