import { Project } from "~~/types/project";

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
  const getProject = async (payload: {
    _id: string
  }): Promise<Project> => {
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

  return {
    projects,
    getProjects,
    getProject
  };
};
