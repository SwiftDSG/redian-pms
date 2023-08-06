<template>
  <rd-panel
    class="rd-panel"
    label="Add stage"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
        <rd-input-switch :input="switchInput" class="rd-panel-input" />
      </div>
      <div v-if="mode === 'Default'" class="rd-panel-input-wrapper">
        <rd-input-text :input="nameInput" class="rd-panel-input" />
      </div>
      <div v-if="mode === 'Bulk'" class="rd-panel-download">
        <div class="rd-panel-download-container" @click="download">
          <div class="rd-panel-download-icon-container">
            <rd-svg
              class="rd-panel-download-icon"
              name="download"
              color="secondary"
            />
          </div>
          <div class="rd-panel-download-detail-container">
            <span class="rd-panel-download-name rd-headline-5"
              >bulk_template.csv</span
            >
            <span class="rd-panel-download-placeholder rd-caption-text"
              >Click to download</span
            >
          </div>
        </div>
        <span class="rd-panel-download-message rd-caption-text"
          >You can create tasks by uploading a CSV based file, you will find the
          needed format by downloading the template above. You can direcly edit
          the template by opening it in Microsoft Excel, Google Spreadsheets or
          any CSV editors.</span
        >
      </div>
      <div
        v-if="mode === 'Bulk'"
        class="rd-panel-input-wrapper"
        style="margin-top: 1rem"
      >
        <rd-input-file :input="fileInput" class="rd-panel-input" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        label="submit"
        :disabled="(mode === 'Default' && !name) || (mode === 'Bulk' && !file)"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import {
    InputFileOption,
    InputOption,
    InputSwitchOption,
  } from "~~/types/general";
  import { ProjectAreaRequest } from "~~/types/project";

  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      project_id: string;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const config = useRuntimeConfig();
  const {
    project,
    addProjectArea,
    createProjectTaskBulk,
    getProject,
    getProjectAreas,
    getProjectTasks,
  } = useProject();

  const panelState = ref<"idle" | "hide">("idle");

  const loading = ref<boolean>(false);

  const switchInput = ref<InputSwitchOption>({
    model: "Default",
    options: ["Default", "Bulk"],
  });
  const nameInput = ref<InputOption>({
    label: "Stage name",
    name: "name",
    model: "",
    error: "",
    placeholder: "Some Stage",
  });
  const fileInput = ref<InputFileOption>({
    label: "Upload CSV",
    type: "any",
  });

  const mode = computed<string>(() => switchInput.value.model);
  const name = computed<ProjectAreaRequest["name"]>(
    () => nameInput.value.model
  );
  const file = computed<File | undefined>(() => fileInput.value.file);

  async function submit(): Promise<void> {
    if (project.value) {
      loading.value = true;

      if (mode.value === "Default") {
        const payload = {
          request: { name: name.value },
          project_id: props.data.project_id,
        };

        await addProjectArea(payload);

        project.value.areas = await getProjectAreas({
          _id: props.data.project_id,
        });
        loading.value = false;
        panelState.value = "hide";
      } else if (file.value) {
        const payload = {
          project_id: props.data.project_id,
          file: file.value,
        };
        await createProjectTaskBulk(payload);

        setTimeout(async () => {
          project.value.areas = await getProjectAreas({
            _id: props.data.project_id,
          });
          project.value.data = await getProject({
            _id: props.data.project_id,
          });
          project.value.timeline = await getProjectTasks({
            _id: props.data.project_id,
          });

          loading.value = false;
          panelState.value = "hide";
        }, 500);
      }
    }
  }
  function download(): void {
    const link = document.createElement("a");
    link.href = `${config.public.base}/bulk_template.csv`;
    link.download = "bulk_template.csv";
    link.click();
    link.remove();
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-panel-download {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .rd-panel-download-container {
          cursor: pointer;
          position: relative;
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: var(--border-color);
          box-sizing: border-box;
          display: flex;
          gap: 0.75rem;
          * {
            pointer-events: none;
          }
          .rd-panel-download-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            border-radius: 0.5rem;
            background: var(--primary-color);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rd-panel-download-detail-container {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.125rem;
          }
        }
        span.rd-panel-download-message {
          position: relative;
          width: 100%;
          line-height: 2;
        }
      }
    }
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      background: var(--background-depth-one-color);
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .rd-panel-button {
        width: 100%;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
      }
    }
    @media only screen and (max-width: 1024px) {
      .rd-panel-footer {
        height: 4rem;
        padding: 1rem;
      }
    }
  }
</style>
