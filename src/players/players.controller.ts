import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreatePlayerDTO } from './dtos/create-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ, // param to specify the transporter to rabbit mq
      options: {
        urls: ['amqp://user:hQ8Z5bUw38g4@107.22.1.222:5672/smartranking'], // param to specify the url of the rabbit mq
        queue: 'admin-backend', // param to specify the queue name
      },
    });
  }

  @Get()
  async index(@Query() player_id: string) {
    return this.clientAdminBackend.send('get-players', player_id || ''); // send return a code observable
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayer: CreatePlayerDTO) {
    this.clientAdminBackend.emit('create-player', createPlayer); // emit return an observable
  }
}
