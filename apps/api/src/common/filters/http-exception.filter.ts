import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';

/**
 * Global exception filter.
 * - Returns structured error responses
 * - Never exposes stack traces to the client
 * - Generates a reference ID for every error (useful for support/debugging)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const referenceId = uuid();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let error = 'Internal Server Error';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || message;
        error = (resp.error as string) || error;
        details = resp.details;
      }
    } else if (exception instanceof Error) {
      // Log the actual error server-side, never send to client
      console.error(`[${referenceId}] Unhandled error:`, exception.message, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      details,
      referenceId,
      timestamp: new Date().toISOString(),
    });
  }
}
