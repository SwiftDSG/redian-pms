import { RoleResponse, RoleRequest, RolePermission } from "~~/types/role";

export default () => {
  const { $fetch } = useNuxtApp();
  const { user } = useUser()
  const config = useRuntimeConfig();

  const roles = useState<RoleResponse[] | null>("customer", () => null);

  function validate(permit: RolePermission): boolean {
    if (!user.value) return false
    for (const role of user.value.role) {
      if (role.permission.includes(permit) || role.permission.includes('owner')) return true
    }
    return false
  }
  async function getRoles(): Promise<RoleResponse[]> {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/roles`, 'get')

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      roles.value = result;

      return result;
    } catch {
      return []
    }
  }
  async function createRole(payload: {
    request: RoleRequest
  }): Promise<string> {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/roles`, 'post', JSON.stringify(payload.request))

      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      roles.value = result;

      return result;
    } catch {
      return ''
    }
  }
  async function updateRole(payload: {
    role_id: string,
    request: RoleRequest
  }): Promise<string> {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/roles/${payload.role_id}`, 'put', JSON.stringify(payload.request))

      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch {
      return ''
    }
  }
  async function deleteRole(payload: {
    role_id: string
  }): Promise<string> {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/roles/${payload.role_id}`, 'delete')

      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch {
      return ''
    }
  }

  return { roles, validate, getRoles, createRole, updateRole, deleteRole }
};
