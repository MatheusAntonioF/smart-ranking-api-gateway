import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [AwsModule],
  controllers: [PlayersController],
  providers: [],
})
export class PlayersModule {}
