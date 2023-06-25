export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, logout, refresh } = useUser()

  await refresh()

  if (!user.value) {
    logout()
    return '/auth'
  }
  return true
})