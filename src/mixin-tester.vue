<template>
  <div class="d-none" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import {
  CommonMixin,
  DateMixin,
  FeeMixin,
  FilingTemplateMixin,
  NameRequestMixin
} from '@/mixins/'

@Component({
  mixins: [
    CommonMixin,
    DateMixin,
    FeeMixin,
    FilingTemplateMixin,
    NameRequestMixin
  ]
})
export default class MixinTester extends Vue {}
</script>

<style>
</style>
