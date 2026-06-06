import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PastesController } from './paste.controller';
import { PastesService } from './paste.service';
import { Paste } from './paste.entity';

//Verify that the PastesController is defined and that the findAll method returns an array of pastes. The test uses Jest's mocking capabilities to create a mock implementation of the PastesService and to spy on the findAll method.
describe('PastesController', () => {
  let pastesController: PastesController;
  let pastesService: PastesService;

  beforeEach(() => {
    pastesService = jest.createMockFromModule<PastesService>('./paste.service');
    pastesController = new PastesController(pastesService);
  });

  describe('findAll', () => {
    it('should return an array of pastes', async () => {
      const result: Paste[] = [
        {
          id: 1,
          content: 'This is a test paste.',
          createdAt: new Date(),
        } as Paste,
      ];
      jest.spyOn(pastesService, 'findAll').mockImplementation(() => Promise.resolve(result));
      expect(await pastesController.findAll()).toBe(result);
    });
  });
});


