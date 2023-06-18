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
          <rd-input-button-small icon="pencil" />
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
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
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
  const { getProjectTask } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);

  const task = ref<ProjectTaskResponse>(null);

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

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(async () => {
    task.value = await getProjectTask({
      project_id: props.data.project_id,
      task_id: props.data.task_id,
    });
    console.log(task.value);
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
        }
        .rd-panel-fieldset-detail {
          position: relative;
          width: 50%;
          display: flex;
          flex-direction: column;
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
