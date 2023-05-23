<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-task-container">
      <div class="rd-panel-task-header"></div>
      <div class="rd-panel-task-body"></div>
    </div>
    <div class="rd-panel-timeline-container">
      <div class="rd-panel-timeline">
        <div v-if="!loading" class="rd-panel-timeline-day-container">
          <div v-for="(day, i) in days" :key="i" class="rd-panel-timeline-day">
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
        </div>
        <div v-if="!loading" class="rd-panel-timeline-data-container">
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
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import { Project } from "~~/types/project";

  type DataTimeline = {
    name: string;
    period: [Date, Date];
    status: string;
    position?: {
      w: number;
      x: number;
      y: number;
    };
  };

  const props = defineProps<{
    project: Project;
    state: "idle" | "changing";
  }>();
  const emits = defineEmits(["change-menu", "changing-done"]);

  const rdPanel = ref<HTMLDivElement>(null);

  const datas = ref<DataTimeline[]>([
    {
      name: "Some task#1",
      period: [new Date(), new Date(new Date().getTime() + 86400000)],
      status: "",
    },
    {
      name: "Some task#2",
      period: [
        new Date(new Date().getTime() + 86400000),
        new Date(new Date().getTime() + 4 * 86400000),
      ],
      status: "",
    },
    {
      name: "Some task#3",
      period: [new Date(), new Date(new Date().getTime() + 86400000)],
      status: "",
    },
    {
      name: "Some task#4",
      period: [
        new Date(new Date().getTime() + 3 * 86400000),
        new Date(new Date().getTime() + 10 * 86400000),
      ],
      status: "",
    },
  ]);

  const period = ref<DataTimeline["period"]>([null, null]);
  const days = ref<Date[]>([]);
  const loading = ref<boolean>(true);

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

  watch(
    () => props.state,
    (val) => {
      if (val === "changing") {
        animate.exit(rdPanel.value);
      }
    }
  );

  function setPeriod(datas: DataTimeline[]): void {
    const allPeriod: [number[], number[]] = datas.reduce(
      (a, b) => {
        a[0].push(b.period[0].getTime());
        a[1].push(b.period[1].getTime());
        return a;
      },
      [[], []]
    );

    period.value[0] = new Date(Math.min(...allPeriod[0]));
    period.value[1] = new Date(Math.max(...allPeriod[1]));

    const diff =
      Math.ceil(
        (period.value[1].getTime() - period.value[0].getTime()) / 86400000
      ) + 1;
    for (var i: number = 0; i < diff; i++) {
      days.value.push(
        new Date(period.value[0].setHours(0, 0, 0, 0) + 86400000 * i)
      );
    }
  }
  function getPosition(data: DataTimeline): DataTimeline["position"] {
    const start = new Date(data.period[0]);
    const end = new Date(data.period[1]);

    const w: number =
      Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    const x: number =
      Math.ceil((start.getTime() - period.value[0].getTime()) / 86400000) - 1;
    let y: number = 0;

    const settled = datas.value
      .filter((a) => !!a.position)
      .sort((a, b) => a.position.y - b.position.y)
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

  onMounted(() => {
    setPeriod(datas.value);
    for (var i: number = 0; i < datas.value.length; i++) {
      datas.value[i].position = getPosition(datas.value[i]);
      if (i === datas.value.length - 1) loading.value = false;
    }

    animate.init(rdPanel.value, () => {
      emits("changing-done");
    });
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    position: relative;
    width: 100%;
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
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .rd-panel-timeline-data-container {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: calc(100% - 3rem);
          .rd-panel-timeline-data {
            position: absolute;
            height: 3.5rem;
            border-radius: 0.5rem;
            border: var(--border);
            padding: 0.75rem;
            box-sizing: border-box;
            background: var(--background-depth-one-color);
          }
        }
      }
    }
  }
</style>
