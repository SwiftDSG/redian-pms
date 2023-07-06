<template>
  <div class="rd-component">
    <div ref="rdDayContainer" v-if="!init" class="rd-day-container">
      <div v-for="(day, i) in days" :key="i" class="rd-day">
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

  const rdDayContainer = ref<HTMLDivElement | null>(null);
  const rdDataContainer = ref<HTMLDivElement | null>(null);

  const datas = ref<DataTimeline[]>([]);

  const period = ref<Period | null>(null);
  const days = ref<Date[]>([]);
  const init = ref<boolean>(true);

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
    const allPeriod: [number[], number[]] = tasks.reduce<[number[], number[]]>(
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

    const diff =
      Math.ceil(
        (period.value.end.getTime() - period.value.start.getTime()) / 86400000
      ) + 1;
    if (!days.value.length) {
      for (var i: number = 0; i < diff; i++) {
        days.value.push(
          new Date(period.value.start.setHours(0, 0, 0, 0) + 86400000 * i)
        );
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
