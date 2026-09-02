import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Role } from '../enums/role.enum';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const findOneByUsernameMock = jest.fn();
  const signAsyncMock = jest.fn();
  const compareMock = bcrypt.compare as jest.MockedFunction<
    typeof bcrypt.compare
  >;
  const usersService = {
    findOneByUsername: findOneByUsernameMock,
  } as unknown as UsersService;
  const jwtService = {
    signAsync: signAsyncMock,
  } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(usersService, jwtService);
  });

  it('returns a signed access token for valid credentials', async () => {
    findOneByUsernameMock.mockResolvedValue({
      id: 7,
      username: 'vlad',
      password: 'stored-password-hash',
      roles: [Role.User],
    });
    compareMock.mockResolvedValue(true);
    signAsyncMock.mockResolvedValue('signed-jwt');

    await expect(service.signIn('vlad', 'correct-password')).resolves.toEqual({
      access_token: 'signed-jwt',
    });
    expect(compareMock).toHaveBeenCalledWith(
      'correct-password',
      'stored-password-hash',
    );
    expect(signAsyncMock).toHaveBeenCalledWith({
      sub: 7,
      username: 'vlad',
      roles: [Role.User],
    });
  });

  it('rejects invalid credentials without signing a token', async () => {
    findOneByUsernameMock.mockResolvedValue({
      id: 7,
      username: 'vlad',
      password: 'stored-password-hash',
      roles: [Role.User],
    });
    compareMock.mockResolvedValue(false);

    await expect(
      service.signIn('vlad', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(signAsyncMock).not.toHaveBeenCalled();
  });
});
