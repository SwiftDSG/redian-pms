<template>
  <rd-panel
    class="rd-panel"
    label="Add area"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="!name"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
  import { ProjectAreaRequest } from "~~/types/project";
  const { addProjectArea } = useProject();

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);

  const nameInput = ref<InputOption>({
    label: "Area name",
    name: "name",
    model: "",
    error: "",
    placeholder: "Some Area",
  });

  const name = computed<ProjectAreaRequest["name"]>(
    () => nameInput.value.model
  );

  async function submit(): Promise<void> {
    const payload = {
      request: { name: name.value },
      project_id: props.data.project_id,
    };

    await addProjectArea(payload);
  }
</script>

<style lang="scss" scoped>
  .rd-panel {
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
