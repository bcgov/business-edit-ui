<template>
  <div class="summary-container">
    <SummaryDefineCompany/>
    <ListPeopleAndRoles :personList="getOrgPeople" :isSummary="true" :showErrorSummary="!step2Valid" />
    <ListShareClass :shareClasses="getShareClasses" :isSummary="true" :showErrorSummary="!step3Valid"/>
    <AgreementType :isSummary="true" :showErrorSummary="!step4Valid"/>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, State } from 'vuex-class'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/PeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Interfaces
import { OrgPersonIF, ShareClassIF } from '@/interfaces'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    AgreementType
  }
})
export default class Summary extends Vue {
  // Global getters
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]

  // Global state
  @State(state => state.stateModel.addPeopleAndRoleStep.valid)
  readonly step2Valid: boolean

  @State(state => state.stateModel.createShareStructureStep.valid)
  readonly step3Valid: boolean

  @State(state => state.stateModel.incorporationAgreementStep.valid)
  readonly step4Valid: boolean
}
</script>

<style lang="scss" scoped>
.summary-container {
  margin-top: 1rem;
}
</style>
