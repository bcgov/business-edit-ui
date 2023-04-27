import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Notifications } from '../../models/notification'
import NotificationService from '../../services/notification.services'
import ConfigHelper from '../../util/config-helper'
import { SessionStorageKeys } from '../../util/constants'

@Module({
  name: 'notification',
  namespaced: true
})
export default class NotificationModule extends VuexModule {
  notifications: Notifications = []
  notificationCount = 0
  notificationUnreadPriorityCount = 0
  notificationUnreadCount = 0

  @Mutation
  public setNotifications (notifications: Notifications): void {
    ConfigHelper.addToSession(SessionStorageKeys.WhatsNew, JSON.stringify(notifications || ''))
    this.notifications = notifications
  }

  @Mutation
  public setNotificationCount (count: number): void {
    this.notificationCount = count
  }

  @Mutation
  public setNotificationUnreadPriorityCount (count: number): void {
    this.notificationUnreadPriorityCount = count
  }

  @Mutation
  public setNotificationUnreadCount (count: number): void {
    this.notificationUnreadCount = count
  }

  @Action({ rawError: true, commit: 'setNotifications' })
  public async syncNotifications (): Promise<Notifications> {
    const response = await NotificationService.getNotifications()
    if (response && response.data) {
      return response.data?.sort(function (a, b) {
        var res = (+b.priority) - (+a.priority)
        if (res === 0) {
          res = b.date.localeCompare(a.date)
        }
        return res
      })
    }
    return []
  }

  @Action({ rawError: true, commit: 'setNotificationCount' })
  public async fetchNotificationCount (): Promise<number> {
    return this.notifications.length
  }

  @Action({ rawError: true, commit: 'setNotificationUnreadPriorityCount' })
  public async fetchNotificationUnreadPriorityCount (): Promise<number> {
    return this.notifications.filter(notification => notification.priority && !notification.read).length
  }

  @Action({ rawError: true, commit: 'setNotificationUnreadCount' })
  public async fetchNotificationUnreadCount (): Promise<number> {
    return this.notifications.filter(notification => !notification.read).length
  }

  @Action({ rawError: true, commit: 'setNotificationUnreadCount' })
  public async markAsRead (): Promise<Notifications> {
    let nl = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.WhatsNew) || '{}')
    nl.map(notification => { notification.read = true; return notification })
    this.context.commit('setNotifications', nl)
    return nl.filter(notification => !notification.read).length
  }
}
