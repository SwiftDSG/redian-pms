<template>
  <div class="rd-component">
    <div class="rd-axis-container">
      <div class="rd-axis rd-caption-text">100%</div>
      <div class="rd-axis rd-caption-text">75%</div>
      <div class="rd-axis rd-caption-text">50%</div>
      <div class="rd-axis rd-caption-text">25%</div>
    </div>
    <div class="rd-sparkline-container">
      <canvas class="rd-sparkline" ref="rdSparklineCanvas"></canvas>
    </div>
    <div class="rd-cursor-container">
      <div
        v-for="i in datas.length"
        :key="i"
        class="rd-cursor-area"
        @mouseenter="canvasHoverIndex = i - 1"
      ></div>
      <div
        class="rd-cursor"
        :style="`width: ${100 / datas.length}%; left: ${
          (canvasHoverIndex / datas.length) * 100
        }%`"
      >
        <div
          class="rd-cursor-line-container"
          :style="`left: ${(canvasHoverIndex / (datas.length - 1)) * 100}%`"
        >
          <svg
            class="rd-cursor-line"
            width="2"
            height="500"
            viewBox="0 0 2 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0L1 500"
              stroke="#CFCFCF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-dasharray="5 3"
            />
          </svg>
          <svg
            class="rd-cursor-circle"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :style="`bottom: ${
              canvasHoverIndex > 0 ? datas[canvasHoverIndex].y[0] : 0
            }%`"
          >
            <rect
              width="12"
              height="12"
              rx="6"
              style="fill: var(--warning-color)"
            />
            <rect x="3" y="3" width="6" height="6" rx="3" fill="white" />
          </svg>
          <svg
            class="rd-cursor-circle"
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
              style="fill: var(--primary-color)"
            />
            <rect x="3" y="3" width="6" height="6" rx="3" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  type Data = {
    x: string[];
    y: number[];
  };

  const rdSparklineCanvas = ref<HTMLCanvasElement>(null);

  const canvasCtx = ref<CanvasRenderingContext2D>(null);
  const canvasHoverIndex = ref<number>(-1);
  const canvasDotsCount = ref<number>(0);

  const datas: Data[] = [
    {
      x: ["21 April 2023"],
      y: [0],
    },
    {
      x: ["21 April 2023"],
      y: [12.5],
    },
    {
      x: ["21 April 2023"],
      y: [27.5],
    },
    {
      x: ["21 April 2023"],
      y: [50],
    },
    {
      x: ["21 April 2023"],
      y: [77.5],
    },
    {
      x: ["21 April 2023"],
      y: [87.5],
    },
    {
      x: ["21 April 2023"],
      y: [95],
    },
    {
      x: ["21 April 2023"],
      y: [100],
    },
  ];

  onMounted(() => {
    const { width, height }: DOMRect =
      rdSparklineCanvas.value.getBoundingClientRect();

    rdSparklineCanvas.value.width = width * 10;
    rdSparklineCanvas.value.height = height * 10;

    canvasCtx.value = rdSparklineCanvas.value.getContext("2d");
    canvasCtx.value.clearRect(
      0,
      0,
      rdSparklineCanvas.value.width,
      rdSparklineCanvas.value.height
    );
    canvasCtx.value.lineWidth = 20;
    canvasCtx.value.beginPath();

    const xStep = rdSparklineCanvas.value.width / (datas.length - 1);
    const yStep = rdSparklineCanvas.value.height;

    canvasCtx.value.moveTo(0, rdSparklineCanvas.value.height);
    for (var i: number = 0; i < datas.length; i++) {
      const data = datas[i];

      const x = i * xStep;
      const y = yStep - (data.y[0] / 100) * yStep;

      canvasCtx.value.lineTo(x, y);
    }
    canvasCtx.value.stroke();
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
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    .rd-axis-container {
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--background-depth-two-color);
      display: flex;
      flex-direction: column;
      opacity: 0.375;
      .rd-axis {
        position: relative;
        width: 100%;
        height: 100%;
        padding-top: 0.25rem;
        border-top: 1px solid rgba(0, 0, 0, 0.375);
        color: var(--font-sub-color);
        box-sizing: border-box;
        flex-shrink: 1;
        display: flex;
        justify-content: center;
        &:first-child {
          border: none;
        }
      }
    }
    .rd-sparkline-container {
      position: absolute;
      width: 100%;
      height: 100%;
      canvas.rd-sparkline {
        position: relative;
        width: 100%;
        height: 100%;
      }
    }
    .rd-cursor-container {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      .rd-cursor-area {
        position: relative;
        width: 100%;
        height: 100%;
        flex-grow: 1;
      }
      .rd-cursor {
        position: absolute;
        left: 0;
        height: 100%;
        opacity: 0;
        transition: 0.25s left, 0.25s opacity;
        .rd-cursor-line-container {
          position: relative;
          left: 50%;
          width: 12px;
          transform: translateX(-6px);
          height: 100%;
          display: flex;
          justify-content: center;
          transition: 0.25s left;
          svg.rd-cursor-line {
            position: absolute;
            height: 100%;
          }
          svg.rd-cursor-circle {
            position: absolute;
            bottom: 0;
            width: 12px;
            height: 12px;
            transform: translateY(6px);
            transition: 0.25s bottom;
          }
        }
        &.rd-cursor-active {
          opacity: 1;
        }
      }
      &:hover {
        .rd-cursor {
          opacity: 1;
        }
      }
    }
  }
</style>