type Overview = {
  project_count: 0;
  project_completed: 0;
  project_completition: 0;
  project: {
    _id: string;
    customer: {
      _id: string;
      name: string;
      image: {
        _id: string;
        extension: string;
      };
    };
    name: string;
    code: string;
    period: {
      start: string;
      end: string;
    };
    progress: {
      actual: number;
      plan: number;
    };
  }[];
  task: {
    _id: string;
    project: {
      _id: string;
      customer: {
        _id: string;
        name: string;
        image: {
          _id: string;
          extension: string;
        };
      };
      name: string;
      code: string;
      period: {
        start: string;
        end: string;
      };
    };
    area: {
      _id: string;
      name: string;
    };
    name: string;
    description?: string;
    period: {
      start: string;
      end: string;
    };
  }[];
};

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const overview = useState<Overview>("overview", () => ({
    project_completed: 0,
    project_completition: 0,
    project_count: 0,
    project: [],
    task: [],
  }));

  const getOverview = async (): Promise<Overview | null> => {
    try {
      const response = await $fetch(`${config.public.apiBase}/overview`, "get");

      const result = await response.json();
      overview.value = result;

      return result;
    } catch (e) {
      return null;
    }
  };

  return { overview, getOverview };
};
