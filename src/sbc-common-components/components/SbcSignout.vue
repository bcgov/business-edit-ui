<template>
  <loading-screen :is-loading="isLoading" />
</template>

<script setup lang="ts">
import KeyCloakService from '@/sbc-common-components/services/keycloak.services'

const isLoading = true
const props = defineProps({
  redirectUrl: {
    type: String,
    default: ''
  }
})

await KeyCloakService.logout(
  props.redirectUrl ? decodeURIComponent(props.redirectUrl) : undefined
)
</script>

<style lang="scss" scoped></style>
