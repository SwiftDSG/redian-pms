import { Customer, CustomerMin, CustomerRequest } from "~~/types/customer";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const names = useState<CustomerMin[] | null>("customer", () => null);
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
  const getCustomer = async (payload: { customer_id: string }): Promise<CustomerMin[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${payload.customer_id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      names.value = result;

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
      if (response.status !== 201) throw new Error("");

      const result = await response.text();

      return result;
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
      if (response.status !== 200) throw new Error("");

      const result = await response.text();

      return result;
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
    names,
    deleteCustomer,
    updateCustomer,
    getCustomers,
    getCustomer,
    createCustomer,
  };
};
