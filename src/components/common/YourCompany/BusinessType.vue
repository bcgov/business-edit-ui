<template>
  <div
    id="business-type"
    class="section-container"
    :class="{'invalid-section': invalidSection}"
  >
    <ChangeBusinessType
      :invalidSection="invalidSection"
      @isEditingBusinessType="isEditingType = $event"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator'
import { Action, Getter } from '@/store/PiniaClass'
import { ActionBindingIF } from '@/interfaces/'
import ChangeBusinessType from '@/components/common/YourCompany/ChangeBusinessType.vue'
import { useStore } from '@/store/store'

@Component({
  components: {
    ChangeBusinessType
  }
})
export default class BusinessType extends Vue {
  // store getters
  @Getter(useStore) getComponentValidate!: boolean

  // global setters
  @Action(useStore) setValidComponent!: ActionBindingIF

  // local variable
  protected isEditingType = false

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && this.isEditingType)
  }

  /** Updates store initially and when isEditingType property has changed. */
  @Watch('isEditingType', { immediate: true })
  private onEditingTypeChanged (): void {
    const isValid = !this.isEditingType
    this.setValidComponent({ key: 'isValidBusinessType', value: isValid })
  }
}
</script>
