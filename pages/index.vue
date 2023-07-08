<template>
  <div class="rd-container">
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="timeline" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            projectsActive.length
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Active projects</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="percent" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            `${projectsCompletition.toFixed(2)}%`
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Overall completition</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="finish" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            projectsFinished.length
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Completed projects</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="timer" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            projectsLate.length
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Behind schedule</span
        >
      </div>
    </div>
    <div class="rd-panel">
      <div class="rd-panel-header">
        <span class="rd-panel-name rd-headline-3">Active projects</span>
        <rd-input-button
          label="More"
          @clicked="
            emits('change-page', {
              name: 'projects',
              href: '/projects',
            })
          "
        />
      </div>
      <div v-if="projectsActive.length" class="rd-panel-body">
        <rd-project
          class="rd-project"
          v-for="project in projectsActive"
          :key="project._id"
          :project="project"
          @click="
            emits('change-page', {
              name: 'projects-project_id',
              href: `/projects/${project._id}`,
            })
          "
        />
      </div>
      <div v-else class="rd-panel-body">
        <span class="rd-panel-empty rd-caption-text">No active project</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ProjectMinResponse } from "types/project";

  const { projects, getProjects } = useProject();
  const emits = defineEmits(["change-page"]);

  definePageMeta({
    middleware: ["auth"],
  });

  const projectsActive = computed<ProjectMinResponse[]>(() => {
    if (!projects.value) return [];
    return projects.value.filter(
      (a) => a.status[0].kind !== "cancelled" && a.status[0].kind !== "finished"
    );
  });
  const projectsFinished = computed<ProjectMinResponse[]>(() => {
    if (!projects.value) return [];
    return projects.value.filter((a) => a.status[0].kind === "finished");
  });
  const projectsLate = computed<ProjectMinResponse[]>(() => {
    if (!projects.value) return [];
    return projects.value.filter((a) => a.progress.actual < a.progress.plan);
  });
  const projectsCompletition = computed<number>(() => {
    if (!projects.value) return 0;
    return (
      projects.value.reduce((a, b) => a + b.progress.actual, 0) /
      projects.value.length
    );
  });

  onMounted(async () => {
    await getProjects();
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    padding: 0 2rem 2rem 2rem;
    box-sizing: border-box;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-content: flex-start;
    .rd-panel {
      position: relative;
      width: 100%;
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
      .rd-panel-body {
        position: relative;
        width: 100%;
        display: flex;
        gap: 0.75rem;
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        span.rd-panel-empty {
          position: relative;
          margin-bottom: 1rem;
        }
      }
      &.rd-panel-counter {
        width: calc((100% - 3rem) / 4);
        flex-direction: row;
        align-items: center;
        gap: 0.75rem;
        .rd-panel-icon-container {
          position: relative;
          width: 3rem;
          height: 3rem;
          background: var(--background-depth-two-color);
          border-radius: 0.75rem;
          padding: 0 0.75rem;
          box-sizing: border-box;
        }
        .rd-panel-detail-container {
          position: relative;
          width: calc(100% - 3.75rem);
          display: flex;
          gap: 0.125rem;
          flex-direction: column;
          justify-content: center;
          span.rd-panel-detail-placeholder {
            position: relative;
            opacity: 0.5;
          }
          .rd-panel-detail-value-container {
            position: relative;
            display: flex;
            gap: 0.25rem;
            align-items: center;
            span.rd-panel-detail-target {
              opacity: 0.5;
            }
          }
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      padding: 0 1rem 1rem 1rem;
      gap: 0.75rem;
      .rd-panel {
        &.rd-panel-counter {
          width: calc(50% - 0.375rem);
          flex-direction: column;
          align-items: flex-start;
          .rd-panel-icon-container {
            width: 2rem;
            height: 2rem;
            padding: 0 0.5rem;
          }
          .rd-panel-detail-container {
            width: 100%;
            span.rd-panel-detail-placeholder {
              width: 60%;
              opacity: 0.5;
            }
          }
        }
      }
    }
  }
</style>
