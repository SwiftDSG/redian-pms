<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-statistic-container"></div>
    <div class="rd-panel-report-container"></div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { ProjectResponse } from "~~/types/project";
  import {
    ProjectTaskMinResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: ProjectTaskMinResponse[];
  }>();
  const emits = defineEmits(["change-menu", "changing-done", "edit-task"]);

  const rdPanel = ref<HTMLDivElement>(null);

  const animate = {
    init(rdComponent: HTMLElement, cb: () => void): void {
      const tl = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdComponent, {
        opacity: 1,
        duration: 0.25,
      });
    },
    exit(rdComponent: HTMLElement): void {
      const tl = gsap.timeline({
        onComplete() {
          rdComponent.removeAttribute("style");
        },
      });

      tl.to(rdComponent, {
        opacity: 0,
        duration: 0.25,
      });
    },
  };

  watch(
    () => props.state,
    (val) => {
      if (val === "changing") {
        animate.exit(rdPanel.value);
      }
    }
  );

  onMounted(() => {
    animate.init(rdPanel.value, () => {
      emits("changing-done");
    });
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    position: relative;
    width: 100%;
    height: calc(100vh - 11rem);
    margin-bottom: 2rem;
    border: var(--border);
    border-radius: 1rem;
    box-sizing: border-box;
    background: var(--background-depth-one-color);
    display: flex;
    flex: 1;
    opacity: 0;
    .rd-panel-statistic-container {
      position: relative;
      width: 20rem;
      height: 100%;
      border-right: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    .rd-panel-report-container {
      position: relative;
      width: calc(100% - 20rem);
      height: 100%;
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
    }
  }
</style>
