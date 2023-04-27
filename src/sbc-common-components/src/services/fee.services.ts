import Axios from 'axios'
import { Fee, FilingData, PayData } from '../models'
import ConfigHelper from '../util/config-helper'
import { SessionStorageKeys } from '../util/constants'

// sample Microcks URLs =
//   https://mock-lear-tools.pathfinder.gov.bc.ca/rest/SBC+Pay+API+Reference/1.0.1/api/v1/fees/CP/OTANN
//   https://mock-lear-tools.pathfinder.gov.bc.ca/rest/SBC+Pay+API+Reference/1.0.1/api/v1/fees/CP/OTADD
const API_URL = 'https://pay-api-dev.pathfinder.gov.bc.ca/api/v1/fees'

export default {
  getFee (filingData: FilingData[], payApiUrl: string) : Promise<Fee[]> {
    const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken)
    const accountId = JSON.parse(ConfigHelper.getFromSession(SessionStorageKeys.CurrentAccount) || '{}').id || 0

    if (filingData.length < 1) {
      Promise.resolve()
    }

    const promises = []
    for (const filing of filingData) {
      if (!filing.filingTypeCode) {
        Promise.resolve()
      }
      let url = prepareUrl(filing, payApiUrl)
      promises.push(Axios.get(url, { headers: { Authorization: `Bearer ${token}`, 'Account-Id': accountId } }))
    }

    return Axios.all(promises)
      .then(Axios.spread((...args) => {
        // customise the response here
        return args
          .map(response => response.data as PayData)
          .map(data => {
            const filingDatum = filingData.find(fd => fd.filingTypeCode === data.filingTypeCode)
            // default the title if client hasn't passed this on
            const filingType = (filingDatum && filingDatum.filingDescription) ? filingDatum.filingDescription : data.filingType
            const fee = data.filingFees
            const priorityFees = (data.priorityFees) || 0
            const futureEffectiveFees = (data.futureEffectiveFees) || 0
            const serviceFees = (data.serviceFees) || 0
            const total = (data.total) || 0
            return { fee, filingType, priorityFees, futureEffectiveFees, serviceFees, total } as Fee
          })
      }))
      .catch(error => {
        switch (error.response && error.response.status) {
          case 400:
            // eslint-disable-next-line no-console
            console.log('%c FeeModule-ERROR: Probably fee code mismatch %s', 'color: red; font-size: 13px',
              JSON.stringify(filingData))
            break
          case 500:
            // eslint-disable-next-line no-console
            console.log('%c FeeModule-ERROR: Probably invalid Token %s', 'color: red; font-size: 13px',
              JSON.stringify(filingData))
            break
          default:
            // eslint-disable-next-line no-console
            console.log('%c FeeModule-ERROR: Probably unknown Error %s', 'color: red; font-size: 13px',
              JSON.stringify(filingData))
        }
        return []
      })
  }
}

const prepareUrl = (filing: FilingData, payApiUrl: string) => {
  let queryParams = []
  if (filing.waiveFees) {
    queryParams.push(`waiveFees=${!!filing.waiveFees}`)
  }
  if (filing.priority) {
    queryParams.push(`priority=${!!filing.priority}`)
  }
  if (filing.futureEffective) {
    queryParams.push(`futureEffective=${!!filing.futureEffective}`)
  }
  let url = `${payApiUrl}fees/${filing.entityType}/${filing.filingTypeCode}`
  if (queryParams.length) {
    url += `?${queryParams.join('&')}`
  }
  return url
}
