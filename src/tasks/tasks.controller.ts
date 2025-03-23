import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {Permissions} from "../decorators/permissions.decorator";
import {Resource} from "../roles/enums/resource.enum";
import {Action} from "../roles/enums/action.enums";
import {AuthGuard} from "../auth/guards/auth.guard";
import {AuthorizationGuard} from "../auth/guards/authorization.guard";


@Controller('tasks')
@UseGuards(AuthGuard, AuthorizationGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Permissions([{ resource: Resource.tasks, actions: [Action.create]}])
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  // @Patch(':id')
  // async markAsCompleted(@Param('id') id: string) {
  //   return this.tasksService.markAsCompleted(+id);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
