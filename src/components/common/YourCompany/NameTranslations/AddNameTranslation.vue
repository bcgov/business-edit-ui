<template>
  <div id="add-name-translation">
    <ConfirmDialogShared
      ref="confirmTranslationDialog"
      attach="#add-name-translation"
    />
    <!-- Name Translation form -->
    <v-form v-model="nameTranslationForm" ref="nameTranslationForm">
      <v-text-field
        filled
        persistent-hint
        id="name-translation-input"
        label="Name Translation"
        v-model="nameTranslation"
        :rules="nameTranslationRules"
        @input="nameTranslation = nameTranslation.toUpperCase()"
      />

      <div class="action-btns">
        <v-btn v-if="!isAddingTranslation"
          large outlined color="error"
          id="name-translation-remove"
          @click="removeTranslation(nameIndex)"
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
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Mixins } from 'vue-property-decorator'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { ConfirmDialogType, FormIF } from '@/interfaces/'
import { CommonMixin } from '@/mixins/'
import { VuetifyRuleFunction } from '@/types'

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

  @Prop({ default: '' }) readonly editNameTranslation!: string
  @Prop({ default: -1 }) readonly editNameIndex!: number

  // Local properties
  protected nameTranslationForm = false
  protected nameTranslation = ''
  protected nameIndex = -1

  // Validation rules
  readonly nameTranslationRules: Array<VuetifyRuleFunction> = [
    (v: string) => !!v || 'A name translation is required', // is not empty
    (v: string) => /^[A-Za-zÀ-ÿ_@./#’&+-]+(?: [A-Za-zÀ-ÿ_@./#’&+-]+)*$/.test(v) || 'Invalid character', // English, French and single spaces
    (v: string) => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // Editing an existing name translation
    if (this.editNameTranslation) {
      this.nameTranslation = this.editNameTranslation
      this.nameIndex = this.editNameIndex
    }
  }

  protected cancelNameTranslation () {
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
        this.addTranslation(this.nameTranslation)
      }
    }).catch(() => {
      this.cancelTranslation()
    })
  }

  /** Is True if we are adding, or False if editing. */
  get isAddingTranslation (): boolean {
    return (this.editNameTranslation === '')
  }

  /** Triggers validation before add in case of blank name. */
  protected validateAddTranslation (): void {
    if (this.$refs.nameTranslationForm.validate()) {
      this.addTranslation(this.nameTranslation)
    }
  }

  /**
   * Emits an event with a string to the parent to handle addition.
   * @param translation the name to add
   */
  @Emit('addTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addTranslation (translation: string): void {}

  /** Emits an event to the parent to handle cancellation. */
  @Emit('cancelTranslation')
  private cancelTranslation (): void {}

  /**
   * Emit an event with an index to the parent to handle removal.
   * @param index the index of the item to remove
   */
  @Emit('removeTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected removeTranslation (index: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.action-btns {
  display: flex;

  .v-btn {
    margin: 0;
    min-width: 6.5rem;

    + .v-btn {
      margin-left: 0.5rem;
    }
  }

  .v-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}

:deep(.v-label) {
  color: $gray7;
  font-weight: normal;
}
</style>
