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
          v-if="
            projectMenu === 'tasks' &&
            project.data?.status[0]?.kind === 'pending'
          "
          label="Add stage"
          @clicked="openAddArea"
        />
        <rd-input-button
          v-else-if="
            projectMenu === 'reports' &&
            project.data?.status[0]?.kind !== 'finished' &&
            project.data?.status[0]?.kind !== 'breakdown' &&
            project.data?.status[0]?.kind !== 'cancelled'
          "
          label="Add report"
          @clicked="openAddReport"
        />
        <rd-input-select
          v-else-if="projectMenu === 'users'"
          :input="roleInput"
        />
        <rd-input-select v-else :input="areaInput" />
      </div>
    </div>
    <div
      v-if="projectWarning"
      class="rd-project-warning"
      :class="
        projectWarning === 'breakdown' ? 'rd-project-warning-breakdown' : ''
      "
    >
      <div class="rd-project-warning-detail">
        <div class="rd-project-warning-icon-container">
          <rd-svg class="rd-project-warning-icon" name="warning" />
        </div>
        <div class="rd-project-warning-message-container">
          <span class="rd-project-warning-name rd-headline-5">{{
            projectWarningName()
          }}</span>
          <span class="rd-project-warning-message rd-caption-text">{{
            projectWarningMessage()
          }}</span>
        </div>
      </div>
      <rd-input-button-small
        v-if="projectWarning !== 'breakdown'"
        class="rd-project-warning-action"
        icon="chevron-right"
        type="primary"
        @clicked="
          projectMenuChange(
            projectWarning !== 'incomplete-period' ? 'tasks' : 'timeline'
          )
        "
      />
    </div>
    <rd-project-overview
      v-if="
        projectMenu === 'overview' &&
        project.data &&
        projectProgress &&
        projectTimeline
      "
      :project="project.data"
      :state="projectMenuState"
      :data="{
        projectProgress,
        projectTimeline,
      }"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-progress
      v-if="projectMenu === 'progress' && project.data && projectProgress"
      :project="project.data"
      :data="projectProgress"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
    />
    <rd-project-timeline
      v-if="projectMenu === 'timeline' && project.data && projectTimeline"
      :project="project.data"
      :data="projectTimeline"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @edit-task="openPeriodTask"
      @open-task="openTask"
    />
    <rd-project-tasks
      v-if="projectMenu === 'tasks' && project.data && projectAreas"
      :project="project.data"
      :data="projectAreas"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @add-task="openAddTask"
      @open-task="openTask"
      @remove-area="openRemoveArea"
    />
    <rd-project-reports
      v-if="projectMenu === 'reports' && project.data && projectReports"
      :project="project.data"
      :state="projectMenuState"
      :data="projectReports"
      @changing-done="projectMenuState = 'idle'"
      @add-task="openAddTask"
    />
    <rd-project-users
      v-if="projectMenu === 'users' && project.data && projectUsers"
      :project="project.data"
      :data="projectUsers"
      :state="projectMenuState"
      @changing-done="projectMenuState = 'idle'"
      @add-role="openRole"
      @edit-role="openRole"
      @add-user="openUser"
      @edit-user="openUser"
    />
  </div>
</template>

<script lang="ts" setup>
  import { InputOption } from "~~/types/general";
  import {
    ProjectAreaResponse,
    ProjectMemberResponse,
    ProjectProgressResponse,
    ProjectReportResponse,
    ProjectUserResponse,
  } from "~~/types/project";
  import { ProjectRoleResponse } from "~~/types/project-role";
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
  type ProjectWarning =
    | "empty-area"
    | "empty-task"
    | "incomplete-value"
    | "incomplete-period"
    | "breakdown";

  const emits = defineEmits(["open-panel", "change-page"]);
  const {
    projects,
    project,
    getProjects,
    getProject,
    getProjectProgress,
    getProjectAreas,
    getProjectTasks,
    getProjectUsers,
    getProjectReports,
  } = useProject();
  const route = useRoute();

  definePageMeta({
    middleware: ["auth"],
  });

  const projectInput = ref<InputOption>({
    name: "project",
    placeholder: "Project",
    model: "",
    options: [],
  });
  const areaInput = ref<InputOption>({
    name: "area",
    placeholder: "Stage",
    model: "All stages",
    options: [
      {
        name: "All stages",
        value: "all",
      },
    ],
  });
  const roleInput = ref<InputOption>({
    name: "role",
    placeholder: "Role",
    model: "All role",
    options: [
      {
        name: "All role",
        value: "all",
      },
    ],
  });

  const projectMenuState = ref<"idle" | "changing">("idle");
  const projectMenu = ref<ProjectMenuKind | null>(null);
  const projectWarning = ref<ProjectWarning | null>(null);

  const projectUsers = computed<ProjectUserResponse | null>(
    () => project.value.users
  );
  const projectAreas = computed<ProjectAreaResponse[] | null>(
    () => project.value.areas
  );
  const projectTimeline = computed<ProjectTaskMinResponse[] | null>(
    () => project.value.timeline
  );
  const projectProgress = computed<ProjectProgressResponse[] | null>(
    () => project.value.progress
  );
  const projectReports = computed<ProjectReportResponse[] | null>(
    () => project.value.reports
  );

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

  function projectWarningName(): string {
    let str = "";

    if (projectWarning.value === "empty-area") str = "Empty project stage";
    if (projectWarning.value === "empty-task") str = "Empty project task";
    if (projectWarning.value === "incomplete-value")
      str = "Invalid tasks values";
    if (projectWarning.value === "incomplete-period")
      str = "Tasks period incomplete";
    if (projectWarning.value === "breakdown")
      str = "Project is currently on investigation";

    return str;
  }
  function projectWarningMessage(): string {
    let str = "";

    if (projectWarning.value === "empty-area")
      str =
        "You need to add at last one stage to begin adding task to the project";
    if (projectWarning.value === "empty-task")
      str = "You need to add at least one task to start the project";
    if (projectWarning.value === "incomplete-value")
      str = "The sum of tasks values need to be 100% to start the project";
    if (projectWarning.value === "incomplete-period")
      str = "Tasks period is not completed yet";
    if (projectWarning.value === "breakdown")
      str = "Please wait until your employer removes this status";

    return str;
  }
  function projectMenuChange(name: ProjectMenuKind): void {
    projectMenuState.value = "changing";
    setTimeout(async () => {
      projectMenu.value = name;
      switch (name) {
        case "overview":
          project.value.progress = await getProjectProgress({
            _id: project.value.data?._id || "",
          });
          project.value.timeline = await getProjectTasks({
            _id: project.value.data?._id || "",
          });
          break;
        case "progress":
          project.value.progress = await getProjectProgress({
            _id: project.value.data?._id || "",
          });
          break;
        case "reports":
          project.value.reports = await getProjectReports({
            _id: project.value.data?._id || "",
          });
          break;
        case "tasks":
          project.value.areas = await getProjectAreas({
            _id: project.value.data?._id || "",
          });
          break;
        case "timeline":
          project.value.timeline = await getProjectTasks({
            _id: project.value.data?._id || "",
          });
          break;
        case "users":
          project.value.users = await getProjectUsers({
            _id: project.value.data?._id || "",
          });
          break;
      }
    }, 250);
  }
  function openAddArea(): void {
    emits("open-panel", {
      state: "show",
      type: "project-area-add",
      data: {
        project_id: project.value.data?._id || "",
      },
    });
  }
  function openAddReport(): void {
    emits("open-panel", {
      state: "show",
      type: "project-report-add",
      data: {
        project_id: project.value.data?._id || "",
      },
    });
  }
  function openAddTask(area_id: string): void {
    emits("open-panel", {
      state: "show",
      type: "project-task-add",
      data: {
        project_id: project.value.data?._id || "",
        area_id,
      },
    });
  }
  function openTask(task_id: string): void {
    emits("open-panel", {
      state: "show",
      type: "project-task",
      data: {
        project_id: project.value.data?._id || "",
        task_id,
      },
    });
  }
  function openRole(role?: ProjectRoleResponse): void {
    emits("open-panel", {
      state: "show",
      type: "project-role",
      data: {
        project_id: project.value.data?._id || "",
        role,
      },
    });
  }
  function openUser(user?: ProjectMemberResponse): void {
    emits("open-panel", {
      state: "show",
      type: "project-user",
      data: {
        project_id: project.value.data?._id || "",
        user,
      },
    });
  }
  function openRemoveArea(area_id: string): void {
    emits("open-panel", {
      state: "show",
      type: "project-area-remove",
      data: {
        project_id: project.value.data?._id || "",
        area_id,
      },
    });
  }
  function openPeriodTask(task: ProjectTaskMinResponse): void {
    emits("open-panel", {
      state: "show",
      type: "project-task-period",
      data: {
        project_id: project.value.data?._id || "",
        period: project.value.data?.period,
        task,
      },
    });
  }
  function generateWarning(): void {
    if (project.value.data?.status[0].kind === "breakdown")
      projectWarning.value = "breakdown";
    else if (!projectAreas.value?.length) projectWarning.value = "empty-area";
    else {
      const count = projectAreas.value.reduce(
        (a, b) => a + (b?.task?.length || 0),
        0
      );
      if (!count) projectWarning.value = "empty-task";
      else {
        const count = projectAreas.value.reduce(
          (a, b) => a + (b?.task?.reduce((c, d) => c + d.value, 0) || 0),
          0
        );
        if (count !== 100) projectWarning.value = "incomplete-value";
        else if (
          projectTimeline.value?.length &&
          !projectTimeline.value.every((a) => !!a.period)
        )
          projectWarning.value = "incomplete-period";
      }
    }
  }

  watch(
    () => projectAreas.value,
    () => {
      generateWarning();
    },
    {
      deep: true,
    }
  );
  watch(
    () => projectTimeline.value,
    () => {
      generateWarning();
    },
    {
      deep: true,
    }
  );

  onMounted(async () => {
    await getProjects();

    project.value = {
      data: await getProject({
        _id: route.params.project_id.toString(),
      }),
      areas: await getProjectAreas({
        _id: route.params.project_id.toString(),
      }),
      timeline: null,
      progress: null,
      users: null,
      reports: null,
    };

    projectMenuChange("overview");

    if (!project.value.areas?.length) generateWarning();
    else if (areaInput.value.options) {
      areaInput.value.options.push(
        ...(project.value.areas?.map((a) => ({
          name: a.name,
          value: a._id,
        })) || [])
      );
    }

    if (projects.value?.length) {
      projectInput.value.options = projects.value.map((a) => ({
        name: a.name,
        value: a._id,
      }));
      if (project.value.data) {
        projectInput.value.model = project.value.data.name;
        projectInput.value.value = project.value.data._id;
      }
    }
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
    .rd-project-warning {
      position: relative;
      width: 100%;
      padding: 0.75rem;
      border-radius: 1rem;
      box-sizing: border-box;
      background: var(--warning-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-project-warning-detail {
        position: relative;
        display: flex;
        gap: 0.75rem;
        align-items: center;
        .rd-project-warning-icon-container {
          position: relative;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          padding: 0.5rem;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .rd-project-warning-message-container {
          position: relative;
          gap: 0.25rem;
          display: flex;
          flex-direction: column;
        }
      }
      &.rd-project-warning-breakdown {
        background: var(--error-color);
      }
    }
  }
</style>
