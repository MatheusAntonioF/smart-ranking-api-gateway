import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { AwsService } from 'src/aws/aws.service';
import { CreatePlayerDTO } from './dtos/create-player.dto';
@Controller('api/v1/players')
export class PlayersController {
  private clientAdminBackend: ClientProxy;

  constructor(private readonly awsService: AwsService) {
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

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async index(@Query() player_id: string) {
    return this.clientAdminBackend.send('get-players', player_id || ''); // send return a code observable
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayer: CreatePlayerDTO) {
    this.clientAdminBackend.emit('create-player', createPlayer); // emit return an observable
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') player_id: string,
  ) {
    const { url } = await this.awsService.uploadFile(file, player_id);

    return { url };
  }
}
