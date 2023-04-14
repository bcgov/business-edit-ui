<template>
  <div class="help-section-component">
    <div class="help-btn top" @click="helpToggle = !helpToggle">
      <v-icon color="primary">mdi-help-circle-outline</v-icon>
      <span v-if="!helpToggle" class="pl-2">Help with Special Resolution</span>
      <span v-else class="pl-2">Hide Help</span>
    </div>
    <v-expand-transition v-if="helpToggle">
      <section class="help-section info-text">
        <header class="help-header mt-4">
          <h2>Help with Special Resolution</h2>
        </header>
        <br/>
        <div>
          <p>A special resolution is a resolution by the members of a Cooperative Association.
             It is required if you wish to change the Cooperative Name, Type, Rules of Association
             or Memorandum of Association. </p>
          <p>A special resolution is submitted to a vote.
             It is passed by either being consented to in writing by all members, or in a general meeting. </p>
          <p>For details on how many members need to vote in a general meeting, refer to the
             Cooperative Association Act</p>
          <p>The special resolution must include:</p>
          <ul>
            <li>The name of the Cooperative Association, incorporation number, date the resolution was passed,
               and the full text of the resolution which clearly indicates the changes being made.</li>
            <li>The signature of a current director, officer or lawyer of the Cooperative Association and
                the date of the signature.</li>
          </ul>
          <div class="help-btn bottom" @click="helpToggle = !helpToggle">Hide Help</div>
        </div>
      </section>
      <!-- Special Resolution Form -->
      <section id="sample-resolution-section" class="section-container mt-10">
        <header id="sample-resolution-header">
          <h2>{{ getSpecialResolutionResource.header}}</h2>
        </header>

        <p class="section-description mt-2"
          v-html="getSpecialResolutionResource.text"></p>

        <div class="mt-4">
          <v-card flat class="py-8 px-6">
            <div class="d-flex flex-column flex-sm-row justify-center align-center">
              <img src="@/assets/images/BCRegistries_CoopSpecialResolution-x2.png"
                :alt="getSpecialResolutionResource.label"
                slot-scope="" class="preview-image" />
              <div class="px-8" />
              <div class="download-link-container py-5">
                <v-icon color="primary" class="mt-n1">mdi-file-pdf-outline</v-icon>
                <a :href="documentURL" download class="ml-1">
                  {{getSpecialResolutionResource.label}}
                </a>
              </div>
            </div>
          </v-card>
        </div>
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Getter } from 'pinia-class'
import { Component } from 'vue-property-decorator'
import { ResourceIF, SpecialResolutionSampleFormIF } from '@/interfaces/'
import { useStore } from '@/store/store'

@Component({
  components: {
  }
})
export default class HelpSpecialResolution extends Vue {
  @Getter(useStore) getResource!: ResourceIF
  helpToggle = false

  get getSpecialResolutionResource (): SpecialResolutionSampleFormIF {
    return this.getResource.changeData?.specialResolution?.sampleFormSection || {}
  }

  /** download URL for pdf file */
  get documentURL (): string {
    /**
     * In session is stored the BASE_URL with business ID
     * So we are taking from process.env.BASE_URL
     */
    return process.env.BASE_URL +
      this.getSpecialResolutionResource?.path
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.v-icon {
  margin-top: -3px;
}

.help-section {
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  margin: 1.5rem 0;
  padding: 1rem 0;
}

.help-header {
  display: flex;
  justify-content: center;
}

.help-btn.bottom {
  font-size: $px-13;
  text-decoration: underline;
  display: flex;
  direction: rtl;
}
</style>
