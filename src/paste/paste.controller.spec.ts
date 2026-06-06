
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PastesController } from './paste.controller';
import { PastesService } from './paste.service';

//Verify that the PastesController is defined and that the findAll method returns an array of pastes. The test uses Jest's mocking capabilities to create a mock implementation of the PastesService and to spy on the findAll method.
describe('PastesController', () => {
  let pastesController: PastesController;
  let pastesService: PastesService;

  beforeEach(() => {
    pastesService = jest.createMockFromModule<PastesService>('./paste.service');
    pastesController = new PastesController(pastesService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = ['test'] as any;
      jest.spyOn(pastesService, 'findAll').mockImplementation(() => result);

      expect(await pastesController.findAll()).toBe(result);
    });
  });
});
