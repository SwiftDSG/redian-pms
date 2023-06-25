<template>
  <div class="rd-container">
    <div class="rd-project-panel">
      <div class="rd-project-panel-header">
        <div class="rd-project-panel-query">
          <div class="rd-project-panel-query-section">
            <rd-input-search :input="searchInput" />
          </div>
          <div
            v-if="viewMode === 'desktop'"
            class="rd-project-panel-query-section"
          >
            <rd-input-select :input="sortInput" />
            <rd-input-button label="new project" @clicked="openProjectPanel" />
          </div>
        </div>
        <rd-input-tabs
          :input="tabsInput"
          class="rd-project-panel-tabs"
          style="top: 1.5px"
        />
      </div>
      <div class="rd-project-panel-body">
        <rd-project
          class="rd-project"
          v-for="project in projects"
          :key="project._id"
          :project="project"
          @click="
            emits('change-page', {
              name: 'projects-project_id',
              href: `/projects/${project._id}`,
            })
          "
        />
      </div>
    </div>
    <rd-input-button-floating
      v-if="viewMode !== 'desktop'"
      class="rd-project-add-button"
      label="new project"
      @clicked="openProjectPanel"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    InputSearchOption,
    InputSwitchOption,
    InputOption,
  } from "~~/types/general";

  const { viewMode } = useMain();
  const { projects, getProjects } = useProject();
  const emits = defineEmits(["change-page", "open-panel"]);

  definePageMeta({
    middleware: ["auth"],
  });

  const tabsInput = ref<InputSwitchOption>({
    options: [
      "All",
      "Completed",
      "On Hold",
      "Behind Schedule",
      "Ahead Schedule",
    ],
    model: "",
  });
  const searchInput = ref<InputSearchOption>({
    name: "search",
    placeholder: "Search for projects...",
    model: "",
    type: "secondary",
  });
  const sortInput = ref<InputOption>({
    name: "search",
    placeholder: "Sort",
    model: "Time added",
    icon: "sort",
    options: [
      {
        name: "Time added",
        value: "time_added",
      },
      {
        name: "Alphabetically",
        value: "alphabetically",
      },
    ],
  });

  function openProjectPanel(): void {
    emits("open-panel", {
      state: "show",
      type: "project-add",
    });
  }

  onMounted(async () => {
    tabsInput.value.model = "";
    await getProjects();
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 2rem 2rem 2rem;
    box-sizing: border-box;
    display: flex;
    .rd-project-panel {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 1rem;
      border: var(--border);
      background: var(--background-depth-one-color);
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      .rd-project-panel-header {
        position: relative;
        width: 100%;
        padding: 0.75rem 0 0 0;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-project-panel-query {
          position: relative;
          width: 100%;
          height: 2rem;
          padding: 0 0.75rem;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-project-panel-query-section {
            position: relative;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            gap: 0.75rem;
          }
        }
      }
      .rd-project-panel-body {
        position: relative;
        width: 100%;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        gap: 0.75rem;
        flex-grow: 1;
        flex-direction: column;
        overflow-y: auto;
      }
    }
    @media only screen and (max-width: 1024px) {
      height: auto;
      padding: 0 1rem 1rem 1rem;
      .rd-project-panel {
        .rd-project-panel-header {
          .rd-project-panel-query {
            padding: 0;
            .rd-project-panel-query-section {
              width: 100%;
              &:first-child {
                padding: 0 0.75rem;
              }
            }
          }
        }
        .rd-project-panel-body {
          min-height: 4rem;
        }
      }
      .rd-project-add-button {
        bottom: 1rem;
        right: 1rem;
      }
    }
  }
</style>
