import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const createMockExecutionContext = (request: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();

    jwtService = mockJwtService as unknown as jest.Mocked<JwtService>;
    guard = new AuthGuard(jwtService);
  });

  it('should return true and attach user to request when token is valid', async () => {
    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const payload = {
      sub: 1,
      username: 'john',
    };

    jwtService.verifyAsync.mockResolvedValue(payload);

    const context = createMockExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(request['user']).toEqual(payload);
  });

  it('should throw UnauthorizedException when authorization header is missing', async () => {
    const request = {
      headers: {},
    };

    const context = createMockExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when authorization header is empty', async () => {
    const request = {
      headers: {
        authorization: '',
      },
    };

    const context = createMockExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when authorization type is not Bearer', async () => {
    const request = {
      headers: {
        authorization: 'Basic abc123',
      },
    };

    const context = createMockExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when bearer token is missing', async () => {
    const request = {
      headers: {
        authorization: 'Bearer',
      },
    };

    const context = createMockExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    const request = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };

    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const context = createMockExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid-token');
  });
});
