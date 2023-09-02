<template>
  <rd-panel
    class="rd-panel"
    label="Add report"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-select :input="typeInput" class="rd-panel-input" />
      </div>
      <div v-if="type === 'Daily'" class="rd-panel-form">
        <div class="rd-panel-form-input-wrapper">
          <rd-input-time :input="inInput" />
          <rd-input-time :input="outInput" />
        </div>
        <div class="rd-panel-form-task-container">
          <div class="rd-panel-form-input-wrapper">
            <rd-input-select
              :input="taskInput"
              style="width: calc(100% - 2.75rem)"
            />
            <rd-input-button-small
              icon="plus"
              :disabled="!selectedTask"
              @clicked="addTaskProgress"
            />
          </div>
          <div v-if="tasksSelected.length" class="rd-panel-form-task-selected">
            <div
              v-for="task in tasksSelected"
              :key="task._id"
              class="rd-panel-form-task"
            >
              <div class="rd-panel-form-task-header">
                <span class="rd-panel-form-task-name rd-headline-5">{{
                  task.name
                }}</span>
                <span
                  class="rd-panel-form-task-status rd-headline-6"
                  :class="`rd-panel-form-task-status-${task.status}`"
                  >{{ getStatus(task.status) }}</span
                >
              </div>
              <div class="rd-panel-form-task-body">
                <div class="rd-panel-form-task-detail">
                  <span class="rd-panel-form-task-placeholder rd-caption-text"
                    >Index Value</span
                  >
                  <span class="rd-panel-form-task-value rd-headline-5">{{
                    `${task.value.toFixed(2)}%`
                  }}</span>
                </div>
                <div class="rd-panel-form-task-collaborators">
                  <span class="rd-panel-form-task-placeholder rd-caption-text"
                    >Progress</span
                  >
                  <span class="rd-panel-form-task-value rd-headline-5">{{
                    `${task.progress}%`
                  }}</span>
                </div>
              </div>
              <div class="rd-panel-form-task-footer">
                <rd-input-text
                  :input="task.input"
                  style="width: calc(100% - 2.75rem)"
                />
                <rd-input-button-small
                  icon="minus"
                  @clicked="removeTaskProgress(task._id)"
                />
              </div>
            </div>
          </div>
        </div>
        <label class="rd-panel-form-label rd-headline-6">Today workers</label>
        <div class="rd-panel-form-input-wrapper">
          <rd-input-select
            :input="collaboratorInput"
            class="rd-panel-form-input"
            style="width: calc(100% - 2.75rem)"
          />
          <rd-input-button-small
            class="rd-panel-form-button"
            icon="plus"
            type="primary"
            :disabled="!member"
            @clicked="addMember"
          />
        </div>
        <div
          v-if="roleInput.length"
          class="rd-panel-form-role-wrapper"
          style="margin-top: -0.25rem"
        >
          <div
            v-for="role in roleInput"
            :key="role.role_id"
            class="rd-panel-form-role"
            @click="addMembersWithinRole(role.role_id)"
          >
            <span class="rd-panel-form-role-name rd-headline-6">{{
              role.name
            }}</span>
            <rd-svg class="rd-panel-form-role-icon" name="plus" />
          </div>
        </div>
        <div
          v-if="membersSelected.length"
          class="rd-panel-form-user-wrapper"
          style="margin-top: -0.25rem"
        >
          <div
            v-for="member in membersSelected"
            :key="member._id"
            class="rd-panel-form-user"
            @click="removeMember(member._id)"
          >
            <div class="rd-panel-form-user-image-container">
              <img
                :src="
                  member.image
                    ? `${config.public.apiBase}/files?name=${member._id}/${member.image._id}.${member.image.extension}&kind=user_image`
                    : `${config.public.base}/default_user.svg`
                "
                class="rd-panel-form-user-image"
              />
            </div>
            <span class="rd-panel-form-user-name rd-headline-5">{{
              member.name
            }}</span>
            <rd-svg class="rd-panel-form-user-icon" name="close" />
          </div>
        </div>
        <div class="rd-panel-form-image-container" style="margin-bottom: 6rem">
          <rd-input-images :input="imagesInput" />
        </div>
      </div>
      <div v-else class="rd-panel-form">
        <div class="rd-panel-form-input-wrapper">
          <rd-input-select
            :input="kindInput"
            class="rd-panel-form-input"
            style="width: 100%"
          />
        </div>
        <label class="rd-panel-form-label rd-headline-6">Victims</label>
        <div class="rd-panel-form-input-wrapper">
          <rd-input-select
            :input="collaboratorInput"
            class="rd-panel-form-input"
            style="width: calc(100% - 2.75rem)"
          />
          <rd-input-button-small
            class="rd-panel-form-button"
            icon="plus"
            type="primary"
            :disabled="!member"
            @clicked="addMember"
          />
        </div>
        <div
          v-if="roleInput.length"
          class="rd-panel-form-role-wrapper"
          style="margin-top: -0.25rem"
        >
          <div
            v-for="role in roleInput"
            :key="role.role_id"
            class="rd-panel-form-role"
            @click="addMembersWithinRole(role.role_id)"
          >
            <span class="rd-panel-form-role-name rd-headline-6">{{
              role.name
            }}</span>
            <rd-svg class="rd-panel-form-role-icon" name="plus" />
          </div>
        </div>
        <div
          v-if="membersSelected.length"
          class="rd-panel-form-user-wrapper"
          style="margin-top: -0.25rem"
        >
          <div
            v-for="member in membersSelected"
            :key="member._id"
            class="rd-panel-form-user"
            @click="removeMember(member._id)"
          >
            <div class="rd-panel-form-user-image-container">
              <img
                :src="
                  member.image
                    ? `${config.public.apiBase}/files?name=${member._id}/${member.image._id}.${member.image.extension}&kind=user_image`
                    : `${config.public.base}/default_user.svg`
                "
                class="rd-panel-form-user-image"
              />
            </div>
            <span class="rd-panel-form-user-name rd-headline-5">{{
              member.name
            }}</span>
            <rd-svg class="rd-panel-form-user-icon" name="close" />
          </div>
        </div>
        <div
          class="rd-panel-form-input-wrapper"
          style="justify-content: space-between; align-items: center"
        >
          <label
            class="rd-panel-form-label rd-headline-6"
            style="width: auto; margin: 0"
            >Project breakdown?</label
          >
          <rd-input-toggle
            class="rd-panel-form-input-toggle"
            :input="breakdownInput"
          />
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :loading="loadingSubmit"
        :disabled="
          type === 'Daily' &&
          (time?.[0]?.[0] || 0) * 60 + (time?.[0]?.[1] || 0) >=
            (time?.[1]?.[0] || 0) * 60 + (time?.[1]?.[1] || 0)
        "
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ProjectMemberResponse } from "types/project";
  import {
    ProjectIncidentReportKind,
    ProjectIncidentReportRequest,
  } from "types/project-incident";
  import {
    InputGeneric,
    InputImageOption,
    InputOption,
    InputTimeOption,
    InputToggleOption,
  } from "~~/types/general";
  import { ProjectProgressReportRequest } from "~~/types/project-report";
  import {
    ProjectTaskMinResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  type ProjectTaskActualInput = {
    _id: string;
    name: string;
    status: ProjectTaskStatusKind;
    value: number;
    progress: number;
    input: InputOption;
  };

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const config = useRuntimeConfig();
  const {
    project,
    createProjectReport,
    createProjectIncident,
    getProject,
    getProjectTasks,
    getProjectReports,
    getProjectUsers,
    getProjectProgress,
  } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);
  const loadingSubmit = ref<boolean>(false);

  const tasks = ref<ProjectTaskMinResponse[]>([]);
  const tasksSelected = ref<ProjectTaskActualInput[]>([]);

  const membersSelected = ref<ProjectMemberResponse[]>([]);

  const typeInput = ref<InputOption>({
    label: "Report type",
    name: "type",
    model: "Daily",
    placeholder: "Report type",
    options: ["Daily", "Incident"],
  });
  const kindInput = ref<InputGeneric<ProjectIncidentReportKind>>({
    label: "Incident type",
    name: "type",
    model: "Environmental",
    placeholder: "Incident type",
    options: [
      {
        name: "Environmental",
        value: "environmental",
      },
      {
        name: "Fatal",
        value: "fatal",
      },
      {
        name: "First Aid",
        value: "first_aid",
      },
      {
        name: "Lost Time Injury",
        value: "lost_time_injury",
      },
      {
        name: "Near Miss",
        value: "near_miss",
      },
      {
        name: "Property Damage",
        value: "property_damage",
      },
    ],
  });
  const inInput = ref<InputTimeOption>({
    label: "Check-in",
    model: [0, 0],
  });
  const outInput = ref<InputTimeOption>({
    label: "Check-out",
    model: [0, 0],
  });
  const taskInput = ref<InputOption>({
    label: "Progress report",
    name: "report",
    model: "",
    placeholder: "Select task",
  });
  const collaboratorInput = ref<InputOption>({
    name: "user",
    placeholder: "Find user",
    model: "",
    value: "",
    options: [],
  });
  const imagesInput = ref<InputImageOption>({
    label: "Documentation",
    limit: 10,
    file: [],
  });
  const breakdownInput = ref<InputToggleOption>({
    model: false,
  });
  const roleInput = ref<
    {
      role_id: string;
      name: string;
      user: ProjectMemberResponse[] | undefined;
    }[]
  >([]);

  const type = computed<string>(() => typeInput.value.model);
  const kind = computed<ProjectIncidentReportKind | undefined>(
    () => kindInput.value.value
  );
  const selectedTask = computed<string | undefined>(
    () => taskInput.value.value
  );
  const time = computed<ProjectProgressReportRequest["time"]>(() => [
    inInput.value.model,
    outInput.value.model,
  ]);
  const actual = computed<ProjectProgressReportRequest["actual"]>(() =>
    tasksSelected.value
      .filter((a) => parseFloat(a.input.model) > 0)
      .map((a) => {
        const value = parseFloat(a.input.model);
        return {
          task_id: a._id,
          value: value + a.progress >= 100 ? 100 - a.progress : value,
        };
      })
  );
  const documentation = computed<ProjectProgressReportRequest["documentation"]>(
    () =>
      imagesInput.value.file.map((a) => ({
        extension: a.type,
      }))
  );
  const documentation_photo = computed<
    ProjectProgressReportRequest["documentation_photo"]
  >(() => imagesInput.value.file);
  const member_id = computed<ProjectProgressReportRequest["member_id"]>(() =>
    membersSelected.value.map((a) => a._id)
  );
  const member = computed<string | undefined>(
    () => collaboratorInput.value.value
  );
  const breakdown = computed<boolean>(() => breakdownInput.value.model);

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
  function addTaskProgress(): void {
    const index = tasks.value.findIndex((a) => a._id === selectedTask.value);
    if (index > -1) {
      tasksSelected.value.push({
        _id: tasks.value[index]._id,
        name: tasks.value[index].name,
        status: tasks.value[index].status[0].kind,
        value: tasks.value[index].value,
        progress: tasks.value[index].progress,
        input: {
          name: "value",
          placeholder: "Progress value",
          model: "",
        },
      });
      taskInput.value.options = tasks.value
        .filter(
          (a) => tasksSelected.value.findIndex((b) => b._id === a._id) === -1
        )
        .map((a) => ({ name: a.name, value: a._id }));
      taskInput.value.model = "";
      taskInput.value.value = "";
    }
  }
  function removeTaskProgress(_id: string): void {
    const index = tasksSelected.value.findIndex((a) => a._id === _id);
    if (index > -1) {
      tasksSelected.value.splice(index, 1);
      taskInput.value.options = tasks.value
        .filter(
          (a) => tasksSelected.value.findIndex((b) => b._id === a._id) === -1
        )
        .map((a) => ({ name: a.name, value: a._id }));
    }
  }
  function filterUsers(): void {
    collaboratorInput.value.options =
      project.value.users?.user
        ?.filter(
          (a) =>
            !(membersSelected.value.map((b) => b._id) || []).includes(a._id)
        )
        .map((a) => ({ name: a.name, value: a._id })) || [];

    roleInput.value =
      project.value.users?.role
        ?.map((a) => ({
          role_id: a._id,
          name: a.name,
          user: project.value.users?.user
            ?.filter(
              (a) =>
                !(membersSelected.value.map((b) => b._id) || []).includes(a._id)
            )
            .filter((b) => b.role.map((c) => c._id).includes(a._id)),
        }))
        .filter((a) => a.user?.length) || [];
  }
  function addMembersWithinRole(role_id: string): void {
    const users: ProjectMemberResponse[] = JSON.parse(
      JSON.stringify(membersSelected.value)
    );
    const usersNew: ProjectMemberResponse[] = [];
    const userIds: string[] = [];

    users?.push(
      ...(project.value?.users?.user.filter((a) =>
        a.role.map((b) => b._id).includes(role_id)
      ) || [])
    );

    for (const user of users) {
      if (!userIds.includes(user._id)) {
        userIds.push(user._id);
        usersNew.push(user);
      }
    }

    membersSelected.value = usersNew;
    collaboratorInput.value.value = "";
    collaboratorInput.value.model = "";
    filterUsers();
  }
  function addMember(): void {
    const users: ProjectMemberResponse[] = JSON.parse(
      JSON.stringify(membersSelected.value)
    );
    const usersNew: ProjectMemberResponse[] = [];
    const userIds: string[] = [];

    users.push(
      ...(project.value?.users?.user.filter((a) => a._id === member.value) ||
        [])
    );

    for (const user of users) {
      if (!userIds.includes(user._id)) {
        userIds.push(user._id);
        usersNew.push(user);
      }
    }

    membersSelected.value = usersNew;
    collaboratorInput.value.value = "";
    collaboratorInput.value.model = "";
    filterUsers();
  }
  function removeMember(user_id: string): void {
    const index = membersSelected.value.findIndex((a) => a._id === user_id);

    if (index > -1) {
      membersSelected.value.splice(0, 1);
      filterUsers();
    }
  }
  async function submit(): Promise<void> {
    loadingSubmit.value = true;
    if (type.value === "Daily") {
      const payload: ProjectProgressReportRequest = {
        member_id: member_id.value,
        time: time.value,
        actual: actual.value,
        documentation: documentation.value,
        documentation_photo: documentation_photo.value,
      };
      await createProjectReport({
        project_id: props.data.project_id,
        request: payload,
      });
    } else if (type.value === "Incident" && kind.value) {
      const payload: ProjectIncidentReportRequest = {
        member_id: member_id.value,
        breakdown: breakdown.value,
        kind: kind.value,
      };

      await createProjectIncident({
        project_id: props.data.project_id,
        request: payload,
      });
    }

    project.value.data = await getProject({
      _id: props.data.project_id,
    });
    project.value.reports = await getProjectReports({
      _id: props.data.project_id,
    });
    project.value.progress = await getProjectProgress({
      _id: props.data.project_id,
    });
    project.value.timeline = await getProjectTasks({
      _id: props.data.project_id,
    });

    loadingSubmit.value = false;
    panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(async () => {
    tasks.value = await getProjectTasks({
      _id: props.data.project_id,
      query: {
        status: "finished",
      },
    });
    taskInput.value.options = tasks.value.map((a) => ({
      name: a.name,
      value: a._id,
    }));
    project.value.users = await getProjectUsers({
      _id: props.data.project_id,
    });
    filterUsers();

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
      flex-direction: column;

      .rd-panel-input-wrapper {
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        display: flex;
        gap: 0.75rem;

        .rd-panel-input {
          position: relative;
          width: 100%;
        }
      }
      .rd-panel-form {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .rd-panel-form-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }
        .rd-panel-form-task-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          .rd-panel-form-task-selected {
            position: relative;
            width: 100%;
            margin-top: 0.75rem;
            display: flex;
            gap: 0.75rem;
            flex-direction: column;
            .rd-panel-form-task {
              position: relative;
              width: 100%;
              border: var(--border);
              padding: 0.75rem;
              border-radius: 0.75rem;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              .rd-panel-form-task-header {
                position: relative;
                width: 100%;
                justify-content: space-between;
                display: flex;
                .rd-panel-form-task-status {
                  position: relative;
                  height: 1rem;
                  padding: 0 0.5rem;
                  border-radius: 0.5rem;
                  box-sizing: border-box;
                  color: var(--font-primary-color);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 0.5rem;
                    background: var(--font-primary-color);
                    opacity: 0.1;
                  }
                  &.rd-panel-form-task-status-finished {
                    color: var(--success-color);
                    &::before {
                      background: var(--success-color);
                    }
                  }
                }
              }

              .rd-panel-form-task-body {
                position: relative;
                width: 100%;
                margin: 0.75rem 0;
                display: flex;
                justify-content: space-between;
                .rd-panel-form-task-detail {
                  position: relative;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                }
                .rd-panel-form-task-collaborators {
                  position: relative;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-end;
                  align-items: flex-end;
                }
              }
              .rd-panel-form-task-footer {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
                gap: 0.75rem;
              }
            }
          }
        }
        .rd-panel-form-label {
          position: relative;
          width: 100%;
          height: 1rem;
          display: flex;
          align-items: center;
          margin-bottom: -1rem;
          opacity: 0.5;
        }
        .rd-panel-form-role-wrapper {
          position: relative;
          left: -2rem;
          width: calc(100% + 4rem);
          padding: 0 2rem;
          box-sizing: border-box;
          display: flex;
          flex-wrap: nowrap;
          gap: 0.75rem;
          overflow-x: auto;
          .rd-panel-form-role {
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
            span {
              white-space: nowrap;
            }
            .rd-panel-form-role-icon {
              position: relative;
              width: 0.75rem;
              height: 0.75rem;
            }
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .rd-panel-form-user-wrapper {
          position: relative;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          .rd-panel-form-user {
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
            .rd-panel-form-user-image-container {
              position: relative;
              width: 1rem;
              height: 1rem;
              background: var(--border-color);
              border-radius: 50%;
              margin-right: 0.5rem;
              overflow: hidden;
              display: flex;
              img {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: center center;
              }
            }
            .rd-panel-form-user-icon {
              position: relative;
              width: 0.75rem;
              height: 0.75rem;
              margin-left: 0.5rem;
            }
          }
        }
        .rd-panel-form-image-container {
          position: relative;
          left: -2rem;
          width: calc(100% + 4rem);
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
      .rd-panel-body {
        .rd-panel-form {
          .rd-panel-form-image-container {
            left: -1rem;
            width: calc(100% + 2rem);
          }
        }
      }
      .rd-panel-footer {
        height: 4rem;
        padding: 1rem;
      }
    }
  }
</style>
