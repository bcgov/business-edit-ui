import { BusinessLookupResultIF } from '@/interfaces'
import { AxiosInstance as axios } from '@/utils/'

/**
 * Class that provides integration with the BusinessLookup API.
 */
export default class BusinessLookupServices {
  /** The Registries Search API URL, from session storage. */
  static get searchApiUrl (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')
  }

  /** The Registries Search API Key, from session storage. */
  static get searchApiKey (): string {
    return sessionStorage.getItem('REGISTRIES_SEARCH_API_KEY')
  }

  /** The Account ID, from session storage. */
  static get accountId (): string {
    // if we can't get account id from ACCOUNT_ID
    // then try to get it from CURRENT_ACCOUNT
    let accountId: string = sessionStorage.getItem('ACCOUNT_ID')
    if (!accountId) {
      const currentAccount = sessionStorage.getItem('CURRENT_ACCOUNT')
      accountId = JSON.parse(currentAccount)?.id
    }
    return accountId
  }

  /**
   * Searches for business by code or words.
   * @param query code or words to search
   * @param status status to match (ACTIVE or HISTORICAL or '' to match all statuses)
   * @returns a promise to return the search results
   */
  static async search (query: string, status: string): Promise<BusinessLookupResultIF[]> {
    const legalType = 'BC,A,ULC,C,S,XP,GP,LP,CUL,XS,LLC,LL,BEN,CP,CC,XL,FI,XCP,PA'

    let url = this.searchApiUrl + 'businesses/search/facets?start=0&rows=20'
    url += `&categories=legalType:${legalType}${status ? '::status:' + status : ''}`
    url += `&query=value:${encodeURIComponent(query)}`

    return axios.get(url, {
      headers: {
        'x-apikey': this.searchApiKey,
        'Account-Id': this.accountId
      }
    }).then(response => {
      const results: Array<BusinessLookupResultIF> = response?.data?.searchResults?.results
      if (!results) {
        throw new Error('Invalid API response')
      }

      // filter out results without a valid identifier
      return results.filter(result => {
        const pattern = /^[A-Z]{1,3}[0-9]{7}$/
        return pattern.test(result.identifier)
      })
    })
  }
}
