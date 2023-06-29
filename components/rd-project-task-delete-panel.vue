<template>
  <rd-panel
    class="rd-panel"
    label="Delete task"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <span class="rd-panel-message rd-caption-text"
        >Are you sure about removing the task you selected? this will also
        delete all the tasks corresponding this task, this action cannot be
        undone.</span
      >
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="remove"
        type="error"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
      task_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { project, deleteProjectTask, getProjectAreas } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  async function submit(): Promise<void> {
    if (project.value) {
      loading.value = true;
      const payload = {
        project_id: props.data.project_id,
        task_id: props.data.task_id,
      };

      await deleteProjectTask(payload);

      project.value.areas = await getProjectAreas({
        _id: props.data.project_id,
      });

      loading.value = false;
      panelState.value = "hide";
    }
  }
  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      display: flex;
      .rd-panel-message {
        position: relative;
        line-height: 2;
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
