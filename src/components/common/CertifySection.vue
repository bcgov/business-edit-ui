<template>
  <div class="pb-6" id="certify-section">
    <h2>{{sectionNumber}} Certify</h2>
    <div class="pt-4">Enter the legal name of the person authorized to complete and submit these changes.</div>
    <div :class="{ 'invalid-section': certificationInvalid }">
      <CertifyShared
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
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CertifyShared } from '@/components/shared'
import { DateMixin, SharedMixin } from '@/mixins/'
import { ActionBindingIF, CertifyIF, ResourceIF } from '@/interfaces/'

@Component({
  components: {
    CertifyShared
  }
})
export default class CertifySection extends Mixins(DateMixin, SharedMixin) {
  @Getter getCertifyState!: CertifyIF
  @Getter getCurrentDate!: string
  @Getter getResource!: ResourceIF
  @Getter isRoleStaff!: boolean
  @Getter getAppValidate!: boolean

  @Action setCertifyState!: ActionBindingIF
  @Action setCertifyStateValidity!: ActionBindingIF

  /** Prop to provide section number. */
  @Prop({ default: '' }) readonly sectionNumber: string

  /** Prop to perform validation. */
  @Prop({ default: false }) readonly validate: boolean

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
    return this.getResource?.certifyClause
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
