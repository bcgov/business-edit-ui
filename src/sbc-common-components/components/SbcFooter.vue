<template>
  <footer class="app-footer">
    <div class="app-footer__container container">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/disclaimer"
              target="_blank"
            >Disclaimer</a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/privacy"
              target="_blank"
            >Privacy</a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/accessibility"
              target="_blank"
            >Accessibility</a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/copyright"
              target="_blank"
            >Copyright</a>
          </li>
        </ul>
        <v-tooltip
          v-if="aboutText"
          location="left"
          content-class="tooltip__footer"
        >
          <template #activator="{ props }">
            <v-icon
              v-bind="props"
              class="mr-3 mt-1"
              color="#8099b3"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span v-html="aboutText" />
        </v-tooltip>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ aboutText?: string }>()
</script>

<style lang="scss" scoped>
  @import "sbc-common-components/src/assets/scss/theme.scss";

  .app-footer {
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    border-top: 2px solid $BCgovGold5;
    background-color: $BCgovBlue5;
    font-size: 0.9375rem;

    &__container {
      margin: auto;
      width: 100%;
    }
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
</style>
