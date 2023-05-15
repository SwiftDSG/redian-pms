import { Customer, CustomerMin, CustomerRequest } from "~~/interfaces/customer";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const names = useState<CustomerMin[]>("customers-names", () => null);
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

  const getCustomer = async (): Promise<CustomerMin[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/customers/names`,
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

  return {
    customers,
    names,
    getCustomers,
    getCustomer,
    getCustomerOverview,
    addCustomer,
  };
};
