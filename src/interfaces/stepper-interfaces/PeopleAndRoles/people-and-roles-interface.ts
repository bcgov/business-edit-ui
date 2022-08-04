import { OrgPersonIF } from '@/interfaces/'

export interface PeopleAndRolesIF {
  changed: boolean // FUTURE: change to a getter like the others
  orgPeople: OrgPersonIF[]
}
