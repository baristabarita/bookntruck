export const setLogoutTimer = (durationInMinutes, logoutCallback) => {
  const timeout = setTimeout(() => {
    localStorage.removeItem('clientDetails');
    logoutCallback();
  }, durationInMinutes * 60 * 1000); // Convert minutes to milliseconds

  return timeout;
};