import { ExistingToApiResolutionDates, FromApiResolutionDates, ToApiResolutionDates } from '@/utils/'

describe('Resolution dates utils', () => {
  it('converts new dates to API format', () => {
    expect(ToApiResolutionDates([])).toEqual([])
    expect(ToApiResolutionDates(null)).toEqual([])
    expect(ToApiResolutionDates(['2026-09-10', '2026-09-11']))
      .toEqual([{ date: '2026-09-10' }, { date: '2026-09-11' }])
  })

  it('converts existing resolutions to API format with ids', () => {
    expect(ExistingToApiResolutionDates([])).toEqual([])
    expect(ExistingToApiResolutionDates(null)).toEqual([])
    expect(ExistingToApiResolutionDates([
      { id: 5, date: '2020-01-05', type: 'SPECIAL', signingDate: '2020-01-06' }
    ])).toEqual([{ id: 5, date: '2020-01-05' }])
  })

  it('converts API dates (new format) to new dates only', () => {
    expect(FromApiResolutionDates(undefined)).toEqual([])
    expect(FromApiResolutionDates([])).toEqual([])
    expect(FromApiResolutionDates([
      { id: 5, date: '2020-01-05' },
      { date: '2026-09-10' }
    ])).toEqual(['2026-09-10'])
  })

  it('converts API dates (old format) to new dates', () => {
    expect(FromApiResolutionDates(['2026-09-10', '2026-09-11'])).toEqual(['2026-09-10', '2026-09-11'])
  })
})
