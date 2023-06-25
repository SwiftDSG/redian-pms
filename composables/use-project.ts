import { ProjectProgressReportRequest } from "~~/types/progress-report";
import { ProjectMinResponse, ProjectAreaRequest, ProjectAreaResponse, ProjectProgressResponse, ProjectRequest, ProjectResponse, ProjectUserResponse, ProjectMemberRequest } from "~~/types/project";
import { ProjectRoleRequest } from "~~/types/project-role";
import { ProjectTask, ProjectTaskMinResponse, ProjectTaskPeriodRequest, ProjectTaskRequest, ProjectTaskResponse, ProjectTaskStatusKind } from "~~/types/project-task";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const projects = useState<ProjectMinResponse[] | null>("projects", () => null);
  const project = useState<{
    data: ProjectResponse | null,
    timeline: ProjectTaskMinResponse[] | null,
    progress: ProjectProgressResponse[] | null,
    areas: ProjectAreaResponse[] | null,
    users: ProjectUserResponse | null,
  }>('project', () => ({
    data: null,
    timeline: null,
    progress: null,
    areas: null,
    users: null
  }));

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
      return [];
    }
  };
  const getProject = async (payload: { _id: string }): Promise<ProjectResponse | null> => {
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
      return [];
    }
  };
  const getProjectTask = async (payload: {
    project_id: string,
    task_id: string
  }): Promise<ProjectTaskResponse | null> => {
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
      return [];
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
      return [];
    }
  };
  const getProjectUsers = async (payload: { _id: string }): Promise<ProjectUserResponse | null> => {
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
  }): Promise<string> => {
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
      return '';
    }
  };
  const createProjectTask = async (payload: {
    task_id?: string;
    project_id: string;
    request: ProjectTaskRequest | ProjectTaskRequest[];
  }): Promise<string> => {
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
      return '';
    }
  };
  const createProjectReport = async (payload: {
    project_id: string;
    request: ProjectProgressReportRequest;
  }): Promise<string> => {
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
      return '';
    }
  };
  const createProjectRole = async (payload: {
    project_id: string;
    request: ProjectRoleRequest;
  }): Promise<string> => {
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
      return '';
    }
  };
  const updateProjectTask = async (payload: {
    task_id: string;
    project_id: string;
    request: ProjectTaskRequest;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/${payload.task_id
        }`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return '';
    }
  };
  const updateProjectTaskPeriod = async (payload: {
    task_id: string;
    project_id: string;
    request: ProjectTaskPeriodRequest;
  }): Promise<string> => {
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
      return '';
    }
  };
  const updateProjectRole = async (payload: {
    project_id: string;
    role_id: string;
    request: ProjectRoleRequest;
  }): Promise<string> => {
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
      return '';
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
      return '';
    }
  };
  const addProjectMember = async (payload: {
    project_id: string;
    request: ProjectMemberRequest;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/members`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return '';
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
      return '';
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
    getProjectUsers,
    removeProjectArea,
    createProject,
    createProjectTask,
    createProjectReport,
    createProjectRole,
    updateProjectTask,
    updateProjectTaskPeriod,
    updateProjectRole,
    addProjectArea,
    addProjectMember
  };
};
