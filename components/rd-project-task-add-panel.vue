<template>
  <rd-panel
    class="rd-panel"
    label="Add task"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-textarea :input="descriptionInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="volumeValueInput" class="rd-panel-input" />
        <rd-input-text :input="volumeUnitInput" class="rd-panel-input" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="valueInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        @clicked="submit"
        :disabled="!name || !value || value > 100 || value <= 0"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
  import { ProjectTaskRequest } from "~~/types/project-task";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      task_id?: string;
      project_id: string;
      area_id?: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { createProjectTask } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);

  const nameInput = ref<InputOption>({
    label: "Task name",
    name: "name",
    model: "",
    error: "",
    placeholder: "Some task #1",
  });
  const descriptionInput = ref<InputOption>({
    label: "Task name",
    name: "description",
    model: "",
    placeholder: "Description",
    error: "",
  });
  const volumeValueInput = ref<InputOption>({
    label: "Volume",
    name: "volume-value",
    type: "number",
    model: "",
    placeholder: "300.000",
    error: "",
  });
  const volumeUnitInput = ref<InputOption>({
    label: "Unit",
    name: "volume-unit",
    model: "",
    placeholder: "kg",
    error: "",
  });
  const valueInput = ref<InputOption>({
    label: "Value (%)",
    name: "value",
    model: "",
    placeholder: "100",
    error: "",
  });

  const name = computed<ProjectTaskRequest["name"]>(
    () => nameInput.value.model
  );
  const description = computed<ProjectTaskRequest["description"]>(
    () => descriptionInput.value.model
  );
  const value = computed<ProjectTaskRequest["value"]>(() =>
    parseFloat(valueInput.value.model)
  );
  const volume = computed<ProjectTaskRequest["volume"]>(() => ({
    unit: volumeUnitInput.value.model,
    value: parseInt(volumeValueInput.value.model.split(".").join("")),
  }));

  async function submit(): Promise<void> {
    const payload: ProjectTaskRequest = {
      name: name.value,
      description: description.value,
      value: value.value,
      volume: volume.value,
      area_id: props.data.area_id,
    };

    await createProjectTask({
      project_id: props.data.project_id,
      task_id: props.data.task_id,
      request: payload,
    });
  }
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
