<template>
  <div class="rd-container">
    <div class="rd-panel rd-panel-counter rd-panel-counter-primary">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="timeline" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">{{
            overview.project.length
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Active projects</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="percent" color="primary" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">{{
            `${overview.project_completition.toFixed(2)}%`
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Overall completition</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="finish" color="success" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">{{
            overview.project_completed
          }}</span>
        </div>
        <span class="rd-panel-detail-placeholder rd-headline-6"
          >Completed projects</span
        >
      </div>
    </div>
    <div class="rd-panel rd-panel-counter">
      <div class="rd-panel-icon-container">
        <rd-svg class="rd-panel-icon" name="timer" color="error" />
      </div>
      <div class="rd-panel-detail-container">
        <div class="rd-panel-detail-value-container">
          <span class="rd-panel-detail-value rd-headline-4">{{
            overview.project.filter((a) => a.progress.actual < a.progress.plan)
              .length
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
      <div v-if="overview.project.length" class="rd-panel-body">
        <div
          v-for="project in overview.project"
          :key="project._id"
          @click="
            emits('change-page', {
              name: 'projects-project_id',
              href: `/projects/${project._id}`,
            })
          "
          class="rd-project"
          :class="`rd-project-${
            project.progress.actual < project.progress.plan ? 'behind' : 'ahead'
          }`"
        >
          <div class="rd-project-data rd-project-data-main">
            <div class="rd-project-data-status">
              <rd-svg
                v-if="project.progress.actual < project.progress.plan"
                color="error"
                class="rd-project-data-status-icon"
                name="chevron-down"
              />
              <rd-svg
                v-else
                color="success"
                class="rd-project-data-status-icon"
                name="chevron-up"
              />
            </div>
            <div class="rd-project-data-container">
              <span class="rd-project-data-value rd-headline-5">{{
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
            <span class="rd-project-data-value rd-headline-5">{{
              project.code
            }}</span>
            <span class="rd-project-data-placeholder rd-body-text"
              >Project code</span
            >
          </div>
          <div
            v-if="view === 'desktop'"
            class="rd-project-data rd-project-data-customer"
          >
            <span class="rd-project-data-value rd-headline-5">{{
              project.customer.name
            }}</span>
            <span class="rd-project-data-placeholder rd-body-text"
              >customer</span
            >
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
      </div>
      <div v-else class="rd-panel-body">
        <span class="rd-panel-empty rd-caption-text"
          >There is no active project</span
        >
      </div>
    </div>
    <div class="rd-panel">
      <div class="rd-panel-header">
        <span class="rd-panel-name rd-headline-3">Active tasks</span>
      </div>
      <div v-if="overview.task.length" class="rd-panel-body">
        <div v-for="task in overview.task" :key="task._id" class="rd-task">
          <div class="rd-task-header">
            <span class="rd-task-area rd-caption-text">{{
              task.area.name
            }}</span>
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
            <div class="rd-task-project">
              <div class="rd-task-project-image-container">
                <img
                  :src="
                    task.project.customer.image
                      ? `${config.public.apiBase}/files?name=${task.project.customer._id}/${task.project.customer.image._id}.${task.project.customer.image.extension}&kind=customer_image`
                      : `${config.public.base}/default_customer.svg`
                  "
                  class="rd-task-project-image"
                />
              </div>
              <div class="rd-task-project-detail-container">
                <span class="rd-task-project-name rd-headline-5">{{
                  task.project.name
                }}</span>
                <span class="rd-task-project-code rd-caption-text">{{
                  task.project.code
                }}</span>
              </div>
            </div>
          </div>
          <div class="rd-task-footer">
            <div class="rd-task-detail">
              <span class="rd-task-placeholder rd-caption-text">Start</span>
              <span class="rd-task-value rd-headline-6">{{
                task.period ? formatDate(task.period?.start) : "N/A"
              }}</span>
            </div>
            <div class="rd-task-detail">
              <span class="rd-task-placeholder rd-caption-text">End</span>
              <span class="rd-task-value rd-headline-6">{{
                task.period ? formatDate(task.period?.end) : "N/A"
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="rd-panel-body">
        <span class="rd-panel-empty rd-caption-text"
          >There is no active tasks</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { overview, getOverview } = useOverview();
  const { view, init, state } = useMain();
  const config = useRuntimeConfig();
  const emits = defineEmits(["change-page"]);

  definePageMeta({
    middleware: ["auth"],
  });

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

  onMounted(async () => {
    await getOverview();
    setTimeout(() => {
      init.value = false;
      state.value = "idle";
    }, 250);
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
      padding: 0.75rem 0;
      border: var(--border);
      border-radius: 1rem;
      box-sizing: border-box;
      background: var(--background-depth-one-color);
      display: flex;
      flex-direction: column;
      .rd-panel-header {
        position: relative;
        width: 100%;
        height: 2.75rem;
        margin-bottom: 0.75rem;
        padding: 0 0.75rem 0.75rem 0.75rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-panel-body {
        position: relative;
        width: 100%;
        padding: 0 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 0.75rem;
        overflow-y: auto;
        span.rd-panel-empty {
          position: relative;
          margin-bottom: 1rem;
        }
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
              margin-right: 0.5rem;
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
            span {
              position: relative;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
                  background: var(--font-primary-color);
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
              &.rd-project-data-main {
                width: 100%;
                .rd-project-data-container {
                  width: calc(100% - 3rem);
                }
              }
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
            .rd-task-project {
              position: relative;
              width: 100%;
              margin-top: 0.75rem;
              padding: 0.75rem;
              border-radius: 0.75rem;
              background: var(--background-depth-one-color);
              border: var(--border);
              box-sizing: border-box;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              .rd-task-project-image-container {
                position: relative;
                width: 2rem;
                height: 2rem;
                border-radius: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                img {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.5rem;
                  object-fit: contain;
                }
              }
              .rd-task-project-detail-container {
                position: relative;
                width: calc(100% - 2.5rem);
                height: 100%;
                display: flex;
                gap: 0.25rem;
                flex-direction: column;
                justify-content: center;
                span {
                  position: relative;
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
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
          @media only screen and (max-width: 1024px) {
            width: 100%;
          }
        }
      }
      &.rd-panel-counter {
        width: calc((100% - 3rem) / 4);
        padding: 0.75rem;
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
        &.rd-panel-counter-primary {
          background: var(--primary-color);
          span {
            color: var(--font-secondary-color) !important;
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
