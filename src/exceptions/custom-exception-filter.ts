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
  
    let message: any;
    console.log('exception: ', exception);
    if (exception instanceof HttpException) {
      let responsed: object | string = exception.getResponse();
      if (typeof responsed === 'object') {
        if ('message' in responsed) {
          message = Array.isArray(responsed['message']) ? responsed['message'].join(', ') : responsed['message'];
        } else if ('error' in responsed) {
          message = responsed['error'];
        } else {
          message = JSON.stringify(responsed);
        }
      } else {
        message = responsed;
      }
    } else {
      message = 'Error no especificado';
    }
  
    // console.log('Mensaje: ', {
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   message,
    // });
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
  
}
