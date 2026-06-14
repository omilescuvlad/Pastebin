import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'

import { PastesService } from './paste.service'
import { Paste } from './paste.entity'
import { User } from '../user/user.entity'

describe('PastesService', () => {
  let service: PastesService

  const mockPastesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  }

  const mockUsersRepository = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module = await Test.createTestingModule({
      providers: [
        PastesService,
        {
          provide: getRepositoryToken(Paste),
          useValue: mockPastesRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile()

    service = module.get<PastesService>(PastesService)
  })

  it('should create a paste', async () => {
    const body = {
      content: 'Hello world',
      userId: 1,
    }

    const user = {
      id: 1,
      username: 'john',
    }

    const createdPaste = {
      content: body.content,
      userId: body.userId,
      user: user,
    }

    const savedPaste = {
      id: 1,
      ...createdPaste,
    }

    mockUsersRepository.findOne.mockResolvedValue(user)
    mockPastesRepository.create.mockReturnValue(createdPaste)
    mockPastesRepository.save.mockResolvedValue(savedPaste)

    const result = await service.create(body)

    expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
      where: { id: body.userId },
    })

    expect(mockPastesRepository.create).toHaveBeenCalledWith({
      content: body.content,
      userId: body.userId,
      user: user,
    })

    expect(mockPastesRepository.save).toHaveBeenCalledWith(createdPaste)

    expect(result).toEqual(savedPaste)
  })

  it('should throw error when creating paste if user does not exist', async () => {
    const body = {
      content: 'Hello world',
      userId: 999,
    }

    mockUsersRepository.findOne.mockResolvedValue(null)

    await expect(service.create(body)).rejects.toThrow(NotFoundException)
  })

  it('should return all pastes', async () => {
    const pastes = [
      { id: 1, content: 'First paste' },
      { id: 2, content: 'Second paste' },
    ]

    mockPastesRepository.find.mockResolvedValue(pastes)

    const result = await service.findAll()

    expect(mockPastesRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
    })

    expect(result).toEqual(pastes)
  })

  it('should return one paste by id', async () => {
    const paste = {
      id: 1,
      content: 'Hello world',
    }

    mockPastesRepository.findOne.mockResolvedValue(paste)

    const result = await service.findOne(1)

    expect(mockPastesRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user'],
    })

    expect(result).toEqual(paste)
  })

  it('should throw error if paste id does not exist', async () => {
    mockPastesRepository.findOne.mockResolvedValue(null)

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
  })

  it('should update a paste', async () => {
    const oldPaste = {
      id: 1,
      content: 'Old content',
    }

    const updatedPaste = {
      id: 1,
      content: 'New content',
    }

    mockPastesRepository.findOne.mockResolvedValue(oldPaste)
    mockPastesRepository.save.mockResolvedValue(updatedPaste)

    const result = await service.update(1, {
      content: 'New content',
    })

    expect(mockPastesRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user'],
    })

    expect(mockPastesRepository.save).toHaveBeenCalledWith({
      id: 1,
      content: 'New content',
    })

    expect(result).toEqual(updatedPaste)
  })

  it('should remove a paste', async () => {
    const paste = {
      id: 1,
      content: 'Hello world',
    }

    mockPastesRepository.findOne.mockResolvedValue(paste)
    mockPastesRepository.remove.mockResolvedValue(paste)

    const result = await service.remove(1)

    expect(mockPastesRepository.remove).toHaveBeenCalledWith(paste)

    expect(result).toEqual({
      message: 'Paste with id 1 was deleted successfully',
    })
  })
})