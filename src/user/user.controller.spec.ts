
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

//Verify that the UsersController is defined and that the findAll method returns an array of users. The test uses Jest's mocking capabilities to create a mock implementation of the UsersService and to spy on the findAll method.
describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = jest.createMockFromModule<UsersService>('./user.service');
    usersController = new UsersController(usersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = ['test'] as any;
      jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

      expect(await usersController.findAll()).toBe(result);
    });
  });
});
