import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { RolesService } from './roles.service';
import {CreateRoleDto} from "./dto/role.dto";

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() role: CreateRoleDto) {
    return this.rolesService.createRole(role);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.rolesService.getRoleById(+id);
  }

}
