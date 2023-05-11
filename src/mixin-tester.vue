<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import {
  CommonMixin,
  DateMixin,
  FeeMixin,
  FilingTemplateMixin,
  NameRequestMixin
} from '@/mixins/'

@Component({})
export default class MixinTester extends Mixins(
  CommonMixin,
  DateMixin,
  FeeMixin,
  FilingTemplateMixin,
  NameRequestMixin
) {}
</script>

<style>
</style>
