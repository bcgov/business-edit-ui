<template>
  <footer class="app-footer">
    <div class="container">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank">Disclaimer</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/accessibility" target="_blank">Accessibility</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content?id=C41D8179671441B2BAA3BDDD3D89C9A9" target="_blank">
            Hours of Availability
          </a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/copyright" target="_blank">Copyright</a></li>
        </ul>
        <div class="d-flex align-center">
          <span class="font-italic">A BC Online Application</span>
          <v-tooltip left nudge-top="30" v-if="aboutText" attach=".app-footer">
            <template v-slot:activator="{ on, attrs }">
              <v-icon icon v-bind="attrs" v-on="on" color="#8099b3" class="pl-4">mdi-information-outline</v-icon>
            </template>
            <div v-html="aboutText"></div>
          </v-tooltip>
        </div>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class SbcFooter extends Vue {
  /** Optional About text. */
  @Prop({ default: '' })
  private aboutText: string
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/theme.scss";

  .app-footer {
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    border-top: 2px solid $BCgovGold5;
    background-color: $BCgovBlue5;
    font-size: 0.9375rem;
  }

  nav {
    display: flex;
    justify-content: space-between;

    ul {
      padding: 0;
      list-style-type: none;
    }

    li {
      display: inline-block;
      margin-right: 0.25rem;

      a {
        display: block;
        padding: 0.25rem 0.5rem;
        color: #fff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
    li:last-child {
      margin-right: 0;
      border-right: none;
    }
  }
  @media (min-width: 960px) {
    nav {
      li {
        margin-right: 0.5rem;
        padding-right: 0.5rem;
        border-right: 1px solid $BCgovBlue3;

        a {
          padding: 0.25rem 0.5rem;
        }
      }
    }
  }

  // make the tooltip opaque
  .v-tooltip__content {
    background: rgba($BCgovBlue3, 1) !important;

    &.menuable__content__active {
      opacity: 1!important;
    }
  }

// disable left pointer
.v-tooltip__content:after {
  margin-top: 0 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-right: 0 !important;
}

span {
  color: #FCBA19; // same as $BCgovGold5
}
</style>
