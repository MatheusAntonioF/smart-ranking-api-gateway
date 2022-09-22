import { convertToLocalTime } from 'date-fns-timezone';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging-interceptor';
import { TimeoutInterceptor } from './interceptors/timeout-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  Date.prototype.toJSON = function () {
    return convertToLocalTime(this, {
      timeZone: 'America/Sao_Paulo',
    }).toISOString();
  };

  await app.listen(8080);
}
bootstrap();
