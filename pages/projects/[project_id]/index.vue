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
        <rd-input-select v-if="projectMenu !== 'tasks'" :input="areaInput" />
        <rd-input-button v-else label="Add task" @clicked="openAddArea" />
      </div>
    </div>
    <rd-project-overview
      v-if="projectMenu === 'overview'"
      :project="project"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-progress
      v-if="projectMenu === 'progress'"
      :project="project"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-timeline
      v-if="projectMenu === 'timeline'"
      :project="project"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-tasks
      v-if="projectMenu === 'tasks'"
      :project="project"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @add-task="openAddTask"
    />
  </div>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
  import { Project } from "~~/types/project";

  type ProjectMenu = {
    title: string;
    name: string;
    icon: string;
  };

  const emits = defineEmits(["open-panel", "change-page"]);
  const { getProject } = useProject();
  const route = useRoute();

  const project = ref<Project>(null);

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

  const projectMenu = ref<string>("overview");
  const projectMenuState = ref<"idle" | "changing">("idle");

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

  function projectMenuChange(name: string): void {
    projectMenuState.value = "changing";
    setTimeout(() => {
      projectMenu.value = name;
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

  onMounted(async () => {
    project.value = await getProject({
      _id: route.params.project_id.toString(),
    });
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
