// NB: use native axios to pre-empt OPTIONS requests
// because Million Verifier doesn't support them
import axios from 'axios'

enum ResultCodes {
  OK = 'ok',
  CATCH_ALL = 'catch_all',
  UNKNOWN = 'unknown',
  ERROR = 'error',
  DISPOSABLE = 'disposable',
  INVALID = 'invalid'
}
/**
 * Class that provides integration with the Million Verifier API.
 * Ref: https://developer.millionverifier.com/
 */
export default class EmailVerificationService {
  /**
   * Verifies an email address in real time.
   * @param email the email address to verify
   * @param apiUrl the API URL for the Million Verifier API
   * @param apiKey the API key for the Million Verifier API
   * @param timeout the timeout for the Million Verifier API
   * @returns whether the email address is valid
   */
  static async isValidEmail (
    email: string,
    apiUrl = 'https://api.millionverifier.com/api/v3',
    apiKey = '8I3zB8yBzV3bWdFEclDrXD4I7',
    timeout = 5 // seconds
  ): Promise<boolean> {
    // safety checks
    if (!email) throw new Error('Email address is required')
    if (!apiUrl) throw new Error('API URL is required')
    if (!timeout) throw new Error('Timeout is required')

    // accept email if no API key is provided
    if (!apiKey) return Promise.resolve(true)

    let url = `${apiUrl}/`
    url += `?api=${apiKey}`
    url += `&email=${encodeURIComponent(email)}`
    url += `&timeout=${timeout}`

    return axios.get(url)
      .then(response => {
        const result = response?.data?.result
        if (!result) throw new Error('Invalid API response')
        // accept OK or UNKNOWN status
        return (result === ResultCodes.OK || result === ResultCodes.UNKNOWN)
      })
  }
}
