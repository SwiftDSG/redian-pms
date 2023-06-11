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
        <lazy-rd-input-select :input="typeInput" class="rd-panel-input" />
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
                <span class="rd-panel-form-task-name rd-headline-4">{{
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
        <div class="rd-panel-form-image-container">
          <rd-input-images :input="imagesInput" />
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :loading="loadingSubmit"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import {
    InputImageOption,
    InputOption,
    InputTimeOption,
  } from "~~/types/general";
  import { ProjectProgressReportRequest } from "~~/types/progress-report";
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
  const { getProjectTasks, createProjectReport } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);
  const loadingSubmit = ref<boolean>(false);

  const tasks = ref<ProjectTaskMinResponse[]>([]);
  const tasksSelected = ref<ProjectTaskActualInput[]>([]);

  const typeInput = ref<InputOption>({
    label: "Report type",
    name: "type",
    model: "Daily",
    placeholder: "Report type",
    options: ["Daily", "Incident"],
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
  const imagesInput = ref<InputImageOption>({
    label: "Documentation",
    limit: 10,
    file: [],
  });

  const type = computed<string>(() => typeInput.value.model);
  const selectedTask = computed<string>(() => taskInput.value.value);
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
  async function submit(): Promise<void> {
    loadingSubmit.value = true;
    const payload: ProjectProgressReportRequest = {
      time: time.value,
      actual: actual.value,
    };
    await createProjectReport({
      project_id: props.data.project_id,
      request: payload,
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
                  color: var(--font-main-color);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 0.5rem;
                    background: var(--font-main-color);
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
  }
</style>
