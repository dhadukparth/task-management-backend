const STATUS_CODE = {
  // Continue
  CODE_CONTINUE: 100,

  // Switching Protocols
  CODE_SWITCHING_PROTOCOLS: 101,

  // Processing
  CODE_PROCESSING: 102,

  // Early Hints
  CODE_EARLY_HINTS: 103,

  // OK
  CODE_OK: 200,

  // Created
  CODE_CREATED: 201,

  // Accepted
  CODE_ACCEPTED: 202,

  // Non Authoritative Information
  CODE_NON_AUTHORITATIVE_INFORMATION: 203,

  // No Content
  CODE_NO_CONTENT: 204,

  // Reset Content
  CODE_RESET_CONTENT: 205,

  // Partial Content
  CODE_PARTIAL_CONTENT: 206,

  // Multi-Status
  CODE_MULTI_STATUS: 207,

  // Multiple Choices
  CODE_MULTIPLE_CHOICES: 300,

  // Moved Permanently
  CODE_MOVED_PERMANENTLY: 301,

  // Moved Temporarily
  CODE_MOVED_TEMPORARILY: 302,

  // See Other
  CODE_SEE_OTHER: 303,

  // Not Modified
  CODE_NOT_MODIFIED: 304,

  // Use Proxy
  CODE_USE_PROXY: 305,

  // Temporary Redirect
  CODE_TEMPORARY_REDIRECT: 307,

  // Permanent Redirect
  CODE_PERMANENT_REDIRECT: 308,

  // Bad Request
  CODE_BAD_REQUEST: 400,

  // Unauthorized
  CODE_UNAUTHORIZED: 401,

  // Payment Required
  CODE_PAYMENT_REQUIRED: 402,

  // Forbidden
  CODE_FORBIDDEN: 403,

  // Not Found
  CODE_NOT_FOUND: 404,

  // Method Not Allowed
  CODE_METHOD_NOT_ALLOWED: 405,

  // Not Acceptable
  CODE_NOT_ACCEPTABLE: 406,

  // Proxy Authentication Required
  CODE_PROXY_AUTHENTICATION_REQUIRED: 407,

  // Request Timeout
  CODE_REQUEST_TIMEOUT: 408,

  // Conflict
  CODE_CONFLICT: 409,

  // Gone
  CODE_GONE: 410,

  // Length Required
  CODE_LENGTH_REQUIRED: 411,

  // Precondition Failed
  CODE_PRECONDITION_FAILED: 412,

  // Request Entity Too Large
  CODE_REQUEST_TOO_LONG: 413,

  // Request-URI Too Long
  CODE_REQUEST_URI_TOO_LONG: 414,

  // Unsupported Media Type
  CODE_UNSUPPORTED_MEDIA_TYPE: 415,

  // Requested Range Not Satisfiable
  CODE_REQUESTED_RANGE_NOT_SATISFIABLE: 416,

  // Expectation Failed
  CODE_EXPECTATION_FAILED: 417,

  // I'm a teapot
  CODE_IM_A_TEAPOT: 418,

  // Insufficient Space on Resource
  CODE_INSUFFICIENT_SPACE_ON_RESOURCE: 419,

  // Method Failure
  CODE_METHOD_FAILURE: 420,

  // Misdirected Request
  CODE_MISDIRECTED_REQUEST: 421,

  // Unprocessable Entity
  CODE_UNPROCESSABLE_ENTITY: 422,

  // Locked
  CODE_LOCKED: 423,

  // Failed Dependency
  CODE_FAILED_DEPENDENCY: 424,

  // Upgrade Required
  CODE_UPGRADE_REQUIRED: 426,

  // Precondition Required
  CODE_PRECONDITION_REQUIRED: 428,

  // Too Many Requests
  CODE_TOO_MANY_REQUESTS: 429,

  // Request Header Fields Too Large
  CODE_REQUEST_HEADER_FIELDS_TOO_LARGE: 431,

  // Unavailable For Legal Reasons
  CODE_UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // Internal Server Error
  CODE_INTERNAL_SERVER_ERROR: 500,

  // Not Implemented
  CODE_NOT_IMPLEMENTED: 501,

  // Bad Gateway
  CODE_BAD_GATEWAY: 502,

  // Service Unavailable
  CODE_SERVICE_UNAVAILABLE: 503,

  // Gateway Timeout
  CODE_GATEWAY_TIMEOUT: 504,

  // HTTP Version Not Supported
  CODE_HTTP_VERSION_NOT_SUPPORTED: 505,

  // Insufficient Storage
  CODE_INSUFFICIENT_STORAGE: 507,

  // Network Authentication Required
  CODE_NETWORK_AUTHENTICATION_REQUIRED: 511
};

export default STATUS_CODE;
