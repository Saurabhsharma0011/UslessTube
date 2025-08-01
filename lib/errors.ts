export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly code: string

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.code = code

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  public readonly field?: string
  
  constructor(message: string, field?: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.field = field
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR')
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR')
  }
}

export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed') {
    super(message, 400, 'FILE_UPLOAD_ERROR')
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR')
  }
}

// Error handler utility
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message)
  }

  return new AppError('An unknown error occurred')
}

// Error response formatter
export const formatErrorResponse = (error: AppError) => {
  const response: any = {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof ValidationError && error.field) {
    response.error.field = error.field
  }

  return response
} 