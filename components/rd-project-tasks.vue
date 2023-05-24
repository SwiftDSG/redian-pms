<template>
  <div class="rd-component" ref="rdComponent">
    <div v-for="area in project?.area" :key="area._id" class="rd-project-area">
      <div class="rd-project-area-header">
        <span class="rd-project-area-name rd-headline-3">{{ area.name }}</span>
        <rd-input-button-small icon="plus" type="primary" @clicked="addTask(area._id)" />
      </div>
      <div class="rd-project-area-body">
        <div class="rd-project-task">
          <div class="rd-project-task-header">
            <span class="rd-project-task-name rd-headline-4">Task 1</span>
            <span class="rd-project-task-name rd-headline-4">50%</span>
          </div>
          <div class="rd-project-task-body">
            <div class="rd-project-task-detail">
              <span class="rd-customers-ranking-placeholder rd-caption-text">Buy count</span>
              <span class="rd-customers-ranking-value rd-headline-5">120 Tonnes</span>
            </div>
            <div class="rd-project-task-collaborators">
              <span class="rd-customers-ranking-placeholder rd-caption-text">colaborators</span>
              <span class="rd-customers-ranking-value rd-headline-5">sjsjs</span>
            </div>
          </div>
        </div>
        <div class="rd-project-task">
          <div class="rd-project-task-header">
            <span class="rd-project-task-name rd-headline-4">Task 1</span>
            <span class="rd-project-task-name rd-headline-4">50%</span>
          </div>
          <div class="rd-project-task-body">
            <div class="rd-project-task-detail">
              <span class="rd-customers-ranking-placeholder rd-caption-text">Buy count</span>
              <span class="rd-customers-ranking-value rd-headline-5">120 Tonnes</span>
            </div>
            <div class="rd-project-task-collaborators">
              <span class="rd-customers-ranking-placeholder rd-caption-text">colaborators</span>
              <span class="rd-customers-ranking-value rd-headline-5">sjsjs</span>
            </div>
          </div>
        </div>
        <div class="rd-project-task">
          <div class="rd-project-task-header">
            <span class="rd-project-task-name rd-headline-4">Task 1</span>
            <span class="rd-project-task-name rd-headline-4">50%</span>
          </div>
          <div class="rd-project-task-body">
            <div class="rd-project-task-detail">
              <span class="rd-customers-ranking-placeholder rd-caption-text">Buy count</span>
              <span class="rd-customers-ranking-value rd-headline-5">120 Tonnes</span>
            </div>
            <div class="rd-project-task-collaborators">
              <span class="rd-customers-ranking-placeholder rd-caption-text">colaborators</span>
              <span class="rd-customers-ranking-value rd-headline-5">sjsjs</span>
            </div>
          </div>
        </div>
        <div class="rd-project-task">
          <div class="rd-project-task-header">
            <span class="rd-project-task-name rd-headline-4">Task 1</span>
            <span class="rd-project-task-name rd-headline-4">50%</span>
          </div>
          <div class="rd-project-task-body">
            <div class="rd-project-task-detail">
              <span class="rd-customers-ranking-placeholder rd-caption-text">Buy count</span>
              <span class="rd-customers-ranking-value rd-headline-5">120 Tonnes</span>
            </div>
            <div class="rd-project-task-collaborators">
              <span class="rd-customers-ranking-placeholder rd-caption-text">colaborators</span>
              <span class="rd-customers-ranking-value rd-headline-5">sjsjs</span>
            </div>
          </div>
        </div>
        <div class="rd-project-task">
          <div class="rd-project-task-header">
            <span class="rd-project-task-name rd-headline-4">Task 1</span>
            <span class="rd-project-task-name rd-headline-4">50%</span>
          </div>
          <div class="rd-project-task-body">
            <div class="rd-project-task-detail">
              <span class="rd-customers-ranking-placeholder rd-caption-text">Buy count</span>
              <span class="rd-customers-ranking-value rd-headline-5">120 Tonnes</span>
            </div>
            <div class="rd-project-task-collaborators">
              <span class="rd-customers-ranking-placeholder rd-caption-text">colaborators</span>
              <span class="rd-customers-ranking-value rd-headline-5">sjsjs</span>
            </div>
          </div>
        </div>
        <div class="rd-project-task">
          <div class="rd-project-task-header">
            <span class="rd-project-task-name rd-headline-4">Task 1</span>
            <span class="rd-project-task-name rd-headline-4">50%</span>
          </div>
          <div class="rd-project-task-body">
            <div class="rd-project-task-detail">
              <span class="rd-customers-ranking-placeholder rd-caption-text">Buy count</span>
              <span class="rd-customers-ranking-value rd-headline-5">120 Tonnes</span>
            </div>
            <div class="rd-project-task-collaborators">
              <span class="rd-customers-ranking-placeholder rd-caption-text">colaborators</span>
              <span class="rd-customers-ranking-value rd-headline-5">sjsjs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Project } from "~~/types/project";
import { gsap } from "gsap";

const props = defineProps<{
  project: Project;
  state: "idle" | "changing";
}>();
const emits = defineEmits(["change-menu", "changing-done", "add-task"]);

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

function addTask(area_id: string): void {
  emits("add-task", area_id);
}

onMounted(() => {
  animate.init(rdComponent.value, () => {
    emits("changing-done");
  });

  console.log("props.project");
  console.log(props.project);
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

    .rd-project-task {
      border: var(--border);
      box-sizing: border-box;
      justify-content: space-between;
      flex-direction: column;
      padding: 0.75rem;
      position: relative;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      width: calc((100% - 2.25rem)/4);

      .rd-project-task-header {
        width: 100%;
        position: relative;
        justify-content: space-between;
        display: flex;
        margin-bottom: 0.75rem;
      }

      .rd-project-task-body {
        flex-direction: row;
        width: 100%;
        position: relative;
        justify-content: space-between;
        display: flex;

        .rd-project-task-detail {
          flex-direction: column;
          width: 100%;
          position: relative;
          // justify-content: space-between;
          display: flex;
        }

        .rd-project-task-collaborators {
          flex-direction: column;
          width: 100%;
          position: relative;
          justify-content: flex-end;
          align-items: flex-end;
          display: flex;
        }
      }
    }
  }

}
</style>
