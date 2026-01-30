<template>
  <div
    id="business-type"
    class="section-container"
    :class="{'invalid-section': invalidSection || isShowingError}"
  >
    <ChangeBusinessType
      :invalidSection="invalidSection"
      :disabled="disabled"
      @isEditingBusinessType="isEditingType = $event"
      @isShowingError="isShowingError = $event"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { ActionKvIF } from '@/interfaces/'
import ChangeBusinessType from '@/components/common/YourCompany/ChangeBusinessType.vue'
import { useStore } from '@/store/store'
import { Components } from '@/enums/'

@Component({
  components: {
    ChangeBusinessType
  }
})
export default class BusinessType extends Vue {
  // store getters
  @Getter(useStore) getDisabledComponents!: Components[]
  @Getter(useStore) getComponentValidate!: boolean

  // global setters
  @Action(useStore) setValidComponent!: (x: ActionKvIF) => void

  // local variable
  isEditingType = false
  isShowingError = false

  /** The section validity state (when prompted by app). */
  get invalidSection (): boolean {
    return (this.getComponentValidate && this.isEditingType)
  }

  /** Whether this component should be disabled. */
  get disabled (): boolean {
    return this.getDisabledComponents.includes(Components.BUSINESS_TYPE)
  }

  /** Updates store initially and when isEditingType property has changed. */
  @Watch('isEditingType', { immediate: true })
  private onEditingTypeChanged (): void {
    const isValid = !this.isEditingType
    this.setValidComponent({ key: 'isValidBusinessType', value: isValid })
  }
}
</script>
