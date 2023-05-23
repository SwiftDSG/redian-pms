<template>
  <div class="rd-project">
    <div class="rd-project-data rd-project-data-main">
      <div class="rd-project-data-status"></div>
      <div class="rd-project-data-container">
        <span class="rd-project-data-value rd-headline-4">{{
          project.name
        }}</span>
        <span class="rd-project-data-placeholder rd-body-text"
          >18 April 2023 - 20 July 2023</span
        >
      </div>
    </div>
    <div
      v-if="viewMode === 'desktop'"
      class="rd-project-data rd-project-data-person"
    >
      <span class="rd-project-data-value rd-headline-4">Fly Over Aloha</span>
      <span class="rd-project-data-placeholder rd-body-text"
        >person in charge</span
      >
    </div>
    <div
      v-if="viewMode === 'desktop'"
      class="rd-project-data rd-project-data-customer"
    >
      <span class="rd-project-data-value rd-headline-4">Fly Over Aloha</span>
      <span class="rd-project-data-placeholder rd-body-text">customer</span>
    </div>
    <div class="rd-project-data rd-project-data-progress">
      <span class="rd-project-data-value rd-headline-5">75% completed</span>
      <div class="rd-project-data-bar-outer">
        <div class="rd-project-data-bar-inner" style="width: 75%"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Project } from "~~/types/project";

  const props = defineProps<{
    project: Project;
  }>();
  const { viewMode } = useMain();
</script>

<style lang="scss" scoped>
  .rd-project {
    position: relative;
    width: 100%;
    height: 4rem;
    padding: 0.75rem;
    border: var(--border);
    border-radius: 0.75rem;
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
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
        width: calc(50% - 12.5rem);
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .rd-project-data-container {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
      &.rd-project-data-person {
        width: 25%;
      }
      &.rd-project-data-customer {
        width: 25%;
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
