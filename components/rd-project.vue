<template>
  <div class="rd-project" :class="`rd-project-${status}`">
    <div class="rd-project-data rd-project-data-main">
      <div class="rd-project-data-status">
        <rd-svg
          v-if="status === 'pending'"
          class="rd-project-data-status-icon"
          name="minus"
        />
        <rd-svg
          v-if="status === 'finished'"
          color="success"
          class="rd-project-data-status-icon"
          name="check"
        />
        <rd-svg
          v-if="status === 'paused'"
          color="error"
          class="rd-project-data-status-icon"
          name="pause"
        />
        <rd-svg
          v-if="status === 'behind'"
          color="error"
          class="rd-project-data-status-icon"
          name="chevron-down"
        />
        <rd-svg
          v-if="status === 'ahead'"
          color="success"
          class="rd-project-data-status-icon"
          name="chevron-up"
        />
      </div>
      <div class="rd-project-data-container">
        <span class="rd-project-data-value rd-headline-4">{{
          project.name
        }}</span>
        <span class="rd-project-data-placeholder rd-body-text">{{
          `${formatDate(project.period.start)} - ${formatDate(
            project.period.end
          )}`
        }}</span>
      </div>
    </div>
    <div
      v-if="view === 'desktop'"
      class="rd-project-data rd-project-data-person"
    >
      <span class="rd-project-data-value rd-headline-4">{{
        project.code
      }}</span>
      <span class="rd-project-data-placeholder rd-body-text">Project code</span>
    </div>
    <div
      v-if="view === 'desktop'"
      class="rd-project-data rd-project-data-customer"
    >
      <span class="rd-project-data-value rd-headline-4">{{
        project.customer.name
      }}</span>
      <span class="rd-project-data-placeholder rd-body-text">customer</span>
    </div>
    <div class="rd-project-data rd-project-data-progress">
      <span class="rd-project-data-value rd-headline-5">{{
        `${project.progress.actual.toFixed(2)}% completed`
      }}</span>
      <div class="rd-project-data-bar-outer">
        <div
          class="rd-project-data-bar-inner"
          :style="`width: ${project.progress.actual}%`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ProjectMinResponse } from "~~/types/project";

  const props = defineProps<{
    project: ProjectMinResponse;
  }>();
  const { view } = useMain();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const status = computed<
    "pending" | "finished" | "paused" | "pending" | "ahead" | "behind"
  >(() => {
    let str:
      | "pending"
      | "finished"
      | "paused"
      | "pending"
      | "ahead"
      | "behind" = "pending";

    if (props.project.status[0].kind === "finished") str = "finished";
    else if (
      props.project.status[0].kind === "paused" ||
      props.project.status[0].kind === "breakdown"
    )
      str = "paused";
    else if (props.project.status[0].kind === "pending") str = "pending";
    else if (props.project.progress.actual >= props.project.progress.plan)
      str = "ahead";
    else if (props.project.progress.actual < props.project.progress.plan)
      str = "behind";

    return str;
  });

  function formatDate(x: string): string {
    const date = new Date(x);

    if (view.value === "desktop")
      return `${date.getDate().toString().padStart(2, "0")} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    else {
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    }
  }
</script>

<style lang="scss" scoped>
  .rd-project {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 4rem;
    padding: 0.75rem;
    border: var(--border);
    background: var(--background-depth-two-color);
    border-radius: 0.75rem;
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    * {
      pointer-events: none;
    }
    .rd-project-data {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .rd-project-data-status {
        position: relative;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        margin-right: 0.75rem;
        padding: 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          background: var(--success-color);
          opacity: 0.1;
        }
      }
      &.rd-project-data-main {
        width: calc(55% - 12.5rem);
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .rd-project-data-container {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          span {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: none;
          }
        }
      }
      &.rd-project-data-person {
        width: 17.5%;
      }
      &.rd-project-data-customer {
        width: 27.5%;
      }
      &.rd-project-data-progress {
        width: 10rem;
        .rd-project-data-bar-outer {
          position: relative;
          width: 100%;
          height: 0.25rem;
          margin-top: 0.5rem;
          background: var(--background-depth-three-color);
          border-radius: 0.125rem;
          display: flex;
          overflow: hidden;
          .rd-project-data-bar-inner {
            position: relative;
            height: 100%;
            border-radius: 0.125rem;
            background: var(--primary-color);
          }
        }
      }
      span.rd-project-data-placeholder {
        margin-top: 0.25rem;
        color: var(--font-sub-color);
      }
    }
    &.rd-project-pending {
      .rd-project-data {
        .rd-project-data-status {
          &::before {
            background: var(--font-main-color);
          }
        }
      }
    }
    &.rd-project-behind {
      .rd-project-data {
        .rd-project-data-status {
          &::before {
            background: var(--error-color);
          }
        }
      }
    }
    &.rd-project-paused,
    &.rd-project-breakdown {
      .rd-project-data {
        .rd-project-data-status {
          &::before {
            background: var(--error-color);
          }
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      height: auto;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .rd-project-data {
        width: 100% !important;
        &.rd-project-data-progress {
          margin-top: 0.75rem;
          .rd-project-data-bar-outer {
            margin-top: 0.25rem;
          }
        }
        span.rd-project-data-placeholder {
          margin-top: 0.125rem;
        }
      }
    }
  }
</style>
