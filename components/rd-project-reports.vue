<template>
  <div class="rd-panel" ref="rdPanel">
    <div class="rd-panel-statistic-container">
      <div class="rd-panel-statistic-header">
        <span class="rd-panel-statistic-header-title rd-headline-3"
          >Statistics</span
        >
      </div>
      <div class="rd-panel-statistic-body">
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg
              class="rd-statistic-icon"
              :name="getStatusIcon(project.status[0].kind)"
            />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span
                class="rd-statistic-value rd-headline-5"
                :class="`rd-statistic-value-${getStatusClass(
                  project.status[0].kind
                )}`"
                >{{ project.status[0].kind }}</span
              >
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Project status</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="finish" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                taskComplete
              }}</span>
              <span class="rd-statistic-target rd-headline-5">/</span>
              <span class="rd-statistic-target rd-headline-5">{{
                taskTotal
              }}</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Tasks completed</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="timeline" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                `${valueActual.toFixed(2)}%`
              }}</span>
              <span class="rd-statistic-target rd-headline-5">/</span>
              <span class="rd-statistic-target rd-headline-5">{{
                `${valuePlan.toFixed(2)}%`
              }}</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Actual vs planned</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="crosshairs-gps" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span
                class="rd-statistic-value rd-headline-5"
                :class="
                  valueActual - valuePlan >= 0
                    ? 'rd-statistic-value-success'
                    : 'rd-statistic-value-error'
                "
                >{{ `${(valueActual - valuePlan).toFixed(2)}%` }}</span
              >
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Deviation</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="clock-outline" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                durationActual
              }}</span>
              <span class="rd-statistic-target rd-headline-5">/</span>
              <span class="rd-statistic-target rd-headline-5">{{
                durationPlan
              }}</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Duration (days)</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="backup-restore" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                breakdownCount
              }}</span>
              <span class="rd-statistic-target rd-headline-5">times</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Breakdown happened</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="calendar-remove" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                breakdownDays
              }}</span>
              <span class="rd-statistic-target rd-headline-5">days</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Man days lost</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="alert-plus" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                incidentCount
              }}</span>
              <span class="rd-statistic-target rd-headline-5">times</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Incidents reported</span
            >
          </div>
        </div>
        <div class="rd-statistic">
          <div class="rd-statistic-header">
            <rd-svg class="rd-statistic-icon" name="archive-plus" />
          </div>
          <div class="rd-statistic-body">
            <div class="rd-statistic-value-container">
              <span class="rd-statistic-value rd-headline-5">{{
                progressCount
              }}</span>
              <span class="rd-statistic-target rd-headline-5">times</span>
            </div>
            <span class="rd-statistic-placeholder rd-caption-text"
              >Progress reported</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-report-container">
      <div class="rd-panel-report-header">
        <span class="rd-panel-report-header-title rd-headline-3">Reports</span>
        <rd-input-button label="export" @clicked="exportReport" />
      </div>
      <div class="rd-panel-report-body">
        <div
          v-for="(report, i) in data.projectReports"
          :key="report.progress?._id || report.incident?._id || i"
          class="rd-report"
          :class="
            report.kind === 'progress'
              ? 'rd-report-progress'
              : 'rd-report-incident'
          "
        >
          <div class="rd-report-timeline">
            <div class="rd-report-timeline-bullet"></div>
          </div>
          <div class="rd-report-container">
            <div class="rd-report-header">
              <div class="rd-report-name-container">
                <span class="rd-report-date rd-caption-text"
                  ><span>{{ formatDate(report.date) }}</span>
                  <div class="rd-report-date-dot"></div>
                  <span>{{
                    report.progress?.user.name || report.incident?.user.name
                  }}</span></span
                >
                <span class="rd-report-name rd-headline-4">{{
                  report.kind === "progress"
                    ? `Progress report #${counterProgress[i]}`
                    : `Incident report #${counterIncident[i]}`
                }}</span>
              </div>
              <div
                v-if="report.kind === 'progress' && view === 'desktop'"
                class="rd-report-action-container"
              >
                <rd-input-button-small
                  class="rd-report-action"
                  icon="download"
                  @clicked="downloadReport(report.progress || report.incident)"
                />
                <rd-input-button-small
                  class="rd-report-action"
                  icon="eye"
                  @clicked="openReport(report.progress || report.incident)"
                />
              </div>
            </div>
            <div v-if="report.progress" class="rd-report-body">
              <div class="rd-report-detail-container">
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >In</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.time?.[0][0]
                      .toString()
                      .padStart(2, "0")}:${report.progress.time?.[0][1]
                      .toString()
                      .padStart(2, "0")}`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Out</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.time?.[1][0]
                      .toString()
                      .padStart(2, "0")}:${report.progress.time?.[1][1]
                      .toString()
                      .padStart(2, "0")}`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Duration (hrs)</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${
                      report.progress.time
                        ? formatHours(report.progress.time).toFixed(2)
                        : 0
                    } hrs`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Progress (%)</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.progress.toFixed(3)}%`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Documentation</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.documentation?.length || 0} photos`
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Worker</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.progress.member?.length || 0} workers`
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else-if="report.incident" class="rd-report-body">
              <div class="rd-report-detail-container">
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Time</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    formatTime(report.incident.date)
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Type</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    getIncidentKind(report.incident.kind)
                  }}</span>
                </div>
                <div class="rd-report-detail">
                  <span class="rd-report-detail-placeholder rd-caption-text"
                    >Casualties</span
                  >
                  <span class="rd-report-detail-value rd-headline-5">{{
                    `${report.incident.member?.length || 0} workers`
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import {
    ProjectIncidentReportKind,
    ProjectIncidentReportResponse,
  } from "types/project-incident";
  import { ProjectProgressReportMinResponse } from "types/project-report";
  import { ProjectTaskMinResponse } from "types/project-task";
  import {
    ProjectProgressResponse,
    ProjectReportResponse,
    ProjectResponse,
    ProjectStatusKind,
  } from "~~/types/project";

  const props = defineProps<{
    project: ProjectResponse;
    state: "idle" | "changing";
    data: {
      projectReports: ProjectReportResponse[];
      projectProgress: ProjectProgressResponse[];
      projectTimeline: ProjectTaskMinResponse[];
    };
  }>();
  const emits = defineEmits([
    "change-menu",
    "changing-done",
    "edit-task",
    "export-report",
  ]);
  const config = useRuntimeConfig();
  const { view } = useMain();

  const rdPanel = ref<HTMLDivElement | null>(null);

  const today = ref<number>(
    props.project.status[0].kind === "finished"
      ? new Date(props.project.status[0].time).setHours(23, 59, 59, 999)
      : new Date().setHours(23, 59, 59, 999)
  );

  const counterProgress = computed<number[]>(() => {
    let count = props.data.projectReports.filter(
      (a) => a.kind === "progress"
    ).length;
    return props.data.projectReports.map((a) =>
      a.kind === "progress" ? count-- : 0
    );
  });
  const counterIncident = computed<number[]>(() => {
    let count = props.data.projectReports.filter(
      (a) => a.kind === "incident"
    ).length;
    return props.data.projectReports.map((a) =>
      a.kind === "incident" ? count-- : 0
    );
  });

  const taskTotal = computed<number>(() => props.data.projectTimeline.length);
  const taskComplete = computed<number>(
    () =>
      props.data.projectTimeline.filter((a) => a.status[0].kind === "finished")
        .length
  );
  const valuePlan = computed<number>(
    () =>
      props.data.projectProgress.find(
        (a) => new Date(a.x).setHours(23, 59, 59, 999) === today.value
      )?.y[0] || 0
  );
  const valueActual = computed<number>(
    () =>
      props.data.projectProgress.find(
        (a) => new Date(a.x).setHours(23, 59, 59, 999) === today.value
      )?.y[1] || 0
  );
  const startDate = computed<number>(() =>
    new Date(props.project.period.start).getTime()
  );
  const endDate = computed<number>(() =>
    new Date(props.project.period.end).getTime()
  );
  const durationPlan = computed<number>(() =>
    Math.round((endDate.value - startDate.value) / 86400000)
  );
  const durationActual = computed<number>(() =>
    Math.round((today.value - startDate.value) / 86400000)
  );
  const breakdownDays = computed<number>(() => {
    return props.project.status
      .map((a, i) => ({ ...a, i }))
      .filter((a) => a.kind === "breakdown")
      .map((a) => {
        if (props.project.status[a.i]) {
          const min = new Date(a.time).getTime();
          const max = new Date(
            props.project.status?.[a.i - 1].time || new Date(a.time).getTime()
          ).getTime();
          return Math.round((max - min) / 86400000) || 1;
        }
        return 1;
      })
      .reduce((a, b) => a + b, 0);
  });
  const breakdownCount = computed<number>(
    () => props.project.status.filter((a) => a.kind === "breakdown").length
  );
  const incidentCount = computed<number>(
    () => props.data.projectReports.filter((a) => a.kind === "incident").length
  );
  const progressCount = computed<number>(
    () => props.data.projectReports.filter((a) => a.kind === "progress").length
  );

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

  function formatDate(x: string): string {
    const date = new Date(x);

    if (view.value === "desktop") {
      return `${date.getDate().toString().padStart(2, "0")} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    } else {
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
  }
  function formatTime(x: string): string {
    const date = new Date(x);

    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
  function formatHours(x: [[number, number], [number, number]]): number {
    return ((x[1][0] - x[0][0]) * 60 + (x[1][1] - x[0][1])) / 60;
  }
  function getStatusClass(status: ProjectStatusKind): string {
    let str = "";

    if (status === "finished") str = "success";
    else if (status === "cancelled" || status === "breakdown") str = "error";
    else if (status === "running" || status === "paused") str = "warning";

    return str;
  }
  function getStatusIcon(status: ProjectStatusKind): string {
    let str = "dots";

    if (status === "finished") str = "check";
    else if (status === "cancelled") str = "close";
    else if (status === "breakdown") str = "warning";
    else if (status === "running") str = "play";
    else if (status === "paused") str = "pause";

    return str;
  }
  function getIncidentKind(kind: ProjectIncidentReportKind): string {
    let str = "";

    switch (kind) {
      case "environmental":
        str = "Environmental";
        break;
      case "fatal":
        str = "Fatal";
        break;
      case "first_aid":
        str = "First Aid";
        break;
      case "lost_time_injury":
        str = "Lost Time Injury";
        break;
      case "near_miss":
        str = "Near Miss";
        break;
      case "property_damage":
        str = "Property Damage";
        break;
    }

    return str;
  }
  function openReport(
    report:
      | ProjectProgressReportMinResponse
      | ProjectIncidentReportResponse
      | undefined
  ): void {
    if (report)
      window.open(
        `${config.public.base}/projects/${report.project._id}/${report._id}`
      );
  }
  function downloadReport(
    report:
      | ProjectProgressReportMinResponse
      | ProjectIncidentReportResponse
      | undefined
  ): void {
    if (report)
      window.open(
        `${config.public.base}/projects/${report.project._id}/${report._id}?download=true`
      );
  }
  function exportReport(): void {
    emits("export-report");
  }

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
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    position: relative;
    width: 100%;
    height: calc(100vh - 11rem);
    margin-bottom: 2rem;
    border: var(--border);
    border-radius: 1rem;
    box-sizing: border-box;
    background: var(--background-depth-one-color);
    display: flex;
    flex: 1;
    opacity: 0;
    .rd-panel-statistic-container {
      position: relative;
      width: 20rem;
      height: 100%;
      border-right: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-panel-statistic-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        border-bottom: var(--border);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-panel-statistic-body {
        position: relative;
        width: 100%;
        height: calc(100% - 3.5rem);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        gap: 0.75rem;
        flex-wrap: wrap;
        overflow-y: auto;
        .rd-statistic {
          position: relative;
          width: calc((100% - 0.75rem) / 2);
          height: 6.5rem;
          background: var(--background-depth-two-color);
          border: var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .rd-statistic-header {
            position: relative;
            width: 2rem;
            height: 2rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            background: var(--background-depth-two-color);
            box-sizing: border-box;
            flex-shrink: 0;
          }
          .rd-statistic-body {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            .rd-statistic-value-container {
              position: relative;
              width: 100%;
              display: flex;
              gap: 0.25rem;
              align-items: center;
              span.rd-statistic-value {
                &.rd-statistic-value-success {
                  color: var(--success-color);
                }
                &.rd-statistic-value-warning {
                  color: var(--warning-color);
                }
                &.rd-statistic-value-error {
                  color: var(--error-color);
                }
              }
              span.rd-statistic-target {
                opacity: 0.5;
              }
            }
            span.rd-statistic-placeholder {
              position: relative;
              margin-top: 0.125rem;
            }
          }
        }
      }
    }
    .rd-panel-report-container {
      position: relative;
      width: calc(100% - 20rem);
      height: 100%;
      display: flex;
      flex-direction: column;
      .rd-panel-report-header {
        position: relative;
        width: 100%;
        height: 3.5rem;
        border-bottom: var(--border);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .rd-panel-report-body {
        position: relative;
        width: 100%;
        height: calc(100% - 3.5rem);
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        .rd-report {
          position: relative;
          width: 100%;
          display: flex;
          .rd-report-timeline {
            position: relative;
            width: 1.5rem;
            display: flex;
            flex: 1;
            flex-direction: column;
            .rd-report-timeline-bullet {
              position: relative;
              width: 1.5rem;
              height: 1.5rem;
              border: var(--border);
              box-sizing: border-box;
              border-radius: 0.75rem;
              background: var(--background-depth-one-color);
              &::before {
                content: "";
                position: absolute;
                left: calc(50% - 0.25rem);
                top: calc(50% - 0.25rem);
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 0.25rem;
                background: var(--border-color);
              }
            }
          }
          .rd-report-container {
            position: relative;
            width: calc(100% - 2.25rem);
            background: var(--background-depth-two-color);
            border: var(--border);
            border-radius: 0.75rem;
            padding: 0.75rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .rd-report-header {
              position: relative;
              width: 100%;
              height: 2rem;
              margin-bottom: 1rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rd-report-name-container {
                position: relative;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                span.rd-report-date {
                  position: relative;
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  .rd-report-date-dot {
                    position: relative;
                    width: 0.25rem;
                    height: 0.25rem;
                    border-radius: 0.125rem;
                    background: var(--font-main-color);
                    opacity: 0.5;
                  }
                }
              }
              .rd-report-action-container {
                position: relative;
                height: 100%;
                display: flex;
                gap: 0.75rem;
              }
            }
            .rd-report-body {
              position: relative;
              width: 100%;
              display: flex;
              flex-direction: column;
              .rd-report-detail-container {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .rd-report-detail {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  span.rd-report-detail-placeholder {
                    position: relative;
                    width: 100%;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
          &:last-child {
            .rd-report-timeline {
              .rd-report-timeline-line {
                &::before {
                  display: none;
                }
              }
            }
          }
          &.rd-report-progress {
            .rd-report-timeline {
              .rd-report-timeline-bullet {
                &::before {
                  background: var(--warning-color);
                }
              }
            }
          }
          &.rd-report-incident {
            .rd-report-timeline {
              .rd-report-timeline-bullet {
                &::before {
                  background: var(--error-color);
                }
              }
            }
          }
        }
      }
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: calc(1.5rem - 0.5px);
        width: 1px;
        height: calc(100% - 3.5rem);
        background: var(--border-color);
      }
    }
    @media only screen and (max-width: 1024px) {
      height: auto;
      border: none;
      background: transparent;
      margin-bottom: 1rem;
      flex-direction: column;
      flex: 0;
      gap: 0.75rem;
      .rd-panel-statistic-container {
        width: 100%;
        height: auto;
        border-radius: 1rem;
        border: var(--border);
        background: var(--background-depth-one-color);
        .rd-panel-statistic-body {
          height: auto;
          flex-direction: row;
          flex-wrap: nowrap;
          overflow-y: hidden;
          overflow-x: auto;
          .rd-statistic {
            min-width: 75%;
            height: 3.5rem;
            flex-shrink: 0;
            flex-direction: row;
            gap: 0.75rem;
            span.rd-statistic-placeholder {
              white-space: nowrap;
            }
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
      .rd-panel-report-container {
        width: 100%;
        height: auto;
        border-radius: 1rem;
        border: var(--border);
        background: var(--background-depth-one-color);
        .rd-panel-report-body {
          flex-direction: column;
          overflow-y: auto;
          .rd-report {
            width: 100%;
            .rd-report-container {
              .rd-report-header {
                span {
                  white-space: nowrap;
                }
              }
              .rd-report-body {
                .rd-report-detail-container {
                  justify-content: flex-start;
                  align-items: flex-start;
                  flex-wrap: wrap;
                  gap: 0.25rem 0;
                  .rd-report-detail {
                    width: 50%;
                    flex-shrink: 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
