import { OrgPersonIF } from '@/interfaces'

export interface PeopleAndRoleIF {
    valid: boolean
    changed: boolean
    orgPeople: OrgPersonIF[]
}
