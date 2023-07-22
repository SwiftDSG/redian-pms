import { Customer, CustomerRequest } from "~~/types/customer";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const customers = useState<Customer[] | null>("customers", () => null);

  const getCustomers = async (): Promise<Customer[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      customers.value = result;
      return result;
    } catch (e) {
      return [];
    }
  };
  const getCustomer = async (payload: { customer_id: string }): Promise<Customer[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${payload.customer_id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return [];
    }
  };
  const createCustomer = async (payload: { request: CustomerRequest }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers`,
        "post",
        JSON.stringify(payload.request)
      );
      const result = await response.text();
      if (response.status === 201) {
        if (payload.request.image && payload.request.image_photo) {
          const data = new FormData()
          data.append('file', payload.request.image_photo, payload.request.image_photo.name)
          const response: Response = await $fetch(
            `${config.public.apiBase}/customers/${result}/image`,
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
  const updateCustomer = async (
    payload: {
      customer_id: string,
      request: CustomerRequest
    },
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${payload.customer_id}`,
        "put",
        JSON.stringify(payload.request)
      );
      const result = await response.text();
      if (response.status === 200) {
        if (payload.request.image && payload.request.image_photo) {
          const data = new FormData()
          data.append('file', payload.request.image_photo, payload.request.image_photo.name)
          const response: Response = await $fetch(
            `${config.public.apiBase}/customers/${result}/image`,
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
  const deleteCustomer = async (payload: { customer_id: string }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${payload.customer_id}`,
        "delete"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.text();

      return result;
    } catch (e) {
      return '';
    }
  };

  return {
    customers,
    deleteCustomer,
    updateCustomer,
    getCustomers,
    getCustomer,
    createCustomer,
  };
};
