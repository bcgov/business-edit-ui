<template>
  <div
    v-if="showNotifications"
    v-on:clickout="emitClose()"
  >
    <v-overlay></v-overlay>
    <v-navigation-drawer
      right
      app
      :width="440"
    >
      <v-app-bar
        flat
        outlined
      >
        <v-toolbar-title class="toolbar-title">What's New at BC Registries</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          large
          class="dialog-close"
          @click="emitClose()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-list flat>
        <v-list-item-group color="primary">
          <template v-for="(item, i) in notifications">
            <v-list-item :key="i">
              <v-row dense>
                <v-col class="d-flex" cols="1">
                  <span :class="!item.read && (item.priority ? 'dot-red' : 'dot-blue')">
                  </span>
                </v-col>
                <v-col>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold list-subtitle">{{item.title}}</v-list-item-title>
                  <v-list-item-subtitle>{{item.date}}</v-list-item-subtitle>
                  <v-spacer></v-spacer>
                  <v-list-item-content v-html="item.description"></v-list-item-content>
                </v-list-item-content>
                </v-col>
              </v-row>
            </v-list-item>
            <v-divider v-if="i < notifications.length - 1" :key="`${i}-divider`"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script lang='ts'>
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Notification } from '../models/notification'
import { mapState, mapActions } from 'vuex'
import NotificationModule from '../store/modules/notification'
import { getModule } from 'vuex-module-decorators'
import 'clickout-event'

@Component({
  name: 'NotificationPanel',
  beforeCreate () {
    this.$store.isModuleRegistered = function (aPath: string[]) {
      let m = (this as any)._modules.root
      return aPath.every((p) => {
        m = m._children[p]
        return m
      })
    }
    if (!this.$store.isModuleRegistered(['notification'])) {
      this.$store.registerModule('notification', NotificationModule)
    }
    this.$options.computed = {
      ...(this.$options.computed || {}),
      ...mapState('notification', ['notifications'])
    }
    this.$options.methods = {
      ...(this.$options.methods || {}),
      ...mapActions('notification', ['markAsRead'])
    }
  }
})
export default class NotificationPanel extends Vue {
  private readonly notifications!: Notification[]

  /** Prop to display the dialog. */
  @Prop() showNotifications: boolean

  @Emit('closeNotifications')
  private async emitClose () {

  }

  private async mounted () {
    getModule(NotificationModule, this.$store)
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/theme.scss";

//$app-notification-height: calc(100vh - $app-header-height);
//$app-notification-item-height: $app-notification-height/3;

//@debug $app-notification-item-height;
::v-deep ::-webkit-scrollbar {
  width: 2px;
}

::v-deep ::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 20px;
}

::v-deep .v-navigation-drawer--right {
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

::v-deep .v-btn:not(.dialog-close) .v-icon.v-icon {
  font-size: $px-18 !important;
}

::v-deep .v-btn__content {
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
