<template>
    <v-form id="folio-number-form" ref="folioForm" v-model="folioFormValid">
      <v-text-field
        filled
        id="folio-number-textfield"
        label="Folio Number (Optional)"
        :value="folioNumber"
        :rules="folioNumberRules"
        :disabled="disabled"
        @input="emitFolioNumber($event)"
        @focus="emitFocus($event)"
        autocomplete="chrome-off"
        :name="Math.random()"
      />
    </v-form>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { FormIF } from '@/bcrs-shared-components/interfaces'

@Component({})
export default class FolioNumberInput extends Vue {
  declare $refs: Vue['$refs'] & {
    folioForm: FormIF
  }

  /** Whether to validate the fields. */
  @Prop({ default: false }) readonly validate!: boolean

  /** Folio Number prop. */
  @Prop({ default: null }) readonly folioNumber!: string

  /** Disabled prop. */
  @Prop({ default: false }) readonly disabled!: boolean

  /** Folio form model property. */
  protected folioFormValid = false

  /** Validation rules for Folio Number. */
  readonly folioNumberRules: Array<(v) => boolean | string> = [
    v => (!v || !this.validate || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Emits an event indicating whether or not this component is valid. */
  @Emit('valid')
  private emitValid (): boolean {
    return this.folioFormValid
  }

  /** Emits an event indicating whether or not this component is focused. */
  @Emit('focus')
  protected emitFocus (val: boolean): void {}

  /** Emits an event to update the Folio Number. */
  @Emit('emitFolioNumber')
  protected emitFolioNumber (val: string): void {}

  /** Prompt the field validations. */
  @Watch('folioFormValid')
  @Watch('validate')
  private validateField (): void {
    if (this.validate) {
      this.validateFolioNumber()
      this.emitValid()
    }
  }

  /**
   * Public method that can be used through $refs from a parent
   * component to reset the folio form.
   */
  public resetFolioNumber (): void {
    this.$refs.folioForm.reset()
  }

  /**
   * Public method that can be used through $refs from a parent
   * component to reset folio number validation.
   */
  public resetFolioNumberValidation (): void {
    this.$refs.folioForm.resetValidation()
  }

  /**
   * Public method that can be used through $refs from a parent
   * component to trigger folio number validation.
   * @returns True if form is valid and False if not
   */
  public validateFolioNumber (): boolean {
    return this.$refs.folioForm.validate()
  }
}
</script>
