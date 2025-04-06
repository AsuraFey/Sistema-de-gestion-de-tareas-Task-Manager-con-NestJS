import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { RolesModule } from './roles/roles.module';
import { MailerModule } from './mailer/mailer.module';
import {ConfigModule} from "@nestjs/config";


@Module({
  imports: [
      AuthModule,
      TasksModule,
      RolesModule,
      MailerModule,
      ConfigModule.forRoot({
          isGlobal: true,
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
