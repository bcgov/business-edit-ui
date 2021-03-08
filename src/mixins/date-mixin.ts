import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { isDate } from 'lodash'
import { CommonMixin } from '@/mixins'

/**
 * Mixin that provides some useful date utilities.
 */
@Component({})
export default class DateMixin extends Mixins(CommonMixin) {
  @Getter getCurrentJsDate!: Date
  @Getter getCurrentDate!: string
  readonly MS_IN_A_DAY = (1000 * 60 * 60 * 24)

  /**
   * Fetches and returns the web server's current date (in UTC).
   * Used to bypass the user's local clock/timezone.
   * Ref: https://www.npmjs.com/package/serverdate
   * @returns a promise to return a Date object
   */
  async getServerDate (): Promise<Date> {
    const input = window.location.origin
    const init: RequestInit = { cache: 'no-store', method: 'HEAD' }

    // don't call fetch() during Jest tests
    // because it's not defined
    if (this.isJestRunning) return new Date()

    const { headers, ok, statusText } = await fetch(input, init)

    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn('Unable to get server date - using browser date instead')
      // fall back to local date
      // NB: filing  may contain invalid dates/times
      return new Date()
    }

    return new Date(headers.get('Date'))
  }

  /**
   * Creates and returns a new Date object in UTC, given parameters in Pacific timezone.
   * (This works regardless of user's local clock/timezone.)
   * @example "2021, 0, 1, 0, 0" -> "2021-01-01T08:00:00.000Z"
   * @example "2021, 6, 1, 0, 0" -> "2021-07-01T07:00:00.000Z"
   */
  createUtcDate (year: number, month: number, day: number, hours: number = 0, minutes: number = 0): Date {
    // use date from server to create a new date in Pacific timezone
    // (this sets the correct tz offset in the new date)
    const date = new Date(this.getCurrentJsDate.toLocaleString('en-US', { timeZone: 'America/Vancouver' }))

    // update all date and time fields
    date.setFullYear(year, month, day)
    date.setHours(hours, minutes, 0, 0) // zero out seconds and milliseconds

    return date
  }

  /**
   * Converts a Date object to a date string (YYYY-MM-DD) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "2020-12-31"
   * @example "2021-01-01 08:00:00 GMT" -> "2021-01-01"
   * @example "2021-01-01 00:00:00 PST" -> "2021-01-01"
   * @example "2021-01-01 23:59:59 PST" -> "2021-01-01"
   */
  dateToDateString (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    const dateStr = date.toLocaleDateString('en-CA', {
      timeZone: 'America/Vancouver'
    })

    return dateStr
  }

  /**
   * Converts a Date object to a time string (HH:MM am/pm) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "11:00 pm"
   * @example "2021-01-01 08:00:00 GMT" -> "12:00 am"
   * @example "2021-01-01 00:00:00 PST" -> "12:00 am"
   * @example "2021-01-01 23:59:59 PST" -> "11:59 pm"
   */
  dateToTimeString (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    let timeStr = date.toLocaleTimeString('en-CA', {
      timeZone: 'America/Vancouver',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    })

    // replace a.m./p.m. with am/pm
    timeStr = timeStr.replace('a.m.', 'am').replace('p.m.', 'pm')

    return timeStr
  }

  /**
   * Converts a date string (YYYY-MM-DD) to a formatted date string (Month Day, Year).
   * @example "2020-01-01" -> "Jan 1, 2020"
   */
  formatDateString (dateStr: string): string {
    // safety check
    if (!dateStr) return null

    // create a Date object
    // then split into its components (in "absolute" time)
    // eg, "2020-01-01" -> "Wed, 01 Jan 2020 00:00:00 GMT"
    const date = new Date(dateStr)
    const [weekday, day, month, year, time, tz] = date.toUTCString().split(' ')

    // convert day to number so that "01" -> "1"
    return `${month} ${+day}, ${year}`
  }

  /**
   * Converts a Date object to a fully formatted data and time string
   * (Weekday Month DD, YYYY at HH:MM am/pm Pacific time).
   * @example "2020-10-27T18:45:00Z" -> "Tuesday, October 27, 2020 at 11:45 am Pacific time"
   */
  fullFormatDate (date: Date): string {
    // safety check
    if (!isDate(date) || isNaN(date.getTime())) return null

    let dateStr = date.toLocaleDateString('en-CA', {
      timeZone: 'America/Vancouver',
      weekday: 'long', // Tuesday
      month: 'long', // October
      day: 'numeric', // 27
      year: 'numeric' // 2020
    })

    let timeStr = date.toLocaleTimeString('en-CA', {
      timeZone: 'America/Vancouver',
      hour: 'numeric', // 11
      minute: '2-digit', // 45
      hour12: true // a.m./p.m.
    })

    // replace a.m./p.m. with am/pm
    timeStr = timeStr.replace('a.m.', 'am').replace('p.m.', 'pm')

    return `${dateStr} at ${timeStr} Pacific time`
  }

  /**
   * Converts an API datetime string to a date and time string (YYYY-MM-DD at HH:MM am/pm)
   * in Pacific timezone.
   * @example "2021-01-01T00:00:00.000000+00:00" -> "2020-12-31 at 04:00 pm" (PST example)
   * @example "2021-07-01T00:00:00.000000+00:00" -> "2021-06-30 at 05:00 pm" (PDT example)
   */
  apiToDateAndTimeString (dateString: string): string {
    if (!dateString) return null // safety check

    // convert to ISO format
    // then create a Date object
    // eg, 2021-03-04T04:41:00Z
    dateString = dateString.slice(0, 19) + 'Z'
    const utc = new Date(dateString)

    // build date string, eg, "2021-03-03"
    const dateStr = this.dateToDateString(utc)

    // build time string, eg, "8:41 pm"
    const timeStr = this.dateToTimeString(utc)

    return `${dateStr} at ${timeStr}`
  }

  /**
   * The number of days that 'date' is from today.
   * @returns -1 for yesterday
   * @returns 0 for today
   * @returns +1 for tomorrow
   * @returns NaN in case of error
   */
  daysFromToday (date: string): number {
    // safety check
    if (!date) return NaN

    // calculate difference between start of "today" and start of "date" (in local time)
    const todayLocalMs = new Date(this.getCurrentDate).setHours(0, 0, 0, 0)
    const dateLocalMs = new Date(date).setHours(0, 0, 0, 0)
    return Math.round((dateLocalMs - todayLocalMs) / this.MS_IN_A_DAY)
  }
}
