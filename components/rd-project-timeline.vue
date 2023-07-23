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
          :data-id="task._id"
          class="rd-panel-task"
          :class="`rd-panel-task-${
            task.status[0].kind !== 'pending' &&
            new Date(task.actual?.end || new Date()).getTime() >
              new Date(task.period?.end || new Date()).getTime()
              ? 'late'
              : task.status[0].kind
          }`"
          ref="rdPanelTask"
        >
          <div class="rd-panel-task-plan">
            <div class="rd-panel-task-detail">
              <span
                class="rd-panel-task-name rd-headline-5"
                @click="openTask(task._id)"
                >{{ task.name }}</span
              >
              <span
                class="rd-panel-task-period rd-caption-text"
                :style="
                  project.status[0]?.kind !== 'pending'
                    ? 'pointer-events: none'
                    : ''
                "
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
                `${task.value.toFixed(3)}%`
              }}</span>
              <div class="rd-panel-task-value-dot"></div>
            </div>
            <span class="rd-panel-task-area rd-caption-text">{{
              getArea(task.area_id)
            }}</span>
          </div>
          <div
            v-if="task.status[0].kind !== 'pending' && task.actual"
            class="rd-panel-task-actual"
          >
            <div class="rd-panel-task-actual-message-container">
              <span class="rd-panel-task-actual-message rd-caption-text"
                >Actual time:
                <span class="rd-headline-6">{{
                  `${formatDate(task.actual.start)} - ${
                    task.status[0].kind === "running"
                      ? "now"
                      : formatDate(task.actual.end)
                  }`
                }}</span>
              </span>
            </div>
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
              v-for="(task, i) in datas"
              :key="i"
              class="rd-panel-timeline-data"
              :class="`rd-panel-timeline-data-${
                task.actual?.end && task.actual.end > task.period.end
                  ? 'late'
                  : task.status
              }`"
              :style="`top: ${task.period.position?.y}px`"
            >
              <div
                class="rd-panel-timeline-data-plan"
                :style="`width: ${
                  (task.period.position?.w || 0) * 3
                }rem; left: ${(task.period.position?.x || 0) * 3}rem;`"
              >
                <div class="rd-panel-timeline-data-name-container">
                  <span class="rd-panel-timeline-data-name rd-headline-5">{{
                    task.name
                  }}</span>
                  <span class="rd-panel-timeline-data-period rd-caption-text">{{
                    `${formatDate(task.period.start)} - ${formatDate(
                      task.period.end
                    )}`
                  }}</span>
                </div>
              </div>
              <div
                v-if="task.actual"
                class="rd-panel-timeline-data-actual"
                :style="`width: ${
                  (task.actual?.position?.w || 0) * 3
                }rem; left: ${(task.actual?.position?.x || 0) * 3}rem;`"
              >
                <span
                  class="rd-panel-timeline-data-actual-name rd-headline-5"
                  >{{ task.name }}</span
                >
                <span
                  class="rd-panel-timeline-data-actual-message rd-caption-text"
                  >{{
                    `${
                      task.status === "running"
                        ? "Due in:"
                        : getDaysDiff(
                            new Date(task.actual.end),
                            new Date(task.period.end)
                          ) < 0
                        ? "Overdue by:"
                        : "Ahead by:"
                    } `
                  }}
                  <span class="rd-headline-6">{{
                    `${getDaysDiff(
                      new Date(task.actual.end),
                      new Date(task.period.end)
                    )} days`
                  }}</span>
                </span>
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
      position?: {
        w: number;
        x: number;
        y: number;
      };
    };
    actual?: {
      start: string;
      end: string;
      position?: {
        w: number;
        x: number;
      };
    };
    status: ProjectTaskStatusKind;
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
  const emits = defineEmits([
    "change-menu",
    "changing-done",
    "edit-task",
    "open-task",
  ]);
  const { view } = useMain();

  const rdPanel = ref<HTMLDivElement | null>(null);
  const rdPanelTask = ref<HTMLDivElement[] | null>(null);
  const rdPanelTaskBody = ref<HTMLDivElement | null>(null);
  const rdPanelTimeline = ref<HTMLDivElement | null>(null);
  const rdPanelTimelineIntersector = ref<HTMLDivElement | null>(null);
  const rdPanelTimelineCounter = ref<HTMLDivElement | null>(null);
  const rdPanelTimelineDataWrapper = ref<HTMLDivElement | null>(null);
  const rdPanelTimelineDataContainer = ref<HTMLDivElement | null>(null);
  const rdPanelTimelineDayContainer = ref<HTMLDivElement | null>(null);

  const datas = ref<DataTimeline[]>([]);

  const init = ref<boolean>(true);
  const period = ref<Period | null>(null);
  const today = ref<number>(new Date().setHours(0, 0, 0, 0));
  const days = ref<Date[]>([]);
  const daysAnim = ref<GSAPAnimation | null>(null);

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
  function openTask(task_id: string): void {
    emits("open-task", task_id);
  }
  function addDays(): void {
    const diff =
      ((period.value?.end.getTime() || 0) -
        (period.value?.start.getTime() || 0)) /
      86400000;
    const date = period.value?.start.setHours(0, 0, 0, 0) || 0;
    for (var i: number = 0; i < diff; i++) {
      days.value.push(new Date(date + 86400000 * i));
    }
    setTimeout(() => {
      if (
        rdPanelTimelineDataWrapper.value &&
        rdPanelTimelineDayContainer.value
      ) {
        rdPanelTimelineDataWrapper.value.style.width = `${
          rdPanelTimelineDayContainer.value.getBoundingClientRect().width
        }px`;
      }
      initCounter();
    }, 100);
  }
  function formatDate(str: string): string {
    const date = new Date(str);
    if (view.value === "desktop") {
      return `${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    } else {
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 2
      )
        .toString()
        .padStart(2, "0")}/${date
        .getFullYear()
        .toString()
        .slice(2)
        .padStart(2, "0")}`;
    }
  }
  function getDaysDiff(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / 86400000);
  }
  function setPeriod(tasks: ProjectTaskMinResponse[]): void {
    const allPeriod: [number[], number[]] = tasks.reduce<[number[], number[]]>(
      (a, b) => {
        if (b.period) {
          a[0].push(new Date(b.period.start).getTime());
          a[1].push(new Date(b.period.end).getTime());
        }
        if (b.actual) {
          a[0].push(new Date(b.actual.start).getTime());
          a[1].push(new Date(b.actual.end).getTime());
        }
        return a;
      },
      [[], []]
    );

    allPeriod[0].push(new Date(props.project.period.start).getTime());
    allPeriod[1].push(new Date(props.project.period.end).getTime());

    period.value = {
      start: new Date(Math.min(...allPeriod[0])),
      end: new Date(Math.max(...allPeriod[1])),
    };

    if (!days.value?.length) addDays();
  }
  function getPosition(
    task: ProjectTaskMinResponse,
    actual?: boolean
  ): {
    w: number;
    x: number;
    y: number;
  } {
    const data = actual ? task.actual : task.period;
    if (data) {
      const start = new Date(data.start).setHours(0, 0, 0, 0);
      const end = new Date(data.end).setHours(23, 59, 59, 999);

      const w: number = Math.ceil((end - start) / 86400000);
      const x: number = Math.ceil(
        (start - (period.value?.start.getTime() || 0)) / 86400000
      );
      const y: number =
        (rdPanelTask.value
          ?.find((a) => a.dataset.id === task._id)
          ?.getBoundingClientRect().top || 0) -
        (rdPanelTaskBody.value?.getBoundingClientRect().top || 0) +
        (rdPanelTaskBody.value?.scrollTop || 0);
      return {
        w,
        x,
        y,
      };
    }
    return {
      w: 0,
      x: 0,
      y: 0,
    };
  }
  function getArea(_id: string): string {
    return props.project.area?.find((a) => a._id === _id)?.name || "";
  }
  function bindScroll(e: Event): void {
    if (
      e.target instanceof HTMLElement &&
      rdPanelTaskBody.value &&
      rdPanelTimelineDataWrapper.value
    ) {
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
      if (val === "changing" && rdPanel.value) {
        animate.exit(rdPanel.value);
      }
    }
  );
  watch(
    () => props.data,
    (val) => {
      if (val?.length) {
        setPeriod(val);
        setTimeout(
          () => {
            if (
              rdPanelTimelineDataContainer.value &&
              rdPanelTimelineDataWrapper.value &&
              rdPanelTimelineDayContainer.value
            ) {
              rdPanelTimelineDataContainer.value.style.height = `${
                3.5 * val.length + 0.75 * (val.length - 1) + 1.5 - 0.75
              }rem`;
              rdPanelTimelineDataWrapper.value.style.width = `${
                rdPanelTimelineDayContainer.value.getBoundingClientRect().width
              }px`;
            }
            datas.value = val
              .filter((a) => !!a.period)
              .map<DataTimeline>((a, i, x) => {
                const payload: DataTimeline = {
                  name: a.name,
                  period: {
                    ...(a.period || {
                      start: "",
                      end: "",
                    }),
                    position: getPosition(a),
                  },
                  status: a.status[0].kind,
                };
                if (a.actual) {
                  payload.actual = {
                    ...a.actual,
                    position: getPosition(a, true),
                  };
                }
                if (init.value && i === x.length - 1) {
                  setTimeout(() => {
                    if (rdPanel.value) {
                      animate.init(rdPanel.value, () => {
                        emits("changing-done");
                        init.value = false;
                      });
                    }
                  }, 100);
                }
                return payload;
              });
          },
          init.value ? 100 : 500
        );
      }
    },
    { immediate: true }
  );

  onMounted(() => {
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
          position: relative;
          width: 100%;
          height: 5.75rem;
          display: flex;
          flex-shrink: 0;
          .rd-panel-task-plan {
            z-index: 1;
            position: relative;
            width: 100%;
            height: 3.5rem;
            padding: 0.75rem;
            border-radius: 0.75rem;
            border: var(--border);
            background: var(--background-depth-two-color);
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .rd-panel-task-detail {
              position: relative;
              width: calc(100% - 5rem);
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              span.rd-panel-task-name {
                cursor: pointer;
                position: relative;
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-bottom: 0.25rem;
              }
              span.rd-panel-task-period {
                cursor: pointer;
                position: relative;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: 0.125s opacity;
                &:hover {
                  opacity: 1;
                }
              }
            }
            .rd-panel-task-value-container {
              position: relative;
              width: 5rem;
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
                flex-shrink: 0;
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
            span.rd-panel-task-area {
              position: absolute;
              top: -0.5rem;
              right: 0.75rem;
              height: 1rem;
              padding: 0 0.5rem;
              border-radius: 0.5rem;
              border: 2px solid var(--border-color);
              background: var(--background-depth-one-color);
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .rd-panel-task-actual {
            z-index: 0;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.75rem;
            box-sizing: border-box;
            .rd-panel-task-actual-message-container {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 2.25rem;
              padding: 0 0.75rem;
              box-sizing: border-box;
              display: flex;
              align-items: center;
            }
            &::before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 0.75rem;
              background: var(--primary-color);
              opacity: 0.1;
            }
          }
          &.rd-panel-task-pending {
            height: 3.5rem;
          }
          &.rd-panel-task-finished {
            .rd-panel-task-plan {
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
            .rd-panel-task-actual {
              border-color: var(--success-color);
              span {
                color: var(--success-color);
                opacity: 1 !important;
              }
              &::before {
                background: var(--success-color);
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
            .rd-panel-task-actual {
              border-color: var(--warning-color);
              span {
                color: var(--warning-color);
                opacity: 1 !important;
              }
              &::before {
                background: var(--warning-color);
              }
            }
          }
          &.rd-panel-task-late {
            .rd-panel-task-value-container {
              .rd-panel-task-value-dot {
                &::before {
                  background: var(--error-color);
                }
                &::after {
                  background: var(--error-color);
                }
              }
            }
            .rd-panel-task-actual {
              border-color: var(--error-color);
              span {
                color: var(--error-color);
                opacity: 1 !important;
              }
              &::before {
                background: var(--error-color);
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
      padding: calc(0.75rem - 1px) 0.75rem;
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
              border-bottom: var(--border);
              box-sizing: border-box;
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
              border-right: var(--border);
              opacity: 0.375;
            }
            &:last-child::after {
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
            padding: 0.75rem 0 0 0;
            box-sizing: border-box;
            display: flex;
            gap: 0.75rem;
            flex-direction: column;
            .rd-panel-timeline-data {
              position: absolute;
              width: 100%;
              height: 5.75rem;
              display: flex;
              flex-shrink: 0;
              .rd-panel-timeline-data-plan {
                z-index: 1;
                position: absolute;
                top: 0;
                height: 3.5rem;
                border-radius: 0.75rem;
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
                  span {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
              .rd-panel-timeline-data-actual {
                z-index: 0;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 0.75rem;
                border-radius: 0.75rem;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                span {
                  position: relative;
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                &::before {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.75rem;
                  background: var(--primary-color);
                  opacity: 0.1;
                }
              }
              &.rd-panel-timeline-data-finished {
                .rd-panel-timeline-data-actual {
                  border-color: var(--success-color);
                  span {
                    color: var(--success-color);
                    opacity: 1 !important;
                  }
                  &::before {
                    background: var(--success-color);
                  }
                }
              }
              &.rd-panel-timeline-data-running {
                .rd-panel-timeline-data-actual {
                  border-color: var(--warning-color);
                  span {
                    color: var(--warning-color);
                    opacity: 1 !important;
                  }
                  &::before {
                    background: var(--warning-color);
                  }
                }
              }
              &.rd-panel-timeline-data-late {
                .rd-panel-timeline-data-actual {
                  border-color: var(--error-color);
                  span {
                    color: var(--error-color);
                    opacity: 1 !important;
                  }
                  &::before {
                    background: var(--error-color);
                  }
                }
              }
              &.rd-panel-timeline-data-pending {
                height: 3.5rem;
              }
            }
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .rd-panel-timeline-counter-container {
          z-index: 2;
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
    @media only screen and (max-width: 1024px) {
      height: auto;
      margin-bottom: 1rem;
      .rd-panel-task-container {
        width: 100%;
        border: none;
      }
      .rd-panel-timeline-container {
        display: none;
      }
    }
  }
</style>
