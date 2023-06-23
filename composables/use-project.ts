import { ProjectProgressReportRequest } from "~~/types/progress-report";
import { ProjectMinResponse, ProjectAreaRequest, ProjectAreaResponse, ProjectProgressResponse, ProjectRequest, ProjectResponse, ProjectUserResponse } from "~~/types/project";
import { ProjectRoleRequest } from "~~/types/project-role";
import { ProjectTask, ProjectTaskMinResponse, ProjectTaskPeriodRequest, ProjectTaskRequest, ProjectTaskResponse, ProjectTaskStatusKind } from "~~/types/project-task";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const projects = useState<ProjectMinResponse[]>("projects", () => null);
  const project = useState<{
    data: ProjectResponse,
    timeline: ProjectTaskMinResponse[],
    progress: ProjectProgressResponse[],
    areas: ProjectAreaResponse[],
    users: ProjectUserResponse
  }>('project', () => null);

  const getProjects = async (): Promise<ProjectMinResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      projects.value = result;

      return result;
    } catch (e) {
      return null;
    }
  };
  const getProject = async (payload: { _id: string }): Promise<ProjectResponse> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return null;
    }
  };
  const getProjectTasks = async (payload: {
    _id: string, query?: {
      status?: ProjectTaskStatusKind
    }
  }): Promise<ProjectTaskMinResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/tasks?${payload.query?.status ? `status=${payload.query.status}&` : ''}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return null;
    }
  };
  const getProjectTask = async (payload: {
    project_id: string,
    task_id: string
  }): Promise<ProjectTaskResponse> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/${payload.task_id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return null;
    }
  };
  const getProjectAreas = async (payload: { _id: string }): Promise<ProjectAreaResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/areas`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return null;
    }
  };
  const getProjectProgress = async (payload: { _id: string }): Promise<ProjectProgressResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/progress`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return null;
    }
  };
  const getProjectUsers = async (payload: { _id: string }): Promise<ProjectUserResponse> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/members`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return null;
    }
  };
  const createProject = async (payload: {
    request: ProjectRequest
  }): Promise<ProjectTask> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const createProjectTask = async (payload: {
    task_id?: string;
    project_id: string;
    request: ProjectTaskRequest | ProjectTaskRequest[];
  }): Promise<ProjectTask> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks${payload.task_id ? `/${payload.task_id}` : ""
        }`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const createProjectReport = async (payload: {
    project_id: string;
    request: ProjectProgressReportRequest;
  }): Promise<ProjectTask> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/reports`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const createProjectRole = async (payload: {
    project_id: string;
    request: ProjectRoleRequest;
  }): Promise<ProjectTask> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/roles`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const updateProjectTaskPeriod = async (payload: {
    task_id: string;
    project_id: string;
    request: ProjectTaskPeriodRequest;
  }): Promise<ProjectTask> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/${payload.task_id
        }/period`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const updateProjectRole = async (payload: {
    project_id: string;
    role_id: string;
    request: ProjectRoleRequest;
  }): Promise<ProjectTask> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/roles/${payload.role_id}`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const addProjectArea = async (payload: {
    project_id: string;
    request: ProjectAreaRequest;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/areas`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const removeProjectArea = async (payload: {
    project_id: string;
    area_id: string
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/areas/${payload.area_id}`,
        "delete"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  return {
    projects,
    project,
    getProjects,
    getProject,
    getProjectTasks,
    getProjectTask,
    getProjectAreas,
    getProjectProgress,
    addProjectArea,
    getProjectUsers,
    removeProjectArea,
    createProject,
    createProjectTask,
    createProjectReport,
    createProjectRole,
    updateProjectTaskPeriod,
    updateProjectRole
  };
};
