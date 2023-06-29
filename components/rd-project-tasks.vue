<template>
  <div class="rd-component" ref="rdComponent">
    <div v-for="area in data" :key="area._id" class="rd-project-area">
      <div class="rd-project-area-header">
        <span class="rd-project-area-name rd-headline-3">{{ area.name }}</span>
        <div class="rd-project-area-actions">
          <rd-input-button-small
            v-if="project.status[0]?.kind === 'pending'"
            icon="delete"
            type="secondary"
            @clicked="removeArea(area._id)"
          />
          <rd-input-button-small
            v-if="project.status[0]?.kind === 'pending'"
            icon="plus"
            type="primary"
            @clicked="addTask(area._id)"
          />
        </div>
      </div>
      <div class="rd-project-area-body">
        <rd-project-task
          v-for="task in area.task"
          :key="task._id"
          class="rd-project-task"
          :task="task"
          @open-task="openTask"
        />
        <span
          v-if="!area.task?.length"
          class="rd-project-area-empty rd-caption-text"
          >No tasks yet</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ProjectAreaResponse, ProjectResponse } from "~~/types/project";
  import { gsap } from "gsap";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: ProjectAreaResponse[];
  }>();
  const emits = defineEmits([
    "change-menu",
    "changing-done",
    "add-task",
    "open-task",
    "remove-area",
  ]);

  const rdComponent = ref<HTMLDivElement | null>(null);

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
      if (val === "changing" && rdComponent.value) {
        animate.exit(rdComponent.value);
      }
    }
  );

  function addTask(area_id: string): void {
    emits("add-task", area_id);
  }
  function openTask(task_id: string): void {
    emits("open-task", task_id);
  }
  function removeArea(area_id: string): void {
    emits("remove-area", area_id);
  }

  onMounted(() => {
    if (rdComponent.value) {
      animate.init(rdComponent.value, () => {
        emits("changing-done");
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-wrap: wrap;
    opacity: 0;

    .rd-project-area {
      position: relative;
      width: 100%;
      border: var(--border);
      border-radius: 1rem;
      box-sizing: border-box;
      background: var(--background-depth-one-color);
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

      .rd-project-area-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        align-items: center;
        border-bottom: var(--border);
        .rd-project-area-actions {
          position: relative;
          display: flex;
          gap: 0.5rem;
        }
      }
    }

    .rd-project-area-body {
      display: flex;
      position: relative;
      width: 100%;
      flex-wrap: wrap;
      padding: 0.75rem;
      box-sizing: border-box;
      gap: 0.75rem;
      .rd-project-area-empty {
        position: relative;
        width: 100%;
        padding: 1rem 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .rd-project-task {
        position: relative;
        width: calc((100% - 2.25rem) / 4) !important;
      }
    }
  }
</style>
