<template>
  <div id="name-translation">
    <confirm-dialog
      ref="confirmTranslationDialog"
      attach="#name-translation"
    />
    <v-layout v-if="!isEditing">
      <v-flex xs3>
        <label><strong>Name Translation(s)</strong></label>
        <v-flex md1>
            <v-chip v-if="hasNameTranslationChange" x-small label color="#1669BB" text-color="white">
                Corrected
            </v-chip>
          </v-flex>
      </v-flex>
      <v-flex xs7 v-if="draftTranslations && translationsExceptRemoved.length">
        <div v-for="(translation, index) in translationsExceptRemoved"
          :key="`name_translation_${index}`">{{translation.value}}</div>
      </v-flex>
      <v-flex xs7 v-else>
        No name translations
      </v-flex>
      <v-flex xs2 class="align-right" v-if="!hasNameTranslationChange">
        <v-btn
          id="correct-name-translation"
          text color="primary"
          @click="isEditing = true"
        >
          <v-icon small>mdi-pencil</v-icon>
          <span>Correct</span>
        </v-btn>
      </v-flex>
      <v-flex xs2 class="align-right" v-else>
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
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                text small color="primary"
                class="more-actions-btn"
                v-on="on"
              >
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                class="actions-dropdown_item"
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
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs3>
        <label><strong>Name Translation(s)</strong></label>
      </v-flex>
      <v-flex xs9>
        <v-layout>
          <v-flex>
            <p>Name translations must use the Latin Alphabet (English, French, etc.).
              Names that use other writing systems must spell the name phonetically in English or French.
            </p>
            <v-btn outlined color="primary" @click="isAddingNameTranslation=true" :disabled="isAddingNameTranslation">
              <v-icon>mdi-plus</v-icon>
              <span>Add Name Translation</span>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <add-name-translation
              v-if="isAddingNameTranslation"
              :editNameTranslation="editingNameTranslation"
              @addTranslation="addName($event)"
              @cancelTranslation="cancelOrResetEditing()"
            ></add-name-translation>
            <list-name-translation
              v-if="draftTranslations && draftTranslations.length > 0"
              :isAddingNameTranslation="isAddingNameTranslation"
              :translationList="draftTranslations"
              @editNameTranslation="editNameTranslation($event)"
              @removeNameTranslation="removeNameTranslation($event)"
              @nameUndo="undoNameTranslation($event)"
            />
          </v-flex>
        </v-layout>
        <v-layout pt-5>
          <v-flex xs12>
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
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'

// Components
import { ConfirmDialog } from '@/components/dialogs'
import { ListNameTranslation, AddNameTranslation } from '.'

// Interfaces
import { ActionBindingIF, ConfirmDialogType,
  NameTranslationDraftIF, NameTranslationIF } from '@/interfaces'

// Enums
import { ActionTypes } from '@/enums'

// Mixins
import { CommonMixin } from '@/mixins'
import { Action, Getter } from 'vuex-class'

@Component({
  components: {
    AddNameTranslation,
    ListNameTranslation,
    ConfirmDialog
  }
})
export default class NameTranslation extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    confirmTranslationDialog: ConfirmDialogType
  }

  @Prop({ default: () => [] })
  private nameTranslations!: NameTranslationDraftIF[]

  private actionTypes = ActionTypes

  // Properties
  private draftTranslations: NameTranslationDraftIF[] = []
  private isEditing: boolean = false
  private isAddingNameTranslation = false
  private editingNameTranslation = ''
  private editIndex = -1

  private get hasPendingChange (): boolean {
    return this.draftTranslations.length !== this.nameTranslations.length ||
      !this.draftTranslations.every((translation, index) => {
        return this.nameTranslations[index].value === translation.value &&
          this.nameTranslations[index].action === translation.action
      })
  }

  private get hasNameTranslationChange (): boolean {
    return this.draftTranslations.length > 0 &&
      this.draftTranslations.filter(x => x.action).length > 0
  }

  private get translationsExceptRemoved (): NameTranslationDraftIF[] {
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
        translation.value = translation.oldValue || translation.value
        translation.oldValue = null
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
        return nameTranslations[index].value === translation.value &&
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
        // If editing for the first time
        translation.oldValue = translation.value
        translation.action = ActionTypes.EDITED
      } else if (translation.oldValue === name) {
        // If user revert to old value
        translation.action = null
        translation.oldValue = null
      }
      translation.value = name
    } else {
      this.draftTranslations.push({ value: name, oldValue: null, action: ActionTypes.ADDED })
    }

    this.cancelOrResetEditing()
  }

  /** Pass an index of the name translation to be edited
   *
   * @param index Index number of the name translation to edit
   */
  private editNameTranslation (index: number): void {
    this.editingNameTranslation = this.draftTranslations[index].value
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
        translation.value = translation.oldValue
        translation.oldValue = null
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
      translation.value = translation.oldValue
      translation.oldValue = null
    }
    translation.action = null
  }

  // Watchers
  @Watch('nameTranslations', { deep: true, immediate: true })
  private onNameTranslationsPropValueChanged (): void {
    this.draftTranslations = this.nameTranslations ? cloneDeep(this.nameTranslations) : []
    this.emitHaveChanges(this.hasNameTranslationChange)
  }

  @Emit('nameTranslationsChange')
  private emitNameTranslations (translations: NameTranslationDraftIF[]): void {}

  @Emit('haveChanges')
  private emitHaveChanges (haveChanges: boolean): void {}
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

      .v-btn[disabled] {
        color: white !important;
        background-color: #1669bb !important;
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
</style>
