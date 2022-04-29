<template>
  <div id="name-translation" v-if="!isSummaryMode || hasNameTranslationChange">
    <ConfirmDialogShared
      ref="confirmTranslationDialog"
      attach="#name-translation"
    />

    <v-row no-gutters v-if="!isEditing">
      <v-col cols="3">
        <label><strong>Name Translation(s)</strong></label>
          <v-col cols="1" class="pa-0">
            <ActionChipShared
              v-if="hasNameTranslationChange && !isSummaryMode"
              :actionable-item="{ action: ActionTypes.EDITED }"
              :editedLabel="editedLabel"
            />
          </v-col>
      </v-col>
      <v-col cols="7" v-if="draftTranslations && translationsExceptRemoved.length">
        <div class="info-text text-uppercase" v-for="(translation, index) in translationsExceptRemoved"
          :key="`name_translation_${index}`">{{translation.name}}</div>
      </v-col>
      <v-col cols="7" class="info-text" v-else>
        No name translations
      </v-col>
      <v-col cols="2" class="align-right" v-if="!hasNameTranslationChange && !isSummaryMode">
        <v-btn
          id="correct-name-translation"
          class="pr-0"
          text color="primary"
          @click="isEditing = true"
        >
          <v-icon small>mdi-pencil</v-icon>
          <span>{{editLabel}}</span>
        </v-btn>
      </v-col>
      <v-col cols="2" class="align-right" v-else-if="hasNameTranslationChange && !isSummaryMode">
        <v-btn
          id="undo-name-translation"
          text color="primary" class="undo-name-translation"
          @click="resetNameTranslations"
        >
          <v-icon small>mdi-undo</v-icon>
          <span>Undo</span>
        </v-btn>

        <!-- More Actions Menu -->
        <span class="more-actions">
          <v-menu offset-y left nudge-bottom="4">
            <template v-slot:activator="{ on }">
              <v-btn
                text small color="primary"
                class="more-actions-btn"
                v-on="on"
              >
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list class="actions__more-actions">
              <v-list-item
                class="actions-dropdown_item"
                @click="isEditing = true"
              >
                <v-list-item-subtitle>
                  <v-icon small>mdi-pencil</v-icon>
                  <span class="ml-1">{{editLabel}}</span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters v-else>
      <v-col cols="3">
        <label :class="{'error-text': invalidSection}"><strong>Name Translation(s)</strong></label>
      </v-col>
      <v-col cols="9">
        <v-row no-gutters>
          <v-col>
            <p>Name translations must use the Latin Alphabet (English, French, etc.).
              Names that use other writing systems must spell the name phonetically in English or French.
            </p>
            <v-btn outlined color="primary" @click="isAddingNameTranslation=true" :disabled="isAddingNameTranslation">
              <v-icon>mdi-plus</v-icon>
              <span>Add Name Translation</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <AddNameTranslation
              v-if="isAddingNameTranslation"
              :editNameTranslation="editingNameTranslation"
              :editNameIndex="editIndex"
              @addTranslation="addName($event)"
              @removeNameTranslation="removeNameTranslation($event)"
              @cancelTranslation="cancelOrResetEditing()"
            />
            <ListNameTranslation
              v-if="draftTranslations && draftTranslations.length > 0"
              :isAddingNameTranslation="isAddingNameTranslation"
              :translationList="draftTranslations"
              @editNameTranslation="editNameTranslation($event)"
              @removeNameTranslation="removeNameTranslation($event)"
              @nameUndo="undoNameTranslation($event)"
            />
          </v-col>
        </v-row>
        <v-row pt-5>
          <v-col cols="12">
            <div class="action-btns">
              <v-btn large color="primary"
                id="name-translation-done"
                :disabled="isAddingNameTranslation || !hasPendingChange"
                @click="setNameTranslations()"
              >
                <span>Done</span>
              </v-btn>
              <v-btn large outlined color="primary"
                id="name-translation-cancel"
                @click="cancelNameTranslationCorrection()"
                :disabled="isAddingNameTranslation"
              >
                <span>Cancel</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Action } from 'vuex-class'
import { ActionChip as ActionChipShared } from '@bcrs-shared-components/action-chip'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog'
import { ListNameTranslation, AddNameTranslation } from './'
import { ActionBindingIF, ConfirmDialogType, NameTranslationIF } from '@/interfaces/'
import { ActionTypes } from '@/enums/'
import { CommonMixin } from '@/mixins/'

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

  @Prop({ default: false })
  readonly invalidSection: boolean

  @Prop({ default: () => { return [] as [] } })
  readonly nameTranslations!: NameTranslationIF[]

  @Prop({ default: false })
  readonly isSummaryMode: boolean

  // Global action
  @Action setEditingNameTranslations: ActionBindingIF

  // Declaration for template
  readonly ActionTypes = ActionTypes

  // Local properties
  private draftTranslations: NameTranslationIF[] = []
  private isEditing: boolean = false
  private isAddingNameTranslation = false
  private editingNameTranslation = ''
  private editIndex = -1

  get hasPendingChange (): boolean {
    return this.draftTranslations.length !== this.nameTranslations.length ||
      this.draftTranslations.some((translation, index) => {
        return this.nameTranslations[index].name !== translation.name ||
          this.nameTranslations[index].action !== translation.action
      })
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

  private setNameTranslations (): void {
    this.emitNameTranslations(this.draftTranslations)
    this.emitHaveChanges(this.hasNameTranslationChange)
    this.isEditing = false
  }

  private resetNameTranslations (): void {
    this.draftTranslations = this.nameTranslations
      .filter(x => x.action !== ActionTypes.ADDED)
      .map(a => {
        const translation = cloneDeep(a)
        translation.name = translation.oldName || translation.name
        translation.oldName = null
        translation.action = null
        return translation
      })
    this.emitNameTranslations(this.draftTranslations)
    this.emitHaveChanges(false)
    this.isEditing = false
  }

  private cancelNameTranslationCorrection () {
    const nameTranslations = this.nameTranslations || []
    // Compare initial/draft translation with the modified translation to identify unsaved data
    // If length is different that means added or removed (a drafted one).
    // If any value is different that means undo or editted.
    const hasUnsavedData = this.draftTranslations.length !== nameTranslations.length ||
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
        this.setNameTranslations()
      }
    }).catch(() => {
      this.draftTranslations = this.nameTranslations ? cloneDeep(this.nameTranslations) : []
      this.isEditing = false
    })
  }

  /** Add or update a name translation
   *
   * @param name The name to add
   */
  private addName (name: string): void {
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

    this.cancelOrResetEditing()
  }

  /** Pass an index of the name translation to be edited
   *
   * @param index Index number of the name translation to edit
   */
  private editNameTranslation (index: number): void {
    this.editingNameTranslation = this.draftTranslations[index].name
    this.editIndex = index
    this.isAddingNameTranslation = true
  }

  /** Remove a name translation
   *
   * @param index Index number of the name translation to remove
   */
  private removeNameTranslation (index: number): void {
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
    this.cancelOrResetEditing()
  }

  /** Cancel adding or editing of name translation */
  private cancelOrResetEditing (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  private undoNameTranslation (index: number): void {
    const translation = this.draftTranslations[index]
    if (translation.action === ActionTypes.EDITED) {
      translation.name = translation.oldName
      translation.oldName = null
    }
    translation.action = null
  }

  // Watchers
  @Watch('nameTranslations', { deep: true, immediate: true })
  private onNameTranslationsPropValueChanged (): void {
    this.draftTranslations = this.nameTranslations ? cloneDeep(this.nameTranslations) : []
    this.emitHaveChanges(this.hasNameTranslationChange)
  }

  /** Updates store when local Editing property has changed. */
  @Watch('isEditing', { immediate: true })
  private onEditingChanged (val: boolean): void {
    this.setEditingNameTranslations(val)
  }

  // Emitters
  @Emit('nameTranslationsChange')
  private emitNameTranslations (translations: NameTranslationIF[]): void {}

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}

  @Watch('isEditing')
  @Emit('isEditingTranslations')
  private emitIsEditingTranslations (isEditing: boolean): void {}
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  #name-translation {
    .action-btns {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 1rem;
      padding-right: 0.5rem;

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
  }

  .v-list-item {
    min-height: 0;
    padding: 0 1rem 0 0.5rem;
  }
  .v-list-item__subtitle {
    color: $app-blue !important;
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

  ::v-deep {
    .theme--light.v-btn.v-btn--disabled,
    .theme--light.v-btn.v-btn--disabled .v-icon {
        color: $app-blue !important;
        opacity: 0.4;
    }
  }
  ::v-deep #correct-name-translation {
    align-items: flex-start;
  }
</style>
