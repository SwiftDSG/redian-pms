<template>
  <div ref="rdComponent" class="rd-component rd-component-overview">
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="finish" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            taskComplete
          }}</span>
          <span class="rd-panel-detail-target rd-headline-3">/</span>
          <span class="rd-panel-detail-target rd-headline-3">{{
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
        <rd-svg class="rd-panel-icon" name="timeline" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            `${valueActual.toFixed(2)}%`
          }}</span>
          <span class="rd-panel-detail-target rd-headline-3">/</span>
          <span class="rd-panel-detail-target rd-headline-3">{{
            `${valuePlan.toFixed(2)}%`
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Actual vs planned</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="crosshairs-gps" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            `${(valueActual - valuePlan).toFixed(2)}%`
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6">Deviation</span>
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="clock-outline" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-3">{{
            durationActual
          }}</span>
          <span class="rd-panel-detail-target rd-headline-3">/</span>
          <span class="rd-panel-detail-target rd-headline-3">{{
            durationPlan
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Duration (days)</span
        >
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
    <div class="rd-panel rd-panel-chart" style="margin-bottom: 2rem">
      <div class="rd-panel-header">
        <span class="rd-panel-name rd-headline-3">Members</span>
        <rd-input-button
          v-if="validate('get_roles')"
          label="More"
          @clicked="emits('change-menu', 'users')"
        />
      </div>
      <div class="rd-panel-body">
        <div
          v-for="member in data.projectMembers.slice(0, 3)"
          :key="member._id"
          class="rd-panel-member"
        >
          <div class="rd-panel-member-image-container"></div>
          <div class="rd-panel-member-detail-container">
            <span class="rd-panel-member-placeholder rd-caption-text"
              >Name</span
            >
            <span class="rd-panel-member-value rd-headline-5">{{
              member.name
            }}</span>
          </div>
          <div class="rd-panel-member-detail-container">
            <span class="rd-panel-member-placeholder rd-caption-text"
              >Role</span
            >
            <span class="rd-panel-member-value rd-headline-5">{{
              member.role[0].name
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-container" style="margin-bottom: 2rem">
      <div
        v-if="validate('get_tasks')"
        class="rd-panel rd-panel-counter"
        @click="emits('change-menu', 'tasks')"
      >
        <div class="rd-panel-icon-container">
          <rd-svg class="rd-panel-icon" name="clipboard" />
        </div>
        <div class="rd-panel-detail-container">
          <div class="rd-panel-detail-value-container">
            <span class="rd-panel-detail-value rd-headline-3"
              >Manage tasks</span
            >
          </div>
          <span class="rd-panel-detail-placeholder rd-headline-6">{{
            `See or manage all ${taskTotal} tasks.`
          }}</span>
        </div>
      </div>
      <div
        v-if="validate('create_report')"
        class="rd-panel rd-panel-counter"
        @click="emits('change-menu', 'reports')"
      >
        <div class="rd-panel-icon-container">
          <rd-svg class="rd-panel-icon" name="file" />
        </div>
        <div class="rd-panel-detail-container">
          <div class="rd-panel-detail-value-container">
            <span class="rd-panel-detail-value rd-headline-3"
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
        class="rd-panel rd-panel-counter"
        @click="emits('change-menu', 'users')"
      >
        <div class="rd-panel-icon-container">
          <rd-svg class="rd-panel-icon" name="account-group" />
        </div>
        <div class="rd-panel-detail-container">
          <div class="rd-panel-detail-value-container">
            <span class="rd-panel-detail-value rd-headline-3"
              >Manage members</span
            >
          </div>
          <span class="rd-panel-detail-placeholder rd-headline-6">{{
            `Change roles and members for this project.`
          }}</span>
        </div>
      </div>
      <div
        class="rd-panel rd-panel-counter"
        @click="emits('change-menu', 'timeline')"
      >
        <div class="rd-panel-icon-container">
          <rd-svg class="rd-panel-icon" name="timeline" />
        </div>
        <div class="rd-panel-detail-container">
          <div class="rd-panel-detail-value-container">
            <span class="rd-panel-detail-value rd-headline-3"
              >Manage timeline</span
            >
          </div>
          <span class="rd-panel-detail-placeholder rd-headline-6">{{
            `See or change the workflow of this project.`
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import {
    ProjectMemberResponse,
    ProjectProgressResponse,
    ProjectResponse,
  } from "~~/types/project";
  import { ProjectTaskMinResponse } from "~~/types/project-task";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: {
      projectProgress: ProjectProgressResponse[];
      projectTimeline: ProjectTaskMinResponse[];
      projectMembers: ProjectMemberResponse[];
    };
  }>();
  const emits = defineEmits(["change-menu", "changing-done"]);
  const { validate } = useProject();

  const rdComponent = ref<HTMLDivElement | null>(null);

  const today = ref<number>(
    props.project.status[0].kind === "finished"
      ? new Date(props.project.status[0].time).setHours(23, 59, 59, 999)
      : new Date().setHours(23, 59, 59, 999)
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
      &.rd-panel-counter {
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
              background: var(--background-depth-two-color);
              margin-right: 0.75rem;
            }
            .rd-panel-member-detail-container {
              position: relative;
              width: calc((100% - 4rem) / 2);
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }
        }
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
