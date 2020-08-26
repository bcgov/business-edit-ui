<template>
  <div>
    <section class="mt-10">
      <header>
        <h1>Correction - Incorporation Application</h1>
      </header>
      <!-- The Summary Components Below are just for a visual representation. Future Components TBD -->
      <SummaryDefineCompany/>
      <ListPeopleAndRoles :personList="orgPersonList" :isSummary="true" />
      <ListShareClass :shareClasses="shareClasses" :isSummary="true" />
      <AgreementType :isSummary="true" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { OrgPersonIF, ShareClassIF, StateModelIF } from '@/interfaces'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    AgreementType
  }
})
export default class Correction extends Mixins(LegalApiMixin, FilingTemplateMixin) {
  readonly INCORPORATION_APPLICATION = 'incorporationApplication'

  // Global state
  @State(state => state.stateModel)
  readonly stateModel!: StateModelIF

  // Global state
  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @State(state => state.stateModel.createShareStructureStep.shareClasses)
  readonly shareClasses: ShareClassIF[]

  created () {
    this.fetchIncorporationApplication()
  }

  /** Fetches a filing. */
  private async fetchIncorporationApplication (): Promise<void> {
    try {
      const businessIdentifier = this.$route.query?.id as string

      const { filing } = await this.fetchFiling(businessIdentifier, this.INCORPORATION_APPLICATION)
      if (filing) {
        this.parseIncorpFiling(filing)
        this.$emit('have-data', true) // Inform the app when the data is ready
      }
    } catch (error) {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
