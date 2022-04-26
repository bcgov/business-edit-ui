<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import AuthApiMixin from '@/mixins/auth-api-mixin'
import LegalApiMixin from '@/mixins/legal-api-mixin'
import FilingTemplateMixin from '@/mixins/filing-template-mixin'
import NameRequestMixin from '@/mixins/name-request-mixin'
import PayApiMixin from '@/mixins/pay-api-mixin'

@Component({})
export default class MixinTester extends Mixins(
  AuthApiMixin,
  LegalApiMixin,
  FilingTemplateMixin,
  NameRequestMixin,
  PayApiMixin
) {}
</script>

<style>
</style>
