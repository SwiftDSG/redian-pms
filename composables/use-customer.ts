import { Customer, CustomerMin, CustomerRequest } from "~~/types/customer";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const names = useState<CustomerMin[]>("customer", () => null);
  const customers = useState<Customer[]>("customers", () => null);

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
      return null;
    }
  };

  const getCustomer = async (payload): Promise<CustomerMin[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${payload}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      names.value = result;

      return result;
    } catch (e) {
      return null;
    }
  };

  const addCustomer = async (payload: CustomerRequest): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers`,
        "post",
        JSON.stringify({
          name: payload.name,
          person: payload.person,
          contact: payload.contact,
        })
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.text();

      return result;
    } catch (e) {
      return null;
    }
  };

  const getCustomerOverview = async (): Promise<Customer[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/overview`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: Customer[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };
  const updateCustomer = async (
    payload: CustomerRequest,
    id
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${id}`,
        "put",
        JSON.stringify({
          name: payload.name,
          person: payload.person,
          contact: payload.contact,
        })
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.text();

      return result;
    } catch (e) {
      return null;
    }
  };
  const deleteCustomer = async (id): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/${id}`,
        "delete"
      );
      if (response.status !== 201) throw new Error("");

      const result = await response.text();

      return result;
    } catch (e) {
      return null;
    }
  };

  return {
    customers,
    names,
    deleteCustomer,
    updateCustomer,
    getCustomers,
    getCustomer,
    addCustomer,
    getCustomerOverview,
  };
};
