<template>
  <div class="rd-container">
    <div class="rd-project-panel">
      <div class="rd-project-panel-header">
        <div class="rd-project-panel-query">
          <div class="rd-project-panel-query-section">
            <rd-input-search :input="searchInput" />
          </div>
          <div v-if="view === 'desktop'" class="rd-project-panel-query-section">
            <rd-input-select :input="sortInput" />
            <rd-input-button
              v-if="validate('create_project')"
              label="new project"
              @clicked="openProjectPanel"
            />
          </div>
          <rd-input-button-small
            v-else-if="validate('create_customer')"
            :icon="'plus'"
            :type="'primary'"
            @clicked="openProjectPanel"
          />
        </div>
        <rd-input-tabs
          :input="tabsInput"
          class="rd-project-panel-tabs"
          style="top: 1.5px"
        />
      </div>
      <div class="rd-project-panel-body">
        <div
          class="rd-project-progress-bar"
          :class="searchLoading ? 'rd-project-progress-bar-active' : ''"
        >
          <div class="rd-project-progress-bar-outer">
            <div class="rd-project-progress-bar-inner"></div>
          </div>
        </div>
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
        <div class="rd-project-observer" ref="rdProjectObserver">
          <span class="rd-project-observer-message rd-caption-text">{{
            query.limit ? "Loading projects..." : "End of the list"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    InputSearchOption,
    InputSwitchOption,
    InputOption,
  } from "~~/types/general";

  const { view, init, state } = useMain();
  const { validate } = useRole();
  const { query, projects, getProjects } = useProject();
  const emits = defineEmits(["change-page", "open-panel"]);

  definePageMeta({
    middleware: ["auth"],
  });

  const rdProjectObserver = ref<HTMLDivElement | null>(null);

  const searchTimeout = ref<NodeJS.Timeout | null>(null);
  const searchLoading = ref<boolean>(false);

  const tabsInput = ref<InputSwitchOption>({
    options: [
      "All",
      "Completed",
      "Cancelled",
      "On hold",
      "On going",
      "Behind schedule",
      "Ahead schedule",
    ],
    model: "",
  });
  const searchInput = ref<InputSearchOption>({
    name: "search",
    placeholder: "Search for projects...",
    model: "",
  });
  const sortInput = ref<InputOption>({
    name: "search",
    placeholder: "Sort",
    model: "Latest",
    value: "latest",
    icon: "sort",
    options: [
      {
        name: "Latest",
        value: "latest",
      },
      {
        name: "Oldest",
        value: "oldest",
      },
      {
        name: "Alphabetical (A-Z)",
        value: "a_z",
      },
      {
        name: "Alphabetical (Z-A)",
        value: "z_a",
      },
    ],
  });

  const sort = computed<string>(() => sortInput.value.value || "latest");
  const text = computed<string>(() => searchInput.value.model);
  const status = computed<string>(() => {
    let str = "";

    switch (tabsInput.value.model) {
      case "All":
        str = "";
        break;
      case "Completed":
        str = "finished";
        break;
      case "Cancelled":
        str = "cancelled";
        break;
      case "On hold":
        str = "paused";
        break;
      case "On going":
        str = "running";
        break;
      case "Behind schedule":
        str = "behind";
        break;
      case "Ahead schedule":
        str = "ahead";
        break;
    }

    return str;
  });

  function openProjectPanel(): void {
    emits("open-panel", {
      state: "show",
      type: "project-add",
    });
  }
  async function refreshProjects(reset: boolean = false): Promise<void> {
    searchLoading.value = true;
    if (reset) query.value.skip = 0;
    query.value.status = status.value;
    query.value.text = text.value;
    query.value.sort = sort.value;

    await getProjects(reset);
    searchLoading.value = false;
    query.value.skip += 10;
    if (init.value) {
      setTimeout(() => {
        init.value = false;
        state.value = "idle";
      }, 250);
    }
  }
  function intersect(entries: IntersectionObserverEntry[]): void {
    if (entries[0].isIntersecting && query.value.limit) {
      refreshProjects();
    }
  }

  watch(
    () => sort.value,
    () => {
      refreshProjects(true);
    }
  );
  watch(
    () => text.value,
    () => {
      if (searchTimeout.value) clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        refreshProjects(true);
      }, 500);
    }
  );
  watch(
    () => status.value,
    () => {
      refreshProjects(true);
    }
  );

  onMounted(async () => {
    tabsInput.value.model = "All";

    setTimeout(() => {
      if (rdProjectObserver.value) {
        const observer = new IntersectionObserver(intersect, {
          threshold: 0.5,
        });
        observer.observe(rdProjectObserver.value);
      }
    }, 100);
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
        z-index: 2;
        position: relative;
        width: 100%;
        padding: 0.75rem 0 0 0;
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
        .rd-project-progress-bar {
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--border-color);
          display: flex;
          justify-content: center !important;
          align-items: center !important;
          overflow: hidden;
          .rd-project-progress-bar-outer {
            position: relative;
            width: 100%;
            height: 2px;
            background: var(--border-color);
            display: flex;
            opacity: 0;
            transition: 0.25s opacity;
            overflow: hidden;
            .rd-project-progress-bar-inner {
              position: absolute;
              top: 0;
              left: 0;
              right: 100%;
              height: 100%;
              background: var(--primary-color);
              animation: rd-loading 2s ease infinite;
            }
          }
          &.rd-project-progress-bar-active {
            .rd-project-progress-bar-outer {
              opacity: 1;
            }
          }
        }
        .rd-project-observer {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      height: auto;
      padding: 0 1rem 1rem 1rem;
      .rd-project-panel {
        .rd-project-panel-header {
          .rd-project-panel-query {
            padding: 0 0.75rem;
            .rd-project-panel-query-section {
              width: 100%;
              &:first-child {
                width: calc(100% - 2.75rem);
              }
            }
          }
        }
        .rd-project-panel-body {
          min-height: 4rem;
        }
      }
      .rd-project-add-button {
        bottom: 2rem;
        right: 2rem;
      }
    }
  }
</style>
