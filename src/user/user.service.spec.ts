/// <reference types="jest" />
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { UsersService } from './user.service';
import { User } from '../user/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const body = {
      fullName: 'John Doe',
      username: 'john',
      password: '123456',
      email: 'john@example.com',
    };

    const createdUser = {
      ...body,
      password: 'hashed-password',
    };

    const savedUser = {
      id: 1,
      ...createdUser,
    };

    mockRepository.create.mockReturnValue(createdUser);
    mockRepository.save.mockResolvedValue(savedUser);

    const result = await service.create(body);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(savedUser);
  });

  it('should return all users', async () => {
    const users = [
      { id: 1, username: 'john' },
      { id: 2, username: 'jane' },
    ];

    mockRepository.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['pastes'],
    });

    expect(result).toEqual(users);
  });

  it('should return one user by id', async () => {
    const user = {
      id: 1,
      username: 'john',
    };

    mockRepository.findOne.mockResolvedValue(user);

    const result = await service.findOne(1);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['pastes'],
    });

    expect(result).toEqual(user);
  });

  it('should throw error if user id does not exist', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should return one user by username', async () => {
    const user = {
      id: 1,
      username: 'john',
    };

    mockRepository.findOne.mockResolvedValue(user);

    const result = await service.findOneByUsername('john');

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'john' },
    });

    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const oldUser = {
      id: 1,
      fullName: 'Old Name',
      username: 'old',
      password: 'old-password',
      email: 'old@example.com',
    };

    const updatedUser = {
      ...oldUser,
      fullName: 'New Name',
    };

    mockRepository.findOne.mockResolvedValue(oldUser);
    mockRepository.save.mockResolvedValue(updatedUser);

    const result = await service.update(1, {
      fullName: 'New Name',
    });

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(updatedUser);
  });

  it('should remove a user', async () => {
    const user = {
      id: 1,
      username: 'john',
    };

    mockRepository.findOne.mockResolvedValue(user);
    mockRepository.remove.mockResolvedValue(user);

    const result = await service.remove(1);

    expect(mockRepository.remove).toHaveBeenCalledWith(user);

    expect(result).toEqual({
      message: 'User with id 1 was deleted successfully',
    });
  });
});
