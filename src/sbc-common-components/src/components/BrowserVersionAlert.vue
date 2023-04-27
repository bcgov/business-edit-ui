<template>
  <v-overlay v-model="browserUnSupported" color="white">
    <v-dialog v-model="browserUnSupported" max-width="720px" persistent>
      <v-card>
        <v-card-title>
          <div>Unsupported Browser </div>
        </v-card-title>
        <v-card-text>
          <p>
            Internet Explorer 11 is no longer supported as it is coming to end-of-support by Microsoft starting on June 15, 2022.
            Download one of following browsers for best experience.
            <a href="https://docs.microsoft.com/en-us/lifecycle/announcements/internet-explorer-11-end-of-support" target="_blank">
              Learn more <v-icon class="text-decoration: none" color="primary" x-small>mdi-open-in-new</v-icon>
            </a>
          </p>
        </v-card-text>
        <v-divider vertical></v-divider>
        <v-row justify="space-around">
          <a href="https://www.microsoft.com/en-us/edge" target="_blank">
            <v-col>
              <v-card class="elevation-0">
                <v-card-title>
                   <v-img src="../assets/img/edge.png" max-height="60" max-width="60"></v-img>
                </v-card-title>
                <v-card-text>
                  Microsoft Edge
                </v-card-text>
              </v-card>
            </v-col>
          </a>
          <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">
            <v-col>
              <v-card class="elevation-0">
                <v-card-title>
                  <v-img src="../assets/img/chrome.png" max-height="60" max-width="60"></v-img>
                </v-card-title>
                <v-card-text>
                  Google Chrome
                </v-card-text>
              </v-card>
            </v-col>
          </a>
          <a href="https://www.mozilla.org/en-CA/firefox/new/" target="_blank">
            <v-col>
              <v-card class="elevation-0">
                <v-card-title>
                  <v-img src="../assets/img/firefox.png" max-height="60" max-width="60"></v-img>
                </v-card-title>
                <v-card-text>
                  Mozilla Firefox
                </v-card-text>
              </v-card>
            </v-col>
          </a>
          <a href="https://support.apple.com/downloads/safari" target="_blank">
            <v-col>
              <v-card class="elevation-0">
                <v-card-title>
                  <v-img src="../assets/img/safari.png" max-height="60" max-width="60"></v-img>
                </v-card-title>
                <v-card-text>
                  Apple Safari
                </v-card-text>
              </v-card>
            </v-col>
          </a>
        </v-row>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({})
export default class BrowserVersionAlert extends Vue {
  private browserUnSupported: boolean = false
  private isIE () {
    return (window.navigator.userAgent.match(/MSIE|Trident/) !== null)
  }
  private async mounted () {
    this.browserUnSupported = this.isIE()
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-alert__wrapper {
      margin: 0 auto;
      max-width: 1382px;
    }
  }
</style>
