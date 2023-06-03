<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-task-container">
      <div class="rd-panel-task-header">
        <span class="rd-panel-task-header-title rd-headline-3">Task list</span>
      </div>
      <div
        ref="rdPanelTaskBody"
        @scroll="bindScroll"
        class="rd-panel-task-body"
      >
        <div
          v-for="task in data"
          :key="task._id"
          class="rd-panel-task"
          :class="`rd-panel-task-${task.status[0].kind}`"
        >
          <div class="rd-panel-task-detail">
            <span class="rd-panel-task-name rd-headline-5">{{
              task.name
            }}</span>
            <span
              class="rd-panel-task-period rd-caption-text"
              @click="editTask(task)"
              >{{
                task.period
                  ? `${formatDate(task.period.start)} - ${formatDate(
                      task.period.end
                    )}`
                  : "Unassigned"
              }}</span
            >
          </div>
          <div class="rd-panel-task-value-container">
            <span class="rd-panel-task-value rd-headline-5">{{
              `${task.value}%`
            }}</span>
            <div class="rd-panel-task-value-dot"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-timeline-container">
      <div ref="rdPanelTimeline" class="rd-panel-timeline">
        <div
          v-if="days?.length"
          ref="rdPanelTimelineDayContainer"
          class="rd-panel-timeline-day-container"
        >
          <div
            v-for="(day, i) in days"
            :key="i"
            class="rd-panel-timeline-day"
            :class="
              day.getTime() === today ? 'rd-panel-timeline-day-active' : ''
            "
          >
            <div class="rd-panel-timeline-day-date">
              <span class="rd-panel-timeline-day-date-value rd-headline-3">{{
                day.getDate()
              }}</span>
              <span
                class="rd-panel-timeline-day-date-placeholder rd-button-text"
                >{{ months[day.getMonth()].slice(0, 3) }}</span
              >
            </div>
            <div class="rd-panel-timeline-day-body"></div>
          </div>
          <div
            ref="rdPanelTimelineIntersector"
            class="rd-panel-timeline-intersector"
          ></div>
        </div>
        <div
          v-if="datas.length"
          class="rd-panel-timeline-data-wrapper"
          ref="rdPanelTimelineDataWrapper"
          @scroll="bindScroll"
        >
          <div
            class="rd-panel-timeline-data-container"
            ref="rdPanelTimelineDataContainer"
          >
            <div
              v-for="(data, i) in datas"
              :key="i"
              class="rd-panel-timeline-data"
              :style="`width: ${(data.position?.w || 0) * 3}rem; left: ${
                (data.position?.x || 0) * 3
              }rem; top: ${
                (data.position?.y || 0) * 3.5 +
                ((data.position?.y || 0) + 1) * 0.75
              }rem`"
            >
              <div class="rd-panel-timeline-data-name-container">
                <span class="rd-panel-timeline-data-name rd-headline-5">{{
                  data.name
                }}</span>
                <span class="rd-panel-timeline-data-period rd-caption-text">{{
                  `${formatDate(data.period.start)} - ${formatDate(
                    data.period.end
                  )}`
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="period"
          class="rd-panel-timeline-counter-container"
          :style="`left: ${
            Math.floor((today - period.start.getTime()) / 86400000) * 3
          }rem`"
        >
          <div ref="rdPanelTimelineCounter" class="rd-panel-timeline-counter">
            <div class="rd-panel-timeline-counter-line"></div>
            <svg
              class="rd-panel-timeline-counter-circle"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="12"
                height="12"
                rx="6"
                style="fill: var(--warning-color)"
              />
              <rect x="3" y="3" width="6" height="6" rx="3" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { ProjectResponse } from "~~/types/project";
  import {
    ProjectTaskMinResponse,
    ProjectTaskStatusKind,
  } from "~~/types/project-task";

  type DataTimeline = {
    name: string;
    period: {
      start: string;
      end: string;
    };
    status: ProjectTaskStatusKind;
    position?: {
      w: number;
      x: number;
      y: number;
    };
  };
  type Period = {
    start: Date;
    end: Date;
  };

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: ProjectTaskMinResponse[];
  }>();
  const emits = defineEmits(["change-menu", "changing-done", "edit-task"]);

  const rdPanel = ref<HTMLDivElement>(null);
  const rdPanelTaskBody = ref<HTMLDivElement>(null);
  const rdPanelTimeline = ref<HTMLDivElement>(null);
  const rdPanelTimelineIntersector = ref<HTMLDivElement>(null);
  const rdPanelTimelineCounter = ref<HTMLDivElement>(null);
  const rdPanelTimelineDataWrapper = ref<HTMLDivElement>(null);
  const rdPanelTimelineDataContainer = ref<HTMLDivElement>(null);
  const rdPanelTimelineDayContainer = ref<HTMLDivElement>(null);

  const timelineObserver = ref<IntersectionObserver>(null);

  const datas = ref<DataTimeline[]>([]);

  const period = ref<Period>(null);
  const today = ref<number>(new Date().setHours(0, 0, 0, 0));
  const days = ref<Date[]>([]);
  const daysCount = ref<number>(0);
  const daysAnim = ref<GSAPAnimation>(null);

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

  function editTask(task: ProjectTaskMinResponse): void {
    emits("edit-task", task);
  }
  function resetDays(): void {
    if (days.value.length && period.value.start) {
      let date = period.value.start.setHours(0, 0, 0, 0);
      days.value = days.value.map((a, i) => new Date(date + i * 86400000));
      initCounter();
    }
  }
  function addDays(): void {
    for (var i: number = 0; i < 30; i++) {
      days.value.push(
        new Date(new Date().getTime() + 86400000 * daysCount.value)
      );
      daysCount.value++;
    }
    setTimeout(() => {
      if (rdPanelTimelineDataWrapper.value) {
        rdPanelTimelineDataWrapper.value.style.width = `${
          rdPanelTimelineDayContainer.value.getBoundingClientRect().width
        }px`;
      }
    }, 100);
  }
  function formatDate(str: string): string {
    const date = new Date(str);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  function setPeriod(tasks: ProjectTaskMinResponse[]): void {
    const allPeriod: [number[], number[]] = tasks.reduce(
      (a, b) => {
        if (b.period) {
          a[0].push(new Date(b.period.start).getTime());
          a[1].push(new Date(b.period.end).getTime());
        }
        return a;
      },
      [[], []]
    );

    period.value = {
      start: new Date(Math.min(...allPeriod[0])),
      end: new Date(Math.max(...allPeriod[1])),
    };

    resetDays();
  }
  function getPosition(data: ProjectTaskMinResponse): DataTimeline["position"] {
    const start = new Date(data.period.start);
    const end = new Date(data.period.end);

    const w: number = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const x: number = Math.ceil(
      (start.getTime() - period.value.start.getTime()) / 86400000
    );
    const y: number = props.data.findIndex((a) => a._id === data._id);

    return {
      w,
      x,
      y,
    };
  }
  function timelineIntersector(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) addDays();
    }
  }
  function bindScroll(e: Event): void {
    if (e.target instanceof HTMLElement) {
      const { scrollTop } = e.target;
      rdPanelTaskBody.value.scrollTop = scrollTop;
      rdPanelTimelineDataWrapper.value.scrollTop = scrollTop;
    }
  }
  function initCounter(): void {
    if (rdPanelTimelineCounter.value) {
      today.value = new Date().setHours(0, 0, 0, 0);
      const percentage = (new Date().getTime() - today.value) / 86400000;

      gsap.to(rdPanelTimelineCounter.value, {
        x: `${percentage * 3}rem`,
        duration: 0,
      });

      if (daysAnim.value) daysAnim.value.kill();

      daysAnim.value = gsap.to(rdPanelTimelineCounter.value, {
        x: "3rem",
        ease: "power0",
        duration: percentage * 86400,
        onComplete: initCounter,
      });
    }
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "changing") {
        animate.exit(rdPanel.value);
      }
    }
  );
  watch(
    () => props.data,
    (val) => {
      if (val?.length) {
        setPeriod(val);
        datas.value = val
          .filter((a) => !!a.period)
          .map<DataTimeline>((a) => ({
            name: a.name,
            period: a.period,
            status: a.status[0].kind,
            position: getPosition(a),
          }));
        setTimeout(() => {
          rdPanelTimelineDataContainer.value.style.height = `${
            3.5 * val.length + 0.75 * (val.length - 1) + 1.5
          }rem`;
          rdPanelTimelineDataWrapper.value.style.width = `${
            rdPanelTimelineDayContainer.value.getBoundingClientRect().width
          }px`;
          timelineObserver.value = new IntersectionObserver(
            timelineIntersector,
            {
              root: rdPanelTimeline.value,
              threshold: 0,
            }
          );
          timelineObserver.value.observe(rdPanelTimelineIntersector.value);
        }, 50);
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    addDays();

    animate.init(rdPanel.value, () => {
      emits("changing-done");
    });

    window.addEventListener("focus", initCounter);
  });
  onBeforeUnmount(() => {
    if (daysAnim.value) daysAnim.value.kill();
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
    .rd-panel-task-container {
      position: relative;
      width: 20rem;
      height: 100%;
      border-right: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-panel-task-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        padding: 0.75rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-panel-task-body {
        position: relative;
        width: 100%;
        height: calc(100% - 3.5rem);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        gap: 0.75rem;
        flex-direction: column;
        overflow-y: auto;
        .rd-panel-task {
          cursor: pointer;
          position: relative;
          width: 100%;
          height: 3.5rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: var(--border);
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-panel-task-detail {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            span.rd-panel-task-name {
              position: relative;
              margin-bottom: 0.25rem;
            }
            span.rd-panel-task-period {
              cursor: pointer;
              position: relative;
              transition: 0.125s opacity;
              &:hover {
                opacity: 1;
              }
            }
          }
          .rd-panel-task-value-container {
            position: relative;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .rd-panel-task-value-dot {
              position: relative;
              width: 1rem;
              height: 1rem;
              margin-left: 0.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              &::before {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: var(--font-main-color);
                opacity: 0.1;
              }
              &::after {
                content: "";
                position: relative;
                width: 50%;
                height: 50%;
                border-radius: 50%;
                background: var(--font-main-color);
              }
            }
          }
          &.rd-panel-task-finished {
            .rd-panel-task-value-container {
              .rd-panel-task-value-dot {
                &::before {
                  background: var(--success-color);
                }
                &::after {
                  background: var(--success-color);
                }
              }
            }
          }
          &.rd-panel-task-running {
            .rd-panel-task-value-container {
              .rd-panel-task-value-dot {
                &::before {
                  background: var(--warning-color);
                }
                &::after {
                  background: var(--warning-color);
                }
              }
            }
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .rd-panel-timeline-container {
      position: relative;
      width: calc(100% - 20rem);
      height: 100%;
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
      .rd-panel-timeline {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 0.75rem;
        border: var(--border);
        box-sizing: border-box;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        .rd-panel-timeline-day-container {
          position: relative;
          height: 100%;
          display: flex;
          .rd-panel-timeline-day {
            position: relative;
            width: 3rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            .rd-panel-timeline-day-date {
              position: relative;
              width: 3rem;
              height: 2.75rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-content: center;
              span.rd-panel-timeline-day-date-value {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              span.rd-panel-timeline-day-date-placeholder {
                position: relative;
                color: var(--font-sub-color);
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            .rd-panel-timeline-day-body {
              position: relative;
              width: 3rem;
              background: var(--background-depth-two-color);
              box-sizing: border-box;
              flex-grow: 1;
              opacity: 0.375;
            }
            &.rd-panel-timeline-day-active {
              .rd-panel-timeline-day-date {
                span {
                  color: var(--warning-color) !important;
                }
              }
            }
            &::after {
              content: "";
              pointer-events: none;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-left: var(--border);
              opacity: 0.375;
            }
            &:first-child::after {
              border: none;
            }
          }
          .rd-panel-timeline-intersector {
            position: absolute;
            top: 0;
            right: 30rem;
            height: 100%;
            width: 3rem;
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
        .rd-panel-timeline-data-wrapper {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: calc(100% - 2.75rem);
          overflow-x: hidden;
          overflow-y: auto;
          .rd-panel-timeline-data-container {
            position: relative;
            width: 100%;
            height: 100%;
            .rd-panel-timeline-data {
              position: absolute;
              height: 3.5rem;
              border-radius: 0.5rem;
              border: var(--border);
              padding: 0.75rem;
              box-sizing: border-box;
              background: var(--background-depth-one-color);
              display: flex;
              .rd-panel-timeline-data-name-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                span.rd-panel-timeline-data-name {
                  position: relative;
                  margin-bottom: 0.25rem;
                }
                span.rd-panel-timeline-data-period {
                  position: relative;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .rd-panel-timeline-counter-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 3rem;
          height: calc(100% - 2.75rem);
          .rd-panel-timeline-counter {
            position: relative;
            left: -0.25rem;
            width: 0.5rem;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            svg.rd-panel-timeline-counter-circle {
              position: absolute;
              top: -0.25rem;
              left: 0;
              width: 0.5rem;
              height: 0.5rem;
            }
            .rd-panel-timeline-counter-line {
              position: absolute;
              width: 2px;
              height: 100%;
              background: var(--warning-color);
            }
          }
        }
      }
    }
  }
</style>
