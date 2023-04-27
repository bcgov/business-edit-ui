export interface Member {
  id: string
  membershipType: string
  membershipStatus: string
}

export interface Members {
  members: Member[]
}

export interface Count {
  count: number
}
