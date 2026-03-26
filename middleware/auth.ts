export default defineNuxtRouteMiddleware(async () => {
  const { session, getSession } = useAuth();
  session.value = await getSession(true);

  if (!session.value?.user) {
    return navigateTo("/");
  }
});
