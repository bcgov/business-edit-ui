import { isDate } from 'lodash'

export default class DateUtilities {
  /**
   * Fetches and returns the web server's current date (in UTC).
   * Used to bypass the user's local clock/timezone.
   * Ref: https://www.npmjs.com/package/serverdate
   * @returns a promise to return a Date object
   */
  static async getServerDate (): Promise<Date> {
    const input = `${window.location.origin}${import.meta.env.VUE_APP_PATH}`
    const init: RequestInit = { cache: 'no-store', method: 'HEAD' }

    // don't call fetch() during Vitest tests
    // because it's not defined
    if (import.meta.env.VITEST !== undefined) return new Date()

    try {
      const { headers, ok, statusText } = await fetch(input, init)
      if (!ok) throw new Error(statusText)
      return new Date(headers.get('Date'))
    } catch {
      // eslint-disable-next-line no-console
      console.warn('Unable to get server date - using browser date instead')
      // fall back to local date
      // NB: new filings may contain invalid date/time
      return new Date()
    }
  }

  /**
   * Creates and returns a new Date object in UTC, given parameters in Pacific timezone.
   * (This works regardless of user's local clock/timezone.)
   * @example "2021, 0, 1, 0, 0" -> "2021-01-01T08:00:00.000Z" (Pacific Standard Time)
   * @example "2021, 6, 1, 0, 0" -> "2021-07-01T07:00:00.000Z" (Pacific Daylight Time)
   */
  static createUtcDate (
    year: number, month: number, day: number, hours = 0, minutes = 0, milliseconds = 0
  ): Date {
    // 1. create the new date in UTC
    // 2. compute the offset between UTC and Pacific timezone
    // 3. add the offset to convert the date to Pacific timezone
    // Ref: https://stackoverflow.com/questions/15141762/
    const date = new Date(Date.UTC(year, month, day, hours, minutes, milliseconds))
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Vancouver' }))
    const offset = utcDate.getTime() - tzDate.getTime()
    date.setTime(date.getTime() + offset)

    return date
  }

  /**
   * Converts a date string (YYYY-MM-DD) to a Date object at 12:00:00 am Pacific time.
   * @example 2021-11-22 -> 2021-11-22T08:00:00.00Z
   */
  static yyyyMmDdToDate (dateStr: string): Date {
    // safety checks
    if (!dateStr) return null
    if (dateStr.length !== 10) return null

    const split = dateStr.split('-')
    const year = +split[0]
    const month = +split[1]
    const day = +split[2]

    // use the date fields to create date object
    return this.createUtcDate(year, (month - 1), day)
  }

  /**
   * Converts a date string (MMM dd, yyyy) to a Date object at 12:00:00 am Pacific time.
   * @example September 5, 2022 -> 2022-09-05T07:00:00.00Z
   */
  static mmmDdYyyyToDate (dateStr: string): Date {
    // safety check
    if (!dateStr) return null

    // build date as 00:00 UTC
    const utcDate = new Date(dateStr + ' 00:00 UTC')

    // use the UTC date fields to create date object
    return this.createUtcDate(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate())
  }

  /**
   * Converts a Date object to a date string (YYYY-MM-DD) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "2020-12-31"
   * @example "2021-01-01 08:00:00 GMT" -> "2021-01-01"
   */
  static dateToYyyyMmDd (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // NB: some versions of Node have only en-US locale
    // so use that and convert results accordingly
    const dateStr = date.toLocaleDateString('en-US', {
      timeZone: 'America/Vancouver',
      month: 'numeric', // 12
      day: 'numeric', // 31
      year: 'numeric' // 2020
    })

    // convert mm/dd/yyyy to yyyy-mm-dd
    // and make sure month and day are 2 digits (eg, 03)
    const [ mm, dd, yyyy ] = dateStr.split('/')
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }

  /**
   * Converts a date string (YYYY-MM-DD) to a date string (Month Day, Year) in Pacific timezone.
   * @param dateStr
   * @param longMonth whether to show long month name (eg, December vs Dec)
   * @param showWeekday whether to show the weekday name (eg, Thursday)
   * @example "2021-01-01" -> "Thursday, December 31, 2020"
   */
  static yyyyMmDdToPacificDate (dateStr: string, longMonth = false, showWeekday = false): string {
    return this.dateToPacificDate(this.yyyyMmDdToDate(dateStr), longMonth, showWeekday)
  }

  /**
   * Converts a Date object to a date string (Month Day, Year) in Pacific timezone.
   * @param date
   * @param longMonth whether to show long month name (eg, December vs Dec)
   * @param showWeekday whether to show the weekday name (eg, Thursday)
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021"
   */
  static dateToPacificDate (date: Date, longMonth = false, showWeekday = false): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // NB: some versions of Node have only en-US locale
    // so use that and convert results accordingly
    let dateStr = date.toLocaleDateString('en-US', {
      timeZone: 'America/Vancouver',
      weekday: showWeekday ? 'long' : undefined, // Thursday or nothing
      month: longMonth ? 'long' : 'short', // December or Dec
      day: 'numeric', // 31
      year: 'numeric' // 2020
    })

    // remove period after month
    dateStr = dateStr.replace('.', '')

    return dateStr
  }

  /**
   * Converts a Date object to a time string (HH:MM am/pm) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "11:00 pm"
   * @example "2021-01-01 08:00:00 GMT" -> "12:00 am"
   */
  static dateToPacificTime (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // NB: some versions of Node have only en-US locale
    // so use that and convert results accordingly
    let timeStr = date.toLocaleTimeString('en-US', {
      timeZone: 'America/Vancouver',
      hour: 'numeric', // 11
      minute: '2-digit', // 00
      hour12: true // a.m./p.m.
    })

    // replace AM with am and PM with pm
    timeStr = timeStr.replace('AM', 'am').replace('PM', 'pm')

    return timeStr
  }

  /**
   * Converts a Date object to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020 at 11:00 pm Pacific time"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021 at 12:00 pm Pacific time"
   */
  static dateToPacificDateTime (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    const dateStr = this.dateToPacificDate(date, true)
    const timeStr = this.dateToPacificTime(date)

    return `${dateStr} at ${timeStr} Pacific time`
  }

  /**
   * Converts an API datetime string (in UTC) to an ISO datetime string.
   * @example 2021-08-05T16:56:50+00:00 -> 2021-08-05T16:56:50Z
   */
  static apiToIso (dateTimeString: string): string {
    if (!dateTimeString) return null // safety check

    // chop off the milliseconds and UTC offset and append "Zulu" timezone abbreviation
    return dateTimeString.slice(0, 19) + 'Z'
  }

  /**
   * Converts an API datetime string (in UTC) to a Date object.
   * @example 2021-08-05T16:56:50.783101+00:00 -> 2021-08-05T16:56:50Z
   */
  static apiToDate (dateTimeString: string): Date {
    if (!dateTimeString) return null // safety check

    return new Date(this.apiToIso(dateTimeString))
  }

  /**
   * Converts an API datetime string (in UTC) to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01T00:00:00.000000+00:00" -> "December 31, 2020 at 04:00 pm Pacific time" (PST example)
   * @example "2021-07-01T00:00:00.000000+00:00" -> "June 30, 2021 at 05:00 pm Pacific time" (PDT example)
   */
  static apiToPacificDateTime (dateTimeString: string): string {
    if (!dateTimeString) return null // safety check

    const date = this.apiToDate(dateTimeString)

    return this.dateToPacificDateTime(date)
  }

  /**
   * Converts an API datetime string (in UTC) to a date string (Month Day, Year).
   * @example "2021-01-01T00:00:00.000000+00:00" -> "December 31, 2020"
   */
  static apiToPacificDateLong (dateTimeString: string): string {
    if (!dateTimeString) return null // safety check

    const date = this.apiToDate(dateTimeString)
    return this.dateToPacificDate(date, true)
  }

  /**
   * Converts a Date object to an API datetime string (in UTC).
   * @example 2021-08-05T16:56:50Z -> 2021-08-05T16:56:50+00:00
   */
  static dateToApi (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    // replace "Zulu" timezone abbreviation with UTC offset
    return date.toISOString().replace('Z', '+00:00')
  }

  /**
   * Returns the number of months remaining when given an expiry date string
   * like this: monthDiffToToday('2023-12-31')
   * if needed, today's date can be passed as the second parameter
   */
  static monthDiffToToday (dateToStr: string, dateFrom = new Date()): number {
    const dateTo = this.mmmDdYyyyToDate(dateToStr)
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  /**
   * Add a number of months to a date and return "YYYY-MM-DD".
   * @param months the number of months to add
   * @param dateStr the date to add months to, in "YYYY-MM-DD" format
   * @example (3, 2023-02-03) -> "2023-05-03"
   * @example (18, 2023-02-03) -> "2024-08-03"
   */
  static addMonthsToDate (months = 0, dateStr: string): string {
    const date = dateStr ? this.yyyyMmDdToDate(dateStr) : new Date()
    date.setMonth(date.getMonth() + months)
    return this.dateToYyyyMmDd(date)
  }

  /**
   * Subtract a number of months from a date and return "YYYY-MM-DD".
   * @param months the number of months to subtract
   * @param dateStr the date to subtract months from, in "YYYY-MM-DD" format
   * @example (3, 2023-05-03) -> "2023-02-03"
   * @example (18, 2024-08-03) -> "2023-02-03"
   */
  static subtractMonthsFromDate (months = 0, dateStr: string): string {
    const date = dateStr ? this.yyyyMmDdToDate(dateStr) : new Date()
    date.setMonth(date.getMonth() - months)
    return this.dateToYyyyMmDd(date)
  }

  /**
   * Subtract one date from another and return number of months they differ by.
   * Dates must be in the "YYYY-MM-DD" format.
   * @example (2023-02-03, 2024-08-03) -> 18
   * @example (2023-02-03, 2023-04-03) -> 2
   * @example (2023-02-03, 2023-02-03) -> 0
   */
  static subtractDates (dateFrom: string, dateTo: string): number {
    const startDate = dateFrom ? this.yyyyMmDdToDate(dateFrom) : new Date()
    const endDate = dateTo ? this.yyyyMmDdToDate(dateTo) : new Date()
    const monthDiff = endDate.getMonth() - startDate.getMonth()
    const yearDiff = (12 * (endDate.getFullYear() - startDate.getFullYear()))
    let difference = monthDiff + yearDiff // in months
    /**
     * Add 25 days to the end date to properly compare only if the day difference is large.
     * @example Jan 31st and March 1st, month difference is 2 but since 26 < 31, we subtract 1.
     * @example Jan 16th and March 15th, month difference is 2 but since 16 + 25 < 31, we don't subtract 1.
     */
    if ((endDate.getDate() + 25) < startDate.getDate()) {
      difference--
    }
    return difference
  }
}
