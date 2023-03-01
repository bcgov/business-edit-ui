import { CommonMixin } from '@/mixins/'
import Vue from 'vue'
import DateUtilities from '@/services/date-utilities'
import { Component } from 'vue-property-decorator'

/**
 * Mixin that provides some useful date utilities.
 */
@Component({
  mixins: [
    CommonMixin
  ]
})
export default class DateMixin extends Vue {
  /**
   * DEPRECATED Fetches and returns the web server's current date (in UTC).
   * Used to bypass the user's local clock/timezone.
   * Ref: https://www.npmjs.com/package/serverdate
   * @returns a promise to return a Date object
   */
  async getServerDate (): Promise<Date> {
    return DateUtilities.getServerDate()
  }

  /**
   * DEPRECATED Creates and returns a new Date object in UTC, given parameters in Pacific timezone.
   * (This works regardless of user's local clock/timezone.)
   * @example "2021, 0, 1, 0, 0" -> "2021-01-01T08:00:00.000Z" (Pacific Standard Time)
   * @example "2021, 6, 1, 0, 0" -> "2021-07-01T07:00:00.000Z" (Pacific Daylight Time)
   */
  createUtcDate (
    year: number, month: number, day: number, hours = 0, minutes = 0, milliseconds = 0
  ): Date {
    return DateUtilities.createUtcDate(year, month, day, hours, minutes, milliseconds)
  }

  /**
   * DEPRECATED Converts a date string (YYYY-MM-DD) to a Date object at 12:00:00 am Pacific time.
   * @example 2021-11-22 -> 2021-11-22T08:00:00.00Z
   */
  yyyyMmDdToDate (dateStr: string): Date {
    return DateUtilities.yyyyMmDdToDate(dateStr)
  }

  /**
   * DEPRECATED Converts a date string (MMM dd, yyyy) to a Date object at 12:00:00 am Pacific time.
   * @example September 5, 2022 -> 2022-09-05T07:00:00.00Z
   */
  mmmDdYyyyToDate (dateStr: string): Date {
    return DateUtilities.mmmDdYyyyToDate(dateStr)
  }

  /**
   * DEPRECATED Converts a Date object to a date string (YYYY-MM-DD) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "2020-12-31"
   * @example "2021-01-01 08:00:00 GMT" -> "2021-01-01"
   */
  dateToYyyyMmDd (date: Date): string {
    return DateUtilities.dateToYyyyMmDd(date)
  }

  /**
   * DEPRECATED Converts a date string (YYYY-MM-DD) to a date string (Month Day, Year) in Pacific timezone.
   * @param dateStr
   * @param longMonth whether to show long month name (eg, December vs Dec)
   * @param showWeekday whether to show the weekday name (eg, Thursday)
   * @example "2021-01-01" -> "Thursday, December 31, 2020"
   */
  yyyyMmDdToPacificDate (dateStr: string, longMonth = false, showWeekday = false): string {
    return DateUtilities.yyyyMmDdToPacificDate(dateStr, longMonth, showWeekday)
  }

  /**
   * DEPRECATED Converts a Date object to a date string (Month Day, Year) in Pacific timezone.
   * @param date
   * @param longMonth whether to show long month name (eg, December vs Dec)
   * @param showWeekday whether to show the weekday name (eg, Thursday)
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021"
   */
  dateToPacificDate (date: Date, longMonth = false, showWeekday = false): string {
    return DateUtilities.dateToPacificDate(date, longMonth, showWeekday)
  }

  /**
   * DEPRECATED Converts a Date object to a time string (HH:MM am/pm) in Pacific timezone.
   * @example "2021-01-01 07:00:00 GMT" -> "11:00 pm"
   * @example "2021-01-01 08:00:00 GMT" -> "12:00 am"
   */
  dateToPacificTime (date: Date): string {
    return DateUtilities.dateToPacificTime(date)
  }

  /**
   * DEPRECATED Converts a Date object to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01 07:00:00 GMT" -> "Dec 31, 2020 at 11:00 pm Pacific time"
   * @example "2021-01-01 08:00:00 GMT" -> "Jan 1, 2021 at 12:00 pm Pacific time"
   */
  dateToPacificDateTime (date: Date): string {
    return DateUtilities.dateToPacificDateTime(date)
  }

  /**
   * DEPRECATED Converts an API datetime string (in UTC) to an ISO datetime string.
   * @example 2021-08-05T16:56:50+00:00 -> 2021-08-05T16:56:50Z
   */
  apiToIso (dateTimeString: string): string {
    return DateUtilities.apiToIso(dateTimeString)
  }

  /**
   * DEPRECATED Converts an API datetime string (in UTC) to a Date object.
   * @example 2021-08-05T16:56:50.783101+00:00 -> 2021-08-05T16:56:50Z
   */
  apiToDate (dateTimeString: string): Date {
    return DateUtilities.apiToDate(dateTimeString)
  }

  /**
   * DEPRECATED Converts an API datetime string (in UTC) to a date and time string (Month Day, Year at HH:MM am/pm
   * Pacific time).
   * @example "2021-01-01T00:00:00.000000+00:00" -> "December 31, 2020 at 04:00 pm Pacific time" (PST example)
   * @example "2021-07-01T00:00:00.000000+00:00" -> "June 30, 2021 at 05:00 pm Pacific time" (PDT example)
   */
  apiToPacificDateTime (dateTimeString: string): string {
    return DateUtilities.apiToPacificDateTime(dateTimeString)
  }

  /**
   * DEPRECATED Converts an API datetime string (in UTC) to a date string (Month Day, Year).
   * @example "2021-01-01T00:00:00.000000+00:00" -> "December 31, 2020"
   */
  apiToPacificDateLong (dateTimeString: string): string {
    return DateUtilities.apiToPacificDateLong(dateTimeString)
  }

  /**
   * DEPRECATED Converts a Date object to an API datetime string (in UTC).
   * @example 2021-08-05T16:56:50Z -> 2021-08-05T16:56:50+00:00
   */
  dateToApi (date: Date): string {
    return DateUtilities.dateToApi(date)
  }
}
