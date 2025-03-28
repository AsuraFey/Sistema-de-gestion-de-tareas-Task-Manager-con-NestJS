import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {RolesService} from './roles.service';
import {CreateRoleDto} from "./dto/role.dto";
import {Permissions} from "../decorators/permissions.decorator";
import {Resource} from "./enums/resource.enum";
import {Action} from "./enums/action.enums";
import {UpdateRoleDto} from "./dto/update-role.dto";
import {AuthGuard} from "../auth/guards/auth.guard";
import {AuthorizationGuard} from "../auth/guards/authorization.guard";

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permissions([{resource: Resource.settings, actions: [Action.create]}])
  @Post()
  async createRole(@Body() role: CreateRoleDto) {
    return this.rolesService.createRole(role);
  }

  @Permissions([{resource: Resource.settings, actions: [Action.read]}])
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.rolesService.getRoleById(+id);
  }

  @Permissions([{resource: Resource.settings, actions: [Action.update]}])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Permissions([{resource: Resource.settings, actions: [Action.delete]}])
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.rolesService.deleteRole(+id);
  }

}
