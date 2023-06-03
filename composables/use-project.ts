import { Project, ProjectAreaRequest, ProjectAreaResponse, ProjectProgressResponse, ProjectResponse } from "~~/types/project";
import { ProjectTask, ProjectTaskMinResponse, ProjectTaskPeriodRequest, ProjectTaskRequest } from "~~/types/project-task";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const projects = useState<Project[]>("projects", () => null);

  const getProjects = async (): Promise<Project[]> => {
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
  const getProjectTasks = async (payload: { _id: string }): Promise<ProjectTaskMinResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/tasks`,
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

  return {
    projects,
    getProjects,
    getProject,
    getProjectTasks,
    getProjectAreas,
    getProjectProgress,
    addProjectArea,
    createProjectTask,
    updateProjectTaskPeriod
  };
};
