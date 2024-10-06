export const ERROR_CODE = 401;
export const SUCCESS_CODE = 201;

// changed because toolkit handle valid status code.
export const RESPONSE_CODE = {
  // Success
  OK: 200,

  // Client Error
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  NOT_ACCEPTABLE: 406,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,

  // Server Error
  INTERNAL_SERVER_ERROR: 500,
};
export const MESSAGES = {
  REQUIRED_FIELDS: "All fields are required.",
  PASSWORD_MISMATCH: "The password and confirm password do not match.",
  EMAIL_EXISTS: "An account with this email already exists.",
  REGISTRATION_ERROR: "An error occurred during user registration.",
  USER_NOT_REGISTERED: "You are not registered. Please sign up.",
  INVALID_CREDENTIALS: "Invalid username or password. Please try again.",
  AUTH_SUCCESS: "Authentication successful!",
  UNAUTHORIZED: "Authorization required. Please log in.",
  PASSWORD_UPDATE_SUCCESS: "Your password has been updated successfully.",
  PASSWORD_UPDATE_ERROR: "An error occurred while updating your password.",
  USER_REGISTER_SUCCESS: "You have been registered successfully.",
  USERNAME_EXISTS: "This username is already taken. Please choose another.",
  PROFILE_UPDATE_SUCCESS: "Your profile has been updated successfully.",
  OLD_PASSWORD_INCORRECT: "The old password you entered is incorrect.",
  PROFILE_DELETE_SUCCESS: "Your profile has been deleted successfully.",
  INACTIVE_USER_ERROR:
    "Your account is currently inactive. Please contact support.",
  ORG_REGISTER_SUCCESS: "The organization has been registered successfully.",
  ORGANIZATION_NOT_FOUND:
    "No organization was found with the provided details.",
  ORGANIZATION_FOUND: "Organization details retrieved successfully.",
  PRODUCT_CREATED_SUCCESS: "New product created successfully.",
  PRODUCT_FETCH_SUCCESS: "Products fetched successfully.",
  CART_ADD_SUCCESS: "Item added to cart successfully.",
  CART_REMOVE_SUCCESS: "Item removed from cart successfully.",
  CART_GET_SUCCESS: "Cart items retrieved successfully.",
  PRODUCT_NOT_FOUND: "The requested product could not be found.",
  CART_NOT_FOUND: "No cart found for this user.",
  CART_EMPTY_SUCCESS: "The cart is currently empty.",
};
