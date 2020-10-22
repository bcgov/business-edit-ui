import { RoleTypes } from '@/enums'

export interface RoleIF {
  roleType: RoleTypes;
  appointmentDate?: string;
  cessationDate?: string;
}
