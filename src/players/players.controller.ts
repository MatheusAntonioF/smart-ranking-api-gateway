import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
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

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') player_id: string,
  ) {
    const { url } = await this.awsService.uploadFile(file, player_id);

    const updatePlayer = {
      url_photo_player: url,
    };

    this.clientAdminBackend.emit('update-player', {
      id: player_id,
      updatePlayer,
    });

    return { url };
  }
}
