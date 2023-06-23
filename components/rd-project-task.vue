<template>
  <div class="rd-project-task" @click="emits('open-task', task._id)">
    <div class="rd-project-task-header">
      <span class="rd-project-task-name rd-headline-4">{{ task.name }}</span>
      <span
        class="rd-project-task-status rd-headline-6"
        :class="`rd-project-task-status-${task.status[0].kind}`"
        >{{ getStatus(task.status[0].kind) }}</span
      >
    </div>
    <div class="rd-project-task-body">
      <div class="rd-project-task-detail">
        <span class="rd-project-task-placeholder rd-caption-text"
          >Index Value</span
        >
        <span class="rd-project-task-value rd-headline-5">{{
          `${task.value.toFixed(3)}%`
        }}</span>
      </div>
      <div class="rd-project-task-collaborators">
        <span class="rd-project-task-placeholder rd-caption-text">{{
          task.task?.length ? "Subtasks" : "Collaborators"
        }}</span>
        <span class="rd-project-task-value rd-headline-5">{{
          task.task?.length || task.user?.length || 0
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    ProjectTaskMinResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  const props = defineProps<{
    task: ProjectTaskMinResponse;
  }>();
  const emits = defineEmits(["open-task"]);

  function getStatus(status: ProjectTaskStatusKind): string {
    let str = "";

    switch (status) {
      case "finished":
        str = "Finished";
        break;
      case "paused":
        str = "Paused";
        break;
      case "pending":
        str = "Pending";
        break;
      case "running":
        str = "Running";
        break;
    }

    return str;
  }
</script>

<style lang="scss" scoped>
  .rd-project-task {
    position: relative;
    width: 100%;
    border: var(--border);
    border-radius: 0.75rem;
    padding: 0.75rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .rd-project-task-header {
      position: relative;
      width: 100%;
      margin-bottom: 0.75rem;
      justify-content: space-between;
      display: flex;
      .rd-project-task-status {
        position: relative;
        height: 1rem;
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        box-sizing: border-box;
        color: var(--font-main-color);
        display: flex;
        justify-content: center;
        align-items: center;
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          background: var(--font-main-color);
          opacity: 0.1;
        }
        &.rd-project-task-status-finished {
          color: var(--success-color);
          &::before {
            background: var(--success-color);
          }
        }
      }
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
</style>