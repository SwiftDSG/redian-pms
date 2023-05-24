<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-header"></div>
    <div class="rd-panel-body">
      <div class="rd-panel-axis-container">
        <div class="rd-panel-axis rd-caption-text">100%</div>
        <div class="rd-panel-axis rd-caption-text">75%</div>
        <div class="rd-panel-axis rd-caption-text">50%</div>
        <div class="rd-panel-axis rd-caption-text">25%</div>
      </div>
      <div class="rd-panel-sparkline-container">
        <div class="rd-panel-sparkline-wrapper">
          <svg class="rd-panel-sparkline" ref="rdSparkline"></svg>
        </div>
      </div>
      <div class="rd-panel-cursor-container">
        <div
          v-for="i in datas.length"
          :key="i"
          class="rd-panel-cursor-area"
          @mouseenter="dataHoverIndex = i - 1"
        ></div>
        <div
          class="rd-panel-cursor"
          :style="`width: ${100 / datas.length}%; left: ${
            (dataHoverIndex / datas.length) * 100
          }%`"
        >
          <div
            class="rd-panel-cursor-line-container"
            :style="`left: ${(dataHoverIndex / (datas.length - 1)) * 100}%`"
          >
            <svg
              class="rd-panel-cursor-line"
              width="2"
              height="1000"
              viewBox="0 0 2 1000"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0L1 1000"
                stroke="#CFCFCF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="5 3"
              />
            </svg>
            <svg
              class="rd-panel-cursor-circle"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              :style="`bottom: ${
                dataHoverIndex > 0 ? datas[dataHoverIndex].y[0] : 0
              }%;`"
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
              class="rd-panel-cursor-circle"
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
  </div>
</template>

<script lang="ts" setup>
  import { Project } from "~~/types/project";
  import { gsap } from "gsap";

  type DataProgress = {
    x: string[];
    y: number[];
  };

  const props = defineProps<{
    project: Project;
    state: "idle" | "changing";
  }>();
  const emits = defineEmits(["change-menu", "changing-done"]);

  const rdPanel = ref<HTMLDivElement>(null);
  const rdSparkline = ref<SVGSVGElement>(null);

  const dataHoverIndex = ref<number>(-1);

  const datas = ref<DataProgress[]>([
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
      y: [15],
    },
    {
      x: ["21 April 2023"],
      y: [21.5],
    },
    {
      x: ["21 April 2023"],
      y: [22.5],
    },
    {
      x: ["21 April 2023"],
      y: [23.5],
    },
    {
      x: ["21 April 2023"],
      y: [24.5],
    },
    {
      x: ["21 April 2023"],
      y: [25.5],
    },
    {
      x: ["21 April 2023"],
      y: [26.5],
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
      y: [100],
    },
  ]);

  const animate = {
    init(rdPanel: HTMLElement, cb: () => void): void {
      const tl = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdPanel, {
        opacity: 1,
        duration: 0.25,
      });
    },
    exit(rdPanel: HTMLElement): void {
      const tl = gsap.timeline();

      tl.to(rdPanel, {
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
    }
  }

  onMounted(() => {
    animate.init(rdPanel.value, () => {
      emits("changing-done");
      setTimeout(() => {
        draw();
        gsap.to([rdSparkline.value.parentElement, rdSparkline.value], {
          x: 0,
          duration: 2,
          ease: "power2.inOut",
        });
      }, 100);
    });
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    position: relative;
    width: 100%;
    margin-bottom: 2rem;
    padding: 0.75rem;
    border: var(--border);
    border-radius: 1rem;
    box-sizing: border-box;
    background: var(--background-depth-one-color);
    display: flex;
    flex: 1;
    flex-direction: column;
    opacity: 0;
    .rd-panel-header {
      position: relative;
      width: 100%;
      height: 2rem;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .rd-panel-body {
      position: relative;
      width: 100%;
      border: var(--border);
      border-radius: 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex: 1;
      overflow: hidden;
      .rd-panel-axis-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--background-depth-two-color);
        display: flex;
        flex-direction: column;
        opacity: 0.375;
        .rd-panel-axis {
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
      .rd-panel-sparkline-container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
        .rd-panel-sparkline-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          transform: translateX(-100%);
          overflow: hidden;
          svg.rd-panel-sparkline {
            position: relative;
            width: 100%;
            height: 100%;
            transform: translateX(100%);
          }
        }
      }
      .rd-panel-cursor-container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        .rd-panel-cursor-area {
          position: relative;
          width: 100%;
          height: 100%;
          flex-grow: 1;
        }
        .rd-panel-cursor {
          position: absolute;
          left: 0;
          height: 100%;
          opacity: 0;
          transition: 0.25s left, 0.25s opacity;
          .rd-panel-cursor-line-container {
            position: relative;
            left: 50%;
            width: 12px;
            transform: translateX(-6px);
            height: 100%;
            display: flex;
            justify-content: center;
            transition: 0.25s left;
            svg.rd-panel-cursor-line {
              position: absolute;
              height: 100%;
            }
            svg.rd-panel-cursor-circle {
              position: absolute;
              bottom: 0;
              width: 12px;
              height: 12px;
              transform: translateY(6px);
              transition: 0.25s bottom;
            }
          }
          &.rd-panel-cursor-active {
            opacity: 1;
          }
        }
        &:hover {
          .rd-panel-cursor {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
