import { RoleTypes, RoleClass } from '@/enums/'

export interface RoleIF {
  roleType?: RoleTypes;
  roleClass?: RoleClass;
  appointmentDate?: string;
  cessationDate?: string;
}
