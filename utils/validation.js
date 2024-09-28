export const validateUsername = (username) => {
    // Username must be alphanumeric, allowing periods and underscores
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;
    return usernameRegex.test(username);
};
export const validateNestedFields = (data, requiredFields, parentKey = '') => {
    const errors = {};

    for (const key in requiredFields) {
      const field = requiredFields[key];

      if (typeof field === 'object' && field.required === undefined) {
        // If it's a nested object, recursively validate
        const nestedErrors = validateNestedFields(data[key] || {}, field, `${parentKey}${key}.`);
        if (Object.keys(nestedErrors).length > 0) {
          errors[key] = nestedErrors;
        }
      } else {
        // If it's a required field, check if it exists and is non-empty
        if (field.required && !data[key]) {
          errors[key] = field.message;
        }
        if (key === 'email' && field.format) {
            const emailRegex = field.format.regex;
            if (data[key] && !emailRegex.test(data[key])) {
                errors[key] = field.format.message;
            }
        }
      }
    }
    return errors;
  };
