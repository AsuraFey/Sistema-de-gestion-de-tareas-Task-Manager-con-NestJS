import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {PERMISSIONS_KEY} from "../../decorators/permissions.decorator";
import {AuthService} from "../auth.service";
import {Permission} from "../../roles/dto/role.dto";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.userId){
            throw new UnauthorizedException("User id not found")
        }

        const routePermissions: Permission[] = this.reflector.getAllAndOverride(
            PERMISSIONS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]
        );

        try {
            const userPermissions = await this.authService.getUserPermissions(
                request.userId
            );
            for (const routePermission of routePermissions) {
                const userPermission = userPermissions.find(
                    perm => perm.resource === routePermission.resource
                )
                if (!userPermission) {
                   return false
                }

                const allActionsAvailable = userPermission.actions.every(
                    (requiredAction) => userPermission.actions.includes(requiredAction),
                )
                
                if (!allActionsAvailable) {
                    return false
                }
            }
        } catch (e){
            throw new ForbiddenException("An error occurred while checking user permissions.");
        }

        return true;
    }



}