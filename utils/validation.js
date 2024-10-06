export const validateUsername = (username) => {
  // Username must be alphanumeric, allowing periods and underscores
  const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;
  return usernameRegex.test(username);
};
