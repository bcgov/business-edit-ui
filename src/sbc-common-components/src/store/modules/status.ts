import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { ServiceStatus } from '../../models/ServiceStatus'
import StatusService from '../../services/status.services'

@Module({
  name: 'status',
  namespaced: true
})
export default class StatusModule extends VuexModule {
  paySystemStatus: ServiceStatus = {
    currentStatus: true,
    nextUpTime: new Date(),
    message: null,
    customMessage: null
  }

  @Mutation
  public setPaySystemStatus (serviceStatus: ServiceStatus) {
    this.paySystemStatus = serviceStatus
  }

  @Action({ rawError: true, commit: 'setPaySystemStatus' })
  public async fetchPaySystemStatus (): Promise<ServiceStatus | null> {
    const response = await StatusService.getServiceStatus('PAYBC')
    return (response && response.data) || null
  }
}
