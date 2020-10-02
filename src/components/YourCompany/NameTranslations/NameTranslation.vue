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
      <v-flex xs7 v-if="drafTranslations && drafTranslations.length">
        <div v-for="(name, index) in drafTranslations" :key="`name_translation_${index}`">{{name}}</div>
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
              v-if="drafTranslations && drafTranslations.length > 0"
              :isAddingNameTranslation="isAddingNameTranslation"
              :translationList="drafTranslations"
              @editNameTranslation="editNameTranslation($event)"
              @removeNameTranslation="removeNameTranslation($event)"
            />
          </v-flex>
        </v-layout>
        <v-layout pt-5>
          <v-flex xs12>
            <div class="action-btns">
              <v-btn large color="primary"
                :disabled="isAddingNameTranslation || !hasNameTranslationChange"
                @click="setNameTranslations()"
              >
                <span>Done</span>
              </v-btn>
              <v-btn large outlined color="primary"
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

// Components
import { ConfirmDialog } from '@/components/dialogs'
import { ListNameTranslation, AddNameTranslation } from '.'

// Interfaces
import { ActionBindingIF, ConfirmDialogType } from '@/interfaces'

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
  private nameTranslations!: Array<string>

  @Prop({ default: () => [] })
  private originalNameTranslations!: Array<string>

  // Properties
  private drafTranslations: Array<string> = []
  private isEditing: boolean = false
  private isAddingNameTranslation = false
  private editingNameTranslation = ''
  private editIndex = -1

  private get hasNameTranslationChange (): boolean {
    return this.drafTranslations.length !== this.originalNameTranslations.length ||
      !this.drafTranslations.every((value, index) => {
        return this.originalNameTranslations[index] === value
      })
  }

  private setNameTranslations (): void {
    this.emitNameTranslations(this.drafTranslations)
    this.emitHaveChanges(this.hasNameTranslationChange)
    this.isEditing = false
  }

  private resetNameTranslations (): void {
    this.drafTranslations = [ ...this.originalNameTranslations ]
    this.emitNameTranslations(this.drafTranslations)
    this.emitHaveChanges(false)
    this.isEditing = false
  }

  private cancelNameTranslationCorrection () {
    const nameTranslations = this.nameTranslations || []
    const hasUnsavedData = this.drafTranslations.length !== nameTranslations.length ||
      !this.drafTranslations.every((value, index) => {
        return nameTranslations[index] === value
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
      this.drafTranslations = this.nameTranslations ? [ ...this.nameTranslations ] : []
      this.isEditing = false
    })
  }

  /** Add or update a name translation
   *
   * @param name The name to add
   */
  private addName (name: string): void {
    // Handle name translation adds or updates
    this.editIndex > -1
      ? this.drafTranslations[this.editIndex] = name
      : this.drafTranslations.push(name)

    this.cancelOrResetEditing()
  }

  /** Pass an index of the name translation to be edited
   *
   * @param index Index number of the name translation to edit
   */
  private editNameTranslation (index: number): void {
    this.editingNameTranslation = this.drafTranslations[index]
    this.editIndex = index
    this.isAddingNameTranslation = true
  }

  /** Remove a name translation
   *
   * @param index Index number of the name translation to remove
   */
  private removeNameTranslation (index: number): void {
    this.drafTranslations.splice(index, 1)

    this.cancelOrResetEditing()
  }

  /** Cancel adding or editing of name translation */
  private cancelOrResetEditing (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  // Watchers
  @Watch('nameTranslations', { deep: true, immediate: true })
  private onNameTranslationsPropValueChanged (): void {
    this.drafTranslations = this.nameTranslations ? [ ...this.nameTranslations ] : []
    this.emitHaveChanges(this.hasNameTranslationChange)
  }

  @Emit('nameTranslationsChange')
  private emitNameTranslations (translations: Array<string>): void {}

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
