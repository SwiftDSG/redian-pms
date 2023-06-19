import { CookieRef } from "nuxt/dist/app/composables";
import { Role } from "~~/types/role";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const roles = useState<Role[]>("customer", () => null);
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
};
