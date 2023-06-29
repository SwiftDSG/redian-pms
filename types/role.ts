export type RolePermission =
  'owner' |
  'get_users' |
  'get_user' |
  'create_user' |
  'delete_user' |
  'update_user' |
  'get_roles' |
  'get_role' |
  'create_role' |
  'delete_role' |
  'update_role' |
  'get_customers' |
  'get_customer' |
  'create_customer' |
  'delete_customer' |
  'update_customer' |
  'get_projects' |
  'get_project' |
  'create_project';

export interface Role {
  _id: string
  name: string
  permission: RolePermission[]
}
export interface RoleResponse {
  _id: string
  name: string
  permission: RolePermission[]
}

export interface RoleRequest {
  name: string
  permission: RolePermission[]
}