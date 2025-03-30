import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service";
import { Request } from 'express';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        if (!req.user) {
            throw new BadRequestException("No req.user")
        }
        const user = await this.prisma.user.findUnique({where: {id: req.user['userId']}});
        if (!user){throw new NotFoundException("User not found")}

        const taskId = req.params.id;

        const task = await this.prisma.task.findUnique({ where: { id: +taskId } });
        if (!task) {
            throw new ForbiddenException('Task not found');
        }

        // Verifica si el usuario es el propietario de la tarea o un administrador
        if (task.userId === req.user['userId'] || user.roleId === 1) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to perform this action');
    }
}