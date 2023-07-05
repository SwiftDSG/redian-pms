<template>
  <rd-panel
    class="rd-panel"
    label="Generate report"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-date :input="startDateInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-date :input="endDateInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-select :input="groupInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="generate"
        :disabled="!start || !end"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputDateOption, InputOption } from "~~/types/general";
  import { ProjectResponse } from "~~/types/project";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
      period: ProjectResponse["period"];
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const panelState = ref<"idle" | "hide">("idle");

  const startDateInput = ref<InputDateOption>({
    label: "Start date",
    name: "start",
    model: "",
    placeholder: "Start date",
    threshold: [
      new Date(props.data.period.start),
      new Date(props.data.period.end),
    ],
    error: "",
  });
  const endDateInput = ref<InputDateOption>({
    label: "End date",
    name: "end",
    model: "",
    placeholder: "End date",
    threshold: [
      new Date(props.data.period.start),
      new Date(props.data.period.end),
    ],
    error: "",
  });
  const groupInput = ref<InputOption>({
    label: "Group by",
    name: "end",
    model: "Daily",
    value: "daily",
    placeholder: "Group datas by",
    options: [
      {
        name: "Daily",
        value: "daily",
      },
      {
        name: "Weekly",
        value: "weekly",
      },
      {
        name: "Monthly",
        value: "monthly",
      },
    ],
  });

  const start = computed<number | null>(() =>
    startDateInput.value.value
      ? new Date(startDateInput.value.value).setHours(0, 0, 0, 0)
      : null
  );
  const end = computed<number | null>(() =>
    endDateInput.value.value
      ? new Date(endDateInput.value.value).setHours(23, 59, 59, 999)
      : null
  );
  const group = computed<string | null>(() => groupInput.value.value || null);

  async function submit(): Promise<void> {
    window.open(
      `/projects/${props.data.project_id}/export?${
        group.value ? `group=${group.value}&` : ""
      }${start.value ? `start=${start.value}&` : ""}${
        end.value ? `end=${end.value}&` : ""
      }`
    );

    panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    startDateInput.value.value = new Date(
      props.data.period.start
    ).toISOString();
    endDateInput.value.value = new Date(props.data.period.end).toISOString();
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
