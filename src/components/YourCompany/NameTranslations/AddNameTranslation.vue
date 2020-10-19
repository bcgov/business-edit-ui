<template>
  <div id="add-name-translation">
    <confirm-dialog
      ref="confirmTranslationDialog"
      attach="#add-name-translation"
    />
    <!-- Name Translation form -->
    <v-form v-model="nameTranslationForm" class="name-translation-form">
      <v-row>
        <v-col class="pb-0">
          <v-text-field
            filled
            persistent-hint
            label="Name Translation"
            id="name-translation-input"
            v-model="nameTranslation"
            :rules="nameTranslationRules">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="action-btns">
            <v-btn large color="primary"
              id="name-translation-btn-ok"
              :disabled="!nameTranslationForm"
              @click="addTranslation()"
            >OK</v-btn>
            <v-btn large outlined color="primary"
              id="name-translation-btn-cancel"
              @click="cancelNameTranslation()"
            >Cancel new name</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

// Components
import { ConfirmDialog } from '@/components/dialogs'

// Interfaces
import { ConfirmDialogType } from '@/interfaces'

@Component({
  components: {
    ConfirmDialog
  }
})
export default class AddNameTranslation extends Vue {
  // Refs
  $refs!: {
    confirmTranslationDialog: ConfirmDialogType
  }

  @Prop({ default: '' })
  private editNameTranslation: string

  // Local Properties
  private nameTranslationForm: boolean = false
  private nameTranslation: string = ''

  // Validation Rules
  private readonly nameTranslationRules: Array<Function> = [
    (v: string) => !!v || 'A name translation is required', // is not empty
    (v: string) => /^[A-Za-zÀ-ÿ_@./#’&+-]+(?: [A-Za-zÀ-ÿ_@./#’&+-]+)*$/.test(v) || 'Invalid character', // English, French and single spaces
    (v: string) => (!v || v.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
  ]

  mounted () {
    // Editing an existing name translation
    if (this.editNameTranslation) this.nameTranslation = this.editNameTranslation
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

  // Events
  @Emit('addTranslation')
  private addTranslation (): string {
    return this.nameTranslation
  }

  @Emit('cancelTranslation')
  private cancelTranslation (): void {}
}
</script>

<style lang="scss" scoped>
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
        background-color: #1669bb !important;
        opacity: 0.2;
      }
    }
  }
</style>
