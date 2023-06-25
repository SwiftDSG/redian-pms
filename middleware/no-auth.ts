export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, refresh } = useUser()

  await refresh()

  if (user.value) {
    return '/'
  }
  return true
})