/* Used for rules and memorandum file uploads + confirmation. */
export interface RulesMemorandumIF {
  // name, lastModified and size are populated via the standard File object
  // https://developer.mozilla.org/en-US/docs/Web/API/File
  name?: string
  // A number that represents the number of milliseconds since the Unix epoch
  lastModified?: number
  size?: number
  key?: string
  confirmed?: boolean
  valid?: boolean
  url?: string
  previouslyInResolution?: boolean
  includedInResolution?: boolean,
  uploaded?: string
}
