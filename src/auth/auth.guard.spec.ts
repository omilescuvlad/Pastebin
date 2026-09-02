import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Role } from '../enums/role.enum';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const verifyAsyncMock = jest.fn();
  const jwtService = {
    verifyAsync: verifyAsyncMock,
  } as unknown as JwtService;
  const createContext = (request: Partial<Request>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as unknown as ExecutionContext;

  let guard: AuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(jwtService);
  });

  it('verifies a Bearer token and attaches its payload to the request', async () => {
    const request: Partial<Request> & { user?: unknown } = {
      headers: { authorization: 'Bearer valid-token' },
    };
    const payload = {
      sub: 7,
      username: 'vlad',
      roles: [Role.User],
    };
    verifyAsyncMock.mockResolvedValue(payload);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(verifyAsyncMock).toHaveBeenCalledWith('valid-token');
    expect(request.user).toEqual(payload);
  });

  it('rejects requests without a Bearer token', async () => {
    await expect(
      guard.canActivate(createContext({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(verifyAsyncMock).not.toHaveBeenCalled();
  });

  it('rejects tokens that fail JWT verification', async () => {
    verifyAsyncMock.mockRejectedValue(new Error('Invalid token'));

    await expect(
      guard.canActivate(
        createContext({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
