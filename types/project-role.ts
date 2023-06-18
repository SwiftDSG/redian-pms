export type ProjectRolePermission =
  'owner' |
  'get_roles' |
  'get_role' |
  'create_role' |
  'delete_role' |
  'update_role' |
  'get_tasks' |
  'get_task' |
  'create_task' |
  'update_task' |
  'create_report' |
  'create_incident';
export type ProjectRole = {
  _id: string;
  project_id: string;
  name: string;
  permission: ProjectRolePermission[];
}
export type ProjectRoleRequest = {
  name: string;
  permission: ProjectRolePermission[];
}
export type ProjectRoleResponse = {
  _id: string;
  name: string;
  permission: ProjectRolePermission[];
}
export type ProjectRoleQuery = {
  project_id: string;
}