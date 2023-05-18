import { CookieRef } from "nuxt/dist/app/composables";
import { User } from "~~/types/user";

export default () => {
  const { $setDefaults, $fetch } = useNuxtApp();
  const config = useRuntimeConfig();
  const atkCookie: CookieRef<string> = useCookie<string>("atk", {
    maxAge: 1800,
  });
  const rtkCookie: CookieRef<string> = useCookie<string>("rtk", {
    maxAge: 86400,
  });

  const user = useState<User>("user", () => null);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/login`,
        "post",
        JSON.stringify({ email, password })
      );
      const result: { atk: string; rtk: string; user: User } =
        await response.json();
      if (!result.atk || !result.rtk) throw new Error("");
      atkCookie.value = result.atk;
      rtkCookie.value = result.rtk;
      console.log(result.atk);
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

  const refresh = async (): Promise<User> => {
    try {
      if (!rtkCookie.value) throw new Error("");
      const response: Response = await $fetch(
        `${config.public.apiBase}/users/refresh-token`,
        "post",
        JSON.stringify({ rtk: rtkCookie.value })
      );
      const result: { atk: string; rtk: string; user: User } =
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
      logout();
      return null;
    }
  };

  const logout = (): void => {
    atkCookie.value = "";
    rtkCookie.value = "";
    $setDefaults({
      headers: {
        Authorization: null,
      },
    });
    user.value = null;
  };

  return { user, login, logout, refresh };
};
