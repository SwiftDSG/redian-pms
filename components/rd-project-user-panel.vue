<template>
  <rd-panel
    class="rd-panel"
    label="Add member"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-select :input="kindInput" class="rd-panel-input" />
      </div>
      <div v-if="kind === 'support'" class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <div v-else class="rd-panel-input-wrapper">
        <rd-input-select :input="userInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-select
          :input="roleInput"
          class="rd-panel-input"
          style="width: calc(100% - 2.75rem)"
        />
        <rd-input-button-small
          icon="plus"
          type="primary"
          @clicked="addRole"
          :disabled="!role"
        />
      </div>
      <div class="rd-panel-role-wrapper">
        <div
          v-for="role in roles"
          :key="role._id"
          class="rd-panel-role"
          @click="removeRole(role._id)"
        >
          <span class="rd-panel-role-name rd-headline-5">{{ role.name }}</span>
          <rd-svg class="rd-panel-role-icon" name="close" />
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="
          (kind === 'support' && !name) ||
          (kind !== 'support' && !_id) ||
          !role_id?.length
        "
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputGeneric, InputOption } from "~~/types/general";
  import { ProjectMemberKind, ProjectMemberRequest } from "~~/types/project";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { project, getProjectUsers, addProjectMember } = useProject();
  const { users, getUsers } = useUser();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);
  const roles = ref<{ _id: string; name: string }[]>([]);

  const kindInput = ref<InputGeneric<ProjectMemberKind>>({
    label: "Member type",
    name: "kind",
    model: "",
    placeholder: "Pick one",
    options: [
      {
        name: "Indirect",
        value: "indirect",
      },
      {
        name: "Direct",
        value: "direct",
      },
      {
        name: "Support",
        value: "support",
      },
    ],
  });
  const nameInput = ref<InputOption>({
    label: "Member name",
    name: "name",
    model: "",
    placeholder: "John Doe",
  });
  const userInput = ref<InputOption>({
    label: "Member",
    name: "user",
    model: "",
    placeholder: "Select user",
    options: [],
  });
  const roleInput = ref<InputOption>({
    label: "Role",
    name: "role",
    model: "",
    placeholder: "Select role",
    options: [],
  });

  const kind = computed<ProjectMemberRequest["kind"] | undefined>(
    () => kindInput.value.value
  );
  const name = computed<ProjectMemberRequest["name"]>(
    () => nameInput.value.model
  );
  const _id = computed<ProjectMemberRequest["_id"]>(
    () => userInput.value.value
  );
  const role_id = computed<ProjectMemberRequest["role_id"]>(() =>
    roles.value.map((a) => a._id)
  );
  const role = computed<{ _id: string; name: string } | null>(() =>
    roleInput.value.value
      ? {
          _id: roleInput.value.value,
          name: roleInput.value.model,
        }
      : null
  );

  async function submit(): Promise<void> {
    if (project.value && kind.value) {
      loading.value = true;

      const payload = {
        project_id: props.data.project_id,
        request: {
          _id: _id.value,
          name: name.value,
          kind: kind.value,
          role_id: role_id.value,
        },
      };

      await addProjectMember(payload);

      project.value.users = await getProjectUsers({
        _id: props.data.project_id,
      });

      loading.value = false;
      panelState.value = "hide";
    }
  }
  function addRole() {
    if (role.value) {
      roles.value.push(role.value);
      roleInput.value.model = "";
      roleInput.value.value = "";
      roleInput.value.options = project.value.users?.role
        ?.filter(
          (a) =>
            !a.permission.includes("owner") &&
            roles.value.findIndex((b) => b._id === a._id) === -1
        )
        .map((a) => ({ name: a.name, value: a._id }));
    }
  }
  function removeRole(_id: string) {
    const index = roles.value.findIndex((a) => a._id === _id);
    if (index > -1) {
      roles.value.splice(index, 1);
    }
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(async () => {
    users.value = await getUsers();
    project.value.users = await getProjectUsers({ _id: props.data.project_id });

    userInput.value.options = users.value
      .filter(
        (a) =>
          (project.value.users?.user || []).findIndex(
            (b) => b._id === a._id
          ) === -1
      )
      .map((a) => ({ name: a.name, value: a._id }));
    roleInput.value.options = project.value.users?.role
      ?.filter((a) => !a.permission.includes("owner"))
      .map((a) => ({ name: a.name, value: a._id }));

    setTimeout(() => {
      loading.value = false;
    }, 500);
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
      .rd-panel-input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        gap: 0.75rem;
        align-items: flex-end;
        .rd-panel-input {
          position: relative;
          width: 100%;
        }
      }
      .rd-panel-role-wrapper {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        .rd-panel-role {
          cursor: pointer;
          position: relative;
          height: 1.5rem;
          border-radius: 0.75rem;
          border: var(--border);
          padding: 0 0.5rem 0 0.75rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          * {
            pointer-events: none;
          }
          .rd-panel-role-icon {
            position: relative;
            width: 0.75rem;
            height: 0.75rem;
            margin-left: 0.5rem;
          }
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
