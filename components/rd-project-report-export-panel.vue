<template>
  <rd-panel
    class="rd-panel"
    label="Generate report"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-date
          :input="startDateInput"
          class="rd-panel-input"
          style="width: calc(50% - 0.375rem)"
        />
        <rd-input-date
          :input="endDateInput"
          class="rd-panel-input"
          style="width: calc(50% - 0.375rem)"
        />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-select :input="groupInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper" style="margin: 1rem 0">
        <span class="rd-panel-input-label rd-headline-6"
          >Compare to other period</span
        >
        <rd-input-toggle :input="otherInput" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-date
          :input="otherStartDateInput"
          class="rd-panel-input"
          style="width: calc(50% - 0.375rem)"
        />
        <rd-input-date
          :input="otherEndDateInput"
          class="rd-panel-input"
          style="width: calc(50% - 0.375rem)"
        />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="generate"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import {
    InputDateOption,
    InputOption,
    InputToggleOption,
  } from "~~/types/general";
  import { ProjectResponse } from "~~/types/project";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
      period: ProjectResponse["period"];
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const config = useRuntimeConfig();

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
  const otherInput = ref<InputToggleOption>({
    model: false,
  });
  const otherStartDateInput = ref<InputDateOption>({
    label: "Start date (other period)",
    name: "start",
    model: "",
    placeholder: "Start date",
    threshold: [
      new Date(props.data.period.start),
      new Date(props.data.period.end),
    ],
    error: "",
    disabled: true,
  });
  const otherEndDateInput = ref<InputDateOption>({
    label: "End date (other period)",
    name: "end",
    model: "",
    placeholder: "End date",
    threshold: [
      new Date(props.data.period.start),
      new Date(props.data.period.end),
    ],
    error: "",
    disabled: true,
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
  const other_start = computed<number | null>(() =>
    otherStartDateInput.value.value
      ? new Date(otherStartDateInput.value.value).setHours(0, 0, 0, 0)
      : null
  );
  const other_end = computed<number | null>(() =>
    otherEndDateInput.value.value
      ? new Date(otherEndDateInput.value.value).setHours(23, 59, 59, 999)
      : null
  );
  const group = computed<string | null>(() => groupInput.value.value || null);

  async function submit(): Promise<void> {
    window.open(
      `${config.public.base}/projects/${props.data.project_id}/export?${
        group.value ? `group=${group.value}&` : ""
      }${start.value ? `start=${start.value}&` : ""}${
        end.value ? `end=${end.value}&` : ""
      }${other_start.value ? `other_start=${other_start.value}&` : ""}${
        other_end.value ? `other_end=${other_end.value}&` : ""
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
  watch(
    () => otherInput.value.model,
    (val) => {
      if (val) {
        otherStartDateInput.value.disabled = false;
        otherEndDateInput.value.disabled = false;
      } else {
        otherStartDateInput.value.disabled = true;
        otherEndDateInput.value.disabled = true;
      }
    }
  );
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
        min-height: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.rd-panel-input-label {
          position: relative;
          opacity: 0.5;
        }
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
    @media only screen and (max-width: 1024px) {
      .rd-panel-footer {
        height: 4rem;
        padding: 1rem;
      }
    }
  }
</style>
