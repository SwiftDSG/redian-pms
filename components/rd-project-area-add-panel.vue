<template>
  <rd-panel
    class="rd-panel"
    label="Add area"
    :state="panelState"
    :loading="loading"
    @exit="emits('exit')"
  >
    <div class="rd-panel-footer">
      <rd-input-button class="rd-panel-button" label="submit" />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(true);

  onMounted(() => {
    console.log("test");
  });
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
