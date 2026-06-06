import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call authService.signIn with username and password', async () => {
      const signInDto = {
        username: 'john',
        password: 'secret',
      };

      const expectedResult = {
        access_token: 'fake-jwt-token',
      };

      authService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith('john', 'secret');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return the authenticated user from the request', () => {
      const req = {
        user: {
          id: 1,
          username: 'john',
        },
      };

      const result = controller.getProfile(req);

      expect(result).toEqual({
        id: 1,
        username: 'john',
      });
    });
  });
});