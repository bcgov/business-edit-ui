<template>
  <div class="layout-wrapper">
    <sbc-header></sbc-header>
    <div class="app-body">
      <slot name="app-body"></slot>
      <div class="app-body__inner">
        <slot name="app-body_inner"></slot>
        <div class="container">
          <main>
            <slot></slot>
          </main>
        </div>
      </div>
    </div>
    <sbc-footer></sbc-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SbcHeader from './SbcHeader.vue'
import SbcFooter from './SbcFooter.vue'

export default Vue.extend({
  name: 'sbc-layout',
  components: {
    SbcHeader,
    SbcFooter
  }
})
</script>

<style lang="scss">
  $app-header-height : 70px; // 70px

  .layout-wrapper{
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
  }

  .app-header{
    flex: 0 0 auto;
    height: $app-header-height;
    z-index: 2;
  }

  .app-body{
    flex: 1 1 auto;
    margin-top: $app-header-height; // Offset the height of the fixed header
  }

  @media (min-width: 1264px){
    .app-body__inner
      > .container:first-child{
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
  }

  .app-footer{
    flex: 0 0 auto
  }

  .container{
    max-width: 1200px;
    padding: 1.5rem
  }
</style>
