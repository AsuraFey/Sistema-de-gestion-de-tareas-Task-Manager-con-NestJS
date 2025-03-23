import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateRoleDto} from "./dto/role.dto";

@Injectable()
export class RolesService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async createRole(role: CreateRoleDto){

        return this.prisma.role.create({
            data: {
                name: role.name,
                permissions: {
                    create: role.permissions.map(permission => ({
                        resource: permission.resource,
                        actions: permission.actions,
                    })),
                }
            }
        });
    }

    async getRoleById(roleId: number){
        return this.prisma.role.findUnique({where: {id: roleId}})
    }

}
