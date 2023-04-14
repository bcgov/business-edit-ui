<template>
  <div id="name-translation" v-if="!isSummaryMode || hasNameTranslationChange">
    <ConfirmDialogShared
      ref="confirmTranslationDialog"
      attach="#name-translation"
    />

    <!-- Summary mode -->
    <v-row no-gutters v-if="!isEditing">
      <v-col cols="3" class="pr-2">
        <label><strong>Name Translation(s)</strong></label>
        <ActionChipShared
          v-if="hasNameTranslationChange && !isSummaryMode"
          :actionable-item="{ action: ActionTypes.EDITED }"
          :editedLabel="getEditedLabel"
        />
      </v-col>

      <v-col cols="7" v-if="draftTranslations && translationsExceptRemoved.length">
        <div
          v-for="(translation, index) in translationsExceptRemoved"
          class="info-text"
          :key="`name_translation_${index}`"
        >
          {{ translation.name }}
        </div>
      </v-col>
      <v-col cols="7" class="info-text" v-else>
        No name translations
      </v-col>

      <!-- Actions -->
      <v-col cols="2" class="mt-n2" v-if="isEditNameTranslationButtonVisible">
        <div class="actions mr-4">
          <v-btn
            class="correct-name-translation"
            text color="primary"
            @click="isEditing = true"
          >
            <v-icon small>mdi-pencil</v-icon>
            <span>{{ getEditLabel }}</span>
          </v-btn>
        </div>
      </v-col>

      <v-col cols="2" class="mt-n2" v-else-if="hasNameTranslationChange && !isSummaryMode">
        <div class="actions mr-4">
          <v-btn
            class="undo-name-translation"
            text color="primary"
            @click="undoNameTranslations()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>

          <!-- More Actions Menu -->
          <span class="more-actions">
            <v-menu offset-y left nudge-bottom="4">
              <template v-slot:activator="{ on }">
                <v-btn
                  text color="primary"
                  class="more-actions-btn"
                  v-on="on"
                >
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list class="more-actions-list">
                <v-list-item @click="isEditing = true">
                  <v-list-item-title>
                    <v-icon small>mdi-pencil</v-icon>
                    <span class="ml-2">Change</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
      </v-col>
    </v-row>

    <!-- Edit mode -->
    <v-row no-gutters v-else>
      <v-col cols="3">
        <label :class="{'error-text': invalidSection}"><strong>Name Translation(s)</strong></label>
      </v-col>

      <v-col cols="9">
        <!-- Indented section -->
        <div class="pr-2">
          <p class="mb-0">
            Name translations must use the Latin Alphabet (English, French, etc.).
            Names that use other writing systems must spell the name phonetically in English or French.
          </p>

          <v-btn
            outlined color="primary"
            class="mt-6"
            @click="isAddingNameTranslation=true"
            :disabled="isAddingNameTranslation"
          >
            <v-icon>mdi-plus</v-icon>
            <span>Add Name Translation</span>
          </v-btn>

          <!-- Add Name Translation component -->
          <div v-if="isAddingNameTranslation" class="mt-6">
            <AddNameTranslation
              :editNameTranslation="editingNameTranslation"
              :editNameIndex="editIndex"
              @addTranslation="addTranslation($event)"
              @removeTranslation="removeTranslation($event)"
              @cancelTranslation="cancelTranslation()"
            />
          </div>

          <!-- List Name Translation component -->
          <div v-if="draftTranslations && draftTranslations.length > 0" class="mt-6">
            <ListNameTranslation
              :isAddingNameTranslation="isAddingNameTranslation"
              :translationsList="draftTranslations"
              @editTranslation="editTranslation($event)"
              @removeTranslation="removeTranslation($event)"
              @undoTranslation="undoTranslation($event)"
            />
          </div>
        </div>

        <div class="action-btns mt-6">
          <v-btn large color="primary"
            id="name-translation-done"
            :disabled="isAddingNameTranslation || !hasPendingChange"
            @click="saveNameTranslations()"
          >
            <span>Done</span>
          </v-btn>
          <v-btn large outlined color="primary"
            id="name-translation-cancel"
            @click="cancelNameTranslations()"
            :disabled="isAddingNameTranslation"
          >
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Action, Getter } from 'pinia-class'
import { ActionChip as ActionChipShared } from '@bcrs-shared-components/action-chip/'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { ListNameTranslation, AddNameTranslation } from './'
import { ActionBindingIF, ConfirmDialogType, NameTranslationIF } from '@/interfaces/'
import { ActionTypes } from '@/enums/'
import { CommonMixin } from '@/mixins/'
import { useStore } from '@/store/store'

@Component({
  components: {
    ActionChipShared,
    AddNameTranslation,
    ListNameTranslation,
    ConfirmDialogShared
  }
})
export default class NameTranslation extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    confirmTranslationDialog: ConfirmDialogType
  }

  @Prop({ default: false }) readonly invalidSection!: boolean
  @Prop({ default: false }) readonly isSummaryMode!: boolean

  // Global getter
  @Getter(useStore) getEditLabel!: string
  @Getter(useStore) getEditedLabel!: string
  @Getter(useStore) getNameTranslations!: NameTranslationIF[]
  @Getter(useStore) isLimitedConversionRestorationFiling!: boolean
  @Getter(useStore) isLimitedExtendRestorationFiling!: boolean

  // Global actions
  @Action(useStore) setEditingNameTranslations!: ActionBindingIF
  @Action(useStore) setNameTranslations!: ActionBindingIF

  // Declaration for template
  readonly ActionTypes = ActionTypes

  // Local properties
  private draftTranslations: NameTranslationIF[] = []
  private isEditing = false
  private isAddingNameTranslation = false
  private editingNameTranslation = ''
  private editIndex = -1

  get hasPendingChange (): boolean {
    return (
      this.draftTranslations.length !== this.getNameTranslations.length ||
      this.draftTranslations.some((translation, index) => {
        return (
          this.getNameTranslations[index].name !== translation.name ||
          this.getNameTranslations[index].action !== translation.action
        )
      })
    )
  }

  get hasNameTranslationChange (): boolean {
    return this.draftTranslations.length > 0 &&
      this.draftTranslations.filter(x => x.action).length > 0
  }

  get isAddingAction (): boolean {
    return this.editIndex === -1
  }

  get translationsExceptRemoved (): NameTranslationIF[] {
    return this.draftTranslations.filter(x => x.action !== ActionTypes.REMOVED)
  }

  /** Returns true when the user can edit the name translations */
  get isEditNameTranslationButtonVisible (): boolean {
    return !(
      this.hasNameTranslationChange ||
      this.isSummaryMode ||
      this.isLimitedConversionRestorationFiling ||
      this.isLimitedExtendRestorationFiling
    )
  }

  protected saveNameTranslations (): void {
    this.setNameTranslations(this.draftTranslations)
    this.isEditing = false
  }

  protected undoNameTranslations (): void {
    this.draftTranslations = this.getNameTranslations
      .filter(x => x.action !== ActionTypes.ADDED)
      .map(a => {
        const translation = cloneDeep(a)
        translation.name = translation.oldName || translation.name
        translation.oldName = null
        translation.action = null
        return translation
      })
    this.setNameTranslations(this.draftTranslations)
    this.isEditing = false
  }

  protected cancelNameTranslations () {
    const nameTranslations = this.getNameTranslations
    // Compare initial/draft translation with the modified translation to identify unsaved data
    // If length is different that means added or removed (a drafted one).
    // If any value is different that means undo or editted.
    const hasUnsavedData =
      (this.draftTranslations.length !== nameTranslations.length) ||
      !this.draftTranslations.every((translation, index) => {
        return nameTranslations[index].name === translation.name &&
          nameTranslations[index].action === translation.action
      })
    if (hasUnsavedData) {
      this.confirmUnsavedChanges()
    } else {
      this.isEditing = false
    }
  }

  private confirmUnsavedChanges () {
    // open confirmation dialog and wait for response
    this.$refs.confirmTranslationDialog.open(
      'Unsaved Changes',
      'You have unsaved changes in your Name Translations. Do you want to save these changes?',
      {
        width: '45rem',
        persistent: true,
        yes: 'Save changes',
        no: null,
        cancel: 'Cancel without saving'
      }
    ).then(async (confirm) => {
      if (confirm) {
        this.saveNameTranslations()
      }
    }).catch(() => {
      this.draftTranslations = cloneDeep(this.getNameTranslations)
      this.isEditing = false
    })
  }

  /** Adds or updates the specified name translation. */
  protected addTranslation (name: string): void {
    // Handle name translation adds or updates
    if (this.editIndex > -1) {
      const translation = this.draftTranslations[this.editIndex]
      if (!translation.action) {
        // if translation has changed at all
        if (translation.name !== name) {
          // If editing for the first time
          translation.oldName = translation.name
          translation.action = ActionTypes.EDITED
        }
      } else if (translation.oldName === name) {
        // If user revert to old value
        translation.action = null
        translation.oldName = null
      }
      translation.name = name
    } else {
      this.draftTranslations.push({ name: name, oldName: null, action: ActionTypes.ADDED })
    }

    this.cancelTranslation()
  }

  /** Edits the specified name translation. */
  protected editTranslation (index: number): void {
    this.editingNameTranslation = this.draftTranslations[index].name
    this.editIndex = index
    this.isAddingNameTranslation = true
  }

  /** Removes the specified name translation. */
  protected removeTranslation (index: number): void {
    const translation = this.draftTranslations[index]
    if (translation.action === ActionTypes.ADDED) {
      this.draftTranslations.splice(index, 1)
    } else {
      if (translation.action === ActionTypes.EDITED) {
        translation.name = translation.oldName
        translation.oldName = null
      }
      translation.action = ActionTypes.REMOVED
    }
    this.cancelTranslation()
  }

  /** Cancels adding or editing the current name translation. */
  protected cancelTranslation (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  /** Undoes change to the specified name translation. */
  protected undoTranslation (index: number): void {
    const translation = this.draftTranslations[index]
    if (translation.action === ActionTypes.EDITED) {
      translation.name = translation.oldName
      translation.oldName = null
    }
    translation.action = null
  }

  /** Updates local property initially and when store property has changed. */
  @Watch('getNameTranslations', { deep: true, immediate: true })
  private onNameTranslationsPropValueChanged (): void {
    this.draftTranslations = cloneDeep(this.getNameTranslations)
  }

  /** Updates store when local Editing property has changed. */
  @Watch('isEditing', { immediate: true })
  @Emit('isEditingTranslations')
  private onEditingChanged (isEditing: boolean): void {
    this.setEditingNameTranslations(isEditing)
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  .action-btns {
    display: flex;
    justify-content: flex-end;

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }

    .v-btn {
      min-width: 6.5rem;
    }

    #name-translation-done[disabled] {
      color: white !important;
      background-color: $app-blue !important;
      opacity: 0.2;
    }
  }

  .undo-name-translation {
    border-right: 1px solid $gray1;
  }

  .v-list-item {
    min-height: 0;
    padding: 0.5rem 1rem;

    .v-list-item__title {
      font-size: $px-14;
      color: $app-blue;
    }
  }

  .v-icon {
    color: $app-blue !important;
  }

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

  :deep() {
    .theme--light.v-btn.v-btn--disabled,
    .theme--light.v-btn.v-btn--disabled .v-icon {
      color: $app-blue !important;
      opacity: 0.4;
    }
  }

  :deep(#correct-name-translation) {
    align-items: flex-start;
  }
</style>
