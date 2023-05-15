import { User } from "~~/interfaces/user"

export default defineNuxtPlugin(() => {
  const { refresh } = useUser()

  let config: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  return {
    provide: {
      setDefaults: (option: RequestInit): void => {
        config = { ...config, ...option, headers: { ...option.headers, 'Content-Type': 'application/json' } }
      },
      fetch: async (url: string, method: string, body?: string | FormData): Promise<Response> => {
        const option: RequestInit = {
          ...config,
          method,
          body,
        }
        if (body && body instanceof FormData) delete option.headers['Content-Type']

        let response: Response = await fetch(url, option)

        if (response.status === 401) {
          const user: User = await refresh()
          console.log(user)
          if (user) response = await fetch(url, option)
        }

        return response
      }
    }
  }
})