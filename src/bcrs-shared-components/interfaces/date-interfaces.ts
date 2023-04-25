/**
 * ISO date string (YYYY-MM-DD), assumed to be in Pacific timezone.
 * @example "2021-12-31"
 */
export type IsoDatePacific = string

/**
  * API date-time string (YYYY-MM-DDTHH:MM:SS[.MMMMMM]+00.00), assumed to be in UTC.
  * @example "2022-05-09T16:26:14.839032+00:00"
  */
export type ApiDateTimeUtc = string

/**
  * Formatted date-time string with explicit GMT timezone (ie, UTC).
  * @example "Tue, 19 Apr 2022 16:40:18 GMT"
  */
export type FormattedDateTimeGmt = string
