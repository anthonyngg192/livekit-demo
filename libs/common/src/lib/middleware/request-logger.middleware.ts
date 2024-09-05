import { ErrorLogRepository } from '../logs/repositories/error-log.repository';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { LogRepository } from '../logs/repositories/log.repository';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly errorLogRepo: ErrorLogRepository, private readonly logRepo: LogRepository) {}

  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const log = {
      url: req.originalUrl,
      method: req.method,
      requestBody: JSON.stringify(req.body),
      time: new Date(),
      header: '',
      duration: 0,
      responseBody: '',
      status: 200,
    };

    const chunkBuffers: any[] = [];
    const rawResponse = res.write;
    const rawResponseEnd = res.end;

    res.write = (...chunks: any[]) => {
      const resArgs: any = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];
        if (!resArgs[i]) {
          res.once('drain', res.write);
          i--;
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      return rawResponse.apply(res, resArgs);
    };

    res.end = (...chunk: any) => {
      const resArgs: any[] = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8');
      log.responseBody = body;
      log.header = JSON.stringify(req.headers);
      log.duration = Date.now() - log.time.getTime();
      log.status = res.statusCode;

      if (log.status === 500) {
        this.errorLogRepo.insert(log);
      } else {
        this.logRepo.insert(log);
      }

      rawResponseEnd.apply(res, chunk);
      return {
        response: {
          statusCode: res.statusCode,
          body: body,
          headers: res.getHeaders(),
        },
      } as unknown as Response;
    };

    res.on('error', (err: Error) => {
      this.logger.error(`Error: ${err.message}`);
    });

    next();
  }
}
