<template>
  <div ref="rdComponent" class="rd-component rd-component-overview">
    <div class="rd-panel rd-panel-chart">
      <div class="rd-panel-header"></div>
      <rd-project-progress-lite
        class="rd-panel-body"
        :data="data.projectProgress"
        :project="project"
      />
    </div>
    <div class="rd-panel rd-panel-chart">
      <div class="rd-panel-header"></div>
      <rd-project-timeline-lite
        class="rd-panel-body"
        :data="data.projectTimeline"
        :project="project"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { ProjectProgressResponse, ProjectResponse } from "~~/types/project";
  import { ProjectTaskMinResponse } from "~~/types/project-task";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: {
      projectProgress: ProjectProgressResponse[];
      projectTimeline: ProjectTaskMinResponse[];
    };
  }>();
  const emits = defineEmits(["change-menu", "changing-done"]);

  const rdComponent = ref<HTMLDivElement>(null);

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
        animate.exit(rdComponent.value);
      }
    }
  );

  onMounted(() => {
    setTimeout(() => {
      animate.init(rdComponent.value, () => {
        emits("changing-done");
      });
    }, 100);
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    .rd-panel {
      position: relative;
      width: calc(50% - 0.5rem);
      padding: 0.75rem;
      border: var(--border);
      border-radius: 1rem;
      box-sizing: border-box;
      background: var(--background-depth-one-color);
      display: flex;
      flex-direction: column;
      .rd-panel-header {
        position: relative;
        width: 100%;
        height: 2rem;
        margin-bottom: 0.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    &.rd-component-overview {
      opacity: 0;
    }
    @media only screen and (max-width: 1024px) {
      padding: 0 1rem;
      .rd-panel {
        width: 100%;
      }
    }
  }
</style>
