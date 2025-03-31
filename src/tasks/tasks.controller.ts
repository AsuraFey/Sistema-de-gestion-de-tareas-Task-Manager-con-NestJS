import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post, Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {Permissions} from "../decorators/permissions.decorator";
import {Resource} from "../roles/enums/resource.enum";
import {Action} from "../roles/enums/action.enums";
import {AuthenticationGuard} from "../auth/guards/authentication.guard";
import {AuthorizationGuard} from "../auth/guards/authorization.guard";
import {Request} from "express";
import {AuthGuard} from "@nestjs/passport";
import {PrismaService} from "../prisma/prisma.service";
import {SelfOrAdminGuard} from "./guards/selfOrAdmin.guard";


@Controller('tasks')
@UseGuards(AuthenticationGuard, AuthorizationGuard, AuthGuard('jwt'))
export class TasksController {
  constructor(
      private readonly tasksService: TasksService,
      private prisma: PrismaService,
  ) {}

  @Permissions([{ resource: Resource.tasks, actions: [Action.create]}])
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    if (!req.user) {
      throw new BadRequestException()
    }
    const user = await this.prisma.user.findUnique({where: {id: req.user['userId']}})
    if (!user){throw new NotFoundException("User not found")}

    if (createTaskDto.userId === user.id || user.roleId === 1){
      return this.tasksService.create(createTaskDto)
    }

    throw new BadRequestException('You do not have permission to create a task to other user')
  }

  @Permissions([{resource: Resource.tasks, actions: [Action.read]}])
  @Get()
  async findAll(
      @Req() req: Request,
      @Query("skip") skip: number = 0,
      @Query("take") take: number = 10,
      @Query('status') status?: string,

  ){
    const user = req.user

    if(!user){
      throw new BadRequestException()
    }

    return this.tasksService.findAll(+user['userId'], +skip, +take, status);
  }

  @Permissions([{resource: Resource.tasks, actions: [Action.read]}])
  @UseGuards(SelfOrAdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Permissions([{resource: Resource.tasks, actions: [Action.update]}])
  @Patch(':id')
  @UseGuards(SelfOrAdminGuard)
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }
  @Permissions([{resource: Resource.tasks, actions: [Action.delete]}])
  @UseGuards(SelfOrAdminGuard)
  @Patch('markAsCompleted/:id')
  async markAsCompleted(@Param('id') id: string) {
    return this.tasksService.markAsCompleted(+id);
  }

  @Permissions([{resource: Resource.tasks, actions: [Action.delete]}])
  @Delete(':id')
  @UseGuards(SelfOrAdminGuard)
  async remove(@Param('id') id: string) {
      return this.tasksService.remove(+id)
  }
}
