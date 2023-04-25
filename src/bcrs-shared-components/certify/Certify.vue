<template>
  <div id="AR-step-4-container">
    <v-form ref="certifyForm" lazy-validation v-on:submit.prevent>
      <v-row no-gutters>
        <v-col cols="12" :sm="firstColumn" class="pr-4 pb-4">
          <label class="title-label" :class="{'error-text': invalidSection}">Legal Name</label>
        </v-col>
        <v-col cols="12" :sm="secondColumn">
          <v-text-field
            filled
            persistent-hint
            id="certified-by-textfield"
            label="Legal name of authorized person"
            :value="certifiedBy"
            :rules="[(v) => !!v || 'A person\'s legal name is required.']"
            :disabled="disableEdit"
            @input="emitCertifiedBy($event)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" :sm="firstColumn" />
        <v-col cols="12" :sm="secondColumn">
          <v-checkbox
            hide-details
            :value="isCertified"
            @change="emitIsCertified($event)"
            class="mt-0 pt-0"
          >
            <template v-slot:label>
              <div class="certify-stmt" :class="{'error-text': invalidSection && !isCertified}" v-if="isStaff">
                <strong>{{ trimmedCertifiedBy || "[Legal Name]" }}</strong>
                certifies that they have relevant knowledge of the
                {{ entityDisplay || "association" }} and is authorized to
                make this filing.
              </div>
              <div class="certify-stmt" :class="{'error-text': invalidSection && !isCertified}" v-else>
                I,
                <strong>{{ trimmedCertifiedBy || "[Legal Name]" }}</strong>,
                certify that I have relevant knowledge of the
                {{ entityDisplay || "association" }} and I am authorized to
                make this filing.
              </div>
            </template>
          </v-checkbox>

          <ul v-if="statements.length > 0" class="certify-statements mt-4">
            <li v-for="(statement, index) in statements" :key="`statement-${index}`" class="pt-2">
              {{ statement }}
            </li>
          </ul>
          <p class="certify-clause"><strong>Date:</strong> {{ currentDate }}</p>
          <p class="certify-clause">{{ message }}</p>

          <!-- Incorporation MailTo Section -->
          <template v-if="enableMailTo">
            <p class="mt-4">
              Copies of the incorporation documents will be sent to the following email addresses:
            </p>
            <ul class="email-addresses">
              <li id="business-email">
                <span>Registered office email address:</span>
                <a v-if="businessEmail" :href="`mailto:${businessEmail}`">{{ businessEmail }}</a>
                <span v-else>(Not entered)</span>
              </li>
              <li id="completing-party-email">
                <span>Completing party email address:</span>&nbsp;
                <a v-if="completingPartyEmail" :href="`mailto:${completingPartyEmail}`">{{ completingPartyEmail }}</a>
                <span v-else>(Not entered)</span>
              </li>
            </ul>
          </template>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-facing-decorator'
import { FormIF } from '@/bcrs-shared-components/interfaces'

@Component({})
export default class Certify extends Vue {
  @Prop({ default: '' }) readonly currentDate!: string

  /** Is Staff prop. */
  @Prop({ default: false }) readonly isStaff!: boolean

  /** Certified By prop. */
  @Prop({ default: '' }) readonly certifiedBy!: string

  /** Is Certified prop. */
  @Prop({ default: false }) readonly isCertified!: boolean

  /** Certified Company statements . */
  @Prop({ default: () => [] }) readonly statements!: []

  /** Message prop. */
  @Prop({ default: '' }) readonly message!: string

  /** Entity Display prop. */
  @Prop({ default: '' }) readonly entityDisplay!: string

  /** Enable MailTo prop. */
  @Prop({ default: false }) readonly enableMailTo!: boolean

  /** Business Email address. */
  @Prop({ default: '' }) readonly businessEmail!: string

  /** Completing Party Email address. */
  @Prop({ default: '' }) readonly completingPartyEmail!: string

  /** First column columns. */
  @Prop({ default: 2 }) readonly firstColumn!: number

  /** Second column columns. */
  @Prop({ default: 10 }) readonly secondColumn!: number

  /** Call field validations. */
  @Prop({ default: false }) readonly validate!: boolean

  /** Prompt Error. */
  @Prop({ default: false }) readonly invalidSection!: boolean

  /** Disable Text Input field. */
  @Prop({ default: false }) readonly disableEdit!: boolean

  // Form Ref
  declare $refs: Vue['$refs'] & {
    certifyForm: FormIF
  }

  /** Called when component is created. */
  created (): void {
    // inform parent of initial validity
    this.emitValid(Boolean(this.trimmedCertifiedBy && this.isCertified))
  }

  /** The trimmed "Certified By" string (may be ''). */
  get trimmedCertifiedBy (): string {
    // remove repeated inline whitespace, and leading/trailing whitespace
    return this.certifiedBy && this.certifiedBy.replace(/\s+/g, ' ').trim()
  }

  /** Prompt the field validations. */
  @Watch('validate')
  private validateFields (): void {
    this.$refs.certifyForm.validate()
  }

  /** Emits an event to update the Certified By prop. */
  @Emit('update:certifiedBy')
  protected emitCertifiedBy (certifiedBy: string): string {
    // remove repeated inline whitespace, and leading/trailing whitespace
    certifiedBy = certifiedBy && certifiedBy.replace(/\s+/g, ' ').trim()
    this.emitValid(Boolean(certifiedBy && this.isCertified))
    return certifiedBy
  }

  /** Emits an event to update the Is Certified prop. */
  @Emit('update:isCertified')
  protected emitIsCertified (isCertified: boolean): boolean {
    this.emitValid(Boolean(this.trimmedCertifiedBy && isCertified))
    return isCertified
  }

  /** Emits an event indicating whether or not the form is valid. */
  @Emit('valid')
  private emitValid (valid: boolean): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#AR-step-4-container {
  line-height: 1.2rem;
  font-size: $px-16;
}

.title-label {
  font-weight: bold;
  color: $gray9;
}

// align checkbox with top of its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

.certify-clause {
  margin: 0;
  padding-top: 1rem;
  padding-left: 2rem;
  color: $gray7;
  font-size: 0.875rem;
}

.certify-stmt {
  display: inline;
  font-size: 0.875rem;
  color: $gray7;
  font-weight: normal;
}

// override v-text-field label
:deep(.v-label) {
  color: $gray7;
  font-weight: normal;
}

// override v-text-field label and text
:deep(.v-input--is-disabled input),
.v-input--is-disabled textarea {
  color: $gray9;
}
</style>
