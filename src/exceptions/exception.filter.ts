import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
import { ServerErrorException } from './exceptions';
  
  @Catch()
  export class ExceptionsHandler implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
  
      if (exception instanceof BadRequestException) {
        status = exception.getStatus();
        message = exception.message;
      }else if (exception instanceof ServerErrorException) {
        status = exception.getStatus();
        message = exception.message;
      }else if (exception instanceof NotFoundException) {
        status = exception.getStatus();
        message = exception.message;
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message,
      });
    }
  }
  