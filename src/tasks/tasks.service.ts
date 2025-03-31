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

  async markAsCompleted(taskId: number) {
    const task = await this.prisma.task.findUnique({where: {id: taskId}})
    if (!task){
      throw new NotFoundException("Task not found")
    }

    return this.prisma.task.update({
      where:{id: task.id},
      data:{status: "Completada"}
    });
  }


  async findAll(userId: number, skip: number, take: number, status?: string) {
    if (skip < 0) skip = 0;
    if (take <= 0) take = 10;

    const whereClause = {
      userId: userId,
      ...(status && { status: status })
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where: whereClause,
        skip: skip,
        take: take,
      }),
      this.prisma.task.count({
        where: whereClause,
      }),
    ]);

    const currentPage = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(total / take);

    return {
      tasks,
      total,
      hasMore: total > skip + take,
      links: {
        previous: currentPage > 1 ? `/tasks?skip=${skip - take}&take=${take}` : null,
        next: currentPage < totalPages ? `/tasks?skip=${skip + take}&take=${take}` : null,
      },
    };
  }
}
