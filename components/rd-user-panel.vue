<template>
  <rd-panel
    class="rd-panel"
    :label="data.user ? 'Edit user' : 'Add user'"
    :state="panelState"
    :loading="loading"
    :action="data.user ? 'delete' : ''"
    @clicked="submit(true)"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="emailInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="passwordInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-select
          :input="roleInput"
          class="rd-panel-input"
          style="width: calc(100% - 2.75rem)"
        />
        <rd-input-button-small
          icon="plus"
          :disabled="!role"
          @clicked="addRole"
        />
      </div>
      <div v-if="rolesSelected.length" class="rd-panel-role-wrapper">
        <div
          v-for="role in rolesSelected"
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
        :disabled="!name || !email || !password || !role_id.length"
        :loading="submitLoading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { RoleResponse } from "types/role";
  import { UserRequest, UserResponse } from "types/user";
  import { InputOption } from "~~/types/general";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      user?: UserResponse;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { getUsers, createUser } = useUser();
  const { roles, getRoles } = useRole();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);
  const submitLoading = ref<boolean>(false);

  const rolesSelected = ref<RoleResponse[]>([]);

  const nameInput = ref<InputOption>({
    label: "User name",
    name: "name",
    model: "",
    placeholder: "Jane Doe",
  });
  const emailInput = ref<InputOption>({
    label: "User email",
    name: "email",
    model: "",
    type: "email",
    placeholder: "jane.doe@abc.com",
  });
  const passwordInput = ref<InputOption>({
    label: "User password",
    name: "password",
    model: "",
    type: "password",
    placeholder: "janedoe321",
  });
  const roleInput = ref<InputOption>({
    label: "User role",
    name: "role",
    model: "",
    placeholder: "Select at least one",
  });

  const name = computed<UserRequest["name"]>(() => nameInput.value.model);
  const email = computed<UserRequest["email"]>(() => emailInput.value.model);
  const password = computed<UserRequest["password"]>(
    () => passwordInput.value.model
  );
  const role = computed<string | undefined>(() => roleInput.value.value);
  const role_id = computed<string[]>(() =>
    rolesSelected.value.map((a) => a._id)
  );

  function addRole(): void {
    if (role.value) {
      const data = roles.value?.find((a) => a._id === role.value);
      if (data) {
        rolesSelected.value.push(data);

        roleInput.value.model = "";
        roleInput.value.value = "";
        roleInput.value.options = roles.value
          ?.filter(
            (a) =>
              !a.permission.includes("owner") &&
              rolesSelected.value.findIndex((b) => b._id === a._id) === -1
          )
          .map((a) => ({ name: a.name, value: a._id }));
      }
    }
  }
  function removeRole(_id: string): void {
    const index = rolesSelected.value.findIndex((a) => a._id === _id);
    if (index > -1) {
      rolesSelected.value.splice(index, 1);

      roleInput.value.options = roles.value
        ?.filter(
          (a) =>
            !a.permission.includes("owner") &&
            rolesSelected.value.findIndex((b) => b._id === a._id) === -1
        )
        .map((a) => ({ name: a.name, value: a._id }));
    }
  }
  async function submit(del?: boolean): Promise<void> {
    if (!submitLoading.value) {
      submitLoading.value = true;

      if (del && props.data.user) {
      } else {
        const payload = {
          request: {
            name: name.value,
            email: email.value,
            password: password.value,
            role_id: role_id.value,
          },
        };
        if (props.data.user) {
        } else {
          await createUser(payload);
        }
      }

      await getUsers();
      submitLoading.value = false;
      panelState.value = "hide";
    }
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(async () => {
    await getRoles();

    roleInput.value.options = roles.value
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
