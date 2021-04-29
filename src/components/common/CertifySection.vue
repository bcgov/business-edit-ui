<template>
  <div class="pb-6" id="certify-section">
    <h2>2. Certify</h2>
    <div class="pt-4">Enter the legal name of the person authorized to complete and submit these changes.</div>
    <div :class="{ 'invalid-section': certificationInvalid }">
      <certify
        :currentDate="getCurrentDate"
        :certifiedBy="getCertifyState.certifiedBy"
        :isCertified="getCertifyState.valid"
        :entityDisplay="readableEntityType"
        :message="certifyMessage"
        :isStaff="isRoleStaff"
        :firstColumn="3"
        :secondColumn="9"
        :validate="getAppValidate"
        :invalidSection="certificationInvalid"
        @update:certifiedBy="onCertifiedBy($event)"
        @update:isCertified="onIsCertified($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { Certify } from '@bcrs-shared-components/certify'

// Mixins
import { DateMixin, EnumMixin } from '@/mixins'

// Interfaces, Enums & Resources
import { ActionBindingIF, CertifyIF, CertifyStatementIF, ValidFlagsIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'

@Component({
  components: {
    Certify
  }
})
export default class CertifySection extends Mixins(DateMixin, EnumMixin) {
  @Getter getCertifyState!: CertifyIF
  @Getter getCurrentDate!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getCertifyResource!: CertifyStatementIF
  @Getter isRoleStaff!: boolean
  @Getter getAlterationValidFlags!: ValidFlagsIF
  @Getter getAppValidate!: boolean

  @Action setCertifyState!: ActionBindingIF
  @Action setCertifyStateValidity!: ActionBindingIF

  /** Prop to perform validation. */
  @Prop() readonly validate: boolean

  /** Called when component is mounted. */
  mounted (): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }

  /** Get the entity type in readable format */
  private get readableEntityType (): string {
    return this.getCorpTypeDescription(this.getEntityType)
  }

  /** Get the certify resource message */
  private get certifyMessage (): string {
    return this.getCertifyResource?.certifyClause
  }

  /** Handler for Valid change event. */
  private onIsCertified (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
    this.setCertifyStateValidity(Boolean(val && this.getCertifyState.certifiedBy))
  }

  /** Handler for CertifiedBy change event. */
  private onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: val
      }
    )
    this.setCertifyStateValidity(Boolean(this.getCertifyState.valid && val))
  }

  /** True if invalid class should be set for certify container. */
  get certificationInvalid (): boolean {
    console.log(!(this.getCertifyState.valid && this.getCertifyState.certifiedBy))
    return (this.validate && !(this.getCertifyState.valid && this.getCertifyState.certifiedBy))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.invalid {
  margin-left: -4px !important;
  border-left: 4px solid $BCgovInputError;
}

.invalid-label {
  color: $BCgovInputError;
}
</style>
