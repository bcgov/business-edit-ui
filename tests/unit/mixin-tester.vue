<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { CommonMixin, DateMixin, SharedMixin, FilingTemplateMixin, NameRequestMixin, PayApiMixin }
  from '@/mixins/'

@Component({})
export default class MixinTester extends Mixins(
  CommonMixin,
  DateMixin,
  SharedMixin,
  FilingTemplateMixin,
  NameRequestMixin,
  PayApiMixin
) {}
</script>

<style>
</style>
