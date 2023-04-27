<template>
  <sbc-system-banner
    v-if="isSbcSystemDown"
    v-bind:show="isSbcSystemDown"
    type="warning"
    v-bind:message="alertMessage"
  ></sbc-system-banner>
</template>

<script lang='ts'>
import VueI18n from 'vue-i18n'
import { getBoolean } from '../util/common-util'
import { OutageMessages } from '../util/enums'
import { Vue, Component, Prop } from 'vue-property-decorator'
import SbcSystemBanner from '../components/SbcSystemBanner.vue'
import StatusServices from '../services/status.services'
import { ServiceStatus } from '../models'

Vue.use(VueI18n)

const messages = {
  en: {
    serviceMaintenanceMessage: '{serviceName} processing is currently not available for corporate filings.',
    serviceScheduledOutageMessage: '{serviceName} processing is currently not available for corporate filings.',
    serviceEmergenceMessage: '{serviceName} processing is currently not available for corporate filings.'
  }
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

@Component({
  components: {
    SbcSystemBanner
  },
  i18n
})
export default class SbcSystemAlert extends Vue {
  @Prop({ default: [] })
  private serviceData: { serviceName: string, serviceNameDesc: string }[]

  @Prop({ default: '' })
  private statusURL: string

  /* class properties */
  private isSbcSystemDown: boolean = false
  private alertMessage: string = ''

  private mounted (): void {
    StatusServices.getServiceStatus(this.serviceData['serviceName'])
      .then((response) => {
        this.isSbcSystemDown = !getBoolean(response.data && response.data.currentStatus)
        if (this.isSbcSystemDown) {
          this.alertMessage = this.$t(OutageMessages.outage, { serviceName: this.serviceData['serviceNameDesc'] }).toString()
        }
      })
  }
}

</script>
