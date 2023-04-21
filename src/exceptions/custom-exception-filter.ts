import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, ExecutionContext } from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    if (exception instanceof HttpException) {
      let responsed: object | string = exception.getResponse();
      message = typeof responsed === 'object' && 'message' in responsed ? (responsed as any).message : responsed;
    } else {
      
      message = 'Error no especificado';
    }

    console.log('Mensaje: ', exception)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
