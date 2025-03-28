import {IsEnum, IsOptional, IsString, ValidateNested} from "class-validator";
import { Type } from "class-transformer";
import { Resource } from "../enums/resource.enum";
import { Action } from "../enums/action.enums";

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Permission)
    permissions?: Permission[];
}

export class Permission {
    @IsOptional()
    @IsEnum(Resource)
    resource: Resource;

    @IsOptional()
    @IsEnum(Action, { each: true })
    actions: Action[];
}