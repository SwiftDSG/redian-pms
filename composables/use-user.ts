import { CookieRef } from "nuxt/dist/app/composables";
import { User, UserRequest, UserResponse } from "~~/types/user";

export default () => {
  const { $setDefaults, $fetch } = useNuxtApp();
  const config = useRuntimeConfig();
  const atkCookie: CookieRef<string> = useCookie<string>("atk", {
    maxAge: 1800,
  });
  const rtkCookie: CookieRef<string> = useCookie<string>("rtk", {
    maxAge: 86400,
  });

  const user = useState<UserResponse | null>("user", () => null);
  const users = useState<UserResponse[] | null>("users", () => null);

  const getUser = async (payload: { user_id: string }): Promise<UserResponse | null> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/${payload.user_id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      user.value = result;

      return result;
    } catch (e) {
      return null;
    }
  };
  const getUsers = async (): Promise<UserResponse[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      users.value = result;

      return result;
    } catch (e) {
      return [];
    }
  };
  const createUser = async (payload: { request: UserRequest }): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users`,
        "post",
        JSON.stringify(payload.request)
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      users.value = result;

      return result;
    } catch (e) {
      return '';
    }
  };
  const login = async (email: string, password: string): Promise<UserResponse | null> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/login`,
        "post",
        JSON.stringify({ email, password })
      );
      const result: { atk: string; rtk: string; user: UserResponse } =
        await response.json();
      if (!result.atk || !result.rtk) throw new Error("");
      atkCookie.value = result.atk;
      rtkCookie.value = result.rtk;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${result.atk}`,
        },
      });
      user.value = result.user;
      return result.user;
    } catch {
      return null;
    }
  };
  const refresh = async (): Promise<UserResponse | null> => {
    try {
      if (!rtkCookie.value) throw new Error("COOKIE_UNAVAILABLE");
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/refresh`,
        "post",
        JSON.stringify({ rtk: rtkCookie.value })
      );
      const result: { atk: string; rtk: string; user: UserResponse } =
        await response.json();
      if (!result.atk || !result.rtk) throw new Error("");
      atkCookie.value = result.atk;
      rtkCookie.value = result.rtk;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${result.atk}`,
        },
      });
      user.value = result.user;
      return result.user;
    } catch (e) {
      logout();
      return null;
    }
  };

  const logout = (): void => {
    atkCookie.value = "";
    rtkCookie.value = "";
    user.value = null;
    $setDefaults({
      headers: {
        "Authorization": '',
      },
    });
  };

  return { user, users, getUser, getUsers, createUser, login, logout, refresh };
};
