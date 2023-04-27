<template>
  <v-row
    justify="center"
    no-gutters
  >
    <v-dialog
      v-model="mobileDevice"
      width="350px"
    >
      <v-card>
        <v-btn
          icon
          color="primary"
          location="right"
          :absolute="true"
          class="mt-1"
          @click="mobileDevice = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title class="justify-center pb-0">
          <v-icon
            color="red"
            size="x-large"
          >
            mdi-alert-circle-outline
          </v-icon>
        </v-card-title>

        <v-card-title class="justify-center text-center py-4">
          <div>
            Mobile Device Use is <br>
            not Recommended
          </div>
        </v-card-title>
        <v-card-text class="text-center px-6">
          <p>
            Use of this application with a mobile device is not recommended at
            this time. You may experience payment issues or other errors which
            may affect the accuracy of information submitted.
          </p>
          <p class="mb-0">
            It is recommended that you return to this site from your desktop or
            laptop computer.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pt-0">
          <v-btn
            variant="text"
            class="mobile-alert-ok-btn"
            @click="mobileDevice = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MobileDeviceAlert',
  setup () {
    const mobileDevice = ref(false)
    onMounted(() => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        mobileDevice.value = true
      }
    })
    return {
      mobileDevice
    }
  }
})
</script>

<style lang="scss" scoped>
.mobile-alert-ok-btn {
  background-color: #1669bb !important;
  width: 6.375rem;
  margin-bottom: 20px;
  color: #fff !important;
}
</style>
