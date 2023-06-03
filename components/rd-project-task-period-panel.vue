<template>
  <rd-panel
    class="rd-panel"
    label="Edit task period"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-date :input="startDateInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-date :input="endDateInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        @clicked="submit"
        :loading="loading"
        :disabled="!start || !end || end <= start"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputDateOption } from "~~/types/general";
  import {
    ProjectTaskMinResponse,
    ProjectTaskPeriodRequest,
  } from "~~/types/project-task";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
      task: ProjectTaskMinResponse;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { updateProjectTaskPeriod } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const startDateInput = ref<InputDateOption>({
    label: "Start date",
    name: "start",
    model: "",
    placeholder: "Start date",
    error: "",
  });
  const endDateInput = ref<InputDateOption>({
    label: "End date",
    name: "end",
    model: "",
    placeholder: "End date",
    error: "",
  });

  const start = computed<ProjectTaskPeriodRequest["start"]>(() =>
    new Date(startDateInput.value.value).setHours(0, 0, 0, 0)
  );
  const end = computed<ProjectTaskPeriodRequest["end"]>(() =>
    new Date(endDateInput.value.value).getTime()
  );

  async function submit(): Promise<void> {
    loading.value = true;
    const payload: ProjectTaskPeriodRequest = {
      start: start.value,
      end: end.value,
    };

    await updateProjectTaskPeriod({
      project_id: props.data.project_id,
      task_id: props.data.task._id,
      request: payload,
    });
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    if (props.data.task.period) {
      startDateInput.value.value = new Date(
        props.data.task.period.start
      ).toISOString();
      endDateInput.value.value = new Date(
        props.data.task.period.end
      ).toISOString();
    }
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
