<template>
  <rd-panel
    class="rd-panel"
    :label="data.role ? 'Edit role' : 'Add role'"
    :state="panelState"
    :action="data.role ? 'delete' : ''"
    @clicked="submit(true)"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <label class="rd-panel-input-label rd-headline-6">Permissions</label>
      <div
        v-for="role in rolePermission"
        :key="role.kind"
        class="rd-panel-role"
      >
        <div class="rd-panel-role-header">
          <span class="rd-panel-role-name rd-headline-5">{{ role.name }}</span>
          <rd-input-toggle :input="role.input" />
        </div>
        <span class="rd-panel-role-description rd-caption-text">{{
          role.description
        }}</span>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="!name || !permission.length"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { RolePermission, RoleRequest, RoleResponse } from "types/role";
  import { InputOption, InputToggleOption } from "~~/types/general";

  type RolePermissionInput = {
    kind: RolePermission;
    name: string;
    description: string;
    input: InputToggleOption;
  };

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      role?: RoleResponse;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { getRoles, createRole, updateRole, deleteRole } = useRole();
  const { getUsers } = useUser();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const nameInput = ref<InputOption>({
    label: "Role name",
    name: "name",
    model: "",
    placeholder: "Project Manager",
  });

  const rolePermission = ref<RolePermissionInput[]>([
    {
      kind: "get_roles",
      name: "See users",
      description: "See all users and roles available.",
      input: {
        model: false,
      },
    },
    {
      kind: "create_role",
      name: "Create user",
      description: "Create a user or a role.",
      input: {
        model: false,
      },
    },
    {
      kind: "update_role",
      name: "Update user",
      description: "Update a user or a role.",
      input: {
        model: false,
      },
    },
    {
      kind: "delete_role",
      name: "Delete user",
      description: "Delete a user or a role.",
      input: {
        model: false,
      },
    },
    {
      kind: "get_customers",
      name: "See customers",
      description: "See all customers available.",
      input: {
        model: false,
      },
    },
    {
      kind: "create_customer",
      name: "Create customer",
      description: "Create a customer.",
      input: {
        model: false,
      },
    },
    {
      kind: "update_customer",
      name: "Update customer",
      description: "Update a customer.",
      input: {
        model: false,
      },
    },
    {
      kind: "delete_customer",
      name: "Delete customer",
      description: "Delete a customer.",
      input: {
        model: false,
      },
    },
    {
      kind: "get_projects",
      name: "See projects",
      description: "See all projects available.",
      input: {
        model: false,
      },
    },
    {
      kind: "create_project",
      name: "Create project",
      description: "Create a project.",
      input: {
        model: false,
      },
    },
  ]);

  const name = computed<RoleRequest["name"]>(() => nameInput.value.model);
  const permission = computed<RoleRequest["permission"]>(() => {
    const permissions = rolePermission.value
      .filter((a) => a.input.model)
      .map((a) => a.kind);
    if (permissions.includes("get_roles"))
      permissions.push("get_role", "get_users", "get_user");
    if (permissions.includes("create_role")) permissions.push("create_user");
    if (permissions.includes("update_role")) permissions.push("update_user");
    if (permissions.includes("delete_role")) permissions.push("delete_user");
    if (permissions.includes("get_customers")) permissions.push("get_customer");
    if (permissions.includes("get_projects")) permissions.push("get_project");
    return permissions;
  });

  async function submit(del?: boolean): Promise<void> {
    if (!loading.value) {
      loading.value = true;

      if (del && props.data.role) {
        await deleteRole({ role_id: props.data.role._id });
      } else {
        const payload = {
          role_id: "",
          request: {
            name: name.value,
            permission: permission.value,
          },
        };

        if (props.data.role) {
          payload.role_id = props.data.role._id;
          await updateRole(payload);
        } else {
          await createRole(payload);
        }
      }

      await getUsers();
      await getRoles();
      loading.value = false;
      panelState.value = "hide";
    }
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    const role = props.data.role;
    if (role) {
      nameInput.value.model = role.name;
      rolePermission.value = rolePermission.value.map((a) => {
        let permitted = false;
        if (
          (a.kind === "get_roles" &&
            role.permission.includes("get_roles") &&
            role.permission.includes("get_role") &&
            role.permission.includes("get_users") &&
            role.permission.includes("get_user")) ||
          (a.kind === "create_role" &&
            role.permission.includes("create_role") &&
            role.permission.includes("create_user")) ||
          (a.kind === "update_role" &&
            role.permission.includes("update_role") &&
            role.permission.includes("update_user")) ||
          (a.kind === "delete_role" &&
            role.permission.includes("delete_role") &&
            role.permission.includes("delete_user")) ||
          (a.kind === "get_customers" &&
            role.permission.includes("get_customers") &&
            role.permission.includes("get_customer")) ||
          (a.kind === "get_projects" &&
            role.permission.includes("get_projects") &&
            role.permission.includes("get_project")) ||
          (a.kind !== "get_roles" &&
            a.kind !== "create_role" &&
            a.kind !== "update_role" &&
            a.kind !== "delete_role" &&
            a.kind !== "get_customers" &&
            a.kind !== "get_projects" &&
            role.permission.includes(a.kind))
        ) {
          permitted = true;
        }

        return {
          ...a,
          input: {
            model: permitted,
          },
        };
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      width: 100%;
      display: flex;
      gap: 1rem;
      flex-direction: column;
      label.rd-panel-input-label {
        position: relative;
        width: 100%;
        height: 1rem;
        margin-bottom: -1rem;
        display: flex;
        color: var(--font-main-color);
        opacity: 0.5;
        align-items: center;
      }
      .rd-panel-role {
        position: relative;
        width: 100%;
        border-radius: 0.75rem;
        border: var(--border);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        .rd-panel-role-header {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        &:last-child {
          margin-bottom: 6rem;
        }
      }
    }
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      background: var(--background-depth-one-color);
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .rd-panel-button {
        width: 100%;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
      }
    }
  }
</style>
