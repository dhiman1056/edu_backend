export const ERROR_CODE = 401;
export const SUCCESS_CODE = 201;

// changed because toolkit handle valid status code.
export const RESPONSE_CODE = {
  // Success
  OK: 200,
 
  // Client Error
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  NOT_ACCEPTABLE:406,
  NOT_FOUND:404,

  // Server Error
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  REQUIRED_FIELDS: "All fields are required",
  PASSWORD_MISMATCH: "Password and Confirm Password do not match",
  EMAIL_EXISTS: "Email already exists",
  REGISTRATION_ERROR: "An error occurred while registering user",
  USER_NOT_REGISTERED: "You are not registered",
  INVALID_CREDENTIALS: "Invalid username or password",
  AUTH_SUCCESS: "Authentication successful!",
  PASSWORD_UPDATE_SUCCESS: "Password updated successfully.",
  PASSWORD_UPDATE_ERROR: "An error occurred while changing the password",
  USER_REGISTER_SUCCESS: "Registered successfully",
  USERNAME_EXISTS: "Username already exists",
  PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
};
