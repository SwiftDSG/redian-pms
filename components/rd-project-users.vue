<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-role-container">
      <div class="rd-panel-role-header">
        <span class="rd-panel-role-header-title rd-headline-3">Role list</span>
        <rd-input-button-small :icon="'plus'" :type="'primary'" />
      </div>
      <div ref="rdPanelRoleBody" @scroll="bindScroll" class="rd-panel-role-body">
        <div class="rd-panel-role">
          <div class="rd-panel-role-detail">
            <span class="rd-panel-role-name rd-headline-5">Project Manager</span>
            <span class="rd-panel-role-period rd-caption-text"> 3 users assigned
            </span>
          </div>
          <div class="rd-panel-role-value-container">
            <rd-input-button-small :icon="'dots'" />
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-users-container">
      <div class="rd-panel-users-header">
        <span class="rd-panel-role-header-title rd-headline-3">Member list</span>
        <rd-input-button-small :icon="'plus'" :type="'primary'" />
      </div>
      <div ref="rdPanelUsersBody" class="rd-panel-users-body">
        <div class="rd-panel-user">
          <div class="rd-user-profile">
            <div class="rd-image">s</div>
          </div>
          <div class="rd-user-detail">
            <span class="rd-user-name rd-headline-4">asd</span>
            <span class="rd-user-status rd-caption-text">sdf</span>
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
const rdPanelRoleBody = ref<HTMLDivElement>(null);
const rdPanelUsersBody = ref<HTMLDivElement>(null);
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
      rdPanelTimelineDataWrapper.value.style.width = `${rdPanelTimelineDayContainer.value.getBoundingClientRect().width
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
    rdPanelRoleBody.value.scrollTop = scrollTop;
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

  .rd-panel-role-container {
    position: relative;
    width: 20rem;
    height: 100%;
    border-right: var(--border);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-panel-role-header {
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

    .rd-panel-role-body {
      position: relative;
      width: 100%;
      height: calc(100% - 3.5rem);
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
      gap: 0.75rem;
      flex-direction: column;
      overflow-y: auto;

      .rd-panel-role {
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

        .rd-panel-role-detail {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          span.rd-panel-role-name {
            position: relative;
            margin-bottom: 0.25rem;
          }

          span.rd-panel-role-period {
            cursor: pointer;
            position: relative;
            transition: 0.125s opacity;

            &:hover {
              opacity: 1;
            }
          }
        }

        .rd-panel-role-value-container {
          position: relative;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .rd-panel-role-value-dot {
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

        &.rd-panel-role-finished {
          .rd-panel-role-value-container {
            .rd-panel-role-value-dot {
              &::before {
                background: var(--success-color);
              }

              &::after {
                background: var(--success-color);
              }
            }
          }
        }

        &.rd-panel-role-running {
          .rd-panel-role-value-container {
            .rd-panel-role-value-dot {
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

  .rd-panel-users-container {
    position: relative;
    width: calc(100% - 20rem);
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-panel-users-header {
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

    .rd-panel-users-body {

      position: relative;
      width: 100%;
      height: 100%;
      padding: 0.75rem;
      border-radius: 0.75rem;
      // border: var(--border);
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      // align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;

      .rd-panel-user {
        cursor: pointer;
        border: var(--border);
        box-sizing: border-box;
        justify-content: flex-start;
        flex-direction: column;
        padding: 0.5rem;
        position: relative;
        border-radius: 0.75rem;
        display: flex;
        flex-direction: row;
        height: 4rem;
        width: calc((100% - 0.75rem) / 2);
        align-items: center;
        gap: 0.75rem;

        .rd-user-profile {
          position: relative;
          // box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 3rem;
          width: 3rem;
          border-radius: 0.5rem;

          // color: var(--font-main-color);
          // background: var(--font-main-color);
          .rd-image {
            border-radius: 0.75rem;
            height: 2.75rem;
            width: 2.75rem;
            color: var(--font-main-color);
            background: var(--font-main-color);

          }
        }

        .rd-user-detail {
          flex-direction: column;
          width: 080%;
          position: relative;
          // justify-content: space-between;
          display: flex;
          justify-content: center;
        }


      }

      &::-webkit-scrollbar {
        display: none;
      }


    }
  }
}
</style>
