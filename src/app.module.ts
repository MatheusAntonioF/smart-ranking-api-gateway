import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PlayersModule } from './players/player.module';

@Module({
  imports: [PlayersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
