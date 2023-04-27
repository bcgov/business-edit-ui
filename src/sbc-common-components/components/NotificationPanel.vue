<template>
  <div
    v-if="showNotifications"
    @clickout="emitClose()"
  >
    <v-overlay />
    <v-navigation-drawer
      location="right"
      app
      :width="440"
    >
      <v-app-bar
        flat
        border
      >
        <v-toolbar-title class="toolbar-title">
          What's New at BC Registries
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          size="large"
          class="dialog-close"
          @click="emitClose()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-list flat>
        <v-list-group color="primary">
          <template
            v-for="(item, i) in notifications"
            :key="i"
          >
            <v-list-item>
              <v-row dense>
                <v-col
                  class="d-flex"
                  cols="1"
                >
                  <span :class="!item.read && (item.priority ? 'dot-red' : 'dot-blue')" />
                </v-col>
                <v-col>
                  <v-list-item>
                    <v-list-item-title class="font-weight-bold list-subtitle">
                      {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ item.date }}</v-list-item-subtitle>
                    <v-spacer />
                    <!-- eslint-disable vue/no-v-text-v-html-on-component -->
                    <v-list-item v-html="item.description" />
                  </v-list-item>
                </v-col>
              </v-row>
            </v-list-item>
            <v-divider
              v-if="i < notifications.length - 1"
              :key="`${i}-divider`"
            />
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Notification } from 'sbc-common-components/src/models/notification'
import NotificationModule from 'sbc-common-components/src/store/modules/notification'
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import 'clickout-event'

export default defineComponent({
  name: 'NotificationPanel',
  props: {
    showNotifications: { default: false }
  },
  setup (props, { emit }) {
    const store = useStore()
    // set modules
    if (!store.hasModule('notification')) { store.registerModule('notification', NotificationModule) }

    // state
    const state = reactive({
      notifications: computed(() => store.state.notification.notifications as Notification[])
    })

    onMounted(async () => {
      getModule(NotificationModule, store)
    })

    const emitClose = (): void => {
      emit('closeNotifications')
    }
    return {
      ...props,
      ...state,
      emitClose
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~sbc-common-components/src/assets/scss/theme.scss";

:deep(::-webkit-scrollbar) {
  width: 2px;
}

:deep(::-webkit-scrollbar-thumb) {
  background: black;
  border-radius: 20px;
}

:deep(.v-navigation-drawer--right) {
  transform: translatey($app-header-height) !important;
  height: 100vh;
}

.v-app-bar.v-toolbar.v-sheet {
  background-color: $app-notification-orange !important;
}

.dialog-close {
  position: absolute;
  top: 8px;
  right: 15px;
  margin-right: 70px;
  z-index: 2;
  font-weight: bold;
}

:deep(.v-btn:not(.dialog-close) .v-icon.v-icon) {
  font-size: $px-18 !important;
}

:deep(.v-btn__content) {
  line-height: inherit;
}

.toolbar-title {
  color: $BCgovBlue5;
  font-size: $px-18;
  font-weight: 700;
}

.list-subtitle {
  font-size: $px-18;
  font-weight: 700;
}

.dot-red {
  height: 8px;
  width: 8px;
  background-color: $app-notification-red !important;
  border-radius: 50%;
  display: inline-block;
  margin-top: 18px;
  margin-left: 10px;
}

.dot-blue {
  @extend .dot-red;
  background-color: $app-notification-blue !important;
}
</style>
