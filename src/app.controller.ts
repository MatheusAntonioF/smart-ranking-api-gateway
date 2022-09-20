import {
  Body,
  Controller,
  Logger,
  Post,
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
import { CreateCategoryDTO } from './dtos/create-category.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ, // param to specify the transporter to rabbitmq
      options: {
        urls: ['amqp://user:hQ8Z5bUw38g4@52.91.198.1:5672/smartranking'], // param to specify the url of the rabbitmq
        queue: 'admin-backend', // param to specify the queue name
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategory: CreateCategoryDTO) {
    return this.clientAdminBackend.emit('create-category', createCategory);
  }
}
