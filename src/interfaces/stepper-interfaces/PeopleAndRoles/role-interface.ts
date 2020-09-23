import { Roles } from '@/enums'

export interface RoleIF {
  roleType: Roles;
  appointmentDate?: string;
  cessationDate?: string;
}
