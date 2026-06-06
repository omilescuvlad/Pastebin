import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const ROLES_KEY = process.env.ROLES_KEY;
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
