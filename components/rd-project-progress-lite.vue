<template>
  <div class="rd-component">
    <div class="rd-axis-container">
      <div class="rd-axis rd-caption-text">100%</div>
      <div class="rd-axis rd-caption-text">75%</div>
      <div class="rd-axis rd-caption-text">50%</div>
      <div class="rd-axis rd-caption-text">25%</div>
    </div>
    <div class="rd-sparkline-wrapper">
      <div class="rd-sparkline-container">
        <svg class="rd-sparkline" ref="rdSparkline"></svg>
      </div>
    </div>
    <div class="rd-cursor-container">
      <div
        v-for="i in datas.length"
        :key="i"
        class="rd-cursor-area"
        @mouseenter="dataHoverIndex = i - 1"
      ></div>
      <div
        class="rd-cursor"
        :style="`width: ${100 / datas.length}%; left: ${
          (dataHoverIndex / datas.length) * 100
        }%`"
      >
        <div
          class="rd-cursor-line-container"
          :style="`left: ${(dataHoverIndex / (datas.length - 1)) * 100}%`"
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
              dataHoverIndex > 0 ? datas[dataHoverIndex].y[0] : 0
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
  import { ProjectProgressResponse, ProjectResponse } from "~~/types/project";
  import { gsap } from "gsap";

  type DataProgress = {
    x: number;
    y: number[];
  };

  const props = defineProps<{
    project: ProjectResponse;
    data: ProjectProgressResponse[];
  }>();

  const rdSparkline = ref<SVGSVGElement>(null);

  const dataHoverIndex = ref<number>(-1);

  const datas = ref<DataProgress[]>([]);

  function draw(): void {
    const { width, height } = rdSparkline.value.getBoundingClientRect();

    const xLen = datas.value.length - 1;
    const xStep = width / xLen;

    for (let i: number = 0; i < xLen; i++) {
      const rdLine: SVGLineElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      const x = (i + 1) * xStep;
      const y = height - (datas.value[i + 1].y[0] / 100) * height;

      rdLine.setAttributeNS(null, "x1", (i * xStep).toString());
      rdLine.setAttributeNS(
        null,
        "y1",
        (height - (datas.value[i].y[0] / 100) * height).toString()
      );
      rdLine.setAttributeNS(null, "x2", x.toString());
      rdLine.setAttributeNS(null, "y2", y.toString());

      rdLine.setAttributeNS(null, "stroke", "#000");
      rdLine.setAttributeNS(null, "stroke-width", "2");

      rdSparkline.value.appendChild(rdLine);
      if (i === xLen - 1) {
        gsap.to([rdSparkline.value.parentElement, rdSparkline.value], {
          x: 0,
          duration: 2,
          ease: "power2.out",
        });
      }
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        datas.value = val;
        if (rdSparkline.value) draw();
      }
    },
    {
      immediate: true,
    }
  );
  onMounted(() => {
    if (props.data) draw();
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
    .rd-sparkline-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      .rd-sparkline-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        transform: translateX(-100%);
        overflow: hidden;
        svg.rd-sparkline {
          position: relative;
          width: 100%;
          height: 100%;
          transform: translateX(100%);
        }
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
