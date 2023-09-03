<template>
  <div ref="rdComponent" class="rd-component rd-component-overview">
    <div class="rd-panel rd-panel-counter rd-panel-counter-primary">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="finish" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">{{
            taskComplete
          }}</span>
          <span class="rd-panel-detail-target rd-headline-4">/</span>
          <span class="rd-panel-detail-target rd-headline-4">{{
            taskTotal
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Completed tasks</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="clock-outline" color="primary" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">{{
            durationActual
          }}</span>
          <span class="rd-panel-detail-target rd-headline-4">/</span>
          <span class="rd-panel-detail-target rd-headline-4">{{
            durationPlan
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Duration (days)</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg
          class="rd-panel-icon"
          name="timeline"
          :color="valueActual - valuePlan >= 0 ? 'success' : 'error'"
        />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span
            class="rd-panel-detail-value rd-headline-4"
            :style="`color: ${
              valueActual - valuePlan >= 0
                ? 'var(--success-color)'
                : 'var(--error-color)'
            }`"
            >{{ `${valueActual.toFixed(2)}%` }}</span
          >
          <span
            v-if="view === 'desktop'"
            class="rd-panel-detail-target rd-headline-4"
            >/</span
          >
          <span
            v-if="view === 'desktop'"
            class="rd-panel-detail-target rd-headline-4"
            >{{ `${valuePlan.toFixed(2)}%` }}</span
          >
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">{{
          view === "desktop" ? "Actual vs planned" : "Actual value"
        }}</span>
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg
          class="rd-panel-icon"
          name="crosshairs-gps"
          :color="valueActual - valuePlan >= 0 ? 'success' : 'error'"
        />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span
            class="rd-panel-detail-value rd-headline-4"
            :style="`color: ${
              valueActual - valuePlan >= 0
                ? 'var(--success-color)'
                : 'var(--error-color)'
            }`"
            >{{ `${(valueActual - valuePlan).toFixed(2)}%` }}</span
          >
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">Deviation</span>
      </div>
    </div>
    <div class="rd-panel rd-panel-chart">
      <div class="rd-panel-header">
        <span class="rd-panel-name rd-headline-3">Progress chart</span>
        <rd-input-button
          label="More"
          @clicked="emits('change-menu', 'progress')"
        />
      </div>
      <rd-project-progress-lite
        class="rd-panel-body"
        :data="data.projectProgress"
        :project="project"
      />
    </div>
    <div class="rd-panel rd-panel-chart">
      <div class="rd-panel-header">
        <span class="rd-panel-name rd-headline-3">Timeline</span>
        <rd-input-button
          v-if="validate('get_tasks')"
          label="More"
          @clicked="emits('change-menu', 'timeline')"
        />
      </div>
      <rd-project-timeline-lite
        class="rd-panel-body"
        :data="data.projectTimeline"
        :project="project"
      />
    </div>
    <div class="rd-panel rd-panel-chart rd-panel-chart-full">
      <div class="rd-panel-header">
        <span class="rd-panel-name rd-headline-3">Tasks list</span>
        <rd-input-select :input="statusInput" />
      </div>
      <rd-project-tasks-lite
        :data="data.projectTimeline"
        :project="project"
        :status="taskStatus"
        @open-task="openTask"
      />
    </div>
    <div
      v-if="validate('get_tasks')"
      class="rd-panel rd-panel-action"
      @click="emits('change-menu', 'tasks')"
    >
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="clipboard" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">Manage tasks</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">{{
          `See or manage all ${taskTotal} tasks.`
        }}</span>
      </div>
    </div>
    <div
      v-if="validate('create_report')"
      class="rd-panel rd-panel-action"
      @click="emits('change-menu', 'reports')"
    >
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="file" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4"
            >Manage reports</span
          >
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">{{
          `See, create or export reports.`
        }}</span>
      </div>
    </div>
    <div
      v-if="validate('get_roles')"
      class="rd-panel rd-panel-action"
      @click="emits('change-menu', 'users')"
    >
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="account-group" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4"
            >Manage members</span
          >
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">{{
          `Change roles and members.`
        }}</span>
      </div>
    </div>
    <div
      class="rd-panel rd-panel-action"
      @click="emits('change-menu', 'timeline')"
    >
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="timeline" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4"
            >Manage timeline</span
          >
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">{{
          `See or add reports.`
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { InputGeneric } from "types/general";
  import {
    ProjectMemberResponse,
    ProjectProgressResponse,
    ProjectResponse,
  } from "~~/types/project";
  import {
    ProjectTaskMinResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: {
      projectProgress: ProjectProgressResponse[];
      projectTimeline: ProjectTaskMinResponse[];
      projectMembers: ProjectMemberResponse[];
    };
  }>();
  const emits = defineEmits(["change-menu", "changing-done", "open-task"]);
  const { view } = useMain();
  const { validate } = useProject();

  const rdComponent = ref<HTMLDivElement | null>(null);

  const today = ref<number>(
    props.project.status[0].kind === "finished"
      ? new Date(props.project.status[0].time).setHours(23, 59, 59, 999)
      : new Date().setHours(23, 59, 59, 999)
  );

  const statusInput = ref<InputGeneric<ProjectTaskStatusKind>>({
    name: "status",
    placeholder: "Tasks status",
    model: "On progress",
    value: "running",
    options: [
      {
        name: "On progress",
        value: "running",
      },
      {
        name: "Pending",
        value: "pending",
      },
      {
        name: "Finished",
        value: "finished",
      },
    ],
  });

  const taskStatus = computed<ProjectTaskStatusKind>(
    () => statusInput.value.value || "running"
  );
  const taskTotal = computed<number>(() => props.data.projectTimeline.length);
  const taskComplete = computed<number>(
    () =>
      props.data.projectTimeline.filter((a) => a.status[0].kind === "finished")
        .length
  );
  const valuePlan = computed<number>(
    () =>
      props.data.projectProgress.find(
        (a) => new Date(a.x).setHours(23, 59, 59, 999) === today.value
      )?.y[0] || 0
  );
  const valueActual = computed<number>(
    () =>
      props.data.projectProgress.find(
        (a) => new Date(a.x).setHours(23, 59, 59, 999) === today.value
      )?.y[1] || 0
  );
  const startDate = computed<number>(() =>
    new Date(props.project.period.start).getTime()
  );
  const endDate = computed<number>(() =>
    new Date(props.project.period.end).getTime()
  );
  const durationPlan = computed<number>(() =>
    Math.round((endDate.value - startDate.value) / 86400000)
  );
  const durationActual = computed<number>(() =>
    Math.round((today.value - startDate.value) / 86400000)
  );

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

  function openTask(_id: string): void {
    emits("open-task", _id);
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "changing" && rdComponent.value) {
        animate.exit(rdComponent.value);
      }
    }
  );

  onMounted(() => {
    setTimeout(() => {
      if (rdComponent.value) {
        animate.init(rdComponent.value, () => {
          emits("changing-done");
        });
      }
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
    align-items: flex-start;
    .rd-panel-container {
      position: relative;
      width: calc(50% - 0.5rem);
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      .rd-panel.rd-panel-counter {
        width: calc(50% - 0.5rem);
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .rd-panel-detail-container {
          width: 100%;
        }
      }
    }
    .rd-panel {
      position: relative;
      width: 100%;
      padding: 0.75rem;
      border: var(--border);
      border-radius: 1rem;
      box-sizing: border-box;
      background: var(--background-depth-one-color);
      display: flex;
      &.rd-panel-counter,
      &.rd-panel-action {
        width: calc((100% - 3rem) / 4);
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
          gap: 0.25rem;
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
        &.rd-panel-counter-primary {
          background: var(--primary-color);
          span {
            color: var(--font-secondary-color) !important;
          }
        }
      }
      &.rd-panel-action {
        cursor: pointer;
      }
      &.rd-panel-chart {
        width: calc(50% - 0.5rem);
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
          height: 13.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          .rd-panel-member {
            position: relative;
            width: 100%;
            height: 4rem;
            padding: 0.75rem;
            background: var(--background-depth-two-color);
            border: var(--border);
            border-radius: 0.75rem;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .rd-panel-member-image-container {
              position: relative;
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 0.5rem;
              background: var(--background-depth-one-color);
              margin-right: 0.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              img {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
            }
            .rd-panel-member-detail-container {
              position: relative;
              width: calc((100% - 4rem) / 2);
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              span {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
        &.rd-panel-chart-full {
          width: 100%;
        }
      }
      &:last-child {
        margin-bottom: 2rem;
      }
    }
    &.rd-component-overview {
      opacity: 0;
    }
    @media only screen and (max-width: 1024px) {
      padding: 0;
      gap: 0.75rem;
      .rd-panel-container {
        width: 100%;
        gap: 0.75rem;
        margin-bottom: 1rem !important;
        .rd-panel.rd-panel-counter {
          width: 100%;
        }
      }
      .rd-panel {
        width: 100%;
        &.rd-panel-chart {
          width: 100%;
        }
        &.rd-panel-action {
          width: 100%;
        }
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
              width: 100%;
              opacity: 0.5;
            }
          }
        }
        &.rd-panel-members {
          height: auto;
          margin: 0 !important;
          .rd-panel-body {
            height: auto;
          }
        }
      }
    }
  }
</style>
