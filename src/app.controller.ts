import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

/**
 * Client proxy turn the component to an event emitter
 * Send messages to the message broker
 */
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/create-category.dto';

@Controller('api/v1/categories')
export class AppController {
  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ, // param to specify the transporter to rabbit mq
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_URL}`,
        ], // param to specify the url of the rabbit mq
        queue: 'admin-backend', // param to specify the queue name
      },
    });
  }

  @Get('')
  index(@Query('category_id') category_id: string): Observable<any> {
    return this.clientAdminBackend.send('get-categories', category_id || ''); // send return a code observable
  }

  @Post('')
  @UsePipes(ValidationPipe)
  create(@Body() createCategory: CreateCategoryDTO) {
    this.clientAdminBackend.emit('create-category', createCategory); // emit return an observable
  }
}
