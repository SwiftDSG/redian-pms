<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-statistic-container">
      <div class="rd-panel-statistic-header">
        <span class="rd-panel-statistic-header-title rd-headline-3"
          >Statistics</span
        >
      </div>
      <div class="rd-panel-statistic-body">
        <div v-for="n in 2" :key="n" class="rd-statistic">
          <div class="rd-statistic-header"></div>
          <div class="rd-statistic-body">
            <span class="rd-statistic-value rd-headline-5">Some value</span>
            <span class="rd-statistic-value rd-caption-text">Placeholder</span>
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-report-container">
      <div class="rd-panel-report-header">
        <span class="rd-panel-report-header-title rd-headline-3">Reports</span>
      </div>
      <div class="rd-panel-report-body">
        <div
          v-for="(report, i) in data"
          :key="report.progress?._id || report.incident?._id || i"
          class="rd-report"
          :class="
            report.kind === 'progress'
              ? 'rd-report-progress'
              : 'rd-report-incident'
          "
        >
          <div class="rd-report-timeline">
            <div class="rd-report-timeline-bullet"></div>
          </div>
          <div class="rd-report-container">
            <div class="rd-report-header">
              <div class="rd-report-name-container">
                <span class="rd-report-date rd-caption-text"
                  ><span>{{ formatDate(report.date) }}</span>
                  <div class="rd-report-date-dot"></div>
                  <span>{{
                    report.progress?.user.name || report.incident?.user.name
                  }}</span></span
                >
                <span class="rd-report-name rd-headline-4">{{
                  `Daily report #${counterProgress[data.length - i - 1]}`
                }}</span>
              </div>
              <div class="rd-report-action-container">
                <rd-input-button-small
                  class="rd-report-action"
                  icon="download"
                />
                <rd-input-button-small class="rd-report-action" icon="eye" />
              </div>
            </div>
            <div v-if="report.progress" class="rd-report-body">
              <div class="rd-report-detail-container">
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >In</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.time?.[0][0]
                      .toString()
                      .padStart(2, "0")}:${report.progress.time?.[0][1]
                      .toString()
                      .padStart(2, "0")}`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Out</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.time?.[1][0]
                      .toString()
                      .padStart(2, "0")}:${report.progress.time?.[1][1]
                      .toString()
                      .padStart(2, "0")}`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Duration (hrs)</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${
                      report.progress.time
                        ? formatHours(report.progress.time)
                        : 0
                    } hrs`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Progress (%)</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.progress.toFixed(3)}%`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Documentation</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.documentation?.length || 0} photos`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Worker</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.member?.length || 0} workers`
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { ProjectReportResponse, ProjectResponse } from "~~/types/project";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: ProjectReportResponse[];
  }>();
  const emits = defineEmits(["change-menu", "changing-done", "edit-task"]);

  const rdPanel = ref<HTMLDivElement | null>(null);

  const counterProgress = computed<number[]>(() => {
    let count = 1;
    return props.data.map((a) => (a.kind === "progress" ? count++ : 0));
  });

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

    return `${date.getDate().toString().padStart(2, "0")} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  }
  function formatHours(x: [[number, number], [number, number]]): number {
    return ((x[1][0] - x[0][0]) * 60 + (x[1][1] - x[0][1])) / 60;
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "changing" && rdPanel.value) {
        animate.exit(rdPanel.value);
      }
    }
  );

  onMounted(() => {
    if (rdPanel.value) {
      animate.init(rdPanel.value, () => {
        emits("changing-done");
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    position: relative;
    width: 100%;
    height: calc(100vh - 11rem);
    margin-bottom: 2rem;
    border: var(--border);
    border-radius: 1rem;
    box-sizing: border-box;
    background: var(--background-depth-one-color);
    display: flex;
    flex: 1;
    opacity: 0;
    .rd-panel-statistic-container {
      position: relative;
      width: 20rem;
      height: 100%;
      border-right: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-panel-statistic-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        border-bottom: var(--border);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-panel-statistic-body {
        position: relative;
        width: 100%;
        height: calc(100% - 3.5rem);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        overflow-y: auto;
        .rd-statistic {
          position: relative;
          width: calc((100% - 0.75rem) / 2);
          height: calc(71rem / 11);
          border: var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .rd-statistic-header {
            position: relative;
            width: 2rem;
            height: 2rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            border: var(--border);
          }
          .rd-statistic-body {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
    .rd-panel-report-container {
      position: relative;
      width: calc(100% - 20rem);
      height: 100%;
      display: flex;
      flex-direction: column;
      .rd-panel-report-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        border-bottom: var(--border);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-panel-report-body {
        position: relative;
        width: 100%;
        height: calc(100% - 3.5rem);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        .rd-report {
          position: relative;
          width: 100%;
          display: flex;
          .rd-report-timeline {
            position: relative;
            width: 1.5rem;
            display: flex;
            flex: 1;
            flex-direction: column;
            .rd-report-timeline-bullet {
              position: relative;
              width: 1.5rem;
              height: 1.5rem;
              border: var(--border);
              box-sizing: border-box;
              border-radius: 0.75rem;
              background: var(--background-depth-one-color);
              &::before {
                content: "";
                position: absolute;
                left: calc(50% - 0.25rem);
                top: calc(50% - 0.25rem);
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 0.25rem;
                background: var(--border-color);
              }
            }
          }
          .rd-report-container {
            position: relative;
            width: calc(100% - 2.25rem);
            border: var(--border);
            border-radius: 0.75rem;
            padding: 0.75rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .rd-report-header {
              position: relative;
              width: 100%;
              height: 2rem;
              margin-bottom: 1rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rd-report-name-container {
                position: relative;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                span.rd-report-date {
                  position: relative;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  .rd-report-date-dot {
                    position: relative;
                    width: 0.25rem;
                    height: 0.25rem;
                    border-radius: 0.125rem;
                    background: var(--font-main-color);
                    opacity: 0.5;
                  }
                }
              }
              .rd-report-action-container {
                position: relative;
                height: 100%;
                display: flex;
                gap: 0.75rem;
              }
            }
            .rd-report-body {
              position: relative;
              width: 100%;
              display: flex;
              flex-direction: column;
              .rd-report-detail-container {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .rd-report-detail {
                  position: relative;
                  // width: calc(100% / 6);
                  display: flex;
                  flex-direction: column;
                  span.rd-report-detail-placeholder {
                    position: relative;
                    width: 100%;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
          &:last-child {
            .rd-report-timeline {
              .rd-report-timeline-line {
                &::before {
                  display: none;
                }
              }
            }
          }
          &.rd-report-progress {
            .rd-report-timeline {
              .rd-report-timeline-bullet {
                &::before {
                  background: var(--warning-color);
                }
              }
            }
          }
          &.rd-report-incident {
            .rd-report-timeline {
              .rd-report-timeline-bullet {
                &::before {
                  background: var(--error-color);
                }
              }
            }
          }
        }
      }
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: calc(1.5rem - 0.5px);
        width: 1px;
        height: calc(100% - 3.5rem);
        background: var(--border-color);
      }
    }
  }
</style>
