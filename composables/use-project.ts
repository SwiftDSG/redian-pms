import { ProjectIncidentReportRequest } from "types/project-incident";
import {
  ProjectProgressReportRequest,
  ProjectProgressReportResponse,
} from "types/project-report";
import {
  ProjectMinResponse,
  ProjectAreaRequest,
  ProjectAreaResponse,
  ProjectProgressResponse,
  ProjectRequest,
  ProjectResponse,
  ProjectUserResponse,
  ProjectMemberRequest,
  ProjectReportResponse,
  ProjectStatusKind,
} from "~~/types/project";
import {
  ProjectRolePermission,
  ProjectRoleRequest,
} from "~~/types/project-role";
import {
  ProjectTaskMinResponse,
  ProjectTaskPeriodRequest,
  ProjectTaskRequest,
  ProjectTaskResponse,
  ProjectTaskStatusKind,
} from "~~/types/project-task";

export default () => {
  const { $fetch } = useNuxtApp();
  const { user } = useUser();
  const config = useRuntimeConfig();

  const query = useState<{
    status?: string;
    sort?: string;
    text?: string;
    skip: number;
    limit: number;
  }>("projects-query", () => ({
    status: "",
    sort: "",
    text: "",
    skip: 0,
    limit: 10,
  }));
  const projects = useState<ProjectMinResponse[] | null>(
    "projects",
    () => null
  );
  const project = useState<{
    data: ProjectResponse | null;
    timeline: ProjectTaskMinResponse[] | null;
    progress: ProjectProgressResponse[] | null;
    areas: ProjectAreaResponse[] | null;
    users: ProjectUserResponse | null;
    reports: ProjectReportResponse[] | null;
  }>("project", () => ({
    data: null,
    timeline: null,
    progress: null,
    areas: null,
    users: null,
    reports: null,
  }));

  function validate(permit: ProjectRolePermission): boolean {
    if (!user.value || !project.value.users?.user) return false;
    const roles =
      project.value.users.user.find((a) => a._id === user.value?._id)?.role ||
      [];
    for (const role of roles) {
      if (role.permission.includes(permit) || role.permission.includes("owner"))
        return true;
    }
    return false;
  }
  const getProjects = async (
    reset: boolean = false
  ): Promise<ProjectMinResponse[]> => {
    try {
      if (reset) query.value.limit = 10;
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects?${
          query.value?.sort ? `sort=${query.value.sort}&` : ""
        }${query.value?.text ? `text=${query.value.text}&` : ""}${
          query.value?.status ? `status=${query.value.status}&` : ""
        }${query.value?.limit ? `limit=${query.value.limit}&` : ""}${
          query.value?.skip ? `skip=${query.value.skip}&` : ""
        }`,
        "get"
      );
      if (response.status !== 200) {
        projects.value = [];
        query.value.limit = 0;
      }

      const result = await response.json();
      if (result.length < 10) query.value.limit = 0;
      projects.value = result;

      return result;
    } catch (e) {
      return [];
    }
  };
  const getProject = async (payload: {
    _id: string;
  }): Promise<ProjectResponse | null> => {
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
    _id: string;
    query?: {
      status?: ProjectTaskStatusKind;
      area_id?: string;
    };
  }): Promise<ProjectTaskMinResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/tasks?${
          payload.query?.status ? `status=${payload.query.status}&` : ""
        }${payload.query?.area_id ? `area_id=${payload.query.area_id}&` : ""}`,
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
    project_id: string;
    task_id: string;
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
  const getProjectAreas = async (payload: {
    _id: string;
  }): Promise<ProjectAreaResponse[]> => {
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
  const getProjectProgress = async (payload: {
    _id: string;
    query?: {
      area_id?: string;
    };
  }): Promise<ProjectProgressResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/progress?${
          payload.query?.area_id ? `area_id=${payload.query.area_id}&` : ""
        }`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return [];
    }
  };
  const getProjectUsers = async (payload: {
    _id: string;
  }): Promise<ProjectUserResponse | null> => {
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
  const getProjectReports = async (payload: {
    _id: string;
  }): Promise<ProjectReportResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload._id}/reports`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return [];
    }
  };
  const getProjectReport = async (payload: {
    project_id: string;
    report_id: string;
  }): Promise<ProjectProgressReportResponse | null> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/reports/${payload.report_id}`,
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
    request: ProjectRequest;
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
      return "";
    }
  };
  const createProjectTask = async (payload: {
    task_id?: string;
    project_id: string;
    request: ProjectTaskRequest | ProjectTaskRequest[];
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks${
          payload.task_id ? `/${payload.task_id}` : ""
        }`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return "";
    }
  };
  const createProjectTaskBulk = async (payload: {
    project_id: string;
    file: File;
  }): Promise<string> => {
    try {
      const data = new FormData();
      data.append("file", payload.file);

      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/bulk`,
        "post",
        data
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return "";
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
      const result = await response.text();
      if (response.status === 201) {
        if (payload.request.documentation_photo?.length) {
          const data = new FormData();
          for (const photo of payload.request.documentation_photo) {
            data.append("file", photo, photo.name);
          }
          const response: Response = await $fetch(
            `${config.public.apiBase}/projects/${payload.project_id}/reports/${result}`,
            "put",
            data
          );
          if (response.status !== 200) throw new Error(await response.json());
        }
        return result;
      }
      throw new Error("");
    } catch (e) {
      return "";
    }
  };
  const createProjectIncident = async (payload: {
    project_id: string;
    request: ProjectIncidentReportRequest;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/incidents?${
          payload.request.breakdown ? "breakdown=true" : ""
        }`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.json();
      return result;
    } catch (e) {
      return "";
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
      return "";
    }
  };
  const updateProjectStatus = async (payload: {
    project_id: string;
    request: ProjectStatusKind;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/status?status=${payload.request}`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
    }
  };
  const updateProjectTask = async (payload: {
    task_id: string;
    project_id: string;
    request: ProjectTaskRequest;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/${payload.task_id}`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
    }
  };
  const updateProjectTaskPeriod = async (payload: {
    task_id: string;
    project_id: string;
    request: ProjectTaskPeriodRequest;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/${payload.task_id}/period`,
        "put",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
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

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
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

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
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

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
    }
  };
  const removeProjectArea = async (payload: {
    project_id: string;
    area_id: string;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/areas/${payload.area_id}`,
        "delete"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
    }
  };
  const deleteProjectTask = async (payload: {
    project_id: string;
    task_id: string;
  }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/projects/${payload.project_id}/tasks/${payload.task_id}`,
        "delete"
      );
      if (response.status !== 204) throw new Error("");

      const result = await response.text();
      return result;
    } catch (e) {
      return "";
    }
  };

  return {
    query,
    projects,
    project,
    validate,
    getProjects,
    getProject,
    getProjectTasks,
    getProjectTask,
    getProjectAreas,
    getProjectProgress,
    getProjectUsers,
    getProjectReports,
    getProjectReport,
    createProject,
    createProjectTask,
    createProjectTaskBulk,
    createProjectReport,
    createProjectIncident,
    createProjectRole,
    updateProjectStatus,
    updateProjectTask,
    updateProjectTaskPeriod,
    updateProjectRole,
    addProjectArea,
    addProjectMember,
    removeProjectArea,
    deleteProjectTask,
  };
};
