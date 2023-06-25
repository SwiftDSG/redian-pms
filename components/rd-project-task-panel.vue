<template>
  <rd-panel
    class="rd-panel"
    :label="task?.name || data.task_id"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div v-if="task" class="rd-panel-body">
      <div class="rd-panel-fieldset">
        <div class="rd-panel-fieldset-header">
          <span class="rd-panel-fieldset-name rd-headline-4"
            >General information</span
          >
          <div class="rd-panel-fieldset-icon-container">
            <rd-svg class="rd-panel-fieldset-icon" name="information" />
          </div>
        </div>
        <div class="rd-panel-fieldset-detail">
          <span class="rd-panel-fieldset-placeholder rd-caption-text"
            >Index value</span
          >
          <span class="rd-panel-fieldset-value rd-headline-5">{{
            `${task.value}%`
          }}</span>
        </div>
        <div class="rd-panel-fieldset-detail">
          <span class="rd-panel-fieldset-placeholder rd-caption-text"
            >Stage</span
          >
          <span class="rd-panel-fieldset-value rd-headline-5">{{
            task.area.name
          }}</span>
        </div>
        <div class="rd-panel-fieldset-detail">
          <span class="rd-panel-fieldset-placeholder rd-caption-text"
            >Status</span
          >
          <span class="rd-panel-fieldset-value rd-headline-5">{{
            getStatus(task.status[0].kind)
          }}</span>
        </div>
        <div v-if="task.volume" class="rd-panel-fieldset-detail">
          <span class="rd-panel-fieldset-placeholder rd-caption-text"
            >Volume</span
          >
          <span class="rd-panel-fieldset-value rd-headline-5">{{
            `${task.volume?.value} ${task.volume?.unit}`
          }}</span>
        </div>
        <div
          v-if="task.description"
          class="rd-panel-fieldset-detail"
          style="width: 100%"
        >
          <span class="rd-panel-fieldset-placeholder rd-caption-text"
            >Description</span
          >
          <span class="rd-panel-fieldset-value rd-headline-5">{{
            task.description
          }}</span>
        </div>
      </div>
      <div
        v-if="
          (!task.task?.length && task.status[0].kind === 'pending') ||
          (task.user?.length && task.status[0].kind !== 'pending')
        "
        class="rd-panel-fieldset"
      >
        <div class="rd-panel-fieldset-header">
          <span class="rd-panel-fieldset-name rd-headline-4"
            >Collaborators</span
          >
          <div
            v-if="!task.user?.length"
            class="rd-panel-fieldset-icon-container"
          >
            <rd-svg class="rd-panel-fieldset-icon" name="account-multiple" />
          </div>
          <rd-input-button-small
            v-else
            icon="save"
            type="primary"
            :loading="submitLoading"
            @clicked="updateProjectUser"
          />
        </div>
        <div class="rd-panel-fieldset-body">
          <div class="rd-panel-fieldset-input-wrapper">
            <rd-input-select
              :input="collaboratorInput"
              class="rd-panel-fieldset-input"
              style="width: calc(100% - 2.75rem)"
            />
            <rd-input-button-small
              class="rd-panel-fieldset-button"
              icon="plus"
              type="primary"
              :disabled="!user_id"
              @clicked="addUser"
            />
          </div>
          <div v-if="roleInput.length" class="rd-panel-fieldset-role-wrapper">
            <div
              v-for="role in roleInput"
              :key="role.role_id"
              class="rd-panel-fieldset-role"
              @click="addUsersWithinRole(role.role_id)"
            >
              <span class="rd-panel-fieldset-role-name rd-headline-6">{{
                role.name
              }}</span>
              <rd-svg class="rd-panel-fieldset-role-icon" name="plus" />
            </div>
          </div>
          <div v-if="task.user?.length" class="rd-panel-fieldset-user-wrapper">
            <div
              v-for="user in task.user"
              :key="user._id"
              class="rd-panel-fieldset-user"
              @click="removeUser(user._id)"
            >
              <div class="rd-panel-fieldset-user-image"></div>
              <span class="rd-panel-fieldset-user-name rd-headline-5">{{
                user.name
              }}</span>
              <rd-svg class="rd-panel-fieldset-user-icon" name="close" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="
          (!task.user?.length && task.status[0].kind === 'pending') ||
          (task.task?.length && task.status[0].kind !== 'pending')
        "
        class="rd-panel-fieldset"
      >
        <div class="rd-panel-fieldset-header">
          <span class="rd-panel-fieldset-name rd-headline-4">Subtask(s)</span>
          <rd-input-button-small
            v-if="taskPrepared || (task.task?.length && !taskPrepared)"
            icon="save"
            type="primary"
            :disabled="
              (taskPrepared &&
                taskRequestSum !== 0 &&
                taskRequestSum !== 100) ||
              (!taskPrepared && taskRequestSum !== 100)
            "
            :loading="submitLoading"
            @clicked="createProjectTaskSub"
          />
          <div v-else class="rd-panel-fieldset-icon-container">
            <rd-svg class="rd-panel-fieldset-icon" name="list" />
          </div>
        </div>
        <div class="rd-panel-fieldset-body">
          <div
            v-if="task.status[0].kind === 'pending'"
            class="rd-panel-fieldset"
          >
            <div class="rd-panel-fieldset-input-wrapper">
              <rd-input-text
                :input="nameInput"
                class="rd-panel-fieldset-input"
              />
            </div>
            <div class="rd-panel-fieldset-input-wrapper">
              <rd-input-text
                :input="volumeValueInput"
                class="rd-panel-fieldset-input"
              />
              <rd-input-text
                :input="volumeUnitInput"
                class="rd-panel-fieldset-input"
              />
            </div>
            <div class="rd-panel-fieldset-input-wrapper">
              <rd-input-text
                :input="valueInput"
                class="rd-panel-fieldset-input"
              />
            </div>
            <div class="rd-panel-fieldset-input-wrapper">
              <rd-input-button
                label="Add subtask"
                class="rd-panel-fieldset-button"
                style="width: 100%"
                :disabled="!name || !value"
                @clicked="addTask"
              />
            </div>
          </div>
          <div v-if="task.task?.length" class="rd-panel-fieldset-task-wrapper">
            <rd-project-task
              v-for="data in task.task"
              :key="data._id"
              :task="data"
              :edit="task.status[0].kind === 'pending' && !data.task?.length"
              :disabled="data._id.includes('temp')"
              @delete-task="removeTask"
              @open-task="openTask"
            />
          </div>
        </div>
      </div>
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
  import { ProjectMemberResponse } from "~~/types/project";
  import {
    ProjectTaskRequest,
    ProjectTaskResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
      task_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const {
    project,
    getProjectUsers,
    getProjectTask,
    getProjectAreas,
    getProjectTasks,
    createProjectTask,
    updateProjectTask,
  } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);
  const submitLoading = ref<boolean>(false);

  const task = ref<ProjectTaskResponse>(null);

  const roleInput = ref<
    {
      role_id: string;
      name: string;
      user: ProjectMemberResponse[];
    }[]
  >([]);
  const collaboratorInput = ref<InputOption>({
    name: "user",
    placeholder: "Find user",
    model: "",
    value: "",
    options: [],
  });
  const nameInput = ref<InputOption>({
    label: "Task name",
    name: "name",
    model: "",

    placeholder: "Some task #1",
  });
  const volumeValueInput = ref<InputOption>({
    label: "Volume",
    name: "volume-value",
    type: "number",
    model: "",
    placeholder: "300.000",
  });
  const volumeUnitInput = ref<InputOption>({
    label: "Unit",
    name: "volume-unit",
    model: "",
    placeholder: "kg",
  });
  const valueInput = ref<InputOption>({
    label: "Value (%)",
    name: "value",
    model: "",
    placeholder: "100",
  });

  const taskPrepared = ref<boolean>(false);

  const user = computed<string>(() => collaboratorInput.value.value);
  const name = computed<ProjectTaskRequest["name"]>(
    () => nameInput.value.model
  );
  const value = computed<ProjectTaskRequest["value"]>(() =>
    parseFloat(valueInput.value.model)
  );
  const volume = computed<ProjectTaskRequest["volume"]>(() => ({
    unit: volumeUnitInput.value.model?.toLowerCase() || "pcs",
    value: parseInt(volumeValueInput.value.model.split(".").join("") || "1"),
  }));
  const taskRequestSum = computed<number>(
    () => task.value.task?.reduce((a, b) => a + b.value, 0) || 0
  );

  function getStatus(status: ProjectTaskStatusKind): string {
    let str = "";

    switch (status) {
      case "finished":
        str = "Finished";
        break;
      case "paused":
        str = "Paused";
        break;
      case "pending":
        str = "Pending";
        break;
      case "running":
        str = "Running";
        break;
    }

    return str;
  }
  function filterUsers(): void {
    collaboratorInput.value.options =
      project.value.users.user
        ?.filter(
          (a) => !(task.value.user?.map((b) => b._id) || []).includes(a._id)
        )
        .map((a) => ({ name: a.name, value: a._id })) || [];

    roleInput.value =
      project.value.users?.role
        ?.map((a) => ({
          role_id: a._id,
          name: a.name,
          user: project.value.users?.user
            ?.filter(
              (a) => !(task.value.user?.map((b) => b._id) || []).includes(a._id)
            )
            .filter((b) => b.role.map((c) => c._id).includes(a._id)),
        }))
        .filter((a) => a.user?.length) || [];
  }
  function addUsersWithinRole(role_id: string): void {
    const users = JSON.parse(JSON.stringify(task.value.user || []));
    const usersNew = [];
    const userIds = [];

    users.push(
      ...project.value.users.user
        .filter((a) => a.role.map((b) => b._id).includes(role_id))
        .map((a) => ({
          _id: a._id,
          name: a.name,
          image: a.image,
        }))
    );

    for (const user of users) {
      if (!userIds.includes(user._id)) {
        userIds.push(user._id);
        usersNew.push(user);
      }
    }

    task.value.user = usersNew;
  }
  function addUser(): void {
    const users = JSON.parse(JSON.stringify(task.value.user || []));
    const usersNew = [];
    const userIds = [];

    users.push(
      ...project.value.users.user
        .filter((a) => a._id === user.value)
        .map((a) => ({
          _id: a._id,
          name: a.name,
          image: a.image,
        }))
    );

    for (const user of users) {
      if (!userIds.includes(user._id)) {
        userIds.push(user._id);
        usersNew.push(user);
      }
    }

    task.value.user = usersNew;
    collaboratorInput.value.value = "";
    collaboratorInput.value.model = "";
  }
  function removeUser(user_id: string): void {
    const index = task.value.user?.findIndex((a) => a._id === user_id);

    if (index > -1) {
      task.value.user.splice(0, 1);
      filterUsers();
    }
  }
  async function updateProjectUser(): Promise<void> {
    submitLoading.value = true;

    await updateProjectTask({
      project_id: props.data.project_id,
      task_id: props.data.task_id,
      request: {
        area_id: task.value.area._id,
        user_id: task.value.user?.map((a) => a._id) || [],
        name: task.value.name,
        description: task.value.description,
        volume: task.value.volume,
        value: task.value.value,
      },
    });

    project.value.areas = await getProjectAreas({ _id: props.data.project_id });
    project.value.timeline = await getProjectTasks({
      _id: props.data.project_id,
    });

    submitLoading.value = false;
    panelState.value = "hide";
  }
  function addTask(): void {
    task.value.task = task.value.task || [];

    task.value.task.push({
      _id: `temp-${new Date().toISOString()}`,
      user: null,
      task: null,
      name: name.value,
      period: null,
      actual: null,
      status: [
        {
          kind: "pending",
          time: new Date(),
        },
      ],
      volume: volume.value,
      value: value.value,
      progress: 0,
    });

    nameInput.value.model = "";
    volumeValueInput.value.model = "";
    volumeUnitInput.value.model = "";
    valueInput.value.model = "";
  }
  function removeTask(task_id: string) {
    const index = task.value.task?.findIndex((a) => a._id === task_id);
    if (index > -1) {
      task.value.task.splice(index, 1);
    }
  }
  function openTask(task_id: string): void {
    emits("open-panel", {
      state: "show",
      type: "project-task",
      data: {
        project_id: props.data.project_id,
        task_id,
      },
    });
  }
  async function createProjectTaskSub(): Promise<void> {
    submitLoading.value = true;

    await createProjectTask({
      project_id: props.data.project_id,
      task_id: props.data.task_id,
      request: [
        ...(task.value.task?.map<ProjectTaskRequest>((a) => ({
          name: a.name,
          value: a.value,
          description: "",
          volume: a.volume,
          area_id: task.value.area._id,
        })) || []),
      ],
    });

    project.value.areas = await getProjectAreas({ _id: props.data.project_id });
    project.value.timeline = await getProjectTasks({
      _id: props.data.project_id,
    });

    submitLoading.value = false;
    panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );
  watch(
    () => task.value,
    () => {
      filterUsers();
    },
    {
      deep: true,
    }
  );

  onMounted(async () => {
    project.value.users = await getProjectUsers({
      _id: project.value.data._id,
    });

    task.value = await getProjectTask({
      project_id: props.data.project_id,
      task_id: props.data.task_id,
    });

    if (task.value.task?.length) taskPrepared.value = true;

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
      .rd-panel-fieldset {
        position: relative;
        width: 100%;
        border: var(--border);
        border-radius: 0.75rem;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        gap: 0.75rem 0;
        flex-wrap: wrap;
        .rd-panel-fieldset-header {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-panel-fieldset-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            border: var(--border);
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .rd-panel-fieldset-body {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          .rd-panel-fieldset-input-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
            .rd-panel-fieldset-input {
              width: 100%;
            }
          }
          .rd-panel-fieldset-role-wrapper {
            position: relative;
            left: -0.75rem;
            width: calc(100% + 1.5rem);
            padding: 0 0.75rem;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            gap: 0.75rem;
            overflow-x: auto;
            .rd-panel-fieldset-role {
              cursor: pointer;
              position: relative;
              height: 1.5rem;
              border-radius: 0.75rem;
              border: var(--border);
              padding: 0 0.5rem 0 0.75rem;
              box-sizing: border-box;
              display: flex;
              gap: 0.5rem;
              justify-content: center;
              align-items: center;
              * {
                pointer-events: none;
              }
              .rd-panel-fieldset-role-icon {
                position: relative;
                width: 0.75rem;
                height: 0.75rem;
              }
            }
          }
          .rd-panel-fieldset-user-wrapper {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            .rd-panel-fieldset-user {
              cursor: pointer;
              position: relative;
              height: 1.5rem;
              border-radius: 0.75rem;
              border: var(--border);
              padding: 0 0.5rem 0 0.25rem;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
              * {
                pointer-events: none;
              }
              .rd-panel-fieldset-user-image {
                position: relative;
                width: 1rem;
                height: 1rem;
                background: var(--border-color);
                border-radius: 50%;
                margin-right: 0.5rem;
              }
              .rd-panel-fieldset-user-icon {
                position: relative;
                width: 0.75rem;
                height: 0.75rem;
                margin-left: 0.5rem;
              }
            }
          }
          .rd-panel-fieldset-task-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
        }
        .rd-panel-fieldset-detail {
          position: relative;
          width: 50%;
          display: flex;
          flex-direction: column;
          span {
            position: relative;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .rd-panel-input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        gap: 0.75rem;

        .rd-panel-input {
          position: relative;
          width: 100%;
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
