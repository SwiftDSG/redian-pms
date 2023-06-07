<template>
  <div class="rd-container">
    <div class="rd-project-menu">
      <div class="rd-project-menu-section">
        <rd-input-select :input="projectInput" />
        <rd-input-button-small
          :icon="menu.icon"
          v-for="menu in projectMenus"
          :key="menu.name"
          :type="projectMenu === menu.name ? 'primary' : 'default'"
          @clicked="projectMenuChange(menu.name)"
        />
      </div>
      <div class="rd-project-menu-section">
        <rd-input-button
          v-if="projectMenu === 'tasks'"
          label="Add area"
          @clicked="openAddArea"
        />
        <rd-input-button
          v-else-if="projectMenu === 'reports'"
          label="Add report"
          @clicked="openAddReport"
        />
        <rd-input-select v-else :input="areaInput" />
      </div>
    </div>
    <rd-project-overview
      v-if="projectMenu === 'overview'"
      :project="project"
      :state="projectMenuState"
      :data="{
        projectProgress: projectDataProgress,
        projectTimeline: projectDataTimeline,
      }"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-progress
      v-if="projectMenu === 'progress'"
      :project="project"
      :data="projectDataProgress"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-timeline
      v-if="projectMenu === 'timeline'"
      :project="project"
      :data="projectDataTimeline"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @edit-task="openPeriodTask"
    />
    <rd-project-tasks
      v-if="projectMenu === 'tasks'"
      :project="project"
      :data="projectDataAreas"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @add-task="openAddTask"
    />
    <rd-project-reports
      v-if="projectMenu === 'reports'"
      :project="project"
      :data="projectDataAreas"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @add-task="openAddTask"
    />
  </div>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
  import {
    ProjectAreaResponse,
    ProjectProgressResponse,
    ProjectResponse,
  } from "~~/types/project";
  import { ProjectTaskMinResponse } from "~~/types/project-task";

  type ProjectMenuKind =
    | "overview"
    | "progress"
    | "timeline"
    | "users"
    | "tasks"
    | "reports";
  type ProjectMenu = {
    title: string;
    name: ProjectMenuKind;
    icon: string;
  };

  const emits = defineEmits(["open-panel", "change-page"]);
  const { getProject, getProjectProgress, getProjectAreas, getProjectTasks } =
    useProject();
  const route = useRoute();

  const project = ref<ProjectResponse>(null);

  const projectInput = ref<InputOption>({
    name: "project",
    placeholder: "Project",
    model: "Time added",
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
  const areaInput = ref<InputOption>({
    name: "area",
    placeholder: "Area",
    model: "All area",
    options: [
      {
        name: "All area",
        value: "all",
      },
    ],
  });

  const projectMenu = ref<ProjectMenuKind>(null);
  const projectMenuState = ref<"idle" | "changing">("idle");
  const projectDataTimeline = ref<ProjectTaskMinResponse[]>(null);
  const projectDataProgress = ref<ProjectProgressResponse[]>(null);
  const projectDataAreas = ref<ProjectAreaResponse[]>(null);

  const projectMenus: ProjectMenu[] = [
    {
      title: "Project Overview",
      name: "overview",
      icon: "chart",
    },
    {
      title: "Project Progress",
      name: "progress",
      icon: "line-chart",
    },
    {
      title: "Project Timeline",
      name: "timeline",
      icon: "timeline",
    },
    {
      title: "Project Users",
      name: "users",
      icon: "account-group",
    },
    {
      title: "Project Tasks",
      name: "tasks",
      icon: "clipboard",
    },
    {
      title: "Project Reports",
      name: "reports",
      icon: "file",
    },
  ];

  function projectMenuChange(name: ProjectMenuKind): void {
    projectMenuState.value = "changing";
    setTimeout(async () => {
      projectMenu.value = name;
      switch (name) {
        case "overview":
          projectDataProgress.value = await getProjectProgress({
            _id: project.value._id,
          });
          projectDataTimeline.value = await getProjectTasks({
            _id: project.value._id,
          });
          break;
        case "progress":
          projectDataProgress.value = await getProjectProgress({
            _id: project.value._id,
          });
          break;
        case "reports":
          break;
        case "tasks":
          projectDataAreas.value = await getProjectAreas({
            _id: project.value._id,
          });
          break;
        case "timeline":
          projectDataTimeline.value = await getProjectTasks({
            _id: project.value._id,
          });
          break;
        case "users":
          break;
      }
    }, 250);
  }
  function openAddArea(): void {
    emits("open-panel", {
      state: "show",
      type: "project-area-add",
      data: {
        project_id: project.value._id,
      },
    });
  }
  function openAddReport(): void {
    emits("open-panel", {
      state: "show",
      type: "project-report-add",
      data: {
        project_id: project.value._id,
      },
    });
  }
  function openAddTask(area_id: string): void {
    emits("open-panel", {
      state: "show",
      type: "project-task-add",
      data: {
        project_id: project.value._id,
        area_id,
      },
    });
  }
  function openPeriodTask(task: ProjectTaskMinResponse): void {
    emits("open-panel", {
      state: "show",
      type: "project-task-period",
      data: {
        project_id: project.value._id,
        task,
      },
    });
  }

  onMounted(async () => {
    project.value = await getProject({
      _id: route.params.project_id.toString(),
    });

    projectMenuChange("overview");

    areaInput.value.options.push(
      ...(project.value.area?.map((a) => ({
        name: a.name,
        value: a._id,
      })) || [])
    );
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    min-height: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .rd-project-menu {
      position: relative;
      width: 100%;
      height: 2rem;
      display: flex;
      justify-content: space-between;

      .rd-project-menu-section {
        position: relative;
        height: 100%;
        display: flex;
        gap: 0.75rem;
      }
    }
  }
</style>
