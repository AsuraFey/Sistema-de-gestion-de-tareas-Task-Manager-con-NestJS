import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import config from "./config/config";


@Module({
  imports: [
      AuthModule,
      TasksModule,
      JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (config) => ({
              secret: config.get("jwt.secret"),
          }),
          global:true,
          inject: [ConfigService],
      }),
      ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [config],
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
