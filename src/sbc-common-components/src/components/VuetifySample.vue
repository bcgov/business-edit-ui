<template>
  <div>
    <!--Test Alerts-->
    <v-alert
      :value="true"
      type="info"
    >
      This is a info alert.
    </v-alert>
    <v-alert
      :value="true"
      color="success"
      icon="new_releases"
    >
      This is a success alert with a custom icon.
    </v-alert>

    <!--Test Buttons-->
    <v-btn color="success">Success</v-btn>
    <v-btn color="error">Error</v-btn>
    <v-btn color="warning">Warning</v-btn>
    <v-btn color="info">Info</v-btn>

    <!--Test Text Fields-->
    <v-text-field
      label="Regular"
    ></v-text-field>
    <v-text-field
      label="Box"
      filled
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import '../plugins/vuetify'

export default Vue.extend({
  name: 'vuetify-sample'
})
</script>
