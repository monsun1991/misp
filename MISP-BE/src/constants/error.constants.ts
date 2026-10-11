/**
 * Centralized Error Messages
 * Keep all error messages in one place for consistency
 */

// General Errors
export const GENERAL_ERRORS = {
  INTERNAL_SERVER: "Internal server error",
  BAD_REQUEST: "Bad request",
  NOT_FOUND: "Resource not found",
  VALIDATION_FAILED: "Validation failed",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
};

// Authentication & Authorization Errors
export const AUTH_ERRORS = {
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "You don't have permission to access this resource",
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Your session has expired. Please login again",
  TOKEN_INVALID: "Invalid authentication token",
  EMAIL_ALREADY_EXISTS: "User with this email already exists",
  PHONE_ALREADY_EXISTS: "User with this phone number already exists",
  INVALID_REPORTING_MANAGER: "Reporting manager must be a valid salesmanager or salesadmin",
  SALESPERSON_NEEDS_MANAGER: "Salesperson must have a reporting manager",
};

// User Errors
export const USER_ERRORS = {
  NOT_FOUND: "User not found",
  ALREADY_EXISTS: "User already exists",
  INVALID_ROLE: "Invalid user role",
  CANNOT_DELETE: "Cannot delete user with existing records",
};

// Lead Errors
export const LEAD_ERRORS = {
  NOT_FOUND: "Lead not found",
  ACCESS_DENIED: "You don't have access to this lead",
  CANNOT_DELETE: "Cannot delete lead with existing records",
  INVALID_STATUS: "Invalid lead status",
};


// Contact Errors
export const CONTACT_ERRORS = {
  NOT_FOUND: "Contact not found",
  ALREADY_EXISTS: "Contact with this email/phone already exists",
  INVALID_EMAIL: "Invalid email address",
  INVALID_PHONE: "Invalid phone number",
};

// Deal Errors
export const DEAL_ERRORS = {
  NOT_FOUND: "Deal not found",
  INVALID_STAGE: "Invalid deal stage",
  INVALID_AMOUNT: "Deal amount must be greater than 0",
};

// Activity Errors
export const ACTIVITY_ERRORS = {
  NOT_FOUND: "Activity not found",
  INVALID_TYPE: "Invalid activity type",
  INVALID_STATUS: "Invalid activity status",
  INVALID_PRIORITY: "Invalid activity priority",
};

// Task Errors
export const TASK_ERRORS = {
  NOT_FOUND: "Task not found",
  ALREADY_COMPLETED: "Task is already completed",
  INVALID_DUE_DATE: "Due date must be in the future",
};

// Attachment Errors
export const ATTACHMENT_ERRORS = {
  NOT_FOUND: "Attachment not found",
  INVALID_FILE_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File size exceeds the maximum limit",
  UPLOAD_FAILED: "File upload failed",
};

// Database Errors
export const DATABASE_ERRORS = {
  DUPLICATE_ENTRY: "Duplicate entry. This record already exists",
  FOREIGN_KEY_VIOLATION: "Cannot perform this operation due to existing references",
  INVALID_REFERENCE: "Invalid reference. The related record does not exist",
  CONNECTION_FAILED: "Database connection failed",
  QUERY_FAILED: "Database query failed",
};

// Validation Errors
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: "This field is required",
  INVALID_FORMAT: "Invalid format",
  INVALID_LENGTH: "Invalid length",
  INVALID_VALUE: "Invalid value",
  INVALID_DATE: "Invalid date",
  INVALID_EMAIL: "Invalid email address",
  INVALID_PHONE: "Invalid phone number",
};

// File Upload Errors
export const FILE_ERRORS = {
  ONLY_XLSX_ALLOWED: "Only XLSX files are allowed",
  FILE_TOO_LARGE: "File size too large. Maximum size is 10MB",
  UNEXPECTED_FIELD: "Unexpected file field",
  UPLOAD_FAILED: "File upload error",
};

