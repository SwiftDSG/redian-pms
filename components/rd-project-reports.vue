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
        <div class="rd-report rd-report-daily">
          <div class="rd-report-timeline">
            <div class="rd-report-timeline-bullet"></div>
          </div>
          <div class="rd-report-container">
            <div class="rd-report-header">
              <div class="rd-report-name-container">
                <span class="rd-report-date rd-caption-text"
                  ><span>10 June 2023</span>
                  <div class="rd-report-date-dot"></div>
                  <span>Johne Dowen</span></span
                >
                <span class="rd-report-name rd-headline-4"
                  >Daily report #321</span
                >
              </div>
              <div class="rd-report-action-container">
                <rd-input-button-small
                  class="rd-report-action"
                  icon="download"
                />
                <rd-input-button-small class="rd-report-action" icon="eye" />
              </div>
            </div>
            <div class="rd-report-body">
              <div class="rd-report-detail-container">
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >In</span
                  >
                  <span class="rd-report-detail-value rd-headline-5"
                    >08:00</span
                  >
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Out</span
                  >
                  <span class="rd-report-detail-value rd-headline-5"
                    >17:00</span
                  >
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Duration (hrs)</span
                  >
                  <span class="rd-report-detail-value rd-headline-5"
                    >9 hrs</span
                  >
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Progress (%)</span
                  >
                  <span class="rd-report-detail-value rd-headline-5"
                    >7.132%</span
                  >
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Documentation</span
                  >
                  <span class="rd-report-detail-value rd-headline-5"
                    >6 photos</span
                  >
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Worker</span
                  >
                  <span class="rd-report-detail-value rd-headline-5"
                    >12 workers</span
                  >
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
  import { ProjectResponse } from "~~/types/project";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
  }>();
  const emits = defineEmits(["change-menu", "changing-done", "edit-task"]);

  const rdPanel = ref<HTMLDivElement>(null);

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
        animate.exit(rdPanel.value);
      }
    }
  );

  onMounted(() => {
    animate.init(rdPanel.value, () => {
      emits("changing-done");
    });
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
          &.rd-report-daily {
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
