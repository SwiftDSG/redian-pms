import { Company, CompanyRequest } from "~~/types/company";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const company = useState<Company | null>("company", () => null);

  const getCompany = async (): Promise<Company[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/companies`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      company.value = result;

      return result;
    } catch (e) {
      return [];
    }
  };
  const createCompany = async (payload: { request: CompanyRequest }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/companies`,
        "post",
        JSON.stringify(payload.request)
      );

      const result = await response.text();
      if (response.status === 201) {
        if (payload.request.image && payload.request.image_photo) {
          const data = new FormData()
          data.append('file', payload.request.image_photo, payload.request.image_photo.name)
          const response: Response = await $fetch(
            `${config.public.apiBase}/companies/${result}/image`,
            "put",
            data
          );
          if (response.status !== 200) throw new Error(await response.json())
        }
        return result;
      }
      throw new Error("");
    } catch (e) {
      return '';
    }
  };
  const updateCompany = async (
    payload: {
      company_id: string,
      request: CompanyRequest
    },
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/companies/${payload.company_id}`,
        "put",
        JSON.stringify(payload.request)
      );
      const result = await response.text();
      if (response.status === 200) {
        if (payload.request.image && payload.request.image_photo) {
          const data = new FormData()
          data.append('file', payload.request.image_photo, payload.request.image_photo.name)
          const response: Response = await $fetch(
            `${config.public.apiBase}/companies/${result}/image`,
            "put",
            data
          );
          if (response.status !== 200) throw new Error(await response.json())
        }
        return result;
      }
      throw new Error("");
    } catch (e) {
      return '';
    }
  };

  return {
    company,
    updateCompany,
    getCompany,
    createCompany,
  };
};
