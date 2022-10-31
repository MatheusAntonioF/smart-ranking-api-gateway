import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PlayersModule } from './players/player.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlayersModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
