<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { AuthApiMixin, CommonMixin, DateMixin, SharedMixin, FilingTemplateMixin, LegalApiMixin,
  NameRequestMixin, PayApiMixin } from '@/mixins'

@Component({})
export default class MixinTester extends Mixins(
  AuthApiMixin,
  CommonMixin,
  DateMixin,
  SharedMixin,
  FilingTemplateMixin,
  LegalApiMixin,
  NameRequestMixin,
  PayApiMixin
) {}
</script>

<style>
</style>
