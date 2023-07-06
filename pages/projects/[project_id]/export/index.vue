<template>
  <div class="rd-report-wrapper">
    <div class="rd-report-container">
      <div
        v-if="project.data"
        class="rd-report"
        ref="rdReport"
        :style="`width: ${(datas.length ? datas.length * 2 : 16) + 4}cm`"
      >
        <div class="rd-report-header">
          <div class="rd-report-detail-container">
            <span class="rd-report-name">Progress Report</span>
            <span class="rd-report-title">{{ project.data?.name }}</span>
            <span class="rd-report-description">{{
              `${formatDate(startDate || 0)} - ${formatDate(endDate || 0)}`
            }}</span>
          </div>
        </div>
        <div class="rd-report-body">
          <div class="rd-report-axis-container">
            <span class="rd-report-axis">100%</span>
            <span class="rd-report-axis">75%</span>
            <span class="rd-report-axis">50%</span>
            <span class="rd-report-axis">25%</span>
          </div>
          <div class="rd-report-sparkline-container">
            <svg class="rd-report-sparkline" ref="rdReportSparkline"></svg>
          </div>
          <div class="rd-report-legend-container">
            <div v-for="data in datas" :key="data.x" class="rd-report-legend">
              <div class="rd-report-legend-line"></div>
              <div
                class="rd-report-legend-plan"
                :style="data.y[0] < 50 ? 'top: 0.5cm' : 'bottom: 0.5cm'"
              >
                <span class="rd-report-legend-value">{{
                  `${data.y[0].toFixed(1)}`
                }}</span>
              </div>
              <div
                v-if="data.x <= today"
                class="rd-report-legend-actual"
                :class="
                  data.y[1] < data.y[0]
                    ? 'rd-report-legend-actual-behind'
                    : 'rd-report-legend-actual-ahead'
                "
                :style="data.y[1] < 50 ? 'top: 1.25cm' : 'bottom: 1.25cm'"
              >
                <span class="rd-report-legend-value">{{
                  `${data.y[1].toFixed(1)}`
                }}</span>
              </div>
            </div>
          </div>
          <div class="rd-report-cursor-container">
            <div
              v-for="data in datas"
              :key="data.x"
              class="rd-report-cursor"
              :style="`width: cm`"
            >
              <div
                class="rd-report-cursor-circle"
                :style="`background: var(--warning-color); bottom: ${data.y[0]}%; translate: 0 6px`"
              >
                <div class="rd-report-cursor-circle-inner"></div>
              </div>
              <div
                v-if="data.x <= today"
                class="rd-report-cursor-circle"
                :style="`background: ${
                  data.y[1] > data.y[0]
                    ? 'var(--success-color)'
                    : 'var(--error-color)'
                }; bottom: ${data.y[1]}%; translate: 0 6px`"
              >
                <div class="rd-report-cursor-circle-inner"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="rd-report-footer">
          <div
            v-for="(data, i) in datas"
            :key="data.x"
            class="rd-report-data-container"
          >
            <div class="rd-report-data">
              <span class="rd-report-data-placeholder">{{
                formatDate(data.x)
              }}</span>
            </div>
            <div class="rd-report-data">
              <span
                class="rd-report-data-value"
                style="color: var(--warning-color)"
                >{{ (data.y[0] - (datas[i - 1]?.y[0] || 0)).toFixed(2) }}</span
              >
            </div>
            <div class="rd-report-data">
              <span
                class="rd-report-data-value"
                :style="
                  data.x <= today
                    ? `color: ${
                        data.y[1] > data.y[0]
                          ? 'var(--success-color)'
                          : 'var(--error-color)'
                      }`
                    : ''
                "
                >{{
                  data.x <= today
                    ? (data.y[1] - (datas[i - 1]?.y[1] || 0)).toFixed(2)
                    : "-"
                }}</span
              >
            </div>
            <div class="rd-report-data">
              <span
                class="rd-report-data-value"
                :style="
                  data.x <= today
                    ? `color: ${
                        data.y[1] > data.y[0]
                          ? 'var(--success-color)'
                          : 'var(--error-color)'
                      }`
                    : ''
                "
                >{{
                  data.x <= today ? (data.y[1] - data.y[0]).toFixed(2) : "-"
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import html2canvas from "html2canvas";
  import { ProjectProgressResponse } from "types/project";

  type GroupKind = "daily" | "weekly" | "monthly";

  const { project, getProject, getProjectProgress } = useProject();
  const route = useRoute();

  const datas = ref<ProjectProgressResponse[]>([]);
  const today = ref<number>(new Date().setHours(23, 59, 59, 999));

  const rdReport = ref<HTMLDivElement | null>(null);
  const rdReportSparkline = ref<SVGSVGElement | null>(null);

  const startDate = computed<number | null>(() => {
    const date = route.query.start?.toString();
    if (!date) return null;
    return parseInt(date);
  });
  const endDate = computed<number | null>(() => {
    const date = route.query.end?.toString();
    if (!date) return null;
    return parseInt(date);
  });
  const groupKind = computed<GroupKind>(() => {
    const kind = route.query.group?.toString();
    if (kind === "weekly") return "weekly";
    if (kind === "monthly") return "monthly";
    return "daily";
  });

  async function download(): Promise<void> {
    if (rdReport.value) {
      const canvas = await html2canvas(rdReport.value, {
        useCORS: true,
        allowTaint: true,
      });
      const base64image = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = base64image;
      link.download = "Test.png";

      link.click();
      window.close();
    }
  }
  function draw(): void {
    if (rdReportSparkline.value) {
      const { width, height } = rdReportSparkline.value.getBoundingClientRect();

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

        rdLine1.setAttributeNS(null, "stroke", "#ffc904");
        rdLine1.setAttributeNS(null, "stroke-width", "2");

        rdReportSparkline.value.appendChild(rdLine1);

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
            datas.value[i + 1].y[1] > datas.value[i + 1].y[0]
              ? "#6bc785"
              : "#ff584c"
          );
          rdLine2.setAttributeNS(null, "stroke-width", "2");

          rdReportSparkline.value.appendChild(rdLine2);
        }

        if (i === xLen - 1) download();
      }
    }
  }
  function formatDate(num: number): string {
    const date = new Date(num);
    if (groupKind.value === "weekly") {
      return `W${getWeek(num)}/${date.getFullYear()}`;
    } else if (groupKind.value === "monthly") {
      return `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    }
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date
      .getFullYear()
      .toString()
      .slice(2)
      .padStart(2, "0")}`;
  }
  function getWeek(num: number): number {
    const date = new Date(num);
    const year = new Date(date.getFullYear(), 0, 1);

    date.setDate(date.getDate() + 4 - (date.getDay() || 7));

    return Math.ceil(((date.getTime() - year.getTime()) / 86400000 + 1) / 7);
  }

  onMounted(async () => {
    project.value = {
      data: await getProject({
        _id: route.params.project_id.toString(),
      }),
      progress: await getProjectProgress({
        _id: route.params.project_id.toString(),
      }),
      areas: null,
      timeline: null,
      users: null,
      reports: null,
    };

    if (project.value.progress) {
      if (startDate.value && endDate.value && startDate.value < endDate.value) {
        const start = startDate.value;
        const end = endDate.value;
        datas.value = project.value.progress.filter(
          (a) => a.x >= start && a.x <= end
        );
      } else {
        datas.value = project.value.progress;
      }

      if (groupKind.value === "weekly") {
        datas.value = datas.value.reduce((a: ProjectProgressResponse[], b) => {
          const index = a.findIndex((c) => {
            return (
              getWeek(b.x) === getWeek(c.x) &&
              new Date(b.x).getFullYear() === new Date(c.x).getFullYear()
            );
          });
          if (index > -1) {
            a[index].y[0] = b.y[0];
            a[index].y[1] = b.y[1];
          } else {
            a.push({
              x: b.x,
              y: b.y,
            });
          }

          return a;
        }, []);
      } else if (groupKind.value === "monthly") {
        datas.value = datas.value.reduce((a: ProjectProgressResponse[], b) => {
          const index = a.findIndex((c) => {
            return (
              new Date(b.x).getMonth() === new Date(c.x).getMonth() &&
              new Date(b.x).getFullYear() === new Date(c.x).getFullYear()
            );
          });
          if (index > -1) {
            a[index].y[0] = b.y[0];
            a[index].y[1] = b.y[1];
          } else {
            a.push({
              x: b.x,
              y: b.y,
            });
          }

          return a;
        }, []);
      }
      datas.value = [
        {
          x: datas.value[0].x,
          y: [0, 0],
        },
        ...datas.value,
      ];
    } else {
      window.close();
    }
    setTimeout(() => {
      if (rdReportSparkline.value) {
        draw();
      }
    }, 100);
  });
</script>

<style lang="scss" scoped>
  .rd-report-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--background-depth-three-color);
    display: flex;
    justify-content: center;
    overflow-x: auto;
    .rd-report-container {
      position: relative;
      width: 100%;
      display: flex;
      flex-grow: 1;
      span {
        font-family: "Courier New", Courier, monospace;
      }
      span.rd-report-title {
        font-weight: bold;
        font-size: 0.625cm;
        text-transform: uppercase;
      }
      span.rd-report-name {
        font-size: 0.625cm;
        text-transform: uppercase;
      }
      span.rd-report-description {
        font-size: 0.375cm;
        text-transform: uppercase;
      }
      .rd-report {
        position: absolute;
        min-width: 20cm;
        height: 100vh;
        padding: 2cm;
        box-sizing: border-box;
        background: var(--background-depth-one-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        .rd-report-header {
          position: relative;
          width: 100%;
          margin-bottom: 1cm;
          display: flex;
          justify-content: center;
          align-items: center;
          .rd-report-detail-container {
            position: relative;
            display: flex;
            gap: 0.1cm;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }
        .rd-report-body {
          position: relative;
          width: 100%;
          display: flex;
          flex: 1;
          .rd-report-axis-container {
            position: absolute;
            width: 100%;
            height: 100%;
            background: var(--background-depth-two-color);
            display: flex;
            flex-direction: column;
            opacity: 0.375;
            span.rd-report-axis {
              position: relative;
              width: 100%;
              height: 100%;
              padding-top: 0.25rem;
              font-size: 0.375cm;
              border-top: 1px solid var(--border-color);
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
          .rd-report-sparkline-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            svg.rd-report-sparkline {
              position: relative;
              width: 100%;
              height: 100%;
            }
          }
          .rd-report-cursor-container {
            pointer-events: none;
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            .rd-report-cursor {
              position: relative;
              width: 100%;
              height: 100%;
              &:first-child {
                display: none;
              }
              &:last-child {
                opacity: 0;
              }
              .rd-report-cursor-circle {
                position: absolute;
                right: -6px;
                bottom: 0;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                .rd-report-cursor-circle-inner {
                  position: relative;
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background: #fff;
                }
              }
            }
          }
          .rd-report-legend-container {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            box-sizing: border-box;
            .rd-report-legend {
              position: relative;
              width: 100%;
              height: 100%;
              translate: 50%;
              &:first-child {
                display: none;
              }
              &:last-child {
                opacity: 0;
              }
              .rd-report-legend-line {
                position: absolute;
                left: calc(50% - 0.5px);
                width: 1px;
                height: 100%;
                background: var(--border-color);
                opacity: 0.5;
              }
              .rd-report-legend-plan,
              .rd-report-legend-actual {
                position: absolute;
                left: 6.25%;
                width: 87.5%;
                height: 0.5cm;
                box-sizing: border-box;
                background: var(--background-depth-one-color);
                span.rd-report-legend-value {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  font-size: 0.25cm;
                  font-weight: bold;
                  line-height: 1;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }
              .rd-report-legend-plan {
                border: 1px solid var(--warning-color);
              }
              .rd-report-legend-actual {
                &.rd-report-legend-actual-ahead {
                  border: 1px solid var(--success-color);
                }
                &.rd-report-legend-actual-behind {
                  border: 1px solid var(--error-color);
                }
              }
            }
          }
        }
        .rd-report-footer {
          position: relative;
          width: 100%;
          height: 3cm;
          margin-top: 1cm;
          border: 1px solid black;
          box-sizing: border-box;
          display: flex;
          .rd-report-data-container {
            position: relative;
            width: 100%;
            height: 100%;
            border-right: 1px solid black;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .rd-report-data {
              position: relative;
              width: 100%;
              height: 100%;
              border-bottom: 1px solid black;
              box-sizing: border-box;
              span.rd-report-data-placeholder {
                position: relative;
                width: 100%;
                height: 100%;
                font-weight: bold;
                font-size: 0.25cm;
                line-height: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              span.rd-report-data-value {
                position: relative;
                width: 100%;
                height: 100%;
                font-size: 0.375cm;
                font-weight: bold;
                line-height: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              &:last-child {
                border: none;
              }
            }
            &:first-child {
              display: none;
            }
            &:last-child {
              border: none;
            }
          }
        }
      }
    }
  }
</style>
