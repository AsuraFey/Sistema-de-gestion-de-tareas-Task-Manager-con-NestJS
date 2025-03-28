import {forwardRef, Module} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import {PrismaService} from "../prisma/prisma.service";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService],
  imports: [forwardRef(() => AuthModule)],
  exports: [RolesService],
})
export class RolesModule {}
