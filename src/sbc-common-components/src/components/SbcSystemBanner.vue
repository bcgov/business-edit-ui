<template>
  <v-alert tile v-model="show" :type="type" :icon="icon" :dismissible="dismissible"><span v-html="message"></span></v-alert>
</template>

<script lang="ts">

import Vue from 'vue'
import Vuetify from 'vuetify'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class SbcSystemBanner extends Vue {
  @Prop({ default: '' }) message: string
  @Prop({ default: 'warning' }) type: string // Accepted values are 'info', 'warning', 'danger', 'success',
  @Prop({ default: 'mdi-information' }) icon: string // See https://material.io/resources/icons/?style=baseline for accepted values
  @Prop({ default: false }) show: boolean
  @Prop({ default: false }) dismissible: boolean

  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.v-alert {
  margin: 0;
  padding: 0;
}

.v-alert ::v-deep .v-alert__wrapper {
  margin: 0 auto;
  padding: 1.25rem 0.75rem;
  overflow: hidden;
}
</style>
