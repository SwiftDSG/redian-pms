<template>
  <div class="rd-component">
    <div ref="rdDayContainer" v-if="!init" class="rd-day-container">
      <div
        v-for="(day, i) in days"
        :key="i"
        class="rd-day"
        :class="day.getTime() === today ? 'rd-day-active' : ''"
      >
        <div class="rd-day-date">
          <span class="rd-day-date-value rd-headline-3">{{
            day.getDate()
          }}</span>
          <span class="rd-day-date-placeholder rd-button-text">{{
            months[day.getMonth()].slice(0, 3)
          }}</span>
        </div>
        <div class="rd-day-body"></div>
      </div>
      <div
        v-if="period"
        class="rd-counter-container"
        :style="`left: ${
          Math.floor((today - period.start.getTime()) / 86400000) * 3
        }rem`"
      >
        <div ref="rdCounter" class="rd-counter">
          <div class="rd-counter-line"></div>
          <svg
            class="rd-counter-circle"
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
    <div
      v-if="!init"
      ref="rdDataContainer"
      @scroll="bindScroll"
      class="rd-data-container"
    >
      <div
        v-for="(data, i) in datas"
        :key="i"
        class="rd-data"
        :style="`width: ${(data.position?.w || 0) * 3}rem; left: ${
          (data.position?.x || 0) * 3
        }rem; top: ${
          (data.position?.y || 0) * 3.5 + ((data.position?.y || 0) + 1) * 0.75
        }rem`"
      >
        <div class="rd-data-name-container">
          <span class="rd-data-name rd-headline-5">{{ data.name }}</span>
          <span class="rd-data-period rd-caption-text">{{
            `${formatDate(data.period.start)} - ${formatDate(data.period.end)}`
          }}</span>
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
    data: ProjectTaskMinResponse[];
  }>();
  const { rem } = useMain();

  const rdDayContainer = ref<HTMLDivElement | null>(null);
  const rdDataContainer = ref<HTMLDivElement | null>(null);
  const rdCounter = ref<HTMLDivElement | null>(null);

  const datas = ref<DataTimeline[]>([]);

  const period = ref<Period | null>(null);
  const init = ref<boolean>(true);
  const today = ref<number>(new Date().setHours(0, 0, 0, 0));
  const days = ref<Date[]>([]);
  const daysInterval = ref<NodeJS.Timer | null>(null);

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

  function setPeriod(tasks: ProjectTaskMinResponse[]): void {
    if (tasks.length) {
      const allPeriod: [number[], number[]] = tasks.reduce<
        [number[], number[]]
      >(
        (a, b) => {
          if (b.period) {
            a[0].push(new Date(b.period.start).getTime());
            a[1].push(new Date(b.period.end).getTime());
          }
          return a;
        },
        [[], []]
      );

      if (allPeriod[0].length && allPeriod[1].length) {
        period.value = {
          start: new Date(Math.min(...allPeriod[0])),
          end: new Date(Math.max(...allPeriod[1])),
        };

        const diff =
          Math.ceil(
            (period.value.end.getTime() - period.value.start.getTime()) /
              86400000
          ) + 1;
        if (!days.value.length) {
          for (var i: number = 0; i < diff; i++) {
            days.value.push(
              new Date(period.value.start.setHours(0, 0, 0, 0) + 86400000 * i)
            );
          }
        }
      }
    }
  }
  function getPosition(data: DataTimeline): DataTimeline["position"] {
    const start = new Date(data.period.start);
    const end = new Date(data.period.end);

    const w: number = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const x: number = Math.ceil(
      (start.getTime() - (period.value?.start.getTime() || 0)) / 86400000
    );
    let y: number = 0;

    const settled = datas.value
      .filter((a) => !!a.position)
      .sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0))
      .map((a) => JSON.parse(JSON.stringify(a)));

    for (var i: number = 0; i < settled.length; i++) {
      const { x: x2, w: w2, y: y2 } = settled[i].position;
      if (y === y2) {
        if (x === x2 || (x > x2 && x <= x2 + w2) || (x < x2 && x + w >= x2)) {
          y += 1;
        }
      } else if (y < y2) break;
    }

    return {
      w,
      x,
      y,
    };
  }
  function formatDate(str: string): string {
    const date = new Date(str);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  function bindScroll(e: Event): void {
    if (
      e.target instanceof HTMLElement &&
      rdDayContainer.value &&
      rdDataContainer.value
    ) {
      const { scrollLeft } = e.target;
      rdDayContainer.value.scrollLeft = scrollLeft;
      rdDataContainer.value.scrollLeft = scrollLeft;
    }
  }
  function initCounter(shift?: boolean): void {
    if (rdCounter.value) {
      today.value = new Date().setHours(0, 0, 0, 0);
      const percentage = (new Date().getTime() - today.value) / 86400000;

      if (shift && period.value && rdDataContainer.value)
        rdDataContainer.value.scrollLeft =
          Math.floor((today.value - period.value.start.getTime()) / 86400000) *
          3 *
          rem.value;

      gsap.to(rdCounter.value, {
        x: `${percentage * 3}rem`,
        duration: 0,
      });

      daysInterval.value = setInterval(initCounter, 60000);
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (val?.length) {
        setPeriod(val);
        datas.value = val
          .filter((a) => !!a.period)
          .map<DataTimeline>((a) => ({
            name: a.name,
            period: a.period || {
              start: "",
              end: "",
            },
            status: a.status[0].kind,
            position: undefined,
          }));

        for (var i: number = 0; i < datas.value.length; i++) {
          datas.value[i].position = getPosition(datas.value[i]);
          if (i === datas.value.length - 1) init.value = false;
        }
        init.value = false;
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    initCounter(true);
  });
  onBeforeUnmount(() => {
    if (daysInterval.value) clearInterval(daysInterval.value);
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    height: 16.5rem;
    border: var(--border);
    border-radius: 0.75rem;
    box-sizing: border-box;
    flex-shrink: 0;
    overflow-x: hidden;
    .rd-day-container {
      pointer-events: none;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      overflow-x: auto;
      .rd-day {
        position: relative;
        width: 3rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        .rd-day-date {
          position: relative;
          width: 3rem;
          height: 3rem;
          border-bottom: var(--border);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          span.rd-day-date-value {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          span.rd-day-date-placeholder {
            position: relative;
            color: var(--font-sub-color);
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .rd-day-body {
          position: relative;
          width: 3rem;
          background: var(--background-depth-two-color);
          box-sizing: border-box;
          flex-grow: 1;
          opacity: 0.375;
        }
        &.rd-day-active {
          .rd-day-date {
            span {
              color: var(--primary-color) !important;
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
      .rd-counter-container {
        z-index: 2;
        position: absolute;
        top: 3rem;
        bottom: 0;
        left: 0;
        width: 3rem;
        height: calc(100% - 2.75rem);
        .rd-counter {
          position: relative;
          left: -0.25rem;
          width: 0.5rem;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          svg.rd-counter-circle {
            position: absolute;
            top: -0.25rem;
            left: 0;
            width: 0.5rem;
            height: 0.5rem;
          }
          .rd-counter-line {
            position: absolute;
            width: 2px;
            height: 100%;
            background: var(--warning-color);
          }
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .rd-data-container {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: calc(100% - 3rem);
      overflow: auto;
      overscroll-behavior: none;
      .rd-data {
        position: absolute;
        height: 3.5rem;
        border-radius: 0.5rem;
        border: var(--border);
        padding: 0.75rem;
        box-sizing: border-box;
        background: var(--background-depth-one-color);
        .rd-data-name-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          span.rd-data-name {
            position: relative;
            width: 100%;
            margin-bottom: 0.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span.rd-data-period {
            position: relative;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
