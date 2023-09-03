<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-header">
      <span class="rd-panel-header-title rd-headline-3">Progress chart</span>
    </div>
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
          @mouseenter="dataHoverIndexChange(i - 1)"
        ></div>
        <div
          class="rd-panel-cursor"
          ref="rdPanelCursor"
          :style="`width: ${100 / datas.length}%;`"
        >
          <div class="rd-panel-cursor-line-container">
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
                :style="`fill: ${
                  dataHoverIndex > 0 && datas[dataHoverIndex].x <= today
                    ? datas[dataHoverIndex].y[1] > datas[dataHoverIndex].y[0]
                      ? 'var(--success-color)'
                      : 'var(--error-color)'
                    : 'rgba(0, 0, 0, 0)'
                }`"
              />
              <rect
                x="3"
                y="3"
                width="6"
                height="6"
                rx="3"
                :fill="
                  dataHoverIndex > 0 && datas[dataHoverIndex].x <= today
                    ? 'white'
                    : 'rgba(0, 0, 0, 0)'
                "
              />
            </svg>
            <div class="rd-panel-cursor-legend-container">
              <span class="rd-panel-cursor-legend-date rd-headline-5">{{
                formatDate(datas[dataHoverIndex]?.x || 0)
              }}</span>
              <div class="rd-panel-cursor-legend">
                <svg
                  class="rd-panel-cursor-circle-legend"
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
                <span class="rd-panel-cursor-legend-placeholder rd-caption-text"
                  >Plan:
                </span>
                <span class="rd-panel-cursor-legend-value rd-headline-6">{{
                  `${(datas[dataHoverIndex]?.y[0] || 0).toFixed(2)}%`
                }}</span>
              </div>
              <div
                v-if="dataHoverIndex > 0 && datas[dataHoverIndex].x <= today"
                class="rd-panel-cursor-legend"
                style="margin-top: 0.25rem"
              >
                <svg
                  class="rd-panel-cursor-circle-legend"
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
                    :style="`fill: ${
                      dataHoverIndex > 0 &&
                      datas[dataHoverIndex].y[1] > datas[dataHoverIndex].y[0]
                        ? 'var(--success-color)'
                        : 'var(--error-color)'
                    }`"
                  />
                  <rect x="3" y="3" width="6" height="6" rx="3" fill="white" />
                </svg>
                <span class="rd-panel-cursor-legend-placeholder rd-caption-text"
                  >Actual:
                </span>
                <span class="rd-panel-cursor-legend-value rd-headline-6">{{
                  `${(datas[dataHoverIndex]?.y[1] || 0).toFixed(2)}%`
                }}</span>
              </div>
            </div>
          </div>
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
    state: "idle" | "changing";
  }>();
  const emits = defineEmits(["change-menu", "changing-done"]);
  const { rem } = useMain();

  const rdPanel = ref<HTMLDivElement | null>(null);
  const rdPanelCursor = ref<HTMLDivElement | null>(null);
  const rdSparkline = ref<SVGSVGElement | null>(null);

  const dataHoverIndex = ref<number>(-1);
  const dataHoverTimeout = ref<NodeJS.Timeout | null>(null);
  const dataHoverAnim = ref<GSAPTimeline | null>(null);

  const datas = ref<DataProgress[]>([]);
  const today = ref<number>(new Date().setHours(23, 59, 59, 999));
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
    move(
      rdPanelCursor: HTMLElement,
      percentage: [number, number, number]
    ): GSAPTimeline {
      const tl = gsap.timeline();

      const rdParent: HTMLElement | null = rdPanelCursor.parentElement;
      const rdCursorLine: HTMLElement | null = rdPanelCursor.querySelector(
        ".rd-panel-cursor-line-container"
      );
      const rdCursorLegend: HTMLElement | null = rdPanelCursor.querySelector(
        ".rd-panel-cursor-legend-container"
      );
      const rdCursorCircle: HTMLElement[] = gsap.utils.toArray(
        rdPanelCursor.querySelectorAll("svg.rd-panel-cursor-circle")
      );

      if (rdParent && rdCursorLine && rdCursorCircle.length) {
        const { width: w1 } = rdPanelCursor.getBoundingClientRect();
        const { width: w2, height } = rdParent.getBoundingClientRect();

        const track = w2 - w1;

        tl.to(rdPanelCursor, {
          x: `${percentage[0] * track}px`,
          duration: 0.25,
          ease: "power2.inOut",
        })
          .to(
            rdCursorLine,
            {
              x: `${percentage[0] * w1}px`,
              duration: 0.25,
              ease: "power2.inOut",
            },
            "<0"
          )
          .to(
            rdCursorCircle[0],
            {
              y: `-${(percentage[1] / 100) * height}px`,
              duration: 0.25,
              ease: "power2.inOut",
            },
            "<0"
          )
          .to(
            rdCursorCircle[1],
            {
              y: `-${(percentage[2] / 100) * height}px`,
              duration: 0.25,
              ease: "power2.inOut",
            },
            "<0"
          );
      }

      if (percentage[0] > 0.5 && rdCursorLegend) {
        tl.to(
          rdCursorLegend,
          {
            x: `${
              -rdCursorLegend.getBoundingClientRect().width - 2 * rem.value
            }px`,
            duration: 0.25,
            ease: "power2.inOut",
          },
          "<0"
        );
      } else if (rdCursorLegend) {
        tl.to(
          rdCursorLegend,
          {
            x: 0,
            duration: 0.25,
            ease: "power2.inOut",
          },
          "<0"
        );
      }

      return tl;
    },
  };

  function dataHoverIndexChange(index: number): void {
    dataHoverIndex.value = index;
    if (dataHoverTimeout.value) clearTimeout(dataHoverTimeout.value);
    dataHoverTimeout.value = setTimeout(() => {
      if (dataHoverAnim.value) dataHoverAnim.value.kill();
      if (rdPanelCursor.value) {
        dataHoverAnim.value = animate.move(rdPanelCursor.value, [
          index / (datas.value.length - 1),
          datas.value[index].y[0] || 0,
          datas.value[index].y[1] || 0,
        ]);
      }
    }, 100);
  }
  function draw(): void {
    if (rdSparkline.value) {
      rdSparkline.value.innerHTML = "";
      const { width, height } = rdSparkline.value.getBoundingClientRect();

      const xLen = datas.value.length - 1;
      const xStep = width / xLen;

      for (let i: number = 0; i < xLen; i++) {
        const rdLine1: SVGLineElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );

        const x = (i + 1) * xStep;
        const y1 = height - (datas.value[i + 1].y[0] / 100) * height;
        const y2 = height - (datas.value[i + 1].y[1] / 100) * height;

        rdLine1.setAttributeNS(null, "x1", (i * xStep).toString());
        rdLine1.setAttributeNS(
          null,
          "y1",
          (height - (datas.value[i].y[0] / 100) * height).toString()
        );
        rdLine1.setAttributeNS(null, "x2", x.toString());
        rdLine1.setAttributeNS(null, "y2", y1.toString());

        rdLine1.setAttributeNS(null, "stroke", "var(--warning-color)");
        rdLine1.setAttributeNS(null, "stroke-width", "2");

        rdSparkline.value.appendChild(rdLine1);

        if (datas.value[i].x <= today.value - 86400000) {
          const rdLine2: SVGLineElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );

          rdLine2.setAttributeNS(null, "x1", (i * xStep).toString());
          rdLine2.setAttributeNS(
            null,
            "y1",
            (height - (datas.value[i].y[1] / 100) * height).toString()
          );
          rdLine2.setAttributeNS(null, "x2", x.toString());
          rdLine2.setAttributeNS(null, "y2", y2.toString());

          rdLine2.setAttributeNS(
            null,
            "stroke",
            datas.value[i + 1].y[1] > 0
              ? datas.value[i + 1].y[1] >= datas.value[i + 1].y[0]
                ? "var(--success-color)"
                : "var(--error-color)"
              : "transparent"
          );
          rdLine2.setAttributeNS(null, "stroke-width", "2");

          rdSparkline.value.appendChild(rdLine2);
        }

        if (i === xLen - 1) {
          gsap.to([rdSparkline.value.parentElement, rdSparkline.value], {
            x: 0,
            duration: 2,
            ease: "power2.out",
          });
        }
      }
    }
  }
  function formatDate(num: number): string {
    const date = new Date(num);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        datas.value = val;
        if (!init.value) draw();
      }
    }
  );
  watch(
    () => init.value,
    (val) => {
      if (!val && props.data) draw();
    }
  );
  watch(
    () => props.state,
    (val) => {
      if (val === "changing" && rdPanel.value) {
        animate.exit(rdPanel.value);
      }
    }
  );

  onMounted(() => {
    if (rdPanel.value) {
      animate.init(rdPanel.value, () => {
        emits("changing-done");
        init.value = false;
      });
    }
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
          transition: 0.25s opacity;
          .rd-panel-cursor-line-container {
            position: relative;
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
              bottom: -6px;
              width: 12px;
              height: 12px;
              transform: translateY(6px);
              * {
                transition: 0.25s fill;
              }
            }
            .rd-panel-cursor-legend-container {
              position: absolute;
              top: 1rem;
              left: calc(50% + 1rem);
              background: var(--background-depth-one-color);
              border-radius: 0.75rem;
              border: var(--border);
              padding: 0.75rem;
              display: flex;
              flex-direction: column;
              span.rd-panel-cursor-legend-date {
                position: relative;
                width: 100%;
                white-space: nowrap;
                margin-bottom: 0.5rem;
              }
              .rd-panel-cursor-legend {
                position: relative;
                display: flex;
                align-items: center;
                svg.rd-panel-cursor-circle {
                  position: relative;
                  width: 12px;
                  height: 12px;
                }
                span.rd-panel-cursor-legend-placeholder {
                  position: relative;
                  margin: 0 0.5rem 0 0.25rem;
                }
              }
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
    @media only screen and (max-width: 1024px) {
      min-height: calc(100vh - 12rem);
      margin-bottom: 1rem;
      flex: 0;
    }
  }
</style>
