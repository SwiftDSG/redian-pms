import { Role } from "~~/types/role";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const roles = useState<Role[] | null>("customer", () => null);

  return { roles }
};
