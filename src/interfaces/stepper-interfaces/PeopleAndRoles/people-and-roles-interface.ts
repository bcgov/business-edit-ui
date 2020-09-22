import { OrgPersonIF } from '@/interfaces'

export interface PeopleAndRolesIF {
    valid: boolean
    changed: boolean
    orgPeople: OrgPersonIF[]
}
