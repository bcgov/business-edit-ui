<template>
    <v-menu
      fixed
      bottom
      left
      transition="slide-y-transition"
      attach="#appHeader"
      v-model="dialog"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          large
          text
          dark
          class="mobile-icon-only px-2"
          aria-label="products and services"
          v-on="on"
          data-test="product-selector-btn"
        >
          <v-icon>mdi-apps</v-icon>
          <span>
            Products and Services
          </span>
          <v-icon class="ml-1">
            mdi-menu-down
          </v-icon>
        </v-btn>
      </template>

      <v-card>
        <div class="menu-header">
          <v-card-title class="body-1">
            Products and Services
          </v-card-title>
          <v-divider></v-divider>
        </div>
        <v-list>
          <v-list-item
            v-for="(product, index) in products"
            :key="index" @click="goToProductPage(product)"
          >
            <v-list-item-title class="body-2">
              {{product.name}}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Full Screen Product Selector -->
      <v-card tile flat dark color="#003366" style="display: none;">
        <header class="app-header">
          <div class="container">
            <a class="brand">
              <picture>
                <source media="(min-width: 601px)"
                  srcset="../assets/img/gov_bc_logo_horiz.png">
                <source media="(max-width: 600px)"
                  srcset="../assets/img/gov_bc_logo_vert.png">
                <img class="brand__image"
                  src="../assets/img/gov_bc_logo_vert.png"
                  alt="Government of British Columbia Logo"
                  title="Government of British Columbia">
              </picture>
              <span class="brand__title">BC Registries <span class="brand__title--wrap">and Online Services</span></span>
            </a>
            <div class="app-header__actions">
            </div>
          </div>
        </header>
        <v-container class="view-container">
          <div class="view-header">
            <v-btn large icon class="back-btn mr-3" @click="dialog = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div>
              <h1>BC Registries Products <span class="lb">and Services</span></h1>
              <p class="view-header__desc">Easy access to a wide range of information products and services, including access <span class="ls">to British Columbia Provincial and Municipal Government information.</span></p>
            </div>
            <div>
              <v-btn text large class="close-btn pr-4 pl-3" @click="dialog = false" data-test="close-btn">
                <span>Close</span>
              </v-btn>
            </div>
          </div>

          <!-- Products -->
          <section class="section-container">
            <v-row class="product-blocks justify-center">
              <v-col cols="12" sm="6" md="4" v-for="(product, index) in products" :key="index">
                <v-hover v-slot:default="{ hover }">
                  <v-card dark outlined color="#26527d" class="product-block text-center" :class="{ 'on-hover': hover }" @click="goToProductPage(product)">
                    <v-card-title class="flex-column justify-center">
                      <v-icon class="product-block__icon mt-n2 mb-4">mdi-image-outline</v-icon>
                      <h2>{{product.name}}</h2>
                    </v-card-title>
                    <v-card-text class="mb-0">
                      {{product.description}}
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </section>
        </v-container>
      </v-card>

    </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import ConfigHelper from '../util/config-helper'
import { Product, Products } from '../models/product'
import { mapState, mapActions } from 'vuex'
import ProductModule from '../store/modules/product'
import { getModule } from 'vuex-module-decorators'

@Component({
  name: 'SbcProductSelector',
  beforeCreate () {
    this.$store.isModuleRegistered = function (aPath: string[]) {
      let m = (this as any)._modules.root
      return aPath.every((p) => {
        m = m._children[p]
        return m
      })
    }
    if (!this.$store.isModuleRegistered(['product'])) {
      this.$store.registerModule('product', ProductModule)
    }
    this.$options.computed = {
      ...(this.$options.computed || {}),
      ...mapState('product', ['products', 'partners'])
    }
    this.$options.methods = {
      ...(this.$options.methods || {}),
      ...mapActions('product', ['syncProducts'])
    }
  }
})
export default class SbcProductSelector extends Vue {
  private dialog = false
  private readonly products!: Products
  private readonly syncProducts!: () => Promise<void>

  private async mounted () {
    getModule(ProductModule, this.$store)
    await this.syncProducts()
  }

  private goToProductPage (product: Product): void {
    window.open(product.url, '_blank')
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

$app-header-font-color: #ffffff;
$dialog-font-color: #ffffff;

.view-container {
  padding: 3rem 2rem;
}

@media (min-width: 1360px) {
  .view-container {
    padding: 3rem 1rem;
  }
}

h1, h2, h3 {
  color: $dialog-font-color !important;
}

section + section {
  margin-top: 3rem;
}

.section-title {
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

// Dialog Header
.app-header {
  z-index: 2;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  width: 100%;
  height: 70px;
  color: $app-header-font-color;
  border-bottom: 2px solid $BCgovGold5;
  background-color: $BCgovBlue5;

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.app-header__actions {
  display: flex;
  align-items: center;
  margin-left: auto;

  .v-btn {
    margin-right: 0;
  }
}

.brand {
  display: flex;
  align-items: center;
  padding-right: 1rem;
  text-decoration: none;
  color: inherit;
}

.brand__image {
  display: block;
  margin-right: 1.25rem;
  max-height: 70px;
}

.brand__title {
  letter-spacing: -0.03rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: inherit;
}

@media (max-width: 600px) {
  .brand__image {
    margin-right: 0.75rem;
    margin-left: -0.15rem;
  }

  .brand__title {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .brand__title--wrap {
    display: block;
  }
}

// Product Selector Button
.close-btn {
  font-weight: 700;
}

// Page Title & Description
.view-header {
  display: flex;
  flex-direction: row;
  margin-bottom: 1.5rem;

  h1 + p {
    margin-top: 1.5rem;
  }

  .back-btn {
    margin-top: -0.25rem;
  }

  &.align-center {
    align-items: center;
  }

  &.block {
    display: block;
  }
}

.view-header__title {
  margin-bottom: 0;
}

@media (max-width: 599px) {
  .view-header .back-btn {
    display: none;
  }
}

@media (min-width: 600px) {
  .view-header__desc .ls {
    display: block;
  }
}

@media (min-width: 1200px) and (min-height: 900px) {
  .view-header {
    .back-btn {
      margin-top: 0;
    }
  }
}

// Product Blocks
.product-blocks {
  [class^="col-"] {
    padding: 1rem;
  }

  h2, h3 {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h2 {
    margin-bottom: 0.75rem;
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.125rem;
  }

  .v-icon {
    opacity: 0.2;
  }
}

.v-card.product-block {
  transition: all ease-out 0.2s;
  padding: 1.25rem 0.5rem;
  background-color: rgba($BCgovBlue4, 0.5) !important;
  max-height: 270px;
  min-height: 270px;
}

.v-card.partner-block {
  transition: all ease-out 0.2s;
  padding: 1.25rem 0.5rem;
  background-color: rgba($BCgovBlue4, 0.5) !important;
  max-height: 175px;
  min-height: 175px;
}

.v-card.product-block.on-hover,
.v-card.product-block:focus {
  transition: all ease-out 0.2s;
  transform: scale(1.02);
  border-color: #ffffff !important;
  background-color: $BCgovBlue4 !important;

  .v-icon {
    opacity: 1;
  }

  .v-card__text {
    color: #ffffff;
  }
}

.v-icon.product-block__icon {
  font-size: 4rem;
}

@media (max-width: 1263px) {
  .product-blocks {
    h2 {
      font-size: 1.25rem;
    }

    h3 {
      font-size: 1rem;
    }
  }
}

// Line Breaks
@media (min-width: 960px) {
  .partner-section .section-desc .ls {
    display: block;
  }
}

.product-select-btn {
  font-weight: 700;
}

.menu-header {
  display: none;
}

@media (max-width: 1263px) {
  .v-btn.mobile-icon-only {
    min-width: 3rem !important;
    width: 3rem;

    .v-icon + span,
    span + .v-icon {
      display: none;
    }

    .v-icon {
      margin-right: 0;
    }
  }
  .menu-header {
    display: block;
  }
}

@media (min-width: 1264px) {
  .menu-header {
    display: none;
  }
}
</style>
