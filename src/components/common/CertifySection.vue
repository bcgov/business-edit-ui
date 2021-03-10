<template>
  <section id="certify-section">
    <header>
      <h2>2. Certify</h2>
    </header>
    <div class="pt-4">Enter the legal name of the person authorized to complete and submit these changes.</div>
    <certify
      :currentDate="getCurrentDate"
      :certified-by="getCertifyState.certifiedBy"
      :is-certified="getCertifyState.valid"
      :entity-display="readableEntityType"
      :message="certifyMessage"
      :is-staff="isRoleStaff"
      @update:certifiedBy="onCertifiedBy($event)"
      @update:isCertified="onValid($event)"
    />
  </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { Certify } from '@bcrs-shared-components/certify'

// Mixins
import { DateMixin, EnumMixin } from '@/mixins'

// Interfaces, Enums & Resources
import { ActionBindingIF, CertifyIF, CertifyStatementIF } from '@/interfaces'
import { EntityTypes } from '@/enums'

@Component({
  components: {
    Certify
  }
})
export default class CertifySection extends Mixins(DateMixin, EnumMixin) {
  @Getter getCertifyState!: CertifyIF
  @Getter getCurrentDate!: string
  @Getter getEntityType!: EntityTypes
  @Getter getCertifyResource!: CertifyStatementIF
  @Getter isRoleStaff!: boolean

  @Action setCertifyState!: ActionBindingIF

  /** Get the entity type in readable format */
  private get readableEntityType (): string {
    return this.entityTypeToDescription(this.getEntityType)
  }

  /** Get the certify resource message */
  private get certifyMessage (): string {
    return this.getCertifyResource?.certifyClause
  }

  /** Handler for Valid change event. */
  private onValid (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }

  /** Handler for CertifiedBy change event. */
  private onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: val
      }
    )
  }
}
</script>

<style lang="scss" scoped>
#certify-container {
  width: 100%;
  height: 4rem;
  padding: 1rem;
  background-color: white;
}
</style>
