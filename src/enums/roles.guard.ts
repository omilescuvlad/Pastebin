import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Role } from './role.enum';

const ROLES_KEY = 'roles';
type JwtUser = {
  sub: number;
  username: string;
  roles: Role[];
};

type AuthenticatedRequest = Request & {
  user?: JwtUser;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.roles) {
      return false;
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
