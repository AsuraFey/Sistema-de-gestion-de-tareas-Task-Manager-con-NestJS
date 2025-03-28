import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateRoleDto} from "./dto/role.dto";
import {UpdateRoleDto} from "./dto/update-role.dto";

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
        return this.prisma.role.findUnique({
            where: { id: roleId },
            include: { permissions: true },
        })
    }

    async updateRole(roleId: number, updateRoleDto: UpdateRoleDto) {

        const existingRole = await this.getRoleById(roleId);

        if (!existingRole) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }


        return this.prisma.role.update({
            where: {id: roleId},
            data: {
                name: updateRoleDto.name ?? existingRole.name,
                permissions: {
                    deleteMany: existingRole.permissions.map(permission => ({
                        id: permission.id,
                    })),
                    create: updateRoleDto.permissions?.map(permission => ({
                        resource: permission.resource,
                        actions: permission.actions,
                    })) || [],
                },
            },
            include: {permissions: true},
        });
    }

    async deleteRole(roleId: number) {
        const role = await this.prisma.role.findUnique({where: {id: roleId}});

        if (!role){
            throw new NotFoundException(`Role not found`)
        }

        return this.prisma.role.delete({where: {id: roleId}, include: {permissions: true}});
    }
}
