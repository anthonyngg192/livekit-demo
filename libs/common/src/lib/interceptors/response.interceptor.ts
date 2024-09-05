import { catchError, map, Observable } from 'rxjs';
import { ResponseDocs, ReturnOKDocs } from '../docs/response.docs';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class ResponseInterceptorInterceptor implements NestInterceptor {
  protected logger = new Logger(this.constructor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<ReturnOKDocs<any> | any>,
  ): Observable<ResponseDocs<any>> | Promise<Observable<ResponseDocs<any>>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response: ReturnOKDocs<any> | any) => {
        return response;
      }),
      catchError(async (err: HttpException | BadRequestException) => {
        let httpCode = 400;
        let errorStack = err['stack'];
        this.logger.error(err, errorStack);
        response.status(httpCode);
        const errData = {
          message: err.message,
          statusCode: httpCode,
        };
        return new ResponseDocs(errData);
      }),
    );
  }
}
