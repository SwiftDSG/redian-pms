<template>
  <div class="rd-report-wrapper">
    <div v-if="company" class="rd-report-container">
      <div
        v-if="project.data"
        class="rd-report"
        ref="rdReportChart"
        :style="`width: ${(datas.length ? datas.length * 2 : 16) + 4}cm`"
      >
        <div class="rd-report-header">
          <div class="rd-report-logo-container">
            <img
              :src="
                company.image
                  ? `${config.public.apiBase}/files?kind=company_image&name=${company._id}/${company.image._id}.${company.image.extension}`
                  : `${config.app.baseURL}/logo.svg`
              "
              class="rd-report-logo"
            />
          </div>
          <div class="rd-report-detail-container">
            <span class="rd-report-name">{{ company.name }}</span>
            <span class="rd-report-name">{{
              `Cumulative Report: ${formatDate(
                startDate || datas[0].x
              )} - ${formatDate(endDate || datas[datas.length - 1].x)}`
            }}</span>
            <span class="rd-report-title">{{ project.data?.name }}</span>
          </div>
          <div class="rd-report-logo-container">
            <img
              :src="
                project.data?.customer.image
                  ? `${config.public.apiBase}/files?kind=customer_image&name=${project.data?.customer._id}/${project.data?.customer.image._id}.${project.data?.customer.image.extension}`
                  : `${config.app.baseURL}/default_customer.svg`
              "
              class="rd-report-logo"
            />
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
                :style="`background: #ffd975; bottom: ${data.y[0]}%; translate: 0 6px`"
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
              <span class="rd-report-data-value" style="color: #ffd975">{{
                (data.y[0] - (datas[i - 1]?.y[0] || 0)).toFixed(2)
              }}</span>
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
      <div
        v-if="project.data"
        class="rd-report"
        ref="rdReportDetail"
        style="width: 29.7cm; height: auto"
      >
        <div class="rd-report-header">
          <div class="rd-report-logo-container">
            <img
              :src="
                company.image
                  ? `${config.public.apiBase}/files?kind=company_image&name=${company._id}/${company.image._id}.${company.image.extension}`
                  : `${config.app.baseURL}/logo.svg`
              "
              class="rd-report-logo"
            />
          </div>
          <div class="rd-report-detail-container">
            <span class="rd-report-name">{{ company.name }}</span>
            <span class="rd-report-name">Cumulative Report Detail</span>
            <span class="rd-report-title">{{ project.data?.name }}</span>
          </div>
          <div class="rd-report-logo-container">
            <img
              :src="
                project.data?.customer.image
                  ? `${config.public.apiBase}/files?kind=customer_image&name=${project.data?.customer._id}/${project.data?.customer.image._id}.${project.data?.customer.image.extension}`
                  : `${config.app.baseURL}/default_customer.svg`
              "
              class="rd-report-logo"
            />
          </div>
        </div>
        <div class="rd-report-details">
          <div class="rd-report-detail">
            <span class="rd-report-detail-placeholder">Current period:</span>
            <span class="rd-report-detail-value">{{
              `${formatDate(startDate || datas[0].x)} - ${formatDate(
                endDate || datas[datas.length - 1].x
              )}`
            }}</span>
          </div>
          <div v-if="otherValid" class="rd-report-detail">
            <span class="rd-report-detail-placeholder">Comparison period:</span>
            <span class="rd-report-detail-value">{{
              `${formatDate(otherStartDate || 0)} - ${formatDate(
                otherEndDate || 0
              )}`
            }}</span>
          </div>
        </div>
        <div
          class="rd-report-table"
          :class="otherValid ? 'rd-report-table-compare' : ''"
        >
          <div class="rd-report-table-header">
            <span class="rd-report-table-data">No</span>
            <span class="rd-report-table-data rd-report-table-data-name"
              >Name</span
            >
            <span class="rd-report-table-data rd-report-table-data-volume"
              >Volume</span
            >
            <span
              v-if="otherValid"
              class="rd-report-table-data rd-report-table-data-value"
              >Comparison period (%)</span
            >
            <span class="rd-report-table-data rd-report-table-data-value"
              >Current period (%)</span
            >
            <span class="rd-report-table-data rd-report-table-data-value"
              >Cumulative (%)</span
            >
          </div>
          <div
            v-for="area in areas"
            :key="area._id"
            class="rd-report-table-area"
          >
            <span class="rd-report-table-data rd-report-table-data-area">{{
              area.name
            }}</span>
            <div
              v-for="(task, i) in area.task"
              :key="task._id"
              class="rd-report-table-body"
            >
              <span class="rd-report-table-data">{{ i + 1 }}</span>
              <span
                class="rd-report-table-data rd-report-table-data-name"
                :style="`padding-left: ${0.25 * getLevel(task._id)}cm`"
                >{{ task.name }}</span
              >
              <span class="rd-report-table-data rd-report-table-data-volume">{{
                task.volume
                  ? `${task.volume.value} ${task.volume.unit}`
                  : "1 pcs"
              }}</span>
              <span
                v-if="otherValid"
                class="rd-report-table-data rd-report-table-data-value"
                >{{
                  task.count?.other.toLocaleString("de-DE", {
                    maximumFractionDigits: 4,
                  }) || ""
                }}</span
              >
              <span class="rd-report-table-data rd-report-table-data-value">{{
                task.count?.current.toLocaleString("de-DE", {
                  maximumFractionDigits: 4,
                }) || ""
              }}</span>
              <span class="rd-report-table-data rd-report-table-data-value">{{
                task.count?.cumulative.toLocaleString("de-DE", {
                  maximumFractionDigits: 4,
                }) || ""
              }}</span>
            </div>
          </div>
          <div class="rd-report-table-footer">
            <span class="rd-report-table-data rd-report-table-data-total"
              >Total</span
            >
            <span
              v-if="otherValid"
              class="rd-report-table-data rd-report-table-data-value"
              >{{
                total.other.toLocaleString("de-DE", {
                  maximumFractionDigits: 4,
                })
              }}</span
            >
            <span class="rd-report-table-data rd-report-table-data-value">{{
              total.current.toLocaleString("de-DE", {
                maximumFractionDigits: 4,
              })
            }}</span>
            <span class="rd-report-table-data rd-report-table-data-value">{{
              total.cumulative.toLocaleString("de-DE", {
                maximumFractionDigits: 4,
              })
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import html2canvas from "html2canvas";
  import { ProjectProgressResponse } from "types/project";
  import { ProjectTaskMinResponse } from "types/project-task";

  type GroupKind = "daily" | "weekly" | "monthly";
  interface RelationalObject extends ProjectTaskMinResponse {
    child?: RelationalObject[];
  }
  interface ProjectTask extends ProjectTaskMinResponse {
    count?: {
      other: number;
      current: number;
      cumulative: number;
    };
  }

  const {
    project,
    getProject,
    getProjectProgress,
    getProjectTasks,
    getProjectReports,
  } = useProject();
  const { company } = useCompany();
  const config = useRuntimeConfig();
  const route = useRoute();

  const datas = ref<ProjectProgressResponse[]>([]);
  const today = ref<number>(new Date().setHours(23, 59, 59, 999));

  const rdReportChart = ref<HTMLDivElement | null>(null);
  const rdReportDetail = ref<HTMLDivElement | null>(null);
  const rdReportSparkline = ref<SVGSVGElement | null>(null);

  const areas = computed<
    {
      _id: string;
      name: string;
      task: ProjectTask[];
    }[]
  >(
    () =>
      project.value.data?.area?.map((a) => {
        const task: ProjectTask[] = sort(
          project.value.timeline?.filter((b) => b.area_id === a._id) || []
        ).map((a) => {
          if (
            project.value.timeline?.findIndex((b) => b.task_id === a._id) === -1
          ) {
            return {
              ...a,
              count: {
                other: otherValid.value
                  ? getCompletition(a._id, {
                      start: new Date(otherStartDate.value || 0),
                      end: new Date(otherEndDate.value || 0),
                    })
                  : 0,
                current: getCompletition(a._id, {
                  start: new Date(startDate.value || datas.value[0]?.x),
                  end: new Date(
                    endDate.value || datas.value[datas.value.length - 1]?.x
                  ),
                }),
                cumulative: getCompletition(a._id),
              },
            };
          }
          return a;
        });

        return {
          _id: a._id,
          name: a.name,
          task,
        };
      }) || []
  );
  const total = computed<{
    other: number;
    current: number;
    cumulative: number;
  }>(() =>
    areas.value.reduce<{
      other: number;
      current: number;
      cumulative: number;
    }>(
      (v, a) => {
        return a.task.reduce<{
          other: number;
          current: number;
          cumulative: number;
        }>(
          (v, a) => ({
            other: v.other + (a.count?.other || 0),
            current: v.current + (a.count?.current || 0),
            cumulative: v.cumulative + (a.count?.cumulative || 0),
          }),
          v
        );
      },
      {
        other: 0,
        current: 0,
        cumulative: 0,
      }
    )
  );

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
  const otherStartDate = computed<number | null>(() => {
    const date = route.query.other_start?.toString();
    if (!date) return null;
    return parseInt(date);
  });
  const otherEndDate = computed<number | null>(() => {
    const date = route.query.other_end?.toString();
    if (!date) return null;
    return parseInt(date);
  });
  const otherValid = computed<boolean>(
    () => (otherStartDate.value || 0) < (otherEndDate.value || 0)
  );
  const groupKind = computed<GroupKind>(() => {
    const kind = route.query.group?.toString();
    if (kind === "weekly") return "weekly";
    if (kind === "monthly") return "monthly";
    return "daily";
  });

  async function download(): Promise<void> {
    if (rdReportChart.value) {
      const canvas = await html2canvas(rdReportChart.value, {
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
      });
      const base64image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = base64image;
      link.download = `Cumulative Report Graph ${
        project.value.data?.name || "Project"
      } ${formatDate(startDate.value || datas.value[0].x)}-${formatDate(
        endDate.value || datas.value[datas.value.length - 1].x
      )}.png`;
      link.click();
    }
    if (rdReportDetail.value) {
      const canvas = await html2canvas(rdReportDetail.value, {
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
      });
      const base64image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = base64image;
      link.download = `Cumulative Report Table ${
        project.value.data?.name || "Project"
      } ${formatDate(startDate.value || datas.value[0].x)}-${formatDate(
        endDate.value || datas.value[datas.value.length - 1].x
      )}.png`;
      link.click();
    }
    window.close();
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
  function getLevel(_id: string): number {
    if (project.value.timeline?.length) {
      const task = project.value.timeline.find((a) => a._id === _id);
      if (task) {
        let value = 1;
        if (task.task_id) {
          _id = task.task_id;
          let found = true;
          while (found) {
            const task = project.value.timeline.find((a) => a._id === _id);
            if (task) {
              value++;
              if (task.task_id) _id = task.task_id;
              else found = false;
            } else found = false;
          }
        }
        return value;
      }
    }
    return 1;
  }
  function getValue(_id: string): number {
    if (project.value.timeline?.length) {
      const task = project.value.timeline.find((a) => a._id === _id);
      if (task) {
        let value = task.value / 100;
        if (task.task_id) {
          _id = task.task_id;
          let found = true;
          while (found) {
            const task = project.value.timeline.find((a) => a._id === _id);
            if (task) {
              value *= task.value / 100;
              if (task.task_id) _id = task.task_id;
              else found = false;
            } else found = false;
          }
        }
        return value * 100;
      }
    }
    return 0;
  }
  function getCompletition(
    _id: string,
    period?: {
      start: Date;
      end: Date;
    }
  ): number {
    if (project.value.timeline?.length && project.value.reports?.length) {
      const start = period?.start.setHours(0, 0, 0, 0) || 0;
      const end = period?.end.setHours(23, 59, 59, 999) || 0;
      const completed = project.value.reports
        .filter((a) => {
          if (a.progress) {
            const index = (a.progress.actual || []).findIndex(
              (b) => b.task_id === _id
            );
            if (index > -1) {
              if (
                start &&
                end &&
                start < end &&
                new Date(a.progress.date).getTime() >= start &&
                new Date(a.progress.date).getTime() <= end
              )
                return true;
              else if (!start && !end) return true;
            }
          }
          return false;
        })
        .reduce((v, a) => {
          if (a.progress && a.progress.actual) {
            const task = a.progress.actual.find((b) => b.task_id === _id);
            if (task) return v + task.value;
          }
          return v;
        }, 0);

      const value = (completed / 100) * getValue(_id);
      return value;
    }
    return 0;
  }
  function sort(arr: ProjectTaskMinResponse[]): ProjectTaskMinResponse[] {
    const copy: RelationalObject[] = JSON.parse(JSON.stringify(arr));

    const keys: { [key: string]: RelationalObject } = {};
    copy.forEach((obj) => {
      keys[obj._id] = obj;
      obj.child = [];
    });

    const root: RelationalObject[] = [];
    copy.forEach((obj) => {
      if (!obj.task_id) {
        root.push(obj);
      } else {
        const parent = keys[obj.task_id];
        if (parent?.child) {
          parent.child.push(obj);
        }
      }
    });

    const result: RelationalObject[] = [];
    function traverse(node: RelationalObject) {
      result.push(node);
      if (node.child?.length) {
        node.child.sort((a, b) => a._id.localeCompare(b._id));
        node.child.forEach((child) => traverse(child));
      }
    }

    root.sort((a, b) => a._id.localeCompare(b._id));
    root.forEach((root) => traverse(root));

    return result.map((a) => {
      delete a.child;
      return a;
    });
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
      timeline: await getProjectTasks({
        _id: route.params.project_id.toString(),
        query: {
          kind: "full",
        },
      }),
      users: null,
      reports: await getProjectReports({
        _id: route.params.project_id.toString(),
      }),
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
    background: #fff;
    display: flex;
    overflow: auto;
    .rd-report-container {
      position: relative;
      width: fit-content;
      height: fit-content;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      span {
        font-family: "Courier New", Courier, monospace;
        color: #000 !important;
      }
      span.rd-report-title {
        font-weight: bold;
        font-size: 0.5cm;
        text-transform: uppercase;
      }
      span.rd-report-name {
        font-size: 0.5cm;
        text-transform: uppercase;
      }
      span.rd-report-description {
        font-size: 0.375cm;
        text-transform: uppercase;
      }
      .rd-report {
        position: relative;
        min-width: 29.7cm;
        height: 100vh;
        padding: 2cm;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        align-items: center;
        .rd-report-header {
          position: relative;
          width: 25.7cm;
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
          .rd-report-logo-container {
            position: absolute;
            left: 0;
            width: 2cm;
            height: 2cm;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              position: relative;
              width: 100%;
              object-fit: contain;
            }
            &:last-child {
              left: auto;
              right: 0;
            }
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
            background: #f0f0f0;
            display: flex;
            flex-direction: column;
            opacity: 0.375;
            span.rd-report-axis {
              position: relative;
              width: 100%;
              height: 100%;
              padding-top: 0.25rem;
              font-size: 0.375cm;
              border-top: 1px solid #fafafa;
              color: rgba(0, 0, 0, 0.375);
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
                background: #fafafa;
                opacity: 0.5;
              }
              .rd-report-legend-plan,
              .rd-report-legend-actual {
                position: absolute;
                left: 6.25%;
                width: 87.5%;
                height: 0.5cm;
                box-sizing: border-box;
                background: #fff;
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
                border: 1px solid #ffd975;
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
                font-size: 0.3cm;
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
        .rd-report-details {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25cm;
          .rd-report-detail {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5cm;
            span.rd-report-detail-placeholder {
              position: relative;
              font-size: 0.375cm;
              line-height: 1;
            }
            span.rd-report-detail-value {
              position: relative;
              font-size: 0.375cm;
              font-weight: bold;
              line-height: 1;
            }
          }
        }
        .rd-report-table {
          position: relative;
          width: 100%;
          margin-top: 0.5cm;
          display: flex;
          flex-direction: column;
          .rd-report-table-header,
          .rd-report-table-footer {
            position: relative;
            width: 100%;
            border-left: 1px solid black;
            border-bottom: 1px solid #000;
            box-sizing: border-box;
            display: flex;
            span.rd-report-table-data {
              height: 1cm;
              font-weight: bold;
              align-items: center;
            }
          }
          .rd-report-table-header {
            border-top: 1px solid #000;
          }
          .rd-report-table-area {
            position: relative;
            width: 100%;
            border-left: 1px solid black;
            border-bottom: 1px solid #000;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            span.rd-report-table-data-area {
              width: 100%;
              height: 1cm;
              font-weight: bold;
              border-bottom: 1px solid #000;
              align-items: center;
            }
            .rd-report-table-body {
              position: relative;
              width: 100%;
              display: flex;
              &:nth-child(2) {
                span.rd-report-table-data {
                  padding-top: 0.25cm;
                }
              }
              span.rd-report-table-data {
                padding-bottom: 0.25cm;
                box-sizing: border-box;
              }
            }
          }
          span.rd-report-table-data {
            position: relative;
            width: 5%;
            height: auto;
            font-size: 0.375cm;
            border-right: 1px solid black;
            padding-left: 0.25cm;
            box-sizing: border-box;
            display: flex;
            align-items: flex-start;
            &.rd-report-table-data-total {
              width: 50%;
            }
            &.rd-report-table-data-name {
              width: 35%;
            }
            &.rd-report-table-data-volume {
              width: 10%;
            }
            &.rd-report-table-data-value {
              width: 25%;
            }
          }
          &.rd-report-table-compare {
            span.rd-report-table-data {
              &.rd-report-table-data-total {
                width: 40%;
              }
              &.rd-report-table-data-name {
                width: 25%;
              }
              &.rd-report-table-data-volume {
                width: 10%;
              }
              &.rd-report-table-data-value {
                width: 20%;
              }
            }
          }
        }
      }
    }
  }
</style>
