<template>
  <rd-panel
    class="rd-panel"
    :label="data.role ? 'Edit role' : 'Add role'"
    :state="panelState"
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
        :disabled="!project || !name"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputOption, InputToggleOption } from "~~/types/general";
  import {
    ProjectRolePermission,
    ProjectRoleRequest,
    ProjectRoleResponse,
  } from "~~/types/project-role";

  type RolePermission = {
    kind: ProjectRolePermission;
    name: string;
    description: string;
    input: InputToggleOption;
  };

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
      role?: ProjectRoleResponse;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { project, createProjectRole, getProjectUsers, updateProjectRole } =
    useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const nameInput = ref<InputOption>({
    label: "Role name",
    name: "name",
    model: "",
    placeholder: "Project Manager",
  });

  const rolePermission = ref<RolePermission[]>([
    {
      kind: "get_roles",
      name: "See users",
      description: "See all users and roles available within this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "create_role",
      name: "Create user",
      description: "Create a user or a role for this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "update_role",
      name: "Update user",
      description: "Update a user or a role within this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "delete_role",
      name: "Delete user",
      description: "Delete a user or a role within this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "get_tasks",
      name: "See tasks",
      description: "See all tasks available within this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "create_task",
      name: "Create task",
      description: "Create a task for this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "update_task",
      name: "Update task",
      description: "Update a task within this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "delete_task",
      name: "Delete task",
      description: "Delete a task within this project.",
      input: {
        model: false,
      },
    },
    {
      kind: "create_report",
      name: "Create report",
      description: "Create reports (daily & incident report) for this project",
      input: {
        model: false,
      },
    },
  ]);

  const name = computed<ProjectRoleRequest["name"]>(
    () => nameInput.value.model
  );
  const permission = computed<ProjectRoleRequest["permission"]>(() => {
    const permissions = rolePermission.value
      .filter((a) => a.input.model)
      .map((a) => a.kind);
    if (permissions.includes("get_roles")) permissions.push("get_role");
    if (permissions.includes("get_tasks")) permissions.push("get_task");
    if (permissions.includes("create_report"))
      permissions.push("create_incident");
    return permissions;
  });

  async function submit(): Promise<void> {
    if (project.value) {
      loading.value = true;
      const payload = {
        request: { name: name.value, permission: permission.value },
        project_id: props.data.project_id,
        role_id: props.data.role?._id || "",
      };

      if (props.data.role) {
        await updateProjectRole(payload);
      } else {
        await createProjectRole(payload);
      }

      project.value.users = await getProjectUsers({
        _id: props.data.project_id,
      });

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
            role.permission.includes("get_role")) ||
          (a.kind === "get_tasks" &&
            role.permission.includes("get_tasks") &&
            role.permission.includes("get_task")) ||
          (a.kind === "create_report" &&
            role.permission.includes("create_report") &&
            role.permission.includes("create_incident")) ||
          (a.kind !== "get_roles" &&
            a.kind !== "get_tasks" &&
            a.kind !== "create_report" &&
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
    @media only screen and (max-width: 1024px) {
      .rd-panel-footer {
        height: 4rem;
        padding: 1rem;
      }
    }
  }
</style>
