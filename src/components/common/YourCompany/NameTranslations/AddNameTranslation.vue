<template>
  <div id="add-name-translation">
    <ConfirmDialogShared
      ref="confirmTranslationDialog"
      attach="#add-name-translation"
    />
    <!-- Name Translation form -->
    <v-form v-model="nameTranslationForm" ref="nameTranslationForm" class="name-translation-form">
      <v-row>
        <v-col class="pb-0">
          <v-text-field
            filled
            persistent-hint
            label="Name Translation"
            id="name-translation-input"
            v-model="nameTranslation"
            :rules="nameTranslationRules"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="action-btns">
            <v-btn v-if="!isAddingTranslation"
              large outlined color="error"
              id="name-translation-remove"
              @click="emitRemoveName(nameIndex)"
            >
              <span>Remove</span>
            </v-btn>
            <v-btn
              large color="primary" class="ml-auto"
              id="name-translation-btn-ok"
              @click="validateAddTranslation()"
            >
                Done
            </v-btn>
            <v-btn
              large outlined color="primary"
              id="name-translation-btn-cancel"
              @click="cancelNameTranslation()"
            >
              <span v-if="isAddingTranslation">Cancel New Name</span>
              <span v-else>Cancel</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Mixins } from 'vue-property-decorator'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { ConfirmDialogType, FormIF } from '@/interfaces/'
import { CommonMixin } from '@/mixins/'

@Component({
  components: {
    ConfirmDialogShared
  }
})
export default class AddNameTranslation extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    confirmTranslationDialog: ConfirmDialogType,
    nameTranslationForm: FormIF
  }

  @Prop({ default: '' })
  readonly editNameTranslation: string

  @Prop({ default: -1 })
  readonly editNameIndex: number

  // Local Properties
  private nameTranslationForm: boolean = false
  private nameTranslation: string = ''
  private nameIndex: number = -1

  // Validation Rules
  readonly nameTranslationRules: Array<Function> = [
    (v: string) => !!v || 'A name translation is required', // is not empty
    (v: string) => /^[A-Za-zÀ-ÿ_@./#’&+-]+(?: [A-Za-zÀ-ÿ_@./#’&+-]+)*$/.test(v) || 'Invalid character', // English, French and single spaces
    (v: string) => (!v || v.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
  ]

  mounted () {
    // Editing an existing name translation
    if (this.editNameTranslation) {
      this.nameTranslation = this.editNameTranslation
      this.nameIndex = this.editNameIndex
    }
  }

  private cancelNameTranslation () {
    const hasUnsavedData = this.nameTranslation !== this.editNameTranslation
    if (hasUnsavedData) {
      this.confirmUnsavedChanges()
    } else {
      this.cancelTranslation()
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
        this.addTranslation()
      }
    }).catch(() => {
      this.cancelTranslation()
    })
  }

  /**
   * Returns True if we are adding, False if editing.
   */
  get isAddingTranslation (): boolean {
    return (this.editNameTranslation === '')
  }

  /**
   * Trigger validation before add in case of blank name.
   */
  private validateAddTranslation (): void {
    if (this.$refs.nameTranslationForm.validate()) {
      this.addTranslation()
    }
  }

  // Events
  @Emit('addTranslation')
  private addTranslation (): string {
    return this.nameTranslation
  }

  @Emit('cancelTranslation')
  private cancelTranslation (): void {}

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeNameTranslation')
  private emitRemoveName (index: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

  .name-translation-form {
    padding-right: 0.5rem;

    .action-btns {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 1rem;

      .v-btn + .v-btn {
        margin-left: 0.5rem;
      }

      .v-btn {
        min-width: 6.5rem;
      }

      .v-btn[disabled] {
        color: white !important;
        background-color: $app-blue !important;
        opacity: 0.2;
      }
    }
  }
  ::v-deep .v-label {
      color: $gray7;
      font-weight: normal;
    }
</style>
