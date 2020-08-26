<template>
  <div>
    <section class="mt-10">
      <header>
        <h1>Alteration</h1>
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
export default class Alteration extends Mixins(LegalApiMixin, FilingTemplateMixin) {
  readonly ALTERATION = 'alteration'
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
    this.fetchAlterationFiling()
  }

  /** Fetches a filing. */
  private async fetchAlterationFiling (): Promise<void> {
    try {
      console.log('inside alter')
      const businessIdentifier = this.$route.query?.id as string

      const { filing } = await this.fetchFiling(businessIdentifier, this.INCORPORATION_APPLICATION) // TEMP FOR TESTING
      // const { filing } = await this.fetchFiling(businessIdentifier, this.ALTERATION) // FUTURE STATE

      if (filing) {
        this.parseIncorpFiling(filing) // TEMP FOR TESTING
        // this.parseAlteration(filing) // FUTURE STATE
        this.$emit('have-data', true) // Inform the app when the data is ready
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
