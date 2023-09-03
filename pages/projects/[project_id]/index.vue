<template>
  <div class="rd-container">
    <div class="rd-project-menu">
      <div class="rd-project-menu-section">
        <!-- <rd-input-select v-if="view === 'desktop'" :input="projectInput" /> -->
        <rd-input-button-small
          :icon="menu.icon"
          v-for="menu in projectMenus"
          :key="menu.name"
          :type="projectMenu === menu.name ? 'primary' : 'default'"
          :tooltip="menu.title"
          @clicked="projectMenuChange(menu.name)"
        />
      </div>
      <div v-if="view === 'desktop'" class="rd-project-menu-section">
        <rd-input-button
          v-if="
            validate('create_task') &&
            projectMenu === 'tasks' &&
            project.data?.status[0]?.kind === 'pending'
          "
          label="Add stage"
          @clicked="openAddArea"
        />
        <rd-input-button
          v-else-if="
            !projectWarning &&
            validate('create_report') &&
            projectMenu === 'reports' &&
            project.data?.status[0]?.kind !== 'finished' &&
            project.data?.status[0]?.kind !== 'breakdown' &&
            project.data?.status[0]?.kind !== 'cancelled'
          "
          label="Add report"
          @clicked="openAddReport"
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
          <rd-svg
            class="rd-project-warning-icon"
            name="warning"
            color="secondary"
          />
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
        type="secondary"
        @clicked="
          projectMenuChange(
            projectWarning !== 'incomplete-period' ? 'tasks' : 'timeline'
          )
        "
      />
      <rd-input-button
        v-else-if="validate('create_incident')"
        class="rd-project-warning-action"
        label="continue project"
        type="secondary"
        @clicked="openRemoveIncident"
      />
    </div>
    <rd-project-overview
      v-if="
        projectMenu === 'overview' &&
        project.data &&
        projectProgress &&
        projectTimeline &&
        projectUsers?.user
      "
      :project="project.data"
      :state="projectMenuState"
      :data="{
        projectProgress,
        projectTimeline,
        projectMembers: projectUsers?.user,
      }"
      @changing-done="projectMenuState = 'idle'"
      @change-menu="projectMenuChange"
      @open-task="openTask"
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
      v-if="
        projectMenu === 'reports' &&
        project.data &&
        projectReports &&
        projectProgress &&
        projectTimeline
      "
      :project="project.data"
      :state="projectMenuState"
      :data="{
        projectReports,
        projectProgress,
        projectTimeline,
      }"
      @changing-done="projectMenuState = 'idle'"
      @add-task="openAddTask"
      @export-report="openExportReport"
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
    <rd-input-button-floating
      v-if="
        view === 'mobile' &&
        validate('create_task') &&
        projectMenu === 'tasks' &&
        project.data?.status[0]?.kind === 'pending'
      "
      class="rd-project-menu-action"
      label="Add stage"
      @clicked="openAddArea"
    />
    <rd-input-button-floating
      v-else-if="
        view === 'mobile' &&
        !projectWarning &&
        validate('create_report') &&
        projectMenu === 'reports' &&
        project.data?.status[0]?.kind !== 'finished' &&
        project.data?.status[0]?.kind !== 'breakdown' &&
        project.data?.status[0]?.kind !== 'cancelled'
      "
      class="rd-project-menu-action"
      label="Add report"
      @clicked="openAddReport"
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
  import {
    ProjectRolePermission,
    ProjectRoleResponse,
  } from "~~/types/project-role";
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
    permit?: ProjectRolePermission;
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
    validate,
    getProjects,
    getProject,
    getProjectProgress,
    getProjectAreas,
    getProjectTasks,
    getProjectUsers,
    getProjectReports,
  } = useProject();
  const { view, init, state } = useMain();
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
        value: "*",
      },
    ],
  });

  const projectMenuState = ref<"idle" | "changing">("idle");
  const projectMenu = ref<ProjectMenuKind | null>(null);
  const projectInit = ref<boolean>(true);

  const area = computed<string>(() =>
    !areaInput.value.value || areaInput.value.value === "*"
      ? ""
      : areaInput.value.value
  );

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
  const projectWarning = computed<ProjectWarning | null>(() => {
    if (projectInit.value) return null;
    if (project.value.data?.status[0].kind === "breakdown") return "breakdown";
    if (!projectAreas.value?.length) return "empty-area";
    if (!projectAreas.value.reduce((a, b) => a + (b?.task?.length || 0), 0))
      return "empty-task";
    if (
      projectAreas.value.reduce(
        (a, b) => a + (b?.task?.reduce((c, d) => c + d.value, 0) || 0),
        0
      ) !== 100
    )
      return "incomplete-value";
    if (
      projectTimeline.value?.length &&
      !projectTimeline.value.every((a) => !!a.period)
    )
      return "incomplete-period";
    return null;
  });
  const projectMenus = computed<ProjectMenu[]>(() => {
    const menus: ProjectMenu[] = [
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
        icon: "gantt",
        permit: "get_tasks",
      },
      {
        title: "Project Users",
        name: "users",
        icon: "account-group",
        permit: "get_roles",
      },
      {
        title: "Project Tasks",
        name: "tasks",
        icon: "clipboard",
        permit: "get_tasks",
      },
      {
        title: "Project Reports",
        name: "reports",
        icon: "file",
        permit: "create_report",
      },
    ];
    return menus.filter((a) => (a.permit ? validate(a.permit) : true));
  });

  function projectWarningName(): string {
    let str = "";

    if (projectWarning.value === "empty-area") str = "Empty project stage";
    if (projectWarning.value === "empty-task") str = "Empty project task";
    if (projectWarning.value === "incomplete-value")
      str = `Invalid tasks values (${(
        projectAreas.value?.reduce(
          (a, b) => a + (b?.task?.reduce((c, d) => c + d.value, 0) || 0),
          0
        ) || 0
      ).toFixed(3)}%)`;
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
  function projectMenuChange(name: ProjectMenuKind): Promise<void> {
    return new Promise((resolve) => {
      if (name !== projectMenu.value) projectMenuState.value = "changing";
      setTimeout(async () => {
        projectMenu.value = name;
        switch (name) {
          case "overview":
            project.value.progress = await getProjectProgress({
              _id: project.value.data?._id || "",
              query: {
                area_id: area.value,
              },
            });
            project.value.timeline = await getProjectTasks({
              _id: project.value.data?._id || "",
              query: {
                area_id: area.value,
              },
            });
            project.value.users = await getProjectUsers({
              _id: project.value.data?._id || "",
            });
            break;
          case "progress":
            project.value.progress = await getProjectProgress({
              _id: project.value.data?._id || "",
              query: {
                area_id: area.value,
              },
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
              query: {
                area_id: area.value,
              },
            });
            break;
          case "users":
            project.value.users = await getProjectUsers({
              _id: project.value.data?._id || "",
            });
            break;
        }
        resolve();
      }, 250);
    });
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
  function openExportReport(): void {
    emits("open-panel", {
      state: "show",
      type: "project-report-export",
      data: {
        project_id: project.value.data?._id || "",
        period: project.value.data?.period,
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
  function openRemoveIncident(): void {
    emits("open-panel", {
      state: "show",
      type: "project-incident-remove",
      data: {
        project_id: project.value.data?._id || "",
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

  watch(
    () => area.value,
    () => {
      if (projectMenu.value) projectMenuChange(projectMenu.value);
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

    await projectMenuChange("overview");

    if (areaInput.value.options) {
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
    projectInit.value = false;

    setTimeout(() => {
      init.value = false;
      state.value = "idle";
    }, 250);
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
          span {
            color: var(--font-secondary-color);
          }
        }
      }
      &.rd-project-warning-breakdown {
        background: var(--error-color);
      }
    }
    @media only screen and (max-width: 1024px) {
      min-height: auto;
      padding: 0 1rem;
      gap: 0.75rem;
      .rd-project-menu {
        left: -1rem;
        width: calc(100% + 2rem);
        padding: 0 1rem;
        box-sizing: border-box;
        flex-shrink: 0;
        overflow-x: auto;
        overflow-y: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        .rd-project-menu-section {
          flex-shrink: 0;
        }
      }
      .rd-project-warning {
        flex-direction: column;
        .rd-project-warning-detail {
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          .rd-project-warning-icon-container {
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
          }
        }
        .rd-project-warning-action {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
        }
      }
      .rd-project-menu-action {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
      }
    }
  }
</style>
