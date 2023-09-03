<template>
  <div class="rd-component">
    <div v-for="task in tasks" :key="task._id" class="rd-task">
      <div v-if="project" class="rd-task-header">
        <span class="rd-task-area rd-caption-text">{{
          getArea(task.area_id)
        }}</span>
        <rd-input-button-small
          icon="eye"
          @clicked="openTask(task._id)"
          tooltip="See task"
        />
      </div>
      <div class="rd-task-body">
        <span class="rd-task-name rd-headline-5">{{ task.name }}</span>
        <span
          v-if="task.description"
          class="rd-task-description rd-caption-text"
          >{{ task.description }}</span
        >
        <span v-else class="rd-task-description-empty rd-caption-text"
          >No description</span
        >
      </div>
      <div class="rd-task-footer">
        <div class="rd-task-detail">
          <span class="rd-task-placeholder rd-caption-text">Start</span>
          <span class="rd-task-value rd-headline-6">{{
            task.period ? formatDate(new Date(task.period?.start)) : "N/A"
          }}</span>
        </div>
        <div class="rd-task-detail">
          <span class="rd-task-placeholder rd-caption-text">End</span>
          <span class="rd-task-value rd-headline-6">{{
            task.period ? formatDate(new Date(task.period?.end)) : "N/A"
          }}</span>
        </div>
      </div>
    </div>
    <span v-if="!tasks.length" class="rd-task-empty rd-caption-text">{{
      `There is no ${status} task`
    }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { ProjectResponse } from "~~/types/project";
  import {
    ProjectTaskMinResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  const props = defineProps<{
    project?: ProjectResponse;
    data: ProjectTaskMinResponse[];
    status: ProjectTaskStatusKind;
  }>();
  const emits = defineEmits(["open-task"]);

  const tasks = ref<ProjectTaskMinResponse[]>([]);

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

  function filter(status: ProjectTaskStatusKind): void {
    tasks.value = props.data.filter((a) => a.status[0].kind === status);
  }
  function openTask(_id: string): void {
    emits("open-task", _id);
  }

  function getArea(_id: string): string {
    return props.project?.area?.find((a) => a._id === _id)?.name || "";
  }
  function formatDate(date: Date): string {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  watch(
    () => props.status,
    (val) => {
      filter(val);
    }
  );
  onMounted(() => {
    filter(props.status);
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 0.75rem !important;
    .rd-task {
      position: relative;
      width: calc((100% - 2.25rem) / 4);
      background: var(--background-depth-two-color);
      border: var(--border);
      border-radius: 0.75rem;
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      .rd-task-header {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.rd-task-area {
          position: relative;
          height: 1rem;
          padding: 0 0.5rem;
          border-radius: 0.5rem;
          color: var(--success-color);
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            background: var(--success-color);
            opacity: 0.1;
          }
        }
      }
      .rd-task-body {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        span.rd-task-name {
          position: relative;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span.rd-task-description {
          position: relative;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span.rd-task-description-empty {
          position: relative;
          font-style: italic;
        }
      }
      .rd-task-footer {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .rd-task-detail {
          position: relative;
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          &:last-child {
            align-items: flex-end;
          }
        }
      }
    }
    span.rd-task-empty {
      position: relative;
      width: 100%;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    @media only screen and (max-width: 1024px) {
      .rd-task {
        width: 100%;
      }
    }
  }
</style>
