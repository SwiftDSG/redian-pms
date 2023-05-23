<template>
  <div class="rd-component">
    <div v-if="!loading" class="rd-day-container">
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
    <div v-if="!loading" class="rd-data-container">
      <div
        v-for="(data, i) in datas"
        :key="i"
        class="rd-data"
        :style="`width: ${(data.position?.w || 0) * 3}rem; left: ${
          (data.position?.x || 0) * 3
        }rem; top: ${
          (data.position?.y || 0) * 3.5 + ((data.position?.y || 0) + 1) * 0.75
        }rem`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
    overflow-x: auto;
    flex-shrink: 0;
    .rd-day-container {
      position: relative;
      height: 100%;
      display: flex;
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
    .rd-data-container {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: calc(100% - 3rem);
      .rd-data {
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
</style>
