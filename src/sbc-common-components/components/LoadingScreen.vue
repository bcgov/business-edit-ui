<template>
  <div>
    <v-fade-transition>
      <div
        v-if="props.isLoading"
        class="loading-container"
      >
        <v-progress-circular
          class="v-loader"
          size="50"
          width="5"
          :indeterminate="props.isLoading"
        />
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isLoading: {
    type: Boolean
  }
})
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2;
}
</style>
