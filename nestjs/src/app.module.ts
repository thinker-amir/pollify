import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import typeorm from './config/typeorm';
import { validate } from './env.validation';
import { PollsModule } from './polls/polls.module';
import { UsersModule } from './users/users.module';
import { ClsModule } from 'nestjs-cls';
import { ParticipatesModule } from './participates/participates.module';
import { RealTimeModule } from './real-time/real-time.module';
import { S3Module } from './aws/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    AuthModule,
    UsersModule,
    PollsModule,
    ParticipatesModule,
    RealTimeModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
