import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {PrismaService} from "../prisma/prisma.service";
import {Task} from "@prisma/client";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise <Task> {
    const { title, description, userId, dueDate } = createTaskDto;

    return this.prisma.task.create({
       data: {
         title,
         description,
         userId,
         dueDate,
      }
    });
  }


  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }


  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({where: {id}})

    if (!task){
      throw new NotFoundException(`Task with id: ${id} not found.`)
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const {
      title,
      description,
      dueDate,
      userId,
    } = updateTaskDto

    return this.prisma.task.update({
      where: {id},
      data: {
        title,
        description,
        dueDate,
        userId,
      }
    });
  }

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({where: {id}});

    if( !task ){
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return this.prisma.task.delete({where: {id}});
  }
}
