import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const getAllAndOverrideMock = jest.fn();
  const reflector = {
    getAllAndOverride: getAllAndOverrideMock,
  } as unknown as Reflector;
  const createContext = (request: Partial<Request>) =>
    ({
      getHandler: () => 'handler',
      getClass: () => 'controller',
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  let guard: RolesGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflector);
  });

  it('allows routes that do not declare required roles', () => {
    getAllAndOverrideMock.mockReturnValue(undefined);

    expect(guard.canActivate(createContext({}))).toBe(true);
  });

  it('rejects protected routes when no authenticated user exists', () => {
    getAllAndOverrideMock.mockReturnValue([Role.Admin]);

    expect(guard.canActivate(createContext({}))).toBe(false);
  });

  it('allows a user with one of the required roles', () => {
    getAllAndOverrideMock.mockReturnValue([Role.Admin]);

    expect(
      guard.canActivate(
        createContext({
          user: { sub: 7, username: 'vlad', roles: [Role.Admin] },
        }),
      ),
    ).toBe(true);
  });

  it('rejects a user without any required role', () => {
    getAllAndOverrideMock.mockReturnValue([Role.Admin]);

    expect(
      guard.canActivate(
        createContext({
          user: { sub: 7, username: 'vlad', roles: [Role.User] },
        }),
      ),
    ).toBe(false);
  });
});
