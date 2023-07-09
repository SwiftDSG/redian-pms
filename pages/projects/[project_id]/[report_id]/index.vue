<template>
  <div class="rd-report-wrapper">
    <div class="rd-report-container">
      <div v-if="report" ref="rdReport" class="rd-report">
        <div class="rd-report-header">
          <div class="rd-report-detail-container">
            <span class="rd-report-name">Progress Report</span>
            <span class="rd-report-title">{{ report.project.name }}</span>
          </div>
        </div>
        <div class="rd-report-body">
          <div class="rd-report-section" style="width: calc(50% - 0.25cm)">
            <span class="rd-report-section-name">Report Date</span>
            <div class="rd-report-section-wrapper">
              <div class="rd-report-section-container">
                <span class="rd-report-section-placeholder">Submitted at</span>
                <span class="rd-report-section-value">{{
                  formatDate(report.date)
                }}</span>
              </div>
            </div>
          </div>
          <div class="rd-report-section" style="width: calc(50% - 0.25cm)">
            <span class="rd-report-section-name">Work hours</span>
            <div class="rd-report-section-wrapper">
              <div class="rd-report-section-container">
                <span class="rd-report-section-placeholder">In</span>
                <span class="rd-report-section-value">{{
                  `${report.time?.[0][0].toString().padStart(2, "0") || "00"}:${
                    report.time?.[0][1].toString().padStart(2, "0") || "00"
                  }`
                }}</span>
              </div>
              <div class="rd-report-section-container">
                <span class="rd-report-section-placeholder">Out</span>
                <span class="rd-report-section-value">{{
                  `${report.time?.[1][0].toString().padStart(2, "0") || "00"}:${
                    report.time?.[1][1].toString().padStart(2, "0") || "00"
                  }`
                }}</span>
              </div>
            </div>
          </div>
          <div v-if="groups.length" class="rd-report-section">
            <span class="rd-report-section-name">Manpowers</span>
            <div
              v-for="group in groups"
              :key="group.kind"
              class="rd-report-section-wrapper"
              style="width: calc(50% - 0.25cm)"
            >
              <span class="rd-report-section-wrapper-name">{{
                group.kind
              }}</span>
              <div
                v-for="user in group.user"
                :key="user._id"
                class="rd-report-section-container"
              >
                <span class="rd-report-section-placeholder">{{
                  user.name
                }}</span>
              </div>
            </div>
          </div>
          <div v-if="areas.length" class="rd-report-section">
            <span class="rd-report-section-name">Actual progress</span>
            <div
              v-for="area in areas"
              :key="area._id"
              class="rd-report-section-wrapper"
            >
              <span class="rd-report-section-wrapper-name">{{
                area.name
              }}</span>
              <div
                v-for="task in area.task"
                :key="task._id"
                class="rd-report-section-container"
              >
                <span class="rd-report-section-placeholder">{{
                  task.name
                }}</span>
                <span class="rd-report-section-value">{{
                  `${task.value}%`
                }}</span>
              </div>
            </div>
          </div>
          <div v-if="report.documentation?.length" class="rd-report-section">
            <span class="rd-report-section-name">Documentation</span>
            <div class="rd-report-section-images">
              <div
                v-for="image in report.documentation"
                :key="image._id"
                class="rd-report-section-image"
              >
                <div
                  :style="`background-image: url(${config.public.apiBase}/files?kind=project_documentation&name=${report._id}/${image._id}.${image.extension})`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import html2canvas from "html2canvas";
  import { ProjectMemberKind, ProjectMemberResponse } from "types/project";
  import {
    ProjectProgressReportActualResponse,
    ProjectProgressReportResponse,
  } from "types/project-report";

  type ProjectUserKindGroup = {
    kind: ProjectMemberKind;
    user: ProjectMemberResponse[];
  };
  type ProjectTaskAreaGroup = {
    _id: string;
    name: string;
    task: ProjectProgressReportActualResponse[];
  };

  const route = useRoute();
  const config = useRuntimeConfig();
  const { getProjectReport } = useProject();

  definePageMeta({
    middleware: ["auth"],
  });

  const rdReport = ref<HTMLDivElement | null>(null);

  const report = ref<ProjectProgressReportResponse | null>(null);

  const groups = computed<ProjectUserKindGroup[]>(() => {
    if (!report.value?.member?.length) return [];
    return report.value.member.reduce((a: ProjectUserKindGroup[], b) => {
      const index = a.findIndex((c) => c.kind === b.kind);
      if (index > -1) {
        a[index].user.push(b);
      } else {
        a.push({
          kind: b.kind,
          user: [b],
        });
      }
      return a;
    }, []);
  });
  const areas = computed<ProjectTaskAreaGroup[]>(() => {
    if (!report.value?.actual?.length) return [];
    return report.value.actual.reduce((a: ProjectTaskAreaGroup[], b) => {
      const index = a.findIndex((c) => c._id === b.area._id);
      if (index > -1) {
        a[index].task.push(b);
      } else {
        a.push({
          _id: b.area._id,
          name: b.name,
          task: [b],
        });
      }
      return a;
    }, []);
  });

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

  async function download(): Promise<void> {
    if (rdReport.value && route.query.download) {
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
  function formatDate(str: string): string {
    const date = new Date(str);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  onMounted(async () => {
    report.value = await getProjectReport({
      project_id: route.params.project_id.toString(),
      report_id: route.params.report_id.toString(),
    });
    setTimeout(download, 100);
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
    overflow-y: auto;
    .rd-report-container {
      position: relative;
      width: 100%;
      display: flex;
      flex-grow: 1;
      justify-content: center;
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
      span.rd-report-section-name {
        font-weight: bold;
        font-size: 0.5cm;
        text-transform: uppercase;
      }
      span.rd-report-section-placeholder {
        font-size: 0.375cm;
      }
      span.rd-report-section-value {
        font-weight: bold;
        font-size: 0.375cm;
      }
      span.rd-report-section-wrapper-name {
        font-weight: bold;
        font-size: 0.375cm;
        margin-bottom: 0.125cm;
      }

      .rd-report {
        position: absolute;
        width: 21cm;
        min-height: 29.7cm;
        padding: 2cm;
        box-sizing: border-box;
        background: var(--background-depth-one-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        .rd-report-header {
          position: relative;
          width: 100%;
          margin-bottom: 2cm;
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
          gap: 0.5cm;
          flex-wrap: wrap;
          .rd-report-section {
            position: relative;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5cm;
            align-content: flex-start;
            span.rd-report-section-name {
              position: relative;
              width: 100%;
              height: 0.75cm;
              &::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                height: 3px;
                background: #000;
              }
            }
            .rd-report-section-wrapper {
              position: relative;
              width: 100%;
              display: flex;
              flex-direction: column;
              .rd-report-section-container {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-between;
              }
            }
            .rd-report-section-images {
              position: relative;
              width: 100%;
              display: flex;
              gap: 0.5cm;
              flex-wrap: wrap;
              .rd-report-section-image {
                position: relative;
                width: calc(50% - 0.25cm);
                height: calc(16.5cm / 2);
                border: 3px solid black;
                padding: 0.25cm;
                box-sizing: border-box;
                div {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  background-size: cover;
                  background-position: center center;
                }
              }
            }
          }
        }
      }
      @media print {
        .rd-report {
          width: 100%;
          aspect-ratio: 1 / 1.41;
        }
      }
    }
  }
</style>
